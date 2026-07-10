// ============================================================
// sync-docs.js
// ดึงเนื้อหาจากหน้า docs HTML ทุกหน้า "ในเครื่อง" (ไม่ยิงเน็ต) →
// generate เป็น DOCS object → เขียนทับส่วน AUTO-GENERATED ใน chat-engine.js
//
// ใช้งาน: npm run sync-docs
// (รันจาก root ของ repo ที่ clone ไว้แล้วในเครื่อง — ไม่ต้องใช้ token
//  หรือเชื่อมต่อ GitHub API เพราะอ่านไฟล์จาก disk ตรงๆ)
// ============================================================

const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

const SITE_BASE = 'https://8bahtapp.github.io'
const REPO_ROOT = path.join(__dirname, '..')
const CHAT_ENGINE_PATH = path.join(REPO_ROOT, 'chat-engine.js')

// โฟลเดอร์ระดับบนสุดที่ถือว่าเป็น "โปรดักส์" — เพิ่มโปรดักส์ใหม่แค่เพิ่มบรรทัดนี้
const PRODUCT_FOLDERS = [
  'adobe', 'autodesk', 'sketchup', 'rhino', 'chaos',
  'd5', 'bim', 'lumion', 'foxit', 'pdfelement', 'microsoft'
]

const MARKER_START = '// DOCS: AUTO-GENERATED START'
const MARKER_END = '// DOCS: AUTO-GENERATED END'

// ─────────────────────────────────────────
// 1. เดินไฟล์ในเครื่อง หา index.html ทุกไฟล์ใต้แต่ละโฟลเดอร์โปรดักส์
//    (ไม่ว่าจะซ้อนลึกกี่ชั้น ไม่ว่าโครงสร้างจะไม่เท่ากันก็ตาม)
// ─────────────────────────────────────────
function walkDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      walkDir(fullPath, fileList)
    } else if (entry.isFile() && entry.name === 'index.html') {
      fileList.push(fullPath)
    }
  }
  return fileList
}

function groupPagesByProduct() {
  const pages = {}
  for (const folder of PRODUCT_FOLDERS) {
    const folderPath = path.join(REPO_ROOT, folder)
    if (!fs.existsSync(folderPath)) continue
    const files = walkDir(folderPath)
    if (files.length) pages[folder] = files.sort()
  }
  return pages
}

// ─────────────────────────────────────────
// 3. Extractor — serialize node เป็น markdown-ish text
//    ต่อ block type ใหม่ได้ที่ BLOCK_HANDLERS ด้านล่าง
// ─────────────────────────────────────────
function serialize($, node) {
  let out = ''
  $(node).contents().each((_, child) => {
    if (child.type === 'text') {
      out += $(child).text().replace(/\s+/g, ' ')
    } else if (child.type === 'tag') {
      const $c = $(child)
      if (child.tagName === 'a') {
        const href = $c.attr('href') || ''
        const label = serialize($, child).trim()
        const url = (href.startsWith('http') || href.startsWith('#'))
          ? href
          : `${SITE_BASE}${href.startsWith('/') ? '' : '/'}${href}`
        out += label ? `[${label}](${url})` : url
      } else if (child.tagName === 'strong' || child.tagName === 'b') {
        out += `**${serialize($, child)}**`
      } else if (child.tagName === 'em' || child.tagName === 'i') {
        const inner = serialize($, child).trim()
        out += inner ? `*${inner}*` : '' // <i class="fas.."> ไอคอนล้วนไม่มี text จะถูกข้ามอัตโนมัติ
      } else if (child.tagName === 'br') {
        out += '\n'
      } else if (child.tagName === 'p') {
        const inner = serialize($, child).trim()
        out += inner ? `${inner}\n` : ''
      } else if (child.tagName === 'ul' && $c.hasClass('info-sublist')) {
        $c.find('> li').each((_, sub) => {
          out += `\n  - ${serialize($, sub).trim()}`
        })
      } else {
        out += serialize($, child)
      }
    }
  })
  return out
}

const BLOCK_HANDLERS = {
  'info-box': (el, $) => {
    const p = $(el).find('p').get(0)
    const text = p ? serialize($, p).trim() : ''
    return text ? `> ${text}` : ''
  },
  'guide-list': (el, $) => {
    return $(el).find('> li').map((_, li) => `- ${serialize($, li).trim()}`).get().join('\n')
  },
  'faq-item': (el, $) => {
    const qEl = $(el).find('.faq-question').clone()
    qEl.find('i').remove()
    const q = qEl.text().replace(/\s+/g, ' ').trim()
    const aEl = $(el).find('.faq-answer').get(0)
    const a = aEl ? serialize($, aEl).trim() : ''
    return q ? `- **Q:** ${q}\n  **A:** ${a}` : ''
  },
  'download-card': (el, $) => {
    const $el = $(el)
    const title = $el.find('.card-title h3').first().text().replace(/\s+/g, ' ').trim()
    const version = $el.find('.card-version').text().replace(/\s+/g, ' ').trim()
    const downloadHref = $el.find('a.download-btn').attr('href')
    let out = `- **${title}**${version ? ` (${version})` : ''}`
    if (downloadHref) out += `\n  - ดาวน์โหลด: ${downloadHref}`
    $el.find('a.user-manual-btn').each((_, a) => {
      const label = $(a).text().replace(/\s+/g, ' ').trim().replace(/\s*→\s*$/, '')
      const href = $(a).attr('href')
      if (label && href) out += `\n  - [${label}](${href})`
    })
    return out
  },
  'info-card': linkCardHandler,
  'kb-card': linkCardHandler,
}

// การ์ดลิงก์ด่วนแบบสั้น (info-card, kb-card) — แค่หัวข้อ + ลิงก์ ไม่ต้องซ้ำเนื้อหาเต็ม
// เพราะเนื้อหาจริงอยู่ในหน้า manage/tips ที่ sync แยกอยู่แล้ว
function linkCardHandler(el, $) {
  const $el = $(el)
  const h3 = $el.find('> h3').first().text().replace(/\s+/g, ' ').trim()
  const href = $el.find('a').first().attr('href')
  if (!h3) return ''
  const url = href ? (href.startsWith('http') ? href : `${SITE_BASE}${href.startsWith('/') ? '' : '/'}${href}`) : ''
  return url ? `- ${h3}: ${url}` : `- ${h3}`
}

const KNOWN_WRAPPER_CLASSES = ['content-card', 'faq-container', 'faq-list', 'cards-grid', 'info-cards-grid', 'kb-grid']

function extractText($) {
  const lines = []

  $('.guide-section, .section').each((_, section) => {
    const $section = $(section)
    // ข้าม CTA ติดต่อท้ายหน้า (ซ้ำทุกหน้า ไม่จำเป็นต้องมีต่อหน้าใน context)
    if ($section.hasClass('guide-cta')) return
    if ($section.attr('id') === 'options') return // แค่ลิงก์ซ้ำไปหน้าอื่น ไม่มีเนื้อหาใหม่

    const h2 = $section.find('> h2').first().text().replace(/\s+/g, ' ').trim()
    const headerPushed = { done: false }
    const pushHeader = () => {
      if (!headerPushed.done && h2) {
        lines.push(`\n## ${h2}`)
        headerPushed.done = true
      }
    }

    $section.find(KNOWN_WRAPPER_CLASSES.map(c => `.${c}`).join(', '))
      .children()
      .each((_, el) => {
        const $el = $(el)
        const tag = el.tagName

        if (tag === 'h3') {
          pushHeader()
          lines.push(`\n### ${$el.text().replace(/\s+/g, ' ').trim()}`)
          return
        }

        for (const cls in BLOCK_HANDLERS) {
          if ($el.hasClass(cls)) {
            const result = BLOCK_HANDLERS[cls](el, $)
            if (result) {
              pushHeader()
              lines.push(result)
            }
            return
          }
        }

        // block ที่ไม่รู้จัก (ไม่ใช่ video-container ซึ่งข้ามได้ตามปกติ) → เตือน
        const cls = $el.attr('class')
        if (cls && !cls.includes('video-container')) {
          console.warn(`⚠️  พบ block ที่ยังไม่มี handler: class="${cls}" (tag=${tag}) — เนื้อหาส่วนนี้จะถูกข้ามไป`)
        }
      })
  })

  const modalText = extractModals($)
  if (modalText) {
    lines.push('\n## ข้อมูลเพิ่มเติม (เงื่อนไข/ข้อกำหนดจาก popup)')
    lines.push(modalText)
  }

  return lines.join('\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

// ─────────────────────────────────────────
// 3b. Modal / Requirements popup — อยู่นอก .guide-section เสมอ
//     สแกนแยกจาก loop หลัก ใช้ descendant selector รองรับทั้งเคส
//     ที่มี #modalBody ครอบ กับเคสที่ไม่มี
// ─────────────────────────────────────────
function extractModals($) {
  const lines = []

  $('.modal-content .req-content').each((_, block) => {
    const $block = $(block)
    const h3 = $block.find('> h3').first().text().replace(/\s+/g, ' ').trim()
    if (h3) lines.push(`\n### ${h3} (ข้อกำหนด/เงื่อนไขเพิ่มเติม)`)

    $block.find('li').each((_, li) => {
      const raw = serialize($, li)
      // li มักมีหลายบรรทัดคั่นด้วย <br> และนำหน้าด้วย "•" ที่พิมพ์เป็น text ธรรมดา
      raw.split('\n')
        .map(s => s.replace(/^[•\-\s]+/, '').trim())
        .filter(Boolean)
        .forEach(item => lines.push(`- ${item}`))
    })
  })

  return lines.join('\n').trim()
}


function toKeyName(folder) {
  return folder // ชื่อโฟลเดอร์ตรงกับ key อยู่แล้ว (adobe, autodesk, ...)
}

function build() {
  console.log('📂 กำลังสแกนไฟล์ index.html ในเครื่อง...')
  const pages = groupPagesByProduct()

  const missing = PRODUCT_FOLDERS.filter(p => !pages[p])
  if (missing.length) {
    console.warn(`⚠️  ไม่พบไฟล์ index.html ในโฟลเดอร์: ${missing.join(', ')}`)
  }

  let docsBlock = ''

  for (const folder of Object.keys(pages).sort()) {
    console.log(`🔎 ${folder}: ${pages[folder].length} หน้า`)
    let combined = ''
    for (const filePath of pages[folder]) {
      const html = fs.readFileSync(filePath, 'utf-8')
      const $ = cheerio.load(html)
      const text = extractText($)
      if (text) combined += text + '\n'
    }
    const key = toKeyName(folder)
    docsBlock += `\n// ── ${key} ──────────────────────────────\n`
    docsBlock += `DOCS.${key} = \`\n${combined.trim()}\n\` + ALL_PRODUCTS\n`
  }

  const original = fs.readFileSync(CHAT_ENGINE_PATH, 'utf-8')
  const startIdx = original.indexOf(MARKER_START)
  const endIdx = original.indexOf(MARKER_END)

  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`ไม่พบ marker "${MARKER_START}" / "${MARKER_END}" ใน chat-engine.js — ยกเลิกเพื่อความปลอดภัย ไม่มีการเขียนทับไฟล์`)
  }

  const before = original.slice(0, startIdx)
  const after = original.slice(endIdx)

  const updated = `${before}${MARKER_START}\n// ห้ามแก้ไขส่วนนี้ด้วยมือ — แก้ที่หน้า docs HTML แล้วรัน: npm run sync-docs\n${docsBlock}\n${after}`

  fs.writeFileSync(CHAT_ENGINE_PATH, updated)
  console.log(`✅ อัปเดต chat-engine.js เรียบร้อย (${Object.keys(pages).length} โปรดักส์)`)
}

try {
  build()
} catch (err) {
  console.error('❌ Sync ล้มเหลว:', err.message)
  process.exit(1)
}