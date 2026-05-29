// ========================================
// Guide Sidebar Active State
// ========================================
function updateActiveTOC() {
    const sections = document.querySelectorAll('.guide-section, .guide-cta');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 150) {
                const id = section.id;
                if (id) {
                    currentSection = id;
                }
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize active TOC update
if (document.querySelector('.toc-link')) {
    updateActiveTOC();
}

// ========================================
// Knowledge Base Search
// ========================================
function searchArticles() {
    const searchInput = document.getElementById('kbSearch');
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase();
    const articles = document.querySelectorAll('.article-link');
    
    articles.forEach(article => {
        const text = article.textContent.toLowerCase();
        if (text.includes(query)) {
            article.style.display = 'flex';
        } else {
            article.style.display = 'none';
        }
    });
}

// ========================================
// FAQ Toggle Accordion
// ========================================
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const faqItem = element.closest('.faq-item');
    const allAnswers = document.querySelectorAll('.faq-answer');
    const allQuestions = document.querySelectorAll('.faq-question');
    const allItems = document.querySelectorAll('.faq-item');

    const scrollY = window.scrollY;

    // Close all others
    allAnswers.forEach(item => { if (item !== answer) item.classList.remove('show') });
    allQuestions.forEach(item => { if (item !== element) item.classList.remove('active') });
    allItems.forEach(item => { if (item !== faqItem) item.classList.remove('is-open') });

    // Toggle current
    answer.classList.toggle('show');
    element.classList.toggle('active');
    faqItem.classList.toggle('is-open', element.classList.contains('active'));

    // Prevent page jump
    window.scrollTo({ top: scrollY, behavior: 'instant' });
}

// ========================================
// Cookie Functions
// ========================================
function acceptCookies() {
    localStorage.setItem('cookies-accepted', 'true');
    document.getElementById('cookieBanner').classList.add('hidden');
}

function declineCookies() {
    localStorage.setItem('cookies-accepted', 'false');
    document.getElementById('cookieBanner').classList.add('hidden');
}

function initCookies() {
    const cookiesAccepted = localStorage.getItem('cookies-accepted');
    if (cookiesAccepted === null) {
        document.getElementById('cookieBanner').classList.remove('hidden');
    } else {
        document.getElementById('cookieBanner').classList.add('hidden');
    }
}

// Initialize cookies on page load
initCookies();

// ========================================
// Search Functionality
// ========================================
function toggleSearch() {
    const searchBar = document.getElementById('searchBar');
    searchBar.classList.toggle('hidden');
    
    if (!searchBar.classList.contains('hidden')) {
        document.getElementById('searchInput').focus();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !document.activeElement.matches('input')) {
        e.preventDefault();
        toggleSearch();
    }
});

// ========================================
// Chat Widget Toggle
// ========================================
function toggleChat() {
    const chatWidget = document.getElementById('chatWidget');
    chatWidget.classList.toggle('hidden');
    
    if (!chatWidget.classList.contains('hidden')) {
        const chatInput = chatWidget.querySelector('.chat-input input');
        chatInput.focus();
        if (typeof initDisclaimer === 'function') initDisclaimer();
    }
}

// ========================================
// Modal Functions
// ========================================
function showInfo(system) {
    const modal = document.getElementById('infoModal');
    const allReqs = document.querySelectorAll('.req-content');
    
    // Hide all
    allReqs.forEach(req => req.classList.add('hidden'));
    
    // Show selected
    const selected = document.getElementById('req-' + system);
    if (selected) {
        selected.classList.remove('hidden');
    }
    
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('infoModal');
    modal.classList.add('hidden');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('infoModal');
    if (e.target === modal) {
        closeModal();
    }
});

// ========================================
// Version Selector
// ========================================
function changeVersion() {
    const select = document.getElementById('versionSelect');
    const version = select.value;
    
    if (version) {
        console.log('Switched to version:', version);
    }
}

// ========================================
// Smooth Scroll for Navigation Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// Active Navigation Link
// ========================================
function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

setActiveNavLink();

// ========================================
// Track Events
// ========================================
function trackEvent(eventName, eventData) {
    console.log(`Event: ${eventName}`, eventData);
}

document.querySelectorAll('.download-btn, .card-link, .kb-link').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('button_click', {
            button_text: btn.textContent.trim(),
            button_type: btn.className
        });
    });
});
// ========================================
// Cards Grid — Collapse / Expand
// ซ่อนแถวที่ 2+ เมื่อมีการ์ดมากกว่า 1 แถว (> 3 ใบ)
// ========================================
(function initCardsCollapse() {
  const COLS = 3; // ตรงกับ grid-template-columns: repeat(3, ...)
  const THRESHOLD = COLS + 1; // > 3 ใบ = มีแถวที่ 2

  document.querySelectorAll('.cards-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.download-card');
    if (cards.length < THRESHOLD) return; // 1–3 ใบ ไม่ทำอะไร

    // วัด height ของ 1 แถว (การ์ดใบแรก + gap)
    function getRowHeight() {
      const gap = parseInt(getComputedStyle(grid).gap) || 24;
      return cards[0].offsetHeight + gap;
    }

    // Wrap
    const wrap = document.createElement('div');
    wrap.className = 'cards-grid-wrap collapsed has-overflow';
    grid.parentNode.insertBefore(wrap, grid);
    wrap.appendChild(grid);

    // Fade overlay — อยู่ใน grid เพื่อให้ overflow:hidden clip พร้อมกัน
    const fade = document.createElement('div');
    fade.className = 'cards-grid-fade';
    grid.appendChild(fade);

    // Toggle button
    const btn = document.createElement('button');
    btn.className = 'cards-grid-toggle';
    btn.innerHTML = 'ดูแอปพลิเคชันเพิ่มเติม';
    wrap.appendChild(btn);

    // max-height = แถว 1 + ครึ่งแถว 2, fade วางที่ครึ่งบนของแถว 2
    function applyCollapse() {
      const rowH = getRowHeight();
      const halfRow = rowH / 2;
      const collapsedH = rowH + halfRow;   // แถว 1 + ครึ่งแถว 2

      if (wrap.classList.contains('collapsed')) {
        grid.style.maxHeight = collapsedH + 'px';
        // fade bottom = 0 → ติดล่างสุดของ max-height (กึ่งกลางแถว 2 พอดี)
        fade.style.bottom = '0';
      }
    }

    applyCollapse();
    window.addEventListener('resize', applyCollapse);

    btn.addEventListener('click', () => {
      const isCollapsed = wrap.classList.contains('collapsed');
      if (isCollapsed) {
        wrap.classList.remove('collapsed');
        grid.style.maxHeight = '';
        btn.innerHTML = 'ย่อขึ้น &#9650;';
      } else {
        wrap.classList.add('collapsed');
        applyCollapse();
        btn.innerHTML = 'ดูแอปพลิเคชันเพิ่มเติม';
      }
    });
  });
})();