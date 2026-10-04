// ==========================================================
// STOK.JS - render tabel, search, dan tambah baris dengan DOM
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  protectPage();
  renderUser();
  renderStockTable(dataBahanAjar);
  renderStockSummary();
  initStockSearch();
  initAddStockForm();
  initLayout();
  initTheme();

  document.getElementById('scrollAddButton').addEventListener('click', () => {
    document.getElementById('addStockSection').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('newKodeLokasi').focus();
  });
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

function renderStockTable(items) {
  const tbody = document.getElementById('stockTableBody');

  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Tidak ada data yang cocok.</td></tr>';
    return;
  }

  tbody.innerHTML = items.map((item) => `
    <tr>
      <td><img class="book-cover" src="${item.cover}" alt="Cover ${item.namaBarang}" onerror="this.src='img/pengantar_komunikasi.jpg'"></td>
      <td><code>${item.kodeLokasi}</code></td>
      <td><code>${item.kodeBarang}</code></td>
      <td><strong>${item.namaBarang}</strong></td>
      <td><span class="type-chip">${item.jenisBarang}</span></td>
      <td>${item.edisi}</td>
      <td><strong class="stock-value">${Number(item.stok).toLocaleString('id-ID')}</strong></td>
    </tr>
  `).join('');
}

function renderStockSummary() {
  const total = dataBahanAjar.reduce((sum, item) => sum + Number(item.stok), 0);
  const highest = Math.max(...dataBahanAjar.map((item) => Number(item.stok)));

  document.getElementById('stockCount').textContent = dataBahanAjar.length;
  document.getElementById('stockTotal').textContent = total.toLocaleString('id-ID');
  document.getElementById('stockHighest').textContent = highest.toLocaleString('id-ID');
}

function initStockSearch() {
  const input = document.getElementById('stockSearch');
  input.addEventListener('input', () => {
    const keyword = input.value.trim().toLowerCase();
    const filtered = dataBahanAjar.filter((item) =>
      item.namaBarang.toLowerCase().includes(keyword) ||
      item.kodeBarang.toLowerCase().includes(keyword) ||
      item.kodeLokasi.toLowerCase().includes(keyword)
    );
    renderStockTable(filtered);
  });
}

function initAddStockForm() {
  const form = document.getElementById('addStockForm');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const newItem = {
      kodeLokasi: document.getElementById('newKodeLokasi').value.trim(),
      kodeBarang: document.getElementById('newKodeBarang').value.trim(),
      namaBarang: document.getElementById('newNamaBarang').value.trim(),
      jenisBarang: document.getElementById('newJenisBarang').value,
      edisi: document.getElementById('newEdisi').value,
      stok: Number(document.getElementById('newStok').value),
      cover: document.getElementById('newCover').value.trim() || 'img/pengantar_komunikasi.jpg'
    };

    if (!newItem.kodeLokasi || !newItem.kodeBarang || !newItem.namaBarang || newItem.stok < 0) {
      alert('Pastikan semua data wajib sudah diisi dengan benar.');
      return;
    }

    dataBahanAjar.push(newItem);
    renderStockTable(dataBahanAjar);
    renderStockSummary();
    form.reset();
    document.getElementById('newEdisi').value = '1';
    document.getElementById('newStok').value = '100';
    alert('Baris stok baru berhasil ditambahkan ke tabel.');
  });
}

function initLayout() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const closeSidebar = () => {
    sidebar.classList.remove('is-open'); overlay.classList.remove('is-visible');
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
