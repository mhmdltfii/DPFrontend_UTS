export class FormValidator {
  static validateLogin(username, password) {
    let isValid = true;
    console.log('[Validator] Memulai validasi form login...');
    this.clearErrors(document.getElementById('loginForm'));

    if (!username || username.trim().length < 3) {
      this.showError('loginUsername', 'Username minimal 3 karakter.');
      console.warn('[Validator Error] Username < 3 karakter.');
      isValid = false;
    }

    if (!password || password.trim().length < 3) {
      this.showError('loginPassword', 'Password minimal 3 karakter.');
      console.warn('[Validator Error] Password < 3 karakter.');
      isValid = false;
    }

    if (isValid) console.log('%c[Validator Success] Validasi login berhasil!', 'color: #2e7d32;');
    return isValid;
  }

  static validateLahan(formData) {
    const form = document.getElementById('lahanForm');
    let isValid = true;
    console.log('[Validator] Memulai validasi form lahan...', formData);
    this.clearErrors(form);

    if (!formData.namaLahan || formData.namaLahan.trim().length < 3) {
      this.showError('namaLahan', 'Nama lahan minimal 3 karakter.');
      console.warn('[Validator Error] Nama Lahan invalid.');
      isValid = false;
    }
    if (!formData.lokasi || formData.lokasi.trim().length < 3) {
      this.showError('lokasi', 'Lokasi minimal 3 karakter.');
      console.warn('[Validator Error] Lokasi invalid.');
      isValid = false;
    }
    if (!formData.luas || Number(formData.luas) <= 0) {
      this.showError('luas', 'Luas lahan harus angka positif.');
      console.warn('[Validator Error] Luas lahan <= 0.');
      isValid = false;
    }
    if (!formData.jenisTanaman) {
      this.showError('jenisTanaman', 'Pilih jenis tanaman.');
      console.warn('[Validator Error] Jenis tanaman belum dipilih.');
      isValid = false;
    }
    if (!formData.tanggalTanam) {
      this.showError('tanggalTanam', 'Pilih tanggal tanam.');
      console.warn('[Validator Error] Tanggal tanam belum diisi.');
      isValid = false;
    }

    if (isValid) console.log('%c[Validator Success] Input form valid!', 'color: #2e7d32;');
    return isValid;
  }

  static showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
      const parent = field.parentElement;
      const errorSmall = parent.querySelector('.error-message');
      parent.classList.add('error');
      if (errorSmall) errorSmall.textContent = message;
    }
  }

  static clearErrors(formElement) {
    if (!formElement) return;
    const errorGroups = formElement.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
      group.classList.remove('error');
      const small = group.querySelector('.error-message');
      if (small) small.textContent = '';
    });
  }
}