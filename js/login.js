// ==========================================================
// LOGIN.JS - validasi login dan modal pada halaman login
// ==========================================================

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const togglePassword = document.getElementById('togglePassword');
const rememberMe = document.getElementById('rememberMe');

function showFieldError(element, message) {
  element.textContent = message;
  element.closest('.field-group')?.classList.add('has-error');
}

function clearFieldError(element) {
  element.textContent = '';
  element.closest('.field-group')?.classList.remove('has-error');
}

emailInput.addEventListener('input', () => clearFieldError(emailError));
passwordInput.addEventListener('input', () => clearFieldError(passwordError));

togglePassword.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePassword.textContent = isPassword ? 'Sembunyi' : 'Lihat';
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  clearFieldError(emailError);
  clearFieldError(passwordError);

  let isValid = true;

  if (!email) {
    showFieldError(emailError, 'Email wajib diisi.');
    isValid = false;
  }

  if (!password) {
    showFieldError(passwordError, 'Password wajib diisi.');
    isValid = false;
  }

  if (!isValid) return;

  const user = dataPengguna.find((item) => item.email.toLowerCase() === email && item.password === password);

  if (!user) {
    alert('email/password yang anda masukkan salah');
    passwordInput.focus();
    return;
  }

  const session = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    lokasi: user.lokasi
  };

  const storage = rememberMe.checked ? localStorage : sessionStorage;
  storage.setItem('sittaSession', JSON.stringify(session));

  window.location.href = 'dashboard.html';
});

// ==========================================================
// MODAL
// ==========================================================

function openModal(modal) {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  const focusable = modal.querySelector('input, button');
  focusable?.focus();
}

function closeModal(modal) {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('[data-modal-target]').forEach((button) => {
  button.addEventListener('click', () => {
    const modal = document.getElementById(button.dataset.modalTarget);
    if (modal) openModal(modal);
  });
});

document.querySelectorAll('[data-close-modal]').forEach((button) => {
  button.addEventListener('click', () => closeModal(button.closest('.modal-backdrop')));
});

document.querySelectorAll('.modal-backdrop').forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.is-open').forEach(closeModal);
  }
});

document.getElementById('forgotForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('forgotEmail').value.trim().toLowerCase();
  const exists = dataPengguna.some((item) => item.email.toLowerCase() === email);

  if (!exists) {
    alert('Email belum terdaftar pada data pengguna.');
    return;
  }

  alert('Permintaan reset password berhasil disimulasikan. Silakan hubungi administrator.');
  event.target.reset();
  closeModal(document.getElementById('forgotModal'));
});

document.getElementById('registerForm').addEventListener('submit', (event) => {
  event.preventDefault();
  alert('Pendaftaran berhasil disimulasikan. Pada versi tugas ini data baru belum disimpan ke backend.');
  event.target.reset();
  closeModal(document.getElementById('registerModal'));
});
