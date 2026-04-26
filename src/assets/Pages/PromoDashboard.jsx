import React, { useState, useMemo } from "react";
import {
  Pencil,
  Trash2,
  Filter,
  CalendarDays,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp // Untuk ikon panah ke atas saat dropdown filter terbuka
} from "lucide-react";
import PromoForm from './PromoForm'; // Pastikan path ini benar

// Data promo awal (diperbanyak menjadi 20)
const initialPromoData = [
  { id: 1, image: "https://cdn-icons-png.flaticon.com/512/1046/1046750.png", name: "Saus Sambal ABC", price: 7000, discount: 10, period: "01 - 08 Juni", startDate: new Date(2025, 5, 1), endDate: new Date(2025, 5, 8) },
  { id: 2, image: "https://cdn-icons-png.flaticon.com/512/263/263115.png", name: "Beras Topi Koki", price: 100000, discount: 6, period: "01 - 09 Juni", startDate: new Date(2025, 5, 1), endDate: new Date(2025, 5, 9) },
  { id: 3, image: "https://cdn-icons-png.flaticon.com/512/479/479090.png", name: "Susu Kental Manis", price: 10000, discount: 8, period: "01 - 10 Juni", startDate: new Date(2025, 5, 1), endDate: new Date(2025, 5, 10) },
  { id: 4, image: "https://cdn-icons-png.flaticon.com/512/3523/3523063.png", name: "Susu Cimory", price: 6000, discount: 12, period: "03 - 13 Juni", startDate: new Date(2025, 5, 3), endDate: new Date(2025, 5, 13) },
  { id: 5, image: "https://cdn-icons-png.flaticon.com/512/684/684908.png", name: "Gulaku", price: 15000, discount: 10, period: "01 - 15 Juni", startDate: new Date(2025, 5, 1), endDate: new Date(2025, 5, 15) },
  { id: 6, image: "https://cdn-icons-png.flaticon.com/512/2965/2965567.png", name: "Kopi Kapal Api", price: 4000, discount: 6, period: "09 - 20 Juni", startDate: new Date(2025, 5, 9), endDate: new Date(2025, 5, 20) },
  { id: 7, image: "https://cdn-icons-png.flaticon.com/512/689/689376.png", name: "Teh Sariwangi", price: 6000, discount: 7, period: "06 - 12 Juni", startDate: new Date(2025, 5, 6), endDate: new Date(2025, 5, 12) },
  { id: 8, image: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png", name: "Minyak Goreng Bimoli", price: 35000, discount: 25, period: "17 - 19 Juni", startDate: new Date(2025, 5, 17), endDate: new Date(2025, 5, 19) },
  { id: 9, image: "https://cdn-icons-png.flaticon.com/512/1126/1126012.png", name: "Rinso", price: 17000, discount: 10, period: "25 - 20 Juli", startDate: new Date(2025, 6, 25), endDate: new Date(2025, 6, 20) }, // Asumsi Juli di tahun yang sama
  { id: 10, image: "https://cdn-icons-png.flaticon.com/512/869/869636.png", name: "Mie Sedap", price: 2500, discount: 5, period: "01 - 07 Juli", startDate: new Date(2025, 6, 1), endDate: new Date(2025, 6, 7) },
  { id: 11, image: "https://cdn-icons-png.flaticon.com/512/860/860829.png", name: "Indomie Goreng", price: 2800, discount: 5, period: "03 - 09 Juli", startDate: new Date(2025, 6, 3), endDate: new Date(2025, 6, 9) },
  { id: 12, image: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png", name: "Pepsodent", price: 8500, discount: 9, period: "01 - 10 Juli", startDate: new Date(2025, 6, 1), endDate: new Date(2025, 6, 10) },
  { id: 13, image: "https://cdn-icons-png.flaticon.com/512/2933/2933108.png", name: "Lifebuoy", price: 9000, discount: 11, period: "02 - 11 Juli", startDate: new Date(2025, 6, 2), endDate: new Date(2025, 6, 11) },
  { id: 14, image: "https://cdn-icons-png.flaticon.com/512/2592/2592061.png", name: "Royco", price: 1500, discount: 3, period: "04 - 10 Juli", startDate: new Date(2025, 6, 4), endDate: new Date(2025, 6, 10) },
  { id: 15, image: "https://cdn-icons-png.flaticon.com/512/2420/2420056.png", name: "Sunlight", price: 6500, discount: 6, period: "07 - 14 Juli", startDate: new Date(2025, 6, 7), endDate: new Date(2025, 6, 14) },
  { id: 16, image: "https://cdn-icons-png.flaticon.com/512/1170/1170678.png", name: "Baygon", price: 17500, discount: 13, period: "10 - 15 Juli", startDate: new Date(2025, 6, 10), endDate: new Date(2025, 6, 15) },
  { id: 17, image: "https://cdn-icons-png.flaticon.com/512/2698/2698194.png", name: "Downy", price: 11000, discount: 15, period: "12 - 18 Juli", startDate: new Date(2025, 6, 12), endDate: new Date(2025, 6, 18) },
  { id: 18, image: "https://cdn-icons-png.flaticon.com/512/1025/1025873.png", name: "Dettol", price: 12000, discount: 10, period: "14 - 20 Juli", startDate: new Date(2025, 6, 14), endDate: new Date(2025, 6, 20) },
  { id: 19, image: "https://cdn-icons-png.flaticon.com/512/860/860857.png", name: "Garnier", price: 21000, discount: 18, period: "15 - 22 Juli", startDate: new Date(2025, 6, 15), endDate: new Date(2025, 6, 22) },
  { id: 20, image: "https://cdn-icons-png.flaticon.com/512/3075/3075976.png", name: "Head & Shoulders", price: 18000, discount: 20, period: "16 - 25 Juli", startDate: new Date(2025, 6, 16), endDate: new Date(2025, 6, 25) }
];


export default function PromoDashboard() {
  const [currentPromoData, setCurrentPromoData] = useState(initialPromoData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // <<-- PASTIKAN NILAI INI 10

  const [showPromoForm, setShowPromoForm] = useState(false); // State untuk menampilkan/menyembunyikan modal
  const [editingPromo, setEditingPromo] = useState(null);

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortOption, setSortOption] = useState({ key: '', order: '' });

  // Warna Merah Utama Anda
  const primaryRed = '#B82329'; // Definisi warna merah

  // --- Fungsi Pencarian, Filter, dan Pengurutan ---
  const filteredAndSortedPromoData = useMemo(() => {
    let resultData = currentPromoData;

    // 1. Filter berdasarkan Search Term
    // Logika: Mencocokkan nama produk dengan searchTerm (case-insensitive)
    if (searchTerm) {
      resultData = resultData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filter berdasarkan Bulan dan Tahun yang Dipilih
    // Logika: Memastikan periode promo (startDate dan endDate) tumpang tindih dengan bulan dan tahun yang dipilih
    resultData = resultData.filter((item) => {
      const startOfMonth = new Date(selectedYear, selectedMonth, 1);
      const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0); // Hari terakhir bulan yang dipilih

      if (!item.startDate || !item.endDate) {
        return false; // Abaikan item tanpa tanggal lengkap
      }

      // Promo berlaku jika tanggal mulai <= akhir bulan yang dipilih DAN tanggal berakhir >= awal bulan yang dipilih
      return (
        (item.startDate <= endOfMonth && item.endDate >= startOfMonth)
      );
    });

    // 3. Pengurutan
    // Logika: Mengurutkan data berdasarkan 'key' (nama, harga, diskon) dan 'order' (asc/desc)
    if (sortOption.key) {
      resultData = [...resultData].sort((a, b) => { // Membuat salinan array untuk diurutkan
        let valA = a[sortOption.key];
        let valB = b[sortOption.key];

        if (sortOption.key === 'startDate' || sortOption.key === 'endDate') {
          valA = valA.getTime(); // Bandingkan tanggal sebagai timestamp
          valB = valB.getTime();
        } else if (typeof valA === 'string') {
          valA = valA.toLowerCase(); // Bandingkan string case-insensitive
          valB = valB.toLowerCase();
        }

        if (valA < valB) {
          return sortOption.order === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortOption.order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return resultData;
  }, [currentPromoData, searchTerm, selectedMonth, selectedYear, sortOption]);

  // Tambahkan ini untuk debugging:
  console.log("Jumlah data setelah filter dan sort:", filteredAndSortedPromoData.length);


  // --- Perhitungan Data Kartu (selalu berdasarkan data yang sudah difilter dan diurutkan) ---

  // Logika: Menghitung jumlah total produk yang ada di 'filteredAndSortedPromoData'
  const totalProducts = filteredAndSortedPromoData.length;

  // Logika: Menemukan diskon tertinggi (persentase) dari semua promo yang ada di 'filteredAndSortedPromoData'
  // Dan juga menemukan nama produk yang memiliki diskon tersebut.
  const highestDiscountPromo = useMemo(() => {
    if (filteredAndSortedPromoData.length === 0) return { discount: 0, name: 'Tidak Ada' };
    let maxDiscount = 0;
    let productName = 'Tidak Ada';
    filteredAndSortedPromoData.forEach(item => {
      if (item.discount > maxDiscount) {
        maxDiscount = item.discount;
        productName = item.name;
      }
    });
    return { discount: maxDiscount, name: productName };
  }, [filteredAndSortedPromoData]);


  // Fungsi pembantu untuk menghitung durasi promo dalam hari
  const calculatePromoDuration = (startDate, endDate) => {
    if (!startDate || !endDate || !(startDate instanceof Date) || !(endDate instanceof Date)) {
      return 0;
    }
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 karena durasi termasuk hari awal dan akhir
  };

  // Logika: Menghitung durasi setiap promo, lalu menemukan durasi terlama dari yang sudah dihitung.
  // Juga mencari nama produk yang memiliki durasi terlama tersebut.
  const longestPromoDetails = useMemo(() => {
    if (filteredAndSortedPromoData.length === 0) return { duration: 0, name: 'Tidak Ada' };
    let maxDuration = 0;
    let productName = 'Tidak Ada';
    filteredAndSortedPromoData.forEach(item => {
      const duration = calculatePromoDuration(item.startDate, item.endDate);
      if (duration > maxDuration) {
        maxDuration = duration;
        productName = item.name;
      }
    });
    return { duration: maxDuration, name: productName };
  }, [filteredAndSortedPromoData]);

  // Logika: Menghitung durasi setiap promo, lalu menemukan durasi terpendek dari yang sudah dihitung.
  // Juga mencari nama produk yang memiliki durasi terpendek tersebut.
  const shortestPromoDetails = useMemo(() => {
    if (filteredAndSortedPromoData.length === 0) return { duration: 0, name: 'Tidak Ada' };
    let minDuration = Infinity; // Gunakan Infinity untuk mencari minimum
    let productName = 'Tidak Ada';
    filteredAndSortedPromoData.forEach(item => {
      const duration = calculatePromoDuration(item.startDate, item.endDate);
      if (duration < minDuration) {
        minDuration = duration;
        productName = item.name;
      }
    });
    // Jika tidak ada promo, minDuration akan tetap Infinity. Set ke 0.
    return { duration: minDuration === Infinity ? 0 : minDuration, name: productName };
  }, [filteredAndSortedPromoData]);


  // --- Paginasi ---
  const totalPages = Math.ceil(filteredAndSortedPromoData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredAndSortedPromoData.slice(startIndex, startIndex + itemsPerPage);

  // --- Event Handlers ---
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleAddPromo = () => {
    setEditingPromo(null);
    setShowPromoForm(true); // Menampilkan modal
  };

  const handleEditPromo = (promo) => {
    setEditingPromo(promo);
    setShowPromoForm(true); // Menampilkan modal
  };

  const handleCloseForm = () => {
    setShowPromoForm(false); // Menyembunyikan modal
    setEditingPromo(null); // Reset data editing
  };

  const handleSavePromo = (newPromoData) => {
    if (editingPromo) {
      const updatedList = currentPromoData.map((promo) =>
        promo.id === editingPromo.id ? { ...promo, ...newPromoData } : promo
      );
      setCurrentPromoData(updatedList);
      alert(`Promo "${newPromoData.name}" berhasil diperbarui!`);
    } else {
      const newId = currentPromoData.length > 0 ? Math.max(...currentPromoData.map(p => p.id)) + 1 : 1;
      setCurrentPromoData([...currentPromoData, { ...newPromoData, id: newId }]);
      alert(`Promo "${newPromoData.name}" berhasil ditambahkan!`);
    }
    handleCloseForm(); // Tutup modal setelah disimpan
    setCurrentPage(1); // Kembali ke halaman pertama
  };

  const handleDeletePromo = (promoId, promoName) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus promo "${promoName}"?`)) {
      const updatedPromoData = currentPromoData.filter(item => item.id !== promoId);
      setCurrentPromoData(updatedPromoData);
      setCurrentPage(1);
      alert(`Promo "${promoName}" berhasil dihapus!`);
    }
  };

  const handleSortChange = (key, order) => {
    setSortOption({ key, order });
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  // Generate options for month and year select
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen"> {/* Ubah kembali ke bg-gray-50 untuk konsistensi */}
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 mb-8 bg-white text-gray-800 rounded-xl shadow-lg border-b-4 border-[#B82329]">
        <h1 className="text-3xl font-extrabold tracking-wide" style={{ color: primaryRed }}>Daftar Promo</h1>
        <button
          className="bg-[#B82329] text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          onClick={handleAddPromo}
          style={{ backgroundColor: primaryRed }}
        >
          <Pencil className="w-5 h-5" /> Tambah Promo Baru
        </button>
      </div>

      {/* Bagian Filter dan Pencarian */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Search Input */}
          <div className="relative flex-grow min-w-[200px] max-w-sm">
            <input
              type="text"
              placeholder="Cari promo berdasarkan nama..."
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#B82329] focus:border-[#B82329] transition-all duration-200 text-gray-700"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Filter Dropdown (Sort by) */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
              onClick={toggleFilterDropdown}
            >
              <Filter className="w-5 h-5 text-gray-600" />
              <span>Urutkan</span>
              {showFilterDropdown ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronLeft className="w-5 h-5 text-gray-600 rotate-90" />}
            </button>
            {showFilterDropdown && (
              <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-56 animate-fade-in-down">
                <p className="px-4 py-3 text-gray-600 font-bold border-b border-gray-100">Urutkan Berdasarkan:</p>
                <button
                  className="block w-full text-left px-4 py-2.5 text-gray-800 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                  onClick={() => handleSortChange('name', 'asc')}
                >
                  Nama Produk (A-Z)
                </button>
                <button
                  className="block w-full text-left px-4 py-2.5 text-gray-800 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                  onClick={() => handleSortChange('name', 'desc')}
                >
                  Nama Produk (Z-A)
                </button>
                <button
                  className="block w-full text-left px-4 py-2.5 text-gray-800 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                  onClick={() => handleSortChange('price', 'asc')}
                >
                  Harga (Termurah)
                </button>
                <button
                  className="block w-full text-left px-4 py-2.5 text-gray-800 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                  onClick={() => handleSortChange('price', 'desc')}
                >
                  Harga (Termahal)
                </button>
                <button
                  className="block w-full text-left px-4 py-2.5 text-gray-800 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                  onClick={() => handleSortChange('discount', 'desc')}
                >
                  Diskon (Terbesar)
                </button>
                <button
                  className="block w-full text-left px-4 py-2.5 text-gray-800 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                  onClick={() => handleSortChange('discount', 'asc')}
                >
                  Diskon (Terkecil)
                </button>
              </div>
            )}
          </div>

          {/* Month and Year Filter */}
          <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm">
            <CalendarDays className="w-5 h-5 text-gray-600" />
            <select
              className="bg-transparent outline-none cursor-pointer text-gray-700 font-medium"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
            <select
              className="bg-transparent outline-none cursor-pointer text-gray-700 font-medium"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>


      {/* Bagian Card Informasi Promo - Dibuat "Pop Up" dengan Red-White Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Produk Promo */}
        <div className="relative p-6 rounded-xl overflow-hidden cursor-pointer
                      bg-white text-gray-800
                      shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out
                      border-b-4 border-transparent hover:border-[#B82329] group"> {/* Border bawah merah saat hover */}
          
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 group-hover:text-red-700 transition-colors duration-300 mb-1">Total Produk Promo</p>
            <p className="text-4xl font-bold mt-1 text-gray-800 group-hover:text-red-900 transition-colors duration-300">{totalProducts}</p>
          </div>
        </div>

        {/* Card 2: Diskon Tertinggi - Desain Khusus untuk Menonjolkan Diskon */}
        <div className="relative p-6 rounded-xl overflow-hidden cursor-pointer
                      bg-[#B82329] text-white
                      shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out
                      border-b-4 border-transparent hover:border-red-300 group"> {/* Border bawah lebih terang saat hover */}
          
          <div className="relative z-10">
            <p className="text-sm font-medium text-red-200 group-hover:text-red-100 transition-colors duration-300 mb-1">Diskon Tertinggi</p>
            <p className="text-4xl font-bold mt-1">
              {highestDiscountPromo.discount}%
              {highestDiscountPromo.name !== 'Tidak Ada' && <span className="text-base font-normal block mt-1">({highestDiscountPromo.name})</span>}
            </p>
          </div>
        </div>

        {/* Card 3: Promo Terlama - Aksen Merah */}
        <div className="relative p-6 rounded-xl overflow-hidden cursor-pointer
                      bg-white text-gray-800
                      shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out
                      border-b-4 border-transparent hover:border-[#B82329] group"> {/* Border bawah merah saat hover */}
          
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 group-hover:text-red-700 transition-colors duration-300 mb-1">Promo Terlama</p>
            <p className="text-4xl font-bold mt-1 text-gray-800 group-hover:text-red-900 transition-colors duration-300">
              {longestPromoDetails.duration} Hari
              {longestPromoDetails.name !== 'Tidak Ada' && <span className="text-base font-normal block mt-1">({longestPromoDetails.name})</span>}
            </p>
          </div>
        </div>

        {/* Card 4: Promo Terpendek - Aksen Merah */}
        <div className="relative p-6 rounded-xl overflow-hidden cursor-pointer
                      bg-white text-gray-800
                      shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out
                      border-b-4 border-transparent hover:border-[#B82329] group"> {/* Border bawah merah saat hover */}
          
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 group-hover:text-red-700 transition-colors duration-300 mb-1">Promo Terpendek</p>
            <p className="text-4xl font-bold mt-1 text-gray-800 group-hover:text-red-900 transition-colors duration-300">
              {shortestPromoDetails.duration} Hari
              {shortestPromoDetails.name !== 'Tidak Ada' && <span className="text-base font-normal block mt-1">({shortestPromoDetails.name})</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Tabel Data Promo */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg mb-8">
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="bg-[#B82329] text-white">
            <tr>
              <th className="px-5 py-3 font-semibold tracking-wider">Gambar</th>
              <th className="px-5 py-3 font-semibold tracking-wider">Nama Produk</th>
              <th className="px-5 py-3 font-semibold tracking-wider">Harga Awal</th> {/* Asumsi ini harga awal, bukan harga promo */}
              <th className="px-5 py-3 font-semibold tracking-wider">Diskon</th>
              <th className="px-5 py-3 font-semibold tracking-wider">Harga Promo</th> {/* Tambahkan kolom ini */}
              <th className="px-5 py-3 font-semibold tracking-wider">Masa Berlaku</th>
              <th className="px-5 py-3 font-semibold tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-red-50'} border-b border-gray-200 hover:bg-red-100 transition-colors duration-150`}>
                  <td className="px-5 py-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm" />
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-800">{item.name}</td>
                  <td className="px-5 py-3 text-gray-700">Rp {item.price.toLocaleString("id-ID")}</td>
                  <td className="px-5 py-3 text-red-600 font-semibold">{item.discount}%</td>
                  <td className="px-5 py-3 text-gray-900 font-bold">
                    Rp {((item.price * (100 - item.discount)) / 100).toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-3 text-gray-700">{item.period}</td>
                  <td className="px-5 py-3 flex gap-3 items-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-150 p-1 rounded-full hover:bg-blue-100"
                      onClick={() => handleEditPromo(item)}
                      title="Edit Promo"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition-colors duration-150 p-1 rounded-full hover:bg-red-100"
                      onClick={() => handleDeletePromo(item.id, item.name)}
                      title="Hapus Promo"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-5 py-8 text-center text-gray-500 text-lg">
                  <p className="mb-2">Tidak ada data promo yang ditemukan.</p>
                  <p>Coba sesuaikan filter atau tambahkan promo baru.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginasi */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="bg-white text-[#B82329] border border-red-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          style={{ borderColor: primaryRed, color: primaryRed }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-lg font-semibold text-gray-700">
          Halaman {currentPage} dari {totalPages === 0 ? 1 : totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="bg-white text-[#B82329] border border-red-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          style={{ borderColor: primaryRed, color: primaryRed }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* PromoForm Komponen (Modal) */}
      <PromoForm
        isOpen={showPromoForm}
        onClose={handleCloseForm}
        onSubmit={handleSavePromo}
        initialData={editingPromo}
      />
    </div>
  );
}