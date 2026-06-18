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
  if (path.includes('/autodesk/'))   return DOCS.autodesk
  if (path.includes('/sketchup/'))   return DOCS.sketchup
  if (path.includes('/rhino/'))      return DOCS.rhino
  if (path.includes('/chaos/'))      return DOCS.chaos
  // if (path.includes('/product2/')) return DOCS.product2
  // if (path.includes('/product3/')) return DOCS.product3
  return null
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
// Parse markdown links → <a>
// ─────────────────────────────────────────
function parseLinks(text) {
  // Escape HTML
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Markdown links [label](url)
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]*)\)/g,
    '<a href="$2" target="_blank" style="color:inherit;text-decoration:underline;">$1</a>'
  )

  // Split into lines and render bullets / paragraphs
  const lines = html.split('\n')
  const parts = []
  let listOpen = false

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      if (listOpen) { parts.push('</ul>'); listOpen = false }
      parts.push('<br>')
      continue
    }
    if (line.startsWith('- ')) {
      if (!listOpen) { parts.push('<ul style="margin:4px 0 4px 16px;padding:0;">'); listOpen = true }
      parts.push(`<li style="margin-bottom:2px;">${line.slice(2)}</li>`)
    } else {
      if (listOpen) { parts.push('</ul>'); listOpen = false }
      parts.push(`<span>${line}</span><br>`)
    }
  }
  if (listOpen) parts.push('</ul>')

  return parts.join('')
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
  if (!context) return
 
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
 
  const bubble = document.createElement('div')
  bubble.style.cssText = type === 'user'
    ? 'display:inline-block; background:var(--text-primary); color:#fff; padding:9px 13px; border-radius:14px 14px 4px 14px; font-size:13px; max-width:85%; line-height:1.5;'
    : 'display:inline-block; background:rgba(0,0,0,0.06); color:var(--text-secondary); padding:9px 13px; border-radius:14px 14px 14px 4px; font-size:13px; max-width:85%; line-height:1.5;'
 
  if (type === 'bot') {
    bubble.innerHTML = parseLinks(text)
  } else {
    bubble.textContent = text
  }
 
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

// ── Autodesk ───────────────────────────
DOCS.autodesk = `
# คู่มือ Autodesk - 8Baht Docs

## โปรดักส์ที่รองรับ
AutoCAD LT, AutoCAD, 3ds Max, Fusion, Revit, Inventor, AEC Collection, PD&M Collection, M&E Collection, Navisworks, Robot Structural Analysis, และแอปพลิเคชันอื่นๆ

## ไฟล์ติดตั้ง
- AutoCAD LT 2027 (Windows): ดาวน์โหลดได้ที่หน้า /docs/autodesk/autocadlt/
- AutoCAD LT 2027 (macOS): ดาวน์โหลดได้ที่หน้า /docs/autodesk/autocadlt/
- AutoCAD Web: ใช้งานผ่านเว็บ https://web.autocad.com/
- AutoCAD 2027 (Windows/macOS): ดาวน์โหลดได้ที่หน้า /docs/autodesk/autocad/
- AutoCAD Mechanical 2027 (Windows): ดาวน์โหลดได้ที่หน้า /docs/autodesk/autocad/
- AutoCAD Electrical 2027 (Windows): ดาวน์โหลดได้ที่หน้า /docs/autodesk/autocad/
- AutoCAD Architecture 2027 (Windows): ดาวน์โหลดได้ที่หน้า /docs/autodesk/autocad/
- 3ds Max 2027 (Windows): ดาวน์โหลดได้ที่หน้า /docs/autodesk/3dsmax/
- 3ds Max 2026 (Windows): ดาวน์โหลดได้ที่หน้า /docs/autodesk/3dsmax/
- Fusion (Windows): ดาวน์โหลดได้ที่หน้า /docs/autodesk/other/
- Revit 2027 (Windows): ดาวน์โหลดได้ที่หน้า /docs/autodesk/other/
- Inventor 2027 (Windows): ดาวน์โหลดได้ที่หน้า /docs/autodesk/other/
- Navisworks 2027 (Windows): ดาวน์โหลดได้ที่หน้า /docs/autodesk/other/
- Robot Structural Analysis 2027 (Windows): ดาวน์โหลดได้ที่หน้า /docs/autodesk/other/
- AEC Collection, PD&M Collection, M&E Collection: ดาวน์โหลดผ่าน https://manage.autodesk.com/products/all
- เวอร์ชั่นก่อนหน้า / Official Download ทุกแอป: https://manage.autodesk.com/products/all
- Product documentation: https://help.autodesk.com/

## วิธีจัดการใบอนุญาต — เริ่มต้นใช้งาน
- เมื่อสั่งซื้อสำเร็จจะได้รับอีเมลยืนยัน อีเมลที่สั่งซื้อสามารถเพิ่มผู้ใช้งานและจัดการใบอนุญาตได้ทั้งหมด
- 1 ใบอนุญาต ต่อ 1 อีเมล เช่น 5 ใบอนุญาต ใช้ 5 อีเมล
- License จะถูกมอบหมายให้อีเมลที่สั่งซื้อโดยอัตโนมัติ สามารถ Unassign เพื่อมอบให้ผู้ใช้งานอื่นได้

## วิธีเพิ่มผู้ใช้งาน (Admin)
- เข้า https://manage.autodesk.com/ → Sign in ด้วยอีเมลที่สั่งซื้อ
- ไปที่เมนู User Management → คลิก Invite users
- ใส่ข้อมูลให้ครบ กด Send invite
- ไปที่ User Management → คลิกชื่อผู้ใช้งานที่เพิ่มใหม่
- เลื่อนลงด้านล่าง คลิก Assign เพื่อเพิ่มโปรดักส์
- หากปุ่ม Assign เป็นสีเทา แปลว่าโปรดักส์ถูกมอบหมายครบแล้ว ต้อง Unassign จากผู้ใช้งานอื่นก่อน
- ดูคู่มือ: [วิธีจัดการใบอนุญาต](https://8bahtapp.github.io/docs/autodesk/manage/)

## วิธีติดตั้งและเปิดใช้งาน
- ไปที่ https://manage.autodesk.com/products/all เพื่อดาวน์โหลดไฟล์ติดตั้ง
- คลิกที่ไฟล์ → Next → Install → รอติดตั้ง → Finish
- เปิดโปรแกรม → เลือก Sign in with your Autodesk ID
- Sign in ด้วยอีเมลผู้ใช้งาน → คลิก Go to product → Open Autodesk Identity Manager
- ต้องเชื่อมต่ออินเทอร์เน็ตระหว่าง Activate และทุก 30 วัน เพื่อตรวจสอบสถานะใบอนุญาต
- ดูคู่มือ: [ติดตั้งและเปิดใช้งาน](https://8bahtapp.github.io/docs/autodesk/manage/#install)

## วิธีถอนใบอนุญาตก่อนเปลี่ยนเครื่อง
- เปิดโปรแกรม Autodesk Access หรือโปรแกรม Autodesk ใดก็ได้
- คลิกไอคอนคนหรือชื่อมุมขวาบน → คลิก Sign out
- ถอนใบอนุญาตสำเร็จ สามารถติดตั้งที่เครื่องใหม่ด้วยอีเมลและรหัสผ่านเดิมได้เลย
- ดูคู่มือ: [ถอนใบอนุญาต](https://8bahtapp.github.io/docs/autodesk/manage/#decivate)

## วิธีค้นหา Serial Number / Subscription ID
- Serial Number จะระบุใน Certificate หรือหาได้จาก Autodesk Account
- เข้า https://manage.autodesk.com/billing/subscription-management/subscriptions-contracts
- Sign in → Billing and Orders → Subscriptions and Contracts
- เลือกชื่อโปรดักส์ → เลื่อนลง Included in contract → เลือกชื่อโปรดักส์อีกครั้ง
- จะเห็น Subscription ID รูปแบบ xxx-xxxxxxxx
- ดูคู่มือ: [วิธีค้นหา Serial Number](https://8bahtapp.github.io/docs/autodesk/tips/#sn)

## วิธีเช็ควันหมดอายุ
- เข้า https://manage.autodesk.com/billing/subscription-management/subscriptions-contracts
- Sign in → Billing and Orders → Subscriptions and Contracts
- จะเห็นชื่อโปรดักส์ จำนวน และวันหมดอายุ
- สามารถต่ออายุล่วงหน้าได้ถึง 90 วัน ก่อนวันหมดอายุ
- หากต่ออายุไม่ทัน ยังใช้งานได้อีก 30 วัน แต่จะมีข้อความแจ้งเตือนทุกครั้ง
- ดูคู่มือ: [วิธีเช็ควันหมดอายุ](https://8bahtapp.github.io/docs/autodesk/tips/#exp)

## วิธีเปลี่ยนอีเมลผู้ใช้งาน
- ถอดสิทธิ์เดิม: เข้า User Management → คลิกชื่อผู้ใช้เดิม → คลิก Unassign
- เพิ่มใหม่: User Management → Invite users → ใส่อีเมลใหม่ → Send invite → คลิกชื่อผู้ใช้ใหม่ → Assign
- ดูคู่มือ: [วิธีเปลี่ยนอีเมลผู้ใช้งาน](https://8bahtapp.github.io/docs/autodesk/tips/#cus)

## FAQ
- Serial Number: ระบุใน Certificate หรือดูได้จาก Autodesk Account
- วันหมดอายุ: ระบุใน Certificate หรือดูจาก Autodesk Account → Billing and Orders
- ถอนใบอนุญาต: Sign Out จากโปรแกรม Autodesk ก่อนเปลี่ยนเครื่องหรือ Uninstall เสมอ
- อินเทอร์เน็ต: ต้องใช้ระหว่าง Activate และทุก 30 วัน ออฟไลน์ได้สูงสุด 30 วัน
- ลืมรหัสผ่าน: ไปที่ Autodesk Account คลิก "Forgot password"
- อัปเกรดเวอร์ชั่น: Subscription สามารถดาวน์โหลดเวอร์ชั่นล่าสุดได้ที่ https://manage.autodesk.com/products/all
- Windows/macOS: ใช้ได้ทั้งสองระบบ รวมถึง Mobile, Tablet, Web สำหรับแอปที่รองรับ
- เวอร์ชั่นก่อนหน้า: รองรับ 4 เวอร์ชั่นล่าสุด ดาวน์โหลดได้ที่ https://manage.autodesk.com/products/all
- แผนรวม (Collection): ใช้งานได้ทุกแอปในแผน เช่น AEC Collection, PD&M Collection
- หลังต่ออายุ: รับอีเมลยืนยัน ถ้าผู้ใช้ไม่เปลี่ยนใช้งานต่อได้เลย
- ติดปัญหาติดตั้ง: เปิด Ticket ที่ [บริการช่วยเหลือ](https://8baht.com/help?ref=8Baht_Docs)

## ช่องทางติดต่อ
- Open Ticket: [บริการช่วยเหลือ](https://8baht.com/help?ref=8Baht_Docs)
- Support: support8baht@applicadthai.com
- Sale: 8baht@applicadthai.com
- เวลาทำการ: จันทร์–ศุกร์ 09:00–17:00
`


// ── SketchUp ───────────────────────────
DOCS.sketchup = `
# คู่มือ SketchUp - 8Baht Docs

## ไฟล์ติดตั้ง
- SketchUp Pro 2026 (Windows): https://www.sketchup.com/sketchup/SketchUpPro-exe
- SketchUp Pro 2026 (macOS): https://www.sketchup.com/sketchup/SketchUpPro-dmg
- SketchUp for Web: https://app.sketchup.com/app
- Trimble Connect (Web): https://web.connect.trimble.com/
- PreDesign (Web): https://web.connect.trimble.com/
- V-Ray for SketchUp Studio (Windows, Commercial Only): https://download.sketchup.com/vray/vray_72000_sketchup_studio_win.exe
- Older Versions / Official Download: https://www.sketchup.com/en/download/all
- System Requirements: https://help.sketchup.com/en/sketchup/system-requirements
- User guide: https://help.sketchup.com/en

## จัดการใบอนุญาต — เริ่มต้นใช้งาน
- เมื่อสั่งซื้อสำเร็จจะได้รับอีเมลคำเชิญจาก Trimble (no-reply@account.trimble.com)
- คลิก "Click here" ในอีเมลเพื่อตอบรับคำเชิญ
- เข้าสู่ระบบหรือสร้างบัญชี Trimble Identity
- เลือกโปรไฟล์ชื่อบริษัท (Purchased via...)
- 1 ใบอนุญาต ต่อ 1 อีเมล เช่น 5 ใบอนุญาต ใช้ 5 อีเมล

## วิธีเพิ่มผู้ใช้งาน (Admin)
- ไปที่ SketchUp License Portal: https://ecom-prd.trimblepaas.com/account/organization/
- Sign in ด้วยอีเมล Admin → เลือกโปรไฟล์ชื่อบริษัท
- เลือกเมนู Members → คลิก Add New User
- ใส่อีเมลผู้ใช้งาน → คลิก Next → เลือกโปรดักส์ → Add User
- หากปุ่ม Assign เป็นสีเทา แปลว่าใบอนุญาตถูกมอบหมายครบแล้ว ต้อง Unassign จากผู้ใช้อื่นก่อน
- ดูคู่มือ: [วิธีจัดการใบอนุญาต](https://8bahtapp.github.io/docs/sketchup/manage/#manage)

## วิธีติดตั้งและเปิดใช้งาน
- รับคำเชิญจาก Trimble ทางอีเมลก่อน จากนั้นดาวน์โหลดไฟล์ติดตั้งที่หน้า /docs/sketchup/
- ดับเบิลคลิกไฟล์ → Install → Finish
- เปิดโปรแกรม SketchUp → คลิก Sign in
- Sign in ด้วยอีเมลผู้ใช้งาน (Trimble Identity)
- ออฟไลน์ได้สูงสุด 28 วัน
- ดูคู่มือ: [ติดตั้งและเปิดใช้งาน](https://8bahtapp.github.io/docs/sketchup/manage/#install)

## วิธีถอนใบอนุญาตก่อนเปลี่ยนเครื่อง
- เปิดโปรแกรม SketchUp → คลิกไอคอนรูปคนมุมขวาบน → เลือก Sign Out
- ดูคู่มือ: [วิธีถอนใบอนุญาต](https://8bahtapp.github.io/docs/sketchup/manage/#decivate)

## วิธีรีเซ็ตใบอนุญาต (Deauthorize)
- หากขึ้นข้อความ "You have exceeded your allowed activations" หรือ "Please authorize SketchUp"
- ดูคู่มือ: [วิธีรีเซ็ตใบอนุญาต](https://8bahtapp.github.io/docs/sketchup/tips/#de)

## วิธีเปลี่ยนอีเมลผู้ใช้งาน
- Admin ถอดสิทธิ์อีเมลเดิมออกจาก License Portal แล้วเพิ่มอีเมลใหม่
- ดูคู่มือ: [วิธีเปลี่ยนอีเมลผู้ใช้งาน](https://8bahtapp.github.io/docs/sketchup/tips/#cus)

## วิธีเช็ควันหมดอายุ
- Admin: SketchUp License Portal → Subscriptions
- ดูคู่มือ Admin: [วิธีเช็ควันหมดอายุ (Admin)](https://8bahtapp.github.io/docs/sketchup/tips/#eba)
- ดูคู่มือ User: [วิธีเช็ควันหมดอายุ (User)](https://8bahtapp.github.io/docs/sketchup/tips/#ebu)

## วิธีบันทึกไฟล์เป็นเวอร์ชั่นเก่า
- SketchUp รองรับการบันทึกกลับเป็นเวอร์ชั่นเก่าได้
- ดูคู่มือ: [วิธีบันทึกไฟล์เป็นเวอร์ชั่นเก่า](https://8bahtapp.github.io/docs/sketchup/tips/#sa)

## FAQ
- License Portal: https://ecom-prd.trimblepaas.com/account/organization/
- 1 ใบอนุญาตใช้ได้ 2 เครื่อง แต่ไม่สามารถใช้พร้อมกัน
- รหัสผ่าน: ตั้งผ่าน Trimble Identity ถ้าลืมคลิก "Forgot password" ในหน้า Sign in ระบบส่ง Verify Code ทางอีเมล
- V-Ray ใช้ได้เฉพาะแผน SketchUp Studio Commercial เท่านั้น ไม่รวม Education/Student/Instructor
- ออฟไลน์ได้สูงสุด 28 วัน
- รองรับ Windows, macOS และ Web
- ติดปัญหา: [Open Ticket](https://8baht.com/help?ref=8Baht_Docs)

## ช่องทางติดต่อ
- Open Ticket: [บริการช่วยเหลือ](https://8baht.com/help?ref=8Baht_Docs)
- Support: support8baht@applicadthai.com
- Sale: 8baht@applicadthai.com
- เวลาทำการ: จันทร์–ศุกร์ 09:00–17:00
`

// ── Rhino ──────────────────────────────
DOCS.rhino = `
# คู่มือ Rhino - 8Baht Docs

## ไฟล์ติดตั้ง
- Rhino 8 (Windows): ดาวน์โหลดได้ที่หน้า /docs/rhino/
- Rhino 8 (macOS): ดาวน์โหลดได้ที่หน้า /docs/rhino/
- Official Download: https://www.rhino3d.com/download/
- System Requirements: https://www.rhino3d.com/8/system-requirements/
- User guide: https://docs.mcneel.com/rhino/8/usersguide/en-us/index.htm

## จัดการใบอนุญาต — Cloud Zoo
- Rhino ใช้ระบบ Cloud Zoo สำหรับจัดการใบอนุญาต
- ไปที่ Rhino License Portal: https://www.rhino3d.com/licenses
- Sign in → Create a New Team → ตั้งชื่อทีม → Add License
- ใส่ License Key (ขึ้นต้นด้วย RH80...) → Add License
- เสร็จสิ้น ผู้ใช้งานสามารถ Sign in ด้วยอีเมลได้เลย
- โดยค่าเริ่มต้น Rhino ใช้การยืนยันทางอีเมลแทนรหัสผ่าน
- ดูคู่มือ: [วิธีจัดการใบอนุญาต](https://8bahtapp.github.io/docs/rhino/manage/#manage)

## วิธีเพิ่มผู้ใช้งาน
- Rhino License Portal → เลือกทีม → Members → Invite Members
- ใส่อีเมลผู้ใช้งาน → Send Invitation
- ผู้ใช้งานได้รับอีเมลเชิญ กดยืนยัน แล้ว Sign in ที่โปรแกรม Rhino ได้เลย

## วิธีติดตั้งและเปิดใช้งาน
- ดาวน์โหลดไฟล์ติดตั้งที่หน้า /docs/rhino/ → Install Now → Close → Install
- เปิดโปรแกรม Rhino → ยอมรับข้อตกลง → Options → Login
- Rhino เปิด Browser → Sign in ด้วยอีเมลที่อยู่ใน Cloud Zoo Team
- ดูคู่มือ: [ติดตั้งและเปิดใช้งาน](https://8bahtapp.github.io/docs/rhino/manage/#install)

## วิธีถอนใบอนุญาต (Logout)
- เปิดโปรแกรม Rhino → พิมพ์คำสั่ง Logout → Enter
- ดูคู่มือ: [วิธีถอนใบอนุญาต](https://8bahtapp.github.io/docs/rhino/manage/#decivate)

## วิธีตั้งรหัสผ่าน
- Rhino License Portal → View and edit your account details → Login → Password
- ดูคู่มือ: [วิธีตั้งรหัสผ่าน](https://8bahtapp.github.io/docs/rhino/tips/#ps)

## วิธีเปลี่ยนอีเมลผู้ใช้งาน
- กรณีเพิ่มอีเมลใหม่: License Portal → Members → Invite Members → ใส่อีเมลใหม่
- กรณีนำอีเมลเดิมออก: License Portal → Members → คลิกอีเมล → Remove Member
- ดูคู่มือ: [วิธีเปลี่ยนอีเมลผู้ใช้งาน](https://8bahtapp.github.io/docs/rhino/tips/#cus)

## วิธีเช็ควันหมดอายุ
- Rhino เป็น Perpetual License ไม่มีวันหมดอายุ
- ดูสถานะ License ในโปรแกรม: Help → About Rhinoceros
- ดูคู่มือ: [วิธีเช็ควันหมดอายุ](https://8bahtapp.github.io/docs/rhino/tips/#ea)

## FAQ
- Rhino เป็น Perpetual License (ซื้อขาด) ไม่มีวันหมดอายุ
- อัปเดตย่อยในเวอร์ชั่นเดิมฟรี เช่น 8.1 → 8.2 แต่อัปเกรดเวอร์ชั่นหลัก เช่น 7 → 8 มีค่าใช้จ่าย
- Cloud Zoo vs Single-Computer: Cloud Zoo ใช้อีเมล ยืดหยุ่นกว่า, Single-Computer ผูกกับเครื่อง
- รองรับทั้ง Windows และ macOS ใช้ License เดียวกัน
- Sign in แล้ว License Error: พิมพ์คำสั่ง Logout แล้ว Sign in ใหม่
- ติดปัญหา: [Open Ticket](https://8baht.com/help?ref=8Baht_Docs)

## ช่องทางติดต่อ
- Open Ticket: [บริการช่วยเหลือ](https://8baht.com/help?ref=8Baht_Docs)
- Support: support8baht@applicadthai.com
- Sale: 8baht@applicadthai.com
- เวลาทำการ: จันทร์–ศุกร์ 09:00–17:00
`

// ── Chaos (Corona, Enscape, V-Ray) ─────
DOCS.chaos = `
# คู่มือ Chaos - 8Baht Docs
# ครอบคลุม: Corona, Enscape, V-Ray

## โปรดักส์ที่รองรับ
- Corona (สำหรับ 3ds Max, Cinema 4D)
- Enscape (สำหรับ SketchUp, Revit, Rhino, Archicad, Vectorworks)
- V-Ray (สำหรับ SketchUp, 3ds Max, Maya, Rhino)

## ไฟล์ติดตั้ง Corona
- Corona 15 สำหรับ 3ds Max 2018-2027 (Windows): ดาวน์โหลดได้ที่หน้า /docs/chaos/corona/
- Corona 15 สำหรับ Cinema 4D R17-2026 (Windows): ดาวน์โหลดได้ที่หน้า /docs/chaos/corona/
- Chaos Cloud (Web): https://cloud.chaos.com/
- Veras, Phoenix, Vantage, Chaos Cosmos: ดาวน์โหลดได้ที่ https://my.chaos.com/download/products
- Older Versions / Official Download: https://my.chaos.com/download/products

## ไฟล์ติดตั้ง Enscape
- Enscape (Windows, รองรับทุก host): ดาวน์โหลดได้ที่หน้า /docs/chaos/enscape/

## ไฟล์ติดตั้ง V-Ray
- V-Ray for SketchUp, 3ds Max, Maya, Rhino: ดาวน์โหลดได้ที่หน้า /docs/chaos/vray/
- V-Ray for 3ds Max ต้องใช้ไฟล์ติดตั้งที่ตรงกับเวอร์ชั่น 3ds Max เท่านั้น

## Named License vs Floating License
- Named License: ผูกกับอีเมลผู้ใช้งานแต่ละคน Admin ต้อง Assign โปรดักส์ก่อน
- Floating License: ใช้ร่วมกันได้ตามจำนวนที่ซื้อ ใช้อีเมลเดียวกันทุกเครื่อง หรือแยกอีเมลก็ได้

## วิธีเพิ่มผู้ใช้งาน Named License (Admin)
- ไปที่ https://my.chaos.com/organization/licenses → Sign in
- Organization → User → จุดสามจุด ⋮ → Invite users → ใส่อีเมล
- กลับ Organization → เลือกอีเมล → Product → Assign → เลือกโปรดักส์ → ยืนยัน
- ผู้ใช้งานได้รับอีเมลคำเชิญ ต้องสร้างบัญชี Chaos ก่อนใช้งาน
- ดูคู่มือ: [จัดการ Named License](https://8bahtapp.github.io/docs/chaos/manage/#manage)

## วิธีใช้งาน Floating License
- แบบที่ 1 อีเมลเดียวกันทุกเครื่อง: Sign in ด้วยอีเมลที่สั่งซื้อทุกเครื่องได้เลย
- แบบที่ 2 แยกอีเมลแต่ละเครื่อง: เพิ่มสมาชิกตามขั้นตอน Named License แต่ไม่ต้อง Assign โปรดักส์
- ดูคู่มือ: [จัดการ Floating License](https://8bahtapp.github.io/docs/chaos/manage/#floating)

## วิธีติดตั้งและเปิดใช้งาน Corona
- ติดตั้งโปรแกรม host (3ds Max หรือ Cinema 4D) ก่อน
- ดาวน์โหลดและติดตั้ง Corona → I accept → Install → Done
- เปิด Render Setup (F10) → System → About Chaos Corona/Licensing → Sign In to Chaos Account
- ดูคู่มือ: [ติดตั้ง Corona](https://8bahtapp.github.io/docs/chaos/manage/#install-corona)

## วิธีติดตั้งและเปิดใช้งาน Enscape
- ติดตั้งโปรแกรม host (SketchUp, Revit, Rhino, Archicad, Vectorworks) ก่อน
- ดาวน์โหลดและติดตั้ง Enscape → I accept → Next → Install → Done
- ไปที่ Toolbar ของ Enscape → Chaos Account → Sign In
- ดูคู่มือ: [ติดตั้ง Enscape](https://8bahtapp.github.io/docs/chaos/manage/#install-enscape)

## วิธีติดตั้งและเปิดใช้งาน V-Ray
- ติดตั้งโปรแกรม host ก่อน
- ดาวน์โหลดและติดตั้ง V-Ray → I accept → Continue → Install → Done
- SketchUp/Rhino: Extensions → V-Ray → Help → Chaos Account → Sign In
- 3ds Max/Maya: เมนู V-Ray → Licensing → Chaos Account → Sign In
- ดูคู่มือ: [ติดตั้ง V-Ray](https://8bahtapp.github.io/docs/chaos/manage/#install-vray)

## วิธีถอนใบอนุญาต (Deactivate)
- License Server: เปิด http://localhost:30304 → Online licensing → Sign out → Yes
- Corona 3ds Max: Render Setup (F10) → System → About Chaos Corona → Chaos Account → Sign Out
- Corona Cinema 4D: เมนู Corona → About → Chaos Account → Sign Out
- Enscape: Toolbar Enscape → Chaos Account → Sign Out
- V-Ray SketchUp: Extensions → V-Ray → Help → Chaos Account → Sign Out
- V-Ray 3ds Max/Maya: เมนู V-Ray → Licensing → Chaos Account → Sign Out
- ดูคู่มือ: [วิธีถอนใบอนุญาต](https://8bahtapp.github.io/docs/chaos/manage/#decivate)

## วิธีเช็ควันหมดอายุ
- Admin: https://my.chaos.com/organization/licenses → Organization
- User: https://my.chaos.com/products
- หรือดูจาก Chaos License Server: http://localhost:30304 → Online licensing
- ดูคู่มือ: [วิธีเช็ควันหมดอายุ](https://8bahtapp.github.io/docs/chaos/tips/#ea)

## วิธีเปลี่ยนอีเมลผู้ใช้งาน
- Admin ถอดสิทธิ์อีเมลเดิม: Organization → จุดสามจุด ⋮ → Remove user
- เพิ่มอีเมลใหม่: Invite users → Assign โปรดักส์
- ดูคู่มือ: [วิธีเปลี่ยนอีเมลผู้ใช้งาน](https://8bahtapp.github.io/docs/chaos/tips/#cus)

## แก้ปัญหา License Error / ไม่พบ License
- Sign out แล้ว Sign in ใหม่
- ตรวจสอบ Chaos Services ใน Windows Settings → Apps → Startup (ต้องเปิดอยู่ทุกตัว)
- Restart Chaos Services: Start → Chaos → Start Service ทุกตัว
- อัปเดตเป็นเวอร์ชั่นล่าสุดที่ /docs/chaos/
- ตรวจสอบสิทธิ์ที่ https://my.chaos.com/products
- ตรวจสอบ Chaos License Server ที่ http://localhost:30304 (สำหรับเวอร์ชั่นเก่า)
- ดูคู่มือ: [License Error](https://8bahtapp.github.io/docs/chaos/tips/#ls-error)

## FAQ
- Portal: https://my.chaos.com/organization/licenses
- Named License ใช้ได้ 1 เครื่องต่อ 1 อีเมล, Floating ใช้พร้อมกันตามจำนวนที่ซื้อ
- ต้องติดตั้งโปรแกรม host ก่อนเสมอ
- ลืมรหัสผ่าน: https://accounts.chaos.com → Forgot password
- สร้างบัญชี Chaos: https://accounts.chaos.com/register
- หลังต่ออายุใบอนุญาตจะต่ออัตโนมัติ ไม่ต้องทำขั้นตอนใหม่
- Chaos Unified Login และ Chaos License Server ต้องทำงานอยู่ตลอดเวลา อย่า Disable
- ติดปัญหา: [Open Ticket](https://8baht.com/help?ref=8Baht_Docs)

## ช่องทางติดต่อ
- Open Ticket: [บริการช่วยเหลือ](https://8baht.com/help?ref=8Baht_Docs)
- Support: support8baht@applicadthai.com
- Sale: 8baht@applicadthai.com
- เวลาทำการ: จันทร์–ศุกร์ 09:00–17:00
`