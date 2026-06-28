/* ===== VÕ ĐANG NGA MI - JAVASCRIPT ===== */

// ===== 1. FORM VALIDATION =====
function validateForm(e) {
  e.preventDefault();
  let isValid = true;

  const fields = [
    { id: 'fullName', errId: 'nameErr', regex: /^[\p{L}\s]{2,}$/u, msg: 'Vui lòng nhập họ tên hợp lệ (ít nhất 2 ký tự).' },
    { id: 'email', errId: 'emailErr', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Địa chỉ email không hợp lệ.' },
    { id: 'phone', errId: 'phoneErr', regex: /^(0|\+84)[0-9]{9}$/, msg: 'Số điện thoại không hợp lệ (VD: 0901234567).' },
    { id: 'message', errId: 'msgErr', validate: v => v.trim().length >= 10, msg: 'Nội dung cần ít nhất 10 ký tự.' }
  ];

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    if (!el) return; 

    const val = el.value;
    const ok = f.regex ? f.regex.test(val.trim()) : f.validate(val);

    if (!ok) {
      el.classList.add('is-invalid');
      el.classList.remove('is-valid');
      if (err) { err.textContent = f.msg; err.style.display = 'block'; }
      isValid = false;
    } else {
      el.classList.remove('is-invalid');
      el.classList.add('is-valid');
      if (err) err.style.display = 'none';
    }
  });

  if (isValid) {
    const btn = document.getElementById('submitBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang gửi...';
    }
    setTimeout(() => {
      showToast('✅ Gửi thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.', 'success');
      const form = document.getElementById('contactForm');
      if (form) form.reset();
      document.querySelectorAll('.form-control').forEach(el => { el.classList.remove('is-valid', 'is-invalid'); });
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = 'Gửi tin nhắn ☕';
      }
    }, 1500);
  }
}

// ===== 2. SEARCH & FILTER =====
let activeCategory = 'all';
let searchQuery = '';

function filterMenu() {
  const cards = document.querySelectorAll('.menu-item');
  const noResults = document.getElementById('noResults');
  let visible = 0;

  cards.forEach(card => {
    const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
    const cat = card.dataset.category;
    const matchCat = activeCategory === 'all' || cat === activeCategory;
    const matchSearch = name.includes(searchQuery.toLowerCase());

    if (matchCat && matchSearch) {
      card.style.display = '';
      card.style.animation = 'fadeInUp 0.4s ease forwards';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });

  const countEl = document.getElementById('menuCount');
  if (countEl) countEl.textContent = `Hiển thị ${visible} món`;
  if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
}

function setCategory(cat, btn) {
  activeCategory = cat;
  document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  filterMenu();
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value;
      filterMenu();
    });
  }
});

// ===== 3. BACK TO TOP =====
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (backToTopBtn) {
    if (window.scrollY > 400) {
      backToTopBtn.style.display = 'flex';
      setTimeout(() => backToTopBtn.style.opacity = '1', 10);
    } else {
      backToTopBtn.style.opacity = '0';
      setTimeout(() => backToTopBtn.style.display = 'none', 300);
    }
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== 4. DARK/LIGHT MODE =====
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  const btn = document.getElementById('darkToggle');
  if (btn) btn.innerHTML = isDark ? '☀️ Sáng' : '🌙 Tối';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    const btn = document.getElementById('darkToggle');
    if (btn) btn.innerHTML = '☀️ Sáng';
  }
});

// ===== 5. CART COUNTER =====
let cartCount = 0;

function addToCart(name) {
  cartCount++;
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = cartCount;
    badge.style.transform = 'scale(1.4)';
    setTimeout(() => badge.style.transform = 'scale(1)', 200);
  }
  showToast(`🛒 Đã thêm "${name}" vào giỏ hàng!`, 'info');
}

// ===== 6. MODAL DETAIL  =====
function showDetail(name, desc, price, imageSrc, category) {
  document.getElementById('modalTitle').textContent = name;
  document.getElementById('modalDesc').textContent = desc;
  document.getElementById('modalPrice').textContent = price;
  document.getElementById('modalCategory').textContent = category;


  const modalImg = document.getElementById('modalImage');
  const modalEmojiBox = document.getElementById('modalEmoji');

  if (modalImg) {
    
    modalImg.alt = name;
  } else if (modalEmojiBox) {
   
    modalEmojiBox.innerHTML = `<img src="${imageSrc}" class="img-fluid rounded-4 shadow-sm" style="max-height: 220px; width: 100%; object-fit: cover;" alt="${name}">`;
    modalEmojiBox.style.fontSize = "1rem";
  }

  const btn = document.getElementById('modalAddBtn');
  if (btn) {
    btn.onclick = (e) => { 
      e.stopPropagation();
      addToCart(name); 
    };
  }

  const modalEl = document.getElementById('productModal');
  if (modalEl) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
}

// ===== 7. TOAST NOTIFICATION =====
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toastNotif');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.className = 'toast align-items-center border-0 show';
  toast.classList.add(type === 'success' ? 'bg-success' : type === 'info' ? 'bg-primary' : 'bg-danger');
  toast.classList.add('text-white');

  const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
  bsToast.show();
}

// ===== SMOOTH SCROLL NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      const navCollapse = document.getElementById('navbarNav');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    }
  });
});
