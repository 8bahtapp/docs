// ============================================================
// chat-data.js — ข้อมูลสำหรับ Fuse.js Search Chat
// ครอบคลุมเนื้อหาทั้งหมดใน docs/adobe/
//
// วิธีเพิ่มข้อมูล:
// 1. copy block { ... } แล้ว paste ต่อท้ายใน chatData array
// 2. กรอก question, answer, tags, และ link
// ============================================================

const chatData = [

  // ─────────────────────────────────────────
  // หมวด: จัดการใบอนุญาต (manage)
  // ─────────────────────────────────────────
  {
    id: 'manage-01',
    tags: ['ใบอนุญาต', 'license', 'จัดการ', 'admin', 'คำเชิญ', 'invite'],
    question: 'วิธีจัดการใบอนุญาต Adobe ทำอย่างไร',
    answer: 'เมื่อสั่งซื้อสำเร็จจะได้รับอีเมลคำเชิญจาก Adobe ให้คลิก Get started แล้ว Sign in ด้วยอีเมลที่สั่งซื้อ จากนั้นคลิก Join team และเลือกโปรไฟล์',
    link: { text: 'ดูคู่มือจัดการใบอนุญาต', url: '/docs/adobe/manage/' }
  },
  {
    id: 'manage-02',
    tags: ['เพิ่มผู้ใช้', 'add user', 'admin console', 'อีเมล'],
    question: 'วิธีเพิ่มผู้ใช้งานใน Adobe Admin Console',
    answer: 'เข้า Adobe Admin Console → คลิกชื่อโปรดักส์ → Add User → ใส่อีเมลผู้ใช้งาน → เลือก Add as a new user ผู้ใช้จะได้รับอีเมลคำเชิญ',
    link: { text: 'ดูคู่มือเพิ่มผู้ใช้งาน', url: '/docs/adobe/manage/#manage' }
  },
  {
    id: 'manage-03',
    tags: ['ติดตั้ง', 'install', 'creative cloud', 'download'],
    question: 'วิธีติดตั้ง Adobe Creative Cloud',
    answer: 'ดาวน์โหลดไฟล์ติดตั้งจากหน้า Adobe แล้วเปิดไฟล์ทำตามขั้นตอน หลังจากนั้น Sign in ด้วยอีเมลที่ได้รับคำเชิญเพื่อเริ่มใช้งาน',
    link: { text: 'ดูคู่มือติดตั้ง', url: '/docs/adobe/manage/#install' }
  },
  {
    id: 'manage-04',
    tags: ['ถอน', 'deactivate', 'sign out', 'เปลี่ยนเครื่อง', 'uninstall'],
    question: 'วิธีถอนใบอนุญาต Adobe ก่อนเปลี่ยนเครื่อง',
    answer: 'เปิด Creative Cloud Desktop App → คลิกชื่อบัญชีมุมขวาบน → Sign Out ต้องทำก่อน Uninstall หรือเปลี่ยนเครื่องคอมพิวเตอร์เสมอ',
    link: { text: 'ดูคู่มือถอนใบอนุญาต', url: '/docs/adobe/manage/#decivate' }
  },
  {
    id: 'manage-05',
    tags: ['1 อีเมล', '1 ใบอนุญาต', 'จำนวน', 'บัญชี'],
    question: 'ใช้ 1 ใบอนุญาตกี่อีเมลได้',
    answer: 'การใช้งาน 1 ใบอนุญาตต่อ 1 อีเมล เช่น 5 ใบอนุญาตต้องใช้อีเมล 5 บัญชี',
    link: { text: 'ดูข้อมูลเพิ่มเติม', url: '/docs/adobe/manage/' }
  },

  // ─────────────────────────────────────────
  // หมวด: How To
  // ─────────────────────────────────────────
  {
    id: 'howto-01',
    tags: ['customer id', 'account id', 'vip number', 'หมายเลข', 'ค้นหา'],
    question: 'วิธีค้นหา Customer ID หรือ Account ID',
    answer: 'เข้า Adobe Admin Console → Sign in → เลือกโปรไฟล์ → ไปที่เมนู Account ด้านบน จะเห็น Account ID รูปแบบ 100XXXXXXX',
    link: { text: 'ดูวิธีค้นหา Customer ID', url: '/docs/adobe/howto/#customer-id' }
  },

  // ─────────────────────────────────────────
  // หมวด: FAQ
  // ─────────────────────────────────────────
  {
    id: 'faq-01',
    tags: ['เปิดใช้งาน', 'activate', 'ใบอนุญาต', 'เริ่มต้น'],
    question: 'วิธีเปิดใช้งานใบอนุญาตทำอย่างไร',
    answer: 'หลังการสั่งซื้อจะได้รับอีเมลพร้อมลิงก์เปิดใช้งาน กดที่ลิงก์และเข้าสู่ระบบด้วยอีเมลที่ลงทะเบียนไว้',
    link: null
  },
  {
    id: 'faq-02',
    tags: ['อินเทอร์เน็ต', 'internet', 'ออฟไลน์', 'offline', '99 วัน'],
    question: 'ต้องเชื่อมต่ออินเทอร์เน็ตตลอดเวลาหรือไม่',
    answer: 'ต้องเชื่อมต่ออินเทอร์เน็ตสำหรับการเปิดใช้งานครั้งแรก หลังจากนั้นใช้งานแบบออฟไลน์ได้สูงสุด 99 วัน',
    link: null
  },
  {
    id: 'faq-03',
    tags: ['รหัสผ่าน', 'password', 'ลืม', 'reset'],
    question: 'ลืมรหัสผ่านทำอย่างไร',
    answer: 'ไปที่หน้าเข้าสู่ระบบ Adobe แล้วคลิก "ลืมรหัสผ่าน" ระบบจะส่งลิงก์รีเซ็ตไปยังอีเมล',
    link: null
  },
  {
    id: 'faq-04',
    tags: ['หลายเครื่อง', 'สองเครื่อง', '2 เครื่อง', 'multiple devices'],
    question: 'ใช้ใบอนุญาตหนึ่งฉบับบนหลายเครื่องได้ไหม',
    answer: 'ลงชื่อเข้าใช้ Adobe ได้บนคอมพิวเตอร์สองเครื่อง แต่ใช้งานได้บนเครื่องเดียวในแต่ละครั้ง',
    link: null
  },
  {
    id: 'faq-05',
    tags: ['ปัญหา', 'ติดปัญหา', 'ticket', 'support', 'ช่วยเหลือ'],
    question: 'ติดปัญหาการติดตั้งทำอย่างไร',
    answer: 'เปิด Ticket ที่ 8baht.com/help เจ้าหน้าที่จะติดต่อในช่วงเวลาทำการ จันทร์–ศุกร์ 09:00–17:00',
    link: { text: 'เปิด Ticket', url: 'https://8baht.com/help?ref=8Baht_Docs' }
  }

]
