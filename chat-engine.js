// ============================================================
// chat-engine.js — Fuse.js Chat Engine
// โหลดหลัง chat-data.js และ script.js เสมอ
// ============================================================

// โหลด Fuse.js จาก CDN
(function loadFuse() {
  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fuse.js/7.0.0/fuse.min.js'
  script.onload = initChatEngine
  document.head.appendChild(script)
})()

// ─────────────────────────────────────────
// Config
// ─────────────────────────────────────────
const FUSE_OPTIONS = {
  keys: [
    { name: 'question', weight: 0.5 },
    { name: 'tags',     weight: 0.35 },
    { name: 'answer',   weight: 0.15 }
  ],
  threshold: 0.45,   // 0 = exact, 1 = match anything — ปรับตรงนี้ถ้าผลลัพธ์มากหรือน้อยเกินไป
  minMatchCharLength: 2,
  includeScore: true
}

const SUPPORT_URL = 'https://8baht.com/help?ref=8Baht_Docs'

let fuse = null

// ─────────────────────────────────────────
// Init
// ─────────────────────────────────────────
function initChatEngine() {
  if (typeof Fuse === 'undefined' || typeof chatData === 'undefined') return
  fuse = new Fuse(chatData, FUSE_OPTIONS)
}

// แสดง disclaimer ใต้ chatBody (นอก scroll area) — คงอยู่ตลอด
function initDisclaimer() {
  const body = document.getElementById('chatBody')
  if (!body) return

  // วาง disclaimer เป็น sibling ถัดจาก chatBody ไม่ใช่ลูก
  const parent = body.parentElement
  if (parent.querySelector('.chat-disclaimer')) return


  const bar = document.createElement('div')
  bar.className = 'chat-disclaimer'
  bar.style.cssText = [
    'background:#fff8e1',
    'color:#7a6300',
    'font-size:11px',
    'line-height:1.5',
    'padding:6px 10px',
    'border-top:1px solid #c8900a',
    'text-align:center',
    'flex-shrink:0'
  ].join(';')
  bar.innerHTML = 'ระบบตอบอัตโนมัติ — คำตอบอาจไม่ครอบคลุมทุกกรณี<br>ติดต่อเจ้าหน้าที่ คลิก <a href="https://8baht.com/help?ref=8Baht_Docs" target="_blank" style="color: #0078d4; text-decoration: underline;">Open Ticket</a>';

  // แทรกหลัง chatBody (ก่อน chat-input)
  body.insertAdjacentElement('afterend', bar)
}

// ─────────────────────────────────────────
// Send & Search
// ─────────────────────────────────────────
function sendChat() {
  const input = document.getElementById('chatInput')
  if (!input) return
  const text = input.value.trim()
  if (!text) return

  appendMessage(text, 'user')
  input.value = ''

  setTimeout(() => {
    const reply = getReply(text)
    appendMessage(reply.text, 'bot', reply.link)
  }, 300)
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendChat()
}

function getReply(query) {
  // ยังไม่ได้ init (Fuse โหลดไม่เสร็จ)
  if (!fuse) {
    return {
      text: 'ระบบกำลังโหลด กรุณาลองใหม่อีกครั้ง',
      link: null
    }
  }

  const results = fuse.search(query)

  // ไม่พบหรือ score แย่เกินไป
  if (!results.length || results[0].score > 0.55) {
    return {
      text: 'ขออภัย ฉันไม่พบข้อมูลที่เกี่ยวข้อง กรุณาติดต่อทีม Support โดยตรง',
      link: { text: 'เปิด Ticket', url: SUPPORT_URL }
    }
  }

  const best = results[0].item
  return {
    text: best.answer,
    link: best.link || null
  }
}

// ─────────────────────────────────────────
// UI Helpers
// ─────────────────────────────────────────
function appendMessage(text, type, link = null) {
  const body = document.getElementById('chatBody')
  if (!body) return

  const wrapper = document.createElement('div')
  wrapper.className = `chat-message ${type}`
  wrapper.style.cssText = type === 'user'
    ? 'text-align:right; margin-bottom:10px;'
    : 'margin-bottom:10px;'

  const bubble = document.createElement('p')
  bubble.style.cssText = type === 'user'
    ? 'display:inline-block; background:var(--text-primary); color:#fff; padding:9px 13px; border-radius:14px 14px 4px 14px; font-size:13px; max-width:85%; line-height:1.5;'
    : 'display:inline-block; background:rgba(0,0,0,0.06); color:var(--text-secondary); padding:9px 13px; border-radius:14px 14px 14px 4px; font-size:13px; max-width:85%; line-height:1.5;'
  bubble.textContent = text

  wrapper.appendChild(bubble)

  // Link ถ้ามี
  if (link && type === 'bot') {
    const a = document.createElement('a')
    a.href = link.url
    a.textContent = link.text
    a.target = '_blank'
    a.style.cssText = 'display:block; margin-top:6px; font-size:12px; color:var(--blue); text-decoration:underline;'
    wrapper.appendChild(a)
  }

  body.appendChild(wrapper)
  body.scrollTop = body.scrollHeight
}