// ============================================================
// chat-engine.js — Gemini via Cloudflare Workers
// Multi-product support — detect จาก URL อัตโนมัติ
//
// วิธีเพิ่ม product ใหม่:
// 1. เพิ่ม key ใน DOCS เช่น DOCS.product2 = `...`
// 2. เพิ่ม path mapping ใน getContext()
// 3. ไม่ต้องแก้อะไรอีก
// ============================================================

const WORKER_URL = 'https://support-chat.8bahtthailand.workers.dev'
const SUPPORT_URL = 'https://8baht.com/help?ref=8Baht_Docs'

// ─────────────────────────────────────────
// DOCS — เพิ่ม product ใหม่ตรงนี้
// ─────────────────────────────────────────
const DOCS = {}

// ── Adobe ──────────────────────────────
DOCS.adobe = `
# คู่มือ Adobe - 8Baht Docs

## ไฟล์ติดตั้ง
- Adobe Creative Cloud (Windows/macOS): ดาวน์โหลดได้ที่หน้า /docs/adobe/ หัวข้อ "ไฟล์ติดตั้ง"
- Adobe Express: ใช้งานผ่านเว็บ https://new.express.adobe.com/
- Acrobat (Windows), Photoshop (Windows), Illustrator (Windows): ดาวน์โหลดได้ที่หน้า /docs/adobe/
- แอปพลิเคชันอื่นๆ: https://www.adobe.com/apps/all/all-platforms หรือผ่าน Creative Cloud desktop app
- System Requirements / User guide: https://helpx.adobe.com/support.html

## วิธีติดตั้ง Creative Cloud
- ดาวน์โหลดไฟล์ติดตั้งจากหน้า Adobe แล้วเปิดไฟล์ทำตามขั้นตอน
- Sign in ด้วยอีเมลที่ได้รับคำเชิญ
- แอปอื่นๆ ติดตั้งผ่าน Creative Cloud desktop app ได้เลย

## จัดการใบอนุญาต — เริ่มต้นใช้งาน
- หลังสั่งซื้อจะได้รับอีเมลคำเชิญจาก Adobe
- คลิก "Get started" → Sign in → คลิก "Join team" → เลือกโปรไฟล์ (ชื่อบริษัท)
- 1 ใบอนุญาต ต่อ 1 อีเมล เช่น 5 ใบอนุญาต ใช้ 5 อีเมล

## วิธีเพิ่มผู้ใช้งาน (Admin)
- Adobe Admin Console → คลิกชื่อโปรดักส์ → Add User → ใส่อีเมล → Add as a new user
- ผู้ใช้จะได้รับอีเมลคำเชิญ

## วิธีถอนใบอนุญาตก่อนเปลี่ยนเครื่อง
- เปิด Creative Cloud Desktop App → คลิกชื่อบัญชีมุมขวาบน → Sign Out
- ต้องทำก่อน Uninstall หรือเปลี่ยนเครื่องเสมอ

## วิธีเปลี่ยนอีเมลผู้ใช้งาน
- Admin Console → Users → เลือกผู้ใช้เดิม → นำสิทธิ์ออก
- จากนั้น Add Users → ใส่อีเมลใหม่ → เลือกโปรแกรม → Save
- ระบบส่งอีเมลเชิญไปยังผู้ใช้ใหม่

## วิธีค้นหา Customer ID / Account ID
- Adobe Admin Console → Sign in → เลือกโปรไฟล์ → เมนู Account
- จะเห็น Account ID รูปแบบ 100XXXXXXX

## วิธีเช็ควันหมดอายุ
- Adobe Admin Console → Account → Anniversary date
- ดูคู่มือ: /docs/adobe/tips/#asd

## วิธีเปลี่ยนตัวแทนจำหน่าย (Change Reseller)
- Admin Console → Sign in → เลือกโปรไฟล์ → Account → Account manager
- คลิกรูปดินสอ ✎ → Generate Code → Copy code
- ส่งชุดตัวเลขพร้อม Customer ID ให้ตัวแทนจำหน่ายใหม่
- หรือส่งมาที่ support8baht@applicadthai.com
- หมายเหตุ: code มีอายุ 72 ชั่วโมง

## FAQ
- เปิดใช้งานใบอนุญาต: หลังสั่งซื้อจะได้รับอีเมลพร้อมลิงก์ กดลิงก์และ Sign in
- อินเทอร์เน็ต: ต้องใช้ครั้งแรก หลังจากนั้นออฟไลน์ได้สูงสุด 99 วัน
- รหัสผ่าน: ตั้งเองที่ Adobe ถ้าลืมคลิก "Reset your password" ในหน้า Sign in
- ใช้ได้กี่เครื่อง: Sign in ได้ 2 เครื่อง แต่ใช้งานได้ทีละ 1 เครื่อง
- โปรแกรมขึ้นให้ซื้อ: Sign out แล้ว Sign in ใหม่ เลือกโปรไฟล์ชื่อบริษัท
- ใช้ได้ทั้ง Windows/macOS: ได้ รวมถึง Mobile, Tablet, Web สำหรับแอปที่รองรับ
- เข้า Admin Console ไม่ได้: ต้องเป็น Admin ที่องค์กรแต่งตั้งเท่านั้น
- หลังต่ออายุ: รับอีเมลยืนยัน ถ้าผู้ใช้ไม่เปลี่ยนใช้งานต่อได้เลย
- ติดปัญหาติดตั้ง: เปิด Ticket ที่ https://8baht.com/help

## ลิงก์ที่เกี่ยวข้อง
- Customer ID: /docs/adobe/tips/#cid
- วันหมดอายุ: /docs/adobe/tips/#asd
- เปลี่ยนอีเมล: /docs/adobe/tips/#cus
- เปลี่ยน Reseller: /docs/adobe/tips/

## ช่องทางติดต่อ
- Open Ticket: https://8baht.com/help?ref=8Baht_Docs
- Support: support8baht@applicadthai.com
- Sale: 8baht@applicadthai.com
- เวลาทำการ: จันทร์–ศุกร์ 09:00–17:00
`

// ── Product 2 — เพิ่มตรงนี้ ──────────────
// DOCS.product2 = `
// # คู่มือ Product2 - 8Baht Docs
// ...
// `

// ── Product 3 ─────────────────────────────
// DOCS.product3 = `...`

// ─────────────────────────────────────────
// URL → Context mapping
// เพิ่ม product ใหม่ตรงนี้ด้วย
// ─────────────────────────────────────────
function getContext() {
  const path = window.location.pathname
  if (path.includes('/adobe/'))    return DOCS.adobe
  // if (path.includes('/product2/')) return DOCS.product2
  // if (path.includes('/product3/')) return DOCS.product3
  return null  // หน้าที่ไม่มี context → ไม่แสดง chatbot
}

// ─────────────────────────────────────────
// Disclaimer
// ─────────────────────────────────────────
function initDisclaimer() {
  const body = document.getElementById('chatBody')
  if (!body) return
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
  bar.innerHTML = 'ระบบตอบอัตโนมัติ — คำตอบอาจไม่ครอบคลุมทุกกรณี<br>ติดต่อเจ้าหน้าที่ คลิก <a href="https://8baht.com/help?ref=8Baht_Docs" target="_blank" style="color:#0078d4;text-decoration:underline;">Open Ticket</a>'
  body.insertAdjacentElement('afterend', bar)
}

// ─────────────────────────────────────────
// Send & Reply
// ─────────────────────────────────────────
function sendChat() {
  const input = document.getElementById('chatInput')
  if (!input) return
  const text = input.value.trim()
  if (!text) return

  const context = getContext()
  if (!context) return  // ไม่มี context → ไม่ทำอะไร

  appendMessage(text, 'user')
  input.value = ''
  showTyping()

  getReply(text, context).then(reply => {
    removeTyping()
    appendMessage(reply.text, 'bot', reply.link)
  })
}

function handleChatKey(e) {
  if (e.key === 'Enter') sendChat()
}

async function getReply(question, context) {
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context })
    })

    if (res.status === 429) {
      return {
        text: 'ขออภัย ระบบมีผู้ใช้งานจำนวนมาก กรุณาติดต่อเจ้าหน้าที่โดยตรง',
        link: { text: 'Open Ticket', url: SUPPORT_URL }
      }
    }

    if (!res.ok) return contactStaffReply()

    const data = await res.json()
    if (data.error) return contactStaffReply()

    return { text: data.answer, link: null }

  } catch (e) {
    return contactStaffReply()
  }
}

function contactStaffReply() {
  return {
    text: 'ขออภัย ไม่สามารถเชื่อมต่อระบบได้ กรุณาติดต่อเจ้าหน้าที่โดยตรง',
    link: { text: 'Open Ticket', url: SUPPORT_URL }
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

function showTyping() {
  const body = document.getElementById('chatBody')
  if (!body) return
  const el = document.createElement('div')
  el.id = 'typingIndicator'
  el.className = 'chat-message bot'
  el.style.marginBottom = '10px'
  el.innerHTML = '<p style="display:inline-block; background:rgba(0,0,0,0.06); padding:9px 13px; border-radius:14px 14px 14px 4px; font-size:13px; color:#888;">กำลังพิมพ์...</p>'
  body.appendChild(el)
  body.scrollTop = body.scrollHeight
}

function removeTyping() {
  const el = document.getElementById('typingIndicator')
  if (el) el.remove()
}
