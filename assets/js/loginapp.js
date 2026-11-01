document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      togglePassword.textContent = isPassword ? '🙈' : '👁️';
      togglePassword.setAttribute('aria-label', isPassword ? 'Sembunyikan Password' : 'Tampilkan Password');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const usernameInput = document.getElementById('username')?.value.trim().toLowerCase() || '';
      const passVal = passwordInput?.value.trim() || '';
      const errorElement = document.getElementById('errorMessage');

      if (!usernameInput || !passVal) {
        if (errorElement) {
          errorElement.textContent = 'Harap isi username dan password terlebih dahulu!';
          errorElement.style.display = 'block';
        }
        return;
      }

      if (usernameInput === 'admin' && passVal === 'admin') {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('user', 'admin');

        if (errorElement) errorElement.style.display = 'none';

        window.location.href = 'dashboard.html';
      } else {
        if (errorElement) {
          errorElement.textContent = 'Username atau password salah!';
          errorElement.style.display = 'block';
        }
      }
    });
  }
});