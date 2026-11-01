const STORAGE_KEY = 'agri_manage_lahan_data';

const DEFAULT_DATA = [
  { id: 'LHN-01', namaLahan: 'Blok Subak A', lokasi: 'Kabat, Banyuwangi', luas: 2500, jenisTanaman: 'Padi Inpari 32', tanggalTanam: '2026-08-15', statusLahan: 'Masa Tanam' },
  { id: 'LHN-02', namaLahan: 'Kebun Jagung Gemilang', lokasi: 'Rogojampi, Banyuwangi', luas: 1800, jenisTanaman: 'Jagung Hibrida', tanggalTanam: '2026-07-10', statusLahan: 'Siap Panen' },
  { id: 'LHN-03', namaLahan: 'Lahan Buah Bintaro', lokasi: 'Srono, Banyuwangi', luas: 3200, jenisTanaman: 'Buah Naga', tanggalTanam: '2026-05-20', statusLahan: 'Pengolahan Tanah' },
  { id: 'LHN-04', namaLahan: 'Subak Melati Tiga', lokasi: 'Giri, Banyuwangi', luas: 2100, jenisTanaman: 'Padi Ciherang', tanggalTanam: '2026-09-01', statusLahan: 'Masa Tanam' },
  { id: 'LHN-05', namaLahan: 'Kebun Cabai Makmur', lokasi: 'Wongsorejo, Banyuwangi', luas: 1500, jenisTanaman: 'Cabai Rawit', tanggalTanam: '2026-06-12', statusLahan: 'Siap Panen' },
  { id: 'LHN-06', namaLahan: 'Lahan Semangka pesisir', lokasi: 'Muncar, Banyuwangi', luas: 4000, jenisTanaman: 'Semangka Non-Biji', tanggalTanam: '2026-08-05', statusLahan: 'Masa Tanam' },
  { id: 'LHN-07', namaLahan: 'Kebun Jeruk Keprok', lokasi: 'Tegaldlimo, Banyuwangi', luas: 2800, jenisTanaman: 'Jeruk Siam', tanggalTanam: '2026-04-18', statusLahan: 'Siap Panen' },
  { id: 'LHN-08', namaLahan: 'Blok Sawah Lemahbangkulon', lokasi: 'Singojuruh, Banyuwangi', luas: 3500, jenisTanaman: 'Padi IPB 3S', tanggalTanam: '2026-10-02', statusLahan: 'Pengolahan Tanah' },
  { id: 'LHN-09', namaLahan: 'Lahan Bawang Merah Utama', lokasi: 'Licin, Banyuwangi', luas: 1200, jenisTanaman: 'Bawang Merah', tanggalTanam: '2026-09-15', statusLahan: 'Masa Tanam' },
  { id: 'LHN-10', namaLahan: 'Kebun Kedelai Subur', lokasi: 'Glagah, Banyuwangi', luas: 1900, jenisTanaman: 'Kedelai Anjasmoro', tanggalTanam: '2026-03-30', statusLahan: 'Status Bera' }
];

export const DataService = {
  getAllData() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
        return DEFAULT_DATA;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Gagal membaca data dari LocalStorage:', e);
      return DEFAULT_DATA;
    }
  },

  saveData(item) {
    const list = this.getAllData();
    
    if (item.id) {
      // Mode Edit Data
      const index = list.findIndex(d => d.id === item.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...item };
      }
    } 
    
    else {
      const nextNumber = list.length + 1;
      const formattedNumber = String(nextNumber).padStart(2, '0');
      const newId = `LHN-${formattedNumber}`;

      const newItem = { ...item, id: newId };
      list.push(newItem);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  deleteData(id) {
    let list = this.getAllData();
    list = list.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  searchData(keyword) {
    const list = this.getAllData();
    if (!keyword) return list;
    const kw = keyword.toLowerCase();
    return list.filter(item => 
      (item.namaLahan && item.namaLahan.toLowerCase().includes(kw)) ||
      (item.lokasi && item.lokasi.toLowerCase().includes(kw)) ||
      (item.jenisTanaman && item.jenisTanaman.toLowerCase().includes(kw)) ||
      (item.statusLahan && item.statusLahan.toLowerCase().includes(kw))
    );
  },

  logDashboardOutput(actionTitle = 'Monitoring Sistem Data Lahan') {
    const list = this.getAllData();
    const totalLuas = list.reduce((acc, curr) => acc + Number(curr.luas || 0), 0);

    console.log(`=== ${actionTitle} ===`);

    list.forEach(item => {
      console.log(`[ID: ${item.id}] ${item.namaLahan} | Luas: ${Number(item.luas).toLocaleString('id-ID')} m² | Komoditas: ${item.jenisTanaman} | Status: ${item.statusLahan}`);
    });

    console.log('Hasil Rekapitulasi:');
    console.log({
      totalLahan: list.length,
      totalAreaSquareMeters: totalLuas,
      systemStatus: 'Active'
    });
  }
};