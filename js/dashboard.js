// ==========================================================
// DASHBOARD.JS - greeting, ringkasan, progress dan histori
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  protectPage();
  renderUser();
  renderGreeting();
  renderMetrics();
  renderProgress();
  renderHistory();
  renderStockDistribution();
  initLayout();
  initTheme();
});

function getSession() {
  const raw = localStorage.getItem('sittaSession') || sessionStorage.getItem('sittaSession');
  return raw ? JSON.parse(raw) : null;
}

function protectPage() {
  if (!getSession()) {
    window.location.href = 'login.html';
  }
}

function renderUser() {
  const user = getSession();
  if (!user) return;

  document.getElementById('userName').textContent = user.nama;
  document.getElementById('userRole').textContent = `${user.role} · ${user.lokasi}`;
  document.getElementById('userAvatar').textContent = user.nama.charAt(0).toUpperCase();
}

function renderGreeting() {
  const hour = new Date().getHours();
  let period = 'pagi';

  if (hour >= 11 && hour < 15) period = 'siang';
  else if (hour >= 15 && hour < 18) period = 'sore';
  else if (hour >= 18) period = 'malam';

  const user = getSession();
  const firstName = user?.nama?.split(' ')[0] || 'Admin';

  document.getElementById('greetingTitle').textContent = `Selamat ${period}, ${firstName}`;
  document.getElementById('greetingText').textContent = `Semoga aktivitas hari ini berjalan lancar. Berikut ringkasan operasional SITTA untuk ${user?.lokasi || 'unit Anda'}.`;
}

function renderMetrics() {
  const totalStock = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);
  const averageStock = Math.round(totalStock / dataBahanAjar.length);

  document.getElementById('totalMaterials').textContent = dataBahanAjar.length;
  document.getElementById('totalStock').textContent = totalStock.toLocaleString('id-ID');
  document.getElementById('totalDO').textContent = Object.keys(dataTracking).length;
  document.getElementById('averageStock').textContent = averageStock.toLocaleString('id-ID');
}

function getStatusClass(status) {
  const value = status.toLowerCase();
  if (value.includes('selesai') || value.includes('diterima')) return 'success';
  if (value.includes('perjalanan')) return 'warning';
  return 'info';
}

function renderProgress() {
  const progressList = document.getElementById('progressList');
  const items = Object.entries(dataTracking);

  progressList.innerHTML = items.map(([doNumber, item]) => {
    const maxSteps = 5;
    const steps = Math.min(item.perjalanan.length, maxSteps);
    const progress = Math.min(Math.round((steps / maxSteps) * 100), 100);

    return `
      <div class="progress-item">
        <div class="progress-topline">
          <div>
            <strong>DO ${doNumber}</strong>
            <span>${item.nama} · ${item.ekspedisi}</span>
          </div>
          <em class="status-badge ${getStatusClass(item.status)}">${item.status}</em>
        </div>
        <div class="progress-track"><span style="width: ${progress}%"></span></div>
        <div class="progress-meta"><span>${steps} update perjalanan</span><span>${progress}% terpantau</span></div>
      </div>
    `;
  }).join('');
}

function renderHistory() {
  const tbody = document.getElementById('historyTableBody');

  tbody.innerHTML = Object.entries(dataTracking).map(([doNumber, item]) => `
    <tr>
      <td><strong>${doNumber}</strong></td>
      <td>${item.nama}</td>
      <td>${item.ekspedisi}</td>
      <td><span class="status-badge ${getStatusClass(item.status)}">${item.status}</span></td>
    </tr>
  `).join('');
}

function renderStockDistribution() {
  const container = document.getElementById('stockDistribution');
  const total = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);

  container.innerHTML = dataBahanAjar.map((item) => {
    const percentage = total ? Math.round((item.stok / total) * 100) : 0;
    return `
      <div class="distribution-item">
        <div class="distribution-label"><span>${item.namaBarang}</span><strong>${item.stok}</strong></div>
        <div class="distribution-track"><span style="width:${percentage}%"></span></div>
      </div>
    `;
  }).join('');
}

function initLayout() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  document.getElementById('menuToggle')?.addEventListener('click', () => {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-visible');
  });

  document.getElementById('sidebarClose')?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-visible');
  }

  document.querySelectorAll('[data-scroll-target]').forEach((button) => {
    button.addEventListener('click', () => {
      document.getElementById(button.dataset.scrollTarget)?.scrollIntoView({ behavior: 'smooth' });
      closeSidebar();
    });
  });

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
