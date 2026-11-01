import { DataService } from './services/dataservices.js';

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavbar();
  initLogoutHandler();

  const lahanForm = document.getElementById('lahanForm');
  const tableBody = document.getElementById('lahanTableBody');
  const searchInput = document.getElementById('searchInput');

  if (tableBody) {
    renderTable();

    const pendingLogMessage = sessionStorage.getItem('pendingDashboardLog');
    if (pendingLogMessage) {
      DataService.logDashboardOutput(pendingLogMessage);
      sessionStorage.removeItem('pendingDashboardLog');
    } else {
      DataService.logDashboardOutput('Laporan Konsol Dashboard Utama');
    }
  }

  if (lahanForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    if (editId) {
      const allData = DataService.getAllData();
      const itemToEdit = allData.find(d => d.id === editId);

      if (itemToEdit) {
        document.getElementById('lahanId').value = itemToEdit.id;
        document.getElementById('namaLahan').value = itemToEdit.namaLahan;
        document.getElementById('lokasi').value = itemToEdit.lokasi;
        document.getElementById('luas').value = itemToEdit.luas;
        document.getElementById('jenisTanaman').value = itemToEdit.jenisTanaman;
        document.getElementById('tanggalTanam').value = itemToEdit.tanggalTanam;
        document.getElementById('statusLahan').value = itemToEdit.statusLahan;

        const formTitle = document.getElementById('formTitle');
        const btnSubmit = document.getElementById('btnSubmit');
        if (formTitle) formTitle.textContent = `Ubah Data Lahan (${itemToEdit.id})`;
        if (btnSubmit) btnSubmit.textContent = 'Perbarui Data';

        updateLivePreview();
      }
    }

    lahanForm.addEventListener('input', updateLivePreview);

    lahanForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const namaLahan = document.getElementById('namaLahan').value.trim();
      const lokasi = document.getElementById('lokasi').value.trim();
      const luas = document.getElementById('luas').value.trim();
      const jenisTanaman = document.getElementById('jenisTanaman').value.trim();
      const tanggalTanam = document.getElementById('tanggalTanam').value.trim();
      const statusLahan = document.getElementById('statusLahan').value.trim();

      const textInputs = [namaLahan, lokasi, luas, jenisTanaman, tanggalTanam];
      const filledTextCount = textInputs.filter(val => val !== '').length;

      if (filledTextCount === 0) {
        showFeedbackNotification('Penambahan data wajib diisi', 'danger');
        return;
      }

      if (filledTextCount < textInputs.length) {
        showFeedbackNotification('Mohon lengkapi seluruh data lahan terlebih dahulu.', 'danger');
        return;
      }

      const item = {
        id: document.getElementById('lahanId').value || null,
        namaLahan: namaLahan,
        lokasi: lokasi,
        luas: luas,
        jenisTanaman: jenisTanaman,
        tanggalTanam: tanggalTanam,
        statusLahan: statusLahan
      };

      DataService.saveData(item);

      const isEdit = !!item.id;
      const logText = isEdit
        ? `Pembaruan Data Lahan Berhasil Diperbarui: ${item.namaLahan}`
        : `Pembaruan Data Lahan Berhasil Ditambahkan: ${item.namaLahan}`;

      sessionStorage.setItem('pendingDashboardLog', logText);

      const feedbackMessage = isEdit ? 'Data Lahan berhasil diperbarui!' : 'Data Lahan berhasil disimpan!';
      showFeedbackNotification(feedbackMessage, 'success');

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderTable(e.target.value);
    });
  }
});

function renderTable(searchKeyword = '') {
  const tbody = document.getElementById('lahanTableBody');
  if (!tbody) return;

  const filteredData = DataService.searchData(searchKeyword);
  const allData = DataService.getAllData();

  updateStatCards(allData);
  tbody.innerHTML = '';

  const isDataLahanPage = window.location.pathname.includes('datalahan.html');

  if (filteredData.length === 0) {
    const colSpan = isDataLahanPage ? 7 : 8;
    tbody.innerHTML = `<tr><td colspan="${colSpan}" style="text-align:center; padding: 1.5rem; color:#888;">Tidak ada data lahan yang ditemukan.</td></tr>`;
    return;
  }

  filteredData.forEach((item, index) => {
    const tr = document.createElement('tr');

    let badgeClass = 'badge-tanam';
    if (item.statusLahan === 'Siap Panen') badgeClass = 'badge-panen';
    if (item.statusLahan === 'Pengolahan Tanah') badgeClass = 'badge-olah';
    if (item.statusLahan === 'Status Bera') badgeClass = 'badge-bera';

    const actionTd = isDataLahanPage
      ? ''
      : `
      <td>
        <section class="action-buttons">
          <a href="tambah_data.html?id=${item.id}" class="btn btn-edit btn-sm" style="background-color: #f59e0b; color: white; text-decoration: none;">Edit</a>
          <button class="btn btn-danger btn-sm" data-id="${item.id}">Hapus</button>
        </section>
      </td>`;

    tr.innerHTML = `
      <td><strong>${index + 1}</strong></td>
      <td>${item.namaLahan}</td>
      <td>${item.lokasi}</td>
      <td>${Number(item.luas).toLocaleString('id-ID')} m²</td>
      <td>${item.jenisTanaman}</td>
      <td>${item.tanggalTanam}</td>
      <td><span class="status-badge ${badgeClass}">${item.statusLahan}</span></td>
      ${actionTd}
    `;

    if (!isDataLahanPage) {
      const btnDanger = tr.querySelector('.btn-danger');
      if (btnDanger) {
        btnDanger.addEventListener('click', () => {
          showDeleteConfirmation(`Apakah Anda yakin ingin menghapus data lahan "${item.namaLahan}" ini?`, () => {
            DataService.deleteData(item.id);
            DataService.logDashboardOutput(`Penghapusan Data Lahan Berhasil: ${item.namaLahan}`);
            showFeedbackNotification(`Data lahan "${item.namaLahan}" berhasil dihapus.`, 'danger');
            renderTable(searchKeyword);
          });
        });
      }
    }

    tbody.appendChild(tr);
  });
}

function initMobileNavbar() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    navLinks.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }
}

function initLogoutHandler() {
  const logoutElements = document.querySelectorAll('a, button');
  logoutElements.forEach(element => {
    const text = element.textContent.trim().toLowerCase();
    const href = element.getAttribute('href') || '';

    if (text.includes('keluar') || text.includes('logout') || (href.includes('index.html') && element.classList.contains('btn-secondary'))) {
      element.addEventListener('click', (e) => {
        e.preventDefault();
        showFeedbackNotification('Sesi telah diakhiri. Mengalihkan ke halaman utama...', 'info');
        sessionStorage.clear();
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 600);
      });
    }
  });
}

function updateLivePreview() {
  const prevNama = document.getElementById('prevNamaLahan');
  if (!prevNama) return;

  document.getElementById('prevNamaLahan').textContent = document.getElementById('namaLahan').value || '-';
  document.getElementById('prevLokasi').textContent = document.getElementById('lokasi').value || '-';
  document.getElementById('prevLuas').textContent = document.getElementById('luas').value ? `${document.getElementById('luas').value} m²` : '-';
  document.getElementById('prevJenisTanaman').textContent = document.getElementById('jenisTanaman').value || '-';
  document.getElementById('prevTanggalTanam').textContent = document.getElementById('tanggalTanam').value || '-';
  document.getElementById('prevStatusLahan').textContent = document.getElementById('statusLahan').value || '-';
}

function updateStatCards(dataList) {
  const totalUnit = document.getElementById('statTotalUnit');
  const totalLuas = document.getElementById('statTotalLuas');
  const masaTanam = document.getElementById('statMasaTanam');
  const siapPanen = document.getElementById('statSiapPanen');

  if (!totalUnit) return;

  const sumLuas = dataList.reduce((acc, curr) => acc + Number(curr.luas || 0), 0);
  const countMasaTanam = dataList.filter(d => d.statusLahan === 'Masa Tanam').length;
  const countSiapPanen = dataList.filter(d => d.statusLahan === 'Siap Panen').length;

  totalUnit.textContent = dataList.length;
  totalLuas.textContent = `${sumLuas.toLocaleString('id-ID')} m²`;
  if (masaTanam) masaTanam.textContent = countMasaTanam;
  if (siapPanen) siapPanen.textContent = countSiapPanen;
}

function showDeleteConfirmation(message, onConfirm) {
  let modalOverlay = document.getElementById('customDeleteModal');

  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'customDeleteModal';
    modalOverlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.4); display: flex; align-items: center;
      justify-content: center; z-index: 10000;
    `;

    modalOverlay.innerHTML = `
      <div style="background: white; padding: 1.5rem; border-radius: 8px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        <h3 style="margin-bottom: 0.75rem; color: #1f2937; font-size: 1.1rem;">Konfirmasi Hapus</h3>
        <p id="deleteModalMessage" style="color: #4b5563; font-size: 0.9rem; margin-bottom: 1.25rem;"></p>
        <div style="display: flex; justify-content: center; gap: 0.75rem;">
          <button id="btnCancelDelete" class="btn btn-secondary" style="padding: 0.4rem 1rem;">Batal</button>
          <button id="btnConfirmDelete" class="btn btn-danger" style="padding: 0.4rem 1rem;">Hapus</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }

  document.getElementById('deleteModalMessage').textContent = message;
  modalOverlay.style.display = 'flex';

  const btnConfirm = document.getElementById('btnConfirmDelete');
  const btnCancel = document.getElementById('btnCancelDelete');

  const handleConfirm = () => {
    modalOverlay.style.display = 'none';
    btnConfirm.removeEventListener('click', handleConfirm);
    btnCancel.removeEventListener('click', handleCancel);
    onConfirm();
  };

  const handleCancel = () => {
    modalOverlay.style.display = 'none';
    btnConfirm.removeEventListener('click', handleConfirm);
    btnCancel.removeEventListener('click', handleCancel);
  };

  btnConfirm.addEventListener('click', handleConfirm);
  btnCancel.addEventListener('click', handleCancel);
}

function showFeedbackNotification(message, type = 'danger') {
  let feedbackBox = document.getElementById('formFeedbackMessage');

  if (!feedbackBox) {
    feedbackBox = document.createElement('div');
    feedbackBox.id = 'formFeedbackMessage';

    const lahanForm = document.getElementById('lahanForm');
    if (lahanForm) {
      lahanForm.appendChild(feedbackBox);
    } else {
      const cardForm = document.querySelector('.card-form');
      if (cardForm) cardForm.appendChild(feedbackBox);
    }
  }

  const bgColors = {
    danger: '#fee2e2',
    success: '#dcfce7',
    info: '#fee2e2'
  };

  const textColors = {
    danger: '#b91c1c',
    success: '#15803d',
    info: '#b91c1c'
  };

  const borderColors = {
    danger: '#fca5a5',
    success: '#86efac',
    info: '#fca5a5'
  };

  feedbackBox.style.cssText = `
    margin-top: 1.25rem;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
    background-color: ${bgColors[type] || bgColors.danger};
    color: ${textColors[type] || textColors.danger};
    border: 1px solid ${borderColors[type] || borderColors.danger};
    transition: all 0.3s ease;
  `;

  feedbackBox.textContent = message;
  feedbackBox.style.display = 'block';

  setTimeout(() => {
    if (feedbackBox) {
      feedbackBox.style.display = 'none';
    }
  }, 3500);
}