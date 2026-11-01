export class UIRenderer {
  constructor() {
    this.tableBody = document.getElementById('lahanTableBody');
    this.emptyState = document.getElementById('emptyState');
  }

  renderTable(items, onEdit, onDelete) {
    this.tableBody.innerHTML = '';

    if (!items || items.length === 0) {
      if (this.emptyState) this.emptyState.classList.remove('hidden');
      return;
    }

    if (this.emptyState) this.emptyState.classList.add('hidden');

    items.forEach((item, index) => {
      const tr = document.createElement('tr');
      const badgeClass = this.getBadgeClass(item.statusLahan);

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td><strong>${this.escapeHtml(item.namaLahan)}</strong></td>
        <td>${this.escapeHtml(item.lokasi)}</td>
        <td>${Number(item.luas).toLocaleString('id-ID')}</td>
        <td>${this.escapeHtml(item.jenisTanaman)}</td>
        <td>${this.formatDate(item.tanggalTanam)}</td>
        <td><span class="status-badge ${badgeClass}">${item.statusLahan}</span></td>
        <td>
          <button class="btn btn-edit" data-id="${item.id}">Edit</button>
          <button class="btn btn-danger" data-id="${item.id}">Hapus</button>
        </td>
      `;

      tr.querySelector('.btn-edit').addEventListener('click', () => onEdit(item));
      tr.querySelector('.btn-danger').addEventListener('click', () => onDelete(item.id));

      this.tableBody.appendChild(tr);
    });
  }

  getBadgeClass(status) {
    switch (status) {
      case 'Masa Tanam': return 'badge-tanam';
      case 'Siap Panen': return 'badge-panen';
      case 'Pengolahan Tanah': return 'badge-olah';
      default: return 'badge-bera';
    }
  }

  formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}