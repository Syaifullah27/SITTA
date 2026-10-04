// ==========================================================
// TRACKING.JS - pencarian nomor DO dan pembuatan timeline DOM
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  protectPage();
  renderUser();
  initLayout();
  initTheme();

  const form = document.getElementById('trackingForm');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    searchTracking();
  });

  const params = new URLSearchParams(window.location.search);
  const requestedDO = params.get('do');
  if (requestedDO) {
    document.getElementById('doNumber').value = requestedDO;
    searchTracking();
  }
});

function getSession() {
  const raw = localStorage.getItem('sittaSession') || sessionStorage.getItem('sittaSession');
  return raw ? JSON.parse(raw) : null;
}

function protectPage() {
  if (!getSession()) window.location.href = 'login.html';
}

function renderUser() {
  const user = getSession();
  if (!user) return;
  document.getElementById('userName').textContent = user.nama;
  document.getElementById('userRole').textContent = `${user.role} · ${user.lokasi}`;
  document.getElementById('userAvatar').textContent = user.nama.charAt(0).toUpperCase();
}

function getStatusClass(status) {
  const value = status.toLowerCase();
  if (value.includes('selesai') || value.includes('diterima')) return 'success';
  if (value.includes('perjalanan')) return 'warning';
  return 'info';
}

function searchTracking() {
  const input = document.getElementById('doNumber');
  const doNumber = input.value.trim();
  const empty = document.getElementById('trackingEmpty');
  const result = document.getElementById('trackingResult');

  if (!doNumber) {
    alert('Nomor Delivery Order wajib diisi.');
    input.focus();
    return;
  }

  const data = dataTracking[doNumber];

  if (!data) {
    result.classList.add('hidden');
    empty.classList.remove('hidden');
    empty.querySelector('h2').textContent = 'Data tidak ditemukan';
    empty.querySelector('p').textContent = 'Nomor DO tidak tersedia di data dummy. Coba 2023001234 atau 2023005678.';
    alert('Nomor Delivery Order tidak ditemukan.');
    return;
  }

  empty.classList.add('hidden');
  result.classList.remove('hidden');

  document.getElementById('trackingName').textContent = data.nama;
  document.getElementById('trackingDoLabel').textContent = `DO ${doNumber}`;
  document.getElementById('trackingStatusBadge').textContent = data.status;
  document.getElementById('trackingStatusBadge').className = `status-badge ${getStatusClass(data.status)}`;
  document.getElementById('trackingExpedition').textContent = data.ekspedisi;
  document.getElementById('trackingDate').textContent = formatDate(data.tanggalKirim);
  document.getElementById('trackingPackage').textContent = data.paket;
  document.getElementById('trackingTotal').textContent = data.total;
  document.getElementById('trackingCount').textContent = `${data.perjalanan.length} update`;

  const timeline = document.getElementById('trackingTimeline');
  timeline.innerHTML = data.perjalanan.map((item, index) => `
    <article class="timeline-item ${index === data.perjalanan.length - 1 ? 'is-last' : ''}">
      <div class="timeline-marker"><span>${index + 1}</span></div>
      <div class="timeline-content">
        <span class="timeline-time">${formatDateTime(item.waktu)}</span>
        <h3>${index === 0 ? 'Paket diterima ekspedisi' : index === data.perjalanan.length - 1 ? 'Update terbaru' : 'Pembaruan perjalanan'}</h3>
        <p>${item.keterangan}</p>
      </div>
    </article>
  `).join('');
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

function formatDateTime(value) {
  const date = new Date(value.replace(' ', 'T'));
  return date.toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function initLayout() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const closeSidebar = () => {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-visible');
  };
  document.getElementById('menuToggle')?.addEventListener('click', () => {
    sidebar.classList.add('is-open'); overlay.classList.add('is-visible');
  });
  document.getElementById('sidebarClose')?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);
  document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('sittaSession');
    sessionStorage.removeItem('sittaSession');
    window.location.href = 'login.html';
  });
}

function initTheme() {
  const savedTheme = localStorage.getItem('sittaTheme') || 'dark';
  applyTheme(savedTheme);
  document.getElementById('themeToggle').addEventListener('click', () => {
    const next = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('sittaTheme', next);
  });
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  document.getElementById('themeToggle').textContent = theme === 'light' ? '☀' : '☾';
}
