import React, { useState, useMemo } from "react";
import {
  Pencil,
  Trash2,
  Filter,
  CalendarDays,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  BookOpen,
  Newspaper,
  Tag,
  Hourglass,
} from "lucide-react";
import ArticleForm from './ArticleForm'; // Pastikan path ini benar! Sesuaikan jika ArticleForm berada di folder lain.

// Data artikel dummy
const initialArticleData = [
  { id: 1, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Rahasia Belanja Hemat di Akhir Bulan", author: "Budi Santoso", date: new Date(2025, 4, 15), category: "Tips & Trik" },
  { id: 2, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Peran Teknologi dalam Peningkatan Efisiensi Supermarket", author: "Dewi Lestari", date: new Date(2025, 5, 1), category: "Teknologi" },
  { id: 3, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Memahami Preferensi Konsumen di Era Digital", author: "Agus Salim", date: new Date(2025, 5, 3), category: "Pemasaran" },
  { id: 4, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Tren Produk Organik: Sehat Itu Pilihan", author: "Siti Aminah", date: new Date(2025, 5, 7), category: "Gaya Hidup" },
  { id: 5, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Manajemen Stok Efektif untuk Minimarket", author: "Joko Susilo", date: new Date(2025, 5, 10), category: "Manajemen" },
  { id: 6, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Strategi Promosi Digital untuk Toko Kelontong", author: "Lina Marlina", date: new Date(2025, 5, 12), category: "Pemasaran" },
  { id: 7, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Panduan Memilih Buah dan Sayur Segar", author: "Rini Wulandari", date: new Date(2025, 5, 15), category: "Gaya Hidup" },
  { id: 8, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Keamanan Pangan: Apa yang Perlu Anda Tahu?", author: "Dr. Aditya", date: new Date(2025, 5, 18), category: "Kesehatan" },
  { id: 9, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Inovasi Pembayaran Digital di Retail Modern", author: "Putri Anggraini", date: new Date(2025, 5, 20), category: "Teknologi" },
  { id: 10, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Strategi Diskon yang Menarik Pelanggan", author: "Fajar Prasetyo", date: new Date(2025, 5, 22), category: "Pemasaran" },
  { id: 11, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Pentingnya Pelayanan Prima di Toko Ritel", author: "Citra Kirana", date: new Date(2025, 5, 25), category: "Manajemen" },
  { id: 12, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Dampak E-Commerce pada Bisnis Retail Tradisional", author: "Hari Cahyono", date: new Date(2025, 5, 28), category: "Teknologi" },
  { id: 13, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Resep Makanan Sehat Ala Rumahan", author: "Chef Renata", date: new Date(2025, 6, 1), category: "Resep & Kuliner" },
  { id: 14, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Meningkatkan Loyalitas Pelanggan dengan Program Poin", author: "Bayu Pratama", date: new Date(2025, 6, 3), category: "Pemasaran" },
  { id: 15, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Tips Mengatur Keuangan Keluarga", author: "Maya Sari", date: new Date(2025, 6, 5), category: "Tips & Trik" },
  { id: 16, image: "https://images.unsplash.com/photo-1563729780860-26462e245a44?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Peluang Bisnis UMKM di Sektor Retail", author: "Andi Wijaya", date: new Date(2025, 6, 7), category: "Manajemen" },
  { id: 17, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Memaksimalkan Penggunaan Media Sosial untuk Promosi", author: "Dina Fitri", date: new Date(2025, 6, 9), category: "Pemasaran" },
  { id: 18, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Manfaat Berbelanja Produk Lokal", author: "Kartika Dewi", date: new Date(2025, 6, 11), category: "Gaya Hidup" },
  { id: 19, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Menghadapi Tantangan Logistik Ritel", author: "Rudi Hartono", date: new Date(2025, 6, 13), category: "Manajemen" },
  { id: 20, image: "https://deriota.com/img/20221217100922-2022-12-17news100919.jpg", title: "Masa Depan Retail: Personalisasi dan Pengalaman Pelanggan", author: "Dr. Maya", date: new Date(2025, 6, 15), category: "Teknologi" },
];


export default function ArticleDashboard() {
  const [currentArticleData, setCurrentArticleData] = useState(initialArticleData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortOption, setSortOption] = useState({ key: '', order: '' });

  // --- Palet Warna Baru ---
  const primaryColor = '#B82329'; // Warna utama: Merah gelap
  const accentColor = '#FDD5D5'; // Warna aksen: Merah muda terang
  const softGray = '#ECF0F1'; // Abu-abu terang untuk latar belakang bergantian tabel

  // --- Fungsi Pencarian, Filter, dan Pengurutan ---
  const filteredAndSortedArticleData = useMemo(() => {
    let resultData = currentArticleData;

    // 1. Filter berdasarkan Search Term (judul)
    if (searchTerm) {
      resultData = resultData.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Filter berdasarkan Bulan dan Tahun Publikasi
    resultData = resultData.filter((item) => {
      // Pastikan item.date adalah objek Date yang valid
      if (!item.date || !(item.date instanceof Date)) {
        return false;
      }
      return (
        item.date.getMonth() === selectedMonth &&
        item.date.getFullYear() === selectedYear
      );
    });

    // 3. Pengurutan
    if (sortOption.key) {
      // Membuat salinan array untuk diurutkan agar tidak memodifikasi state secara langsung
      resultData = [...resultData].sort((a, b) => {
        let valA = a[sortOption.key];
        let valB = b[sortOption.key];

        if (sortOption.key === 'date') {
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
  }, [currentArticleData, searchTerm, selectedMonth, selectedYear, sortOption]);

  // --- Perhitungan Data Kartu (selalu berdasarkan data yang sudah difilter dan diurutkan) ---

  // Total Artikel
  const totalArticles = filteredAndSortedArticleData.length;

  // Artikel Terbaru
  const latestArticle = useMemo(() => {
    if (filteredAndSortedArticleData.length === 0) return { title: 'Tidak Ada', date: null };
    const sortedByDate = [...filteredAndSortedArticleData].sort((a, b) => b.date.getTime() - a.date.getTime());
    return sortedByDate[0];
  }, [filteredAndSortedArticleData]);

  // Artikel Terlama
  const oldestArticle = useMemo(() => {
    if (filteredAndSortedArticleData.length === 0) return { title: 'Tidak Ada', date: null };
    const sortedByDate = [...filteredAndSortedArticleData].sort((a, b) => a.date.getTime() - b.date.getTime());
    return sortedByDate[0];
  }, [filteredAndSortedArticleData]);

  // Kategori Terbanyak
  const mostFrequentCategory = useMemo(() => {
    if (filteredAndSortedArticleData.length === 0) return { category: 'Tidak Ada', count: 0 };
    const categoryCounts = {};
    filteredAndSortedArticleData.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    let maxCount = 0;
    let mostFrequent = 'Tidak Ada';
    for (const category in categoryCounts) {
      if (categoryCounts[category] > maxCount) {
        maxCount = categoryCounts[category];
        mostFrequent = category;
      }
    }
    return { category: mostFrequent, count: maxCount };
  }, [filteredAndSortedArticleData]);


  // --- Paginasi ---
  const totalPages = Math.ceil(filteredAndSortedArticleData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredAndSortedArticleData.slice(startIndex, startIndex + itemsPerPage);

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

  const handleAddArticle = () => {
    setEditingArticle(null);
    setShowArticleForm(true); // Menampilkan modal
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setShowArticleForm(true); // Menampilkan modal
  };

  const handleCloseForm = () => {
    setShowArticleForm(false); // Menyembunyikan modal
    setEditingArticle(null); // Reset data editing
  };

  const handleSaveArticle = (newArticleData) => {
    if (editingArticle) {
      const updatedList = currentArticleData.map((article) =>
        article.id === editingArticle.id ? { ...article, ...newArticleData } : article
      );
      setCurrentArticleData(updatedList);
      alert(`Artikel "${newArticleData.title}" berhasil diperbarui!`);
    } else {
      const newId = currentArticleData.length > 0 ? Math.max(...currentArticleData.map(p => p.id)) + 1 : 1;
      setCurrentArticleData([...currentArticleData, { ...newArticleData, id: newId }]);
      alert(`Artikel "${newArticleData.title}" berhasil ditambahkan!`);
    }
    handleCloseForm(); // Tutup modal setelah disimpan
    setCurrentPage(1); // Kembali ke halaman pertama
  };

  const handleDeleteArticle = (articleId, articleTitle) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus artikel "${articleTitle}"?`)) {
      const updatedArticleData = currentArticleData.filter(item => item.id !== articleId);
      setCurrentArticleData(updatedArticleData);
      setCurrentPage(1);
      alert(`Artikel "${articleTitle}" berhasil dihapus!`);
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
    <div className="p-6 md:p-8 bg-gray-100 min-h-screen font-sans">
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 mb-8 bg-white text-gray-800 rounded-xl shadow-lg border-b-4"
        style={{ borderColor: primaryColor }}> {/* Menggunakan primaryColor untuk border */}
        <h1 className="text-3xl font-extrabold tracking-wide" style={{ color: primaryColor }}>Daftar Artikel</h1>
        <button
          className="text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:opacity-90 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mt-4 sm:mt-0"
          style={{ backgroundColor: primaryColor }} // Menggunakan primaryColor untuk tombol
          onClick={handleAddArticle}
        >
          <Pencil className="w-5 h-5" /> Tambah Artikel Baru
        </button>
      </div>

      {/* Bagian Filter dan Pencarian */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Search Input */}
          <div className="relative flex-grow min-w-[200px] max-w-sm">
            <input
              type="text"
              placeholder="Cari artikel berdasarkan judul..."
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:border-transparent"
              style={{
                '--tw-ring-color': primaryColor, // Ring color on focus
                '--tw-ring-opacity': 0.7,
                borderColor: accentColor // Border color default
              }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: primaryColor }} /> {/* Icon color */}
          </div>

          {/* Filter Dropdown (Sort by) */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
              onClick={toggleFilterDropdown}
              style={{ borderColor: accentColor }} // Border color
            >
              <Filter className="w-5 h-5" style={{ color: primaryColor }} /> {/* Icon color */}
              <span>Urutkan</span>
              {showFilterDropdown ? <ChevronUp className="w-5 h-5" style={{ color: primaryColor }} /> : <ChevronLeft className="w-5 h-5 rotate-90" style={{ color: primaryColor }} />}
            </button>
            {showFilterDropdown && (
              <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-56 animate-fade-in-down origin-top-left">
                <p className="px-4 py-3 text-gray-600 font-bold border-b border-gray-100">Urutkan Berdasarkan:</p>
                <button
                  className="block w-full text-left px-4 py-2.5 text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                  onClick={() => handleSortChange('title', 'asc')}
                >
                  Judul (A-Z)
                </button>
                <button
                  className="block w-full text-left px-4 py-2.5 text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                  onClick={() => handleSortChange('title', 'desc')}
                >
                  Judul (Z-A)
                </button>
                <button
                  className="block w-full text-left px-4 py-2.5 text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                  onClick={() => handleSortChange('date', 'desc')}
                >
                  Tanggal (Terbaru)
                </button>
                <button
                  className="block w-full text-left px-4 py-2.5 text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
                  onClick={() => handleSortChange('date', 'asc')}
                >
                  Tanggal (Terlama)
                </button>
              </div>
            )}
          </div>

          {/* Month and Year Filter */}
          <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm"
            style={{ borderColor: accentColor }}> {/* Border color */}
            <CalendarDays className="w-5 h-5" style={{ color: primaryColor }} /> {/* Icon color */}
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

      {/* Bagian Card Informasi Artikel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Artikel */}
        <div className="relative p-6 rounded-xl overflow-hidden cursor-pointer
                         bg-white text-gray-800
                         shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out
                         border-b-4 border-transparent group"
          style={{ borderColor: primaryColor }}> {/* Border color */}
          <div className="absolute top-4 right-4 text-gray-200 group-hover:text-red-200 transition-colors duration-300"> {/* Icon hover color */}
            <BookOpen className="w-10 h-10 opacity-70" style={{ color: accentColor }} /> {/* Icon color */}
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 group-hover:text-red-700 transition-colors duration-300 mb-1">Total Artikel</p> {/* Text hover color */}
            <p className="text-4xl font-bold mt-1 text-gray-800 group-hover:text-red-900 transition-colors duration-300">{totalArticles}</p> {/* Text hover color */}
          </div>
        </div>

        {/* Card 2: Artikel Terbaru (Aksen Warna) */}
        <div className="relative p-6 rounded-xl overflow-hidden cursor-pointer
                         text-white
                         shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out
                         border-b-4 border-transparent group"
          style={{ backgroundColor: primaryColor, borderColor: accentColor }}> {/* Background and border color */}
          <div className="absolute top-4 right-4 text-red-300 group-hover:text-red-100 transition-colors duration-300"> {/* Icon hover color */}
            <Newspaper className="w-10 h-10 opacity-70" style={{ color: accentColor }} /> {/* Icon color */}
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-red-200 group-hover:text-red-100 transition-colors duration-300 mb-1">Artikel Terbaru</p> {/* Text hover color */}
            <p className="text-xl font-bold mt-1">
              {latestArticle.title === 'Tidak Ada' ? 'Tidak Ada' : latestArticle.title}
              {latestArticle.date && <span className="text-sm font-normal block mt-1">({latestArticle.date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })})</span>}
            </p>
          </div>
        </div>

        {/* Card 3: Artikel Terlama */}
        <div className="relative p-6 rounded-xl overflow-hidden cursor-pointer
                         bg-white text-gray-800
                         shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out
                         border-b-4 border-transparent group"
          style={{ borderColor: primaryColor }}> {/* Border color */}
          <div className="absolute top-4 right-4 text-gray-200 group-hover:text-red-200 transition-colors duration-300"> {/* Icon hover color */}
            <Hourglass className="w-10 h-10 opacity-70" style={{ color: accentColor }} /> {/* Icon color */}
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 group-hover:text-red-700 transition-colors duration-300 mb-1">Artikel Terlama</p> {/* Text hover color */}
            <p className="text-xl font-bold mt-1 text-gray-800 group-hover:text-red-900 transition-colors duration-300">
              {oldestArticle.title === 'Tidak Ada' ? 'Tidak Ada' : oldestArticle.title}
              {oldestArticle.date && <span className="text-sm font-normal block mt-1">({oldestArticle.date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })})</span>}
            </p>
          </div>
        </div>

        {/* Card 4: Kategori Terbanyak */}
        <div className="relative p-6 rounded-xl overflow-hidden cursor-pointer
                         bg-white text-gray-800
                         shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out
                         border-b-4 border-transparent group"
          style={{ borderColor: primaryColor }}> {/* Border color */}
          <div className="absolute top-4 right-4 text-gray-200 group-hover:text-red-200 transition-colors duration-300"> {/* Icon hover color */}
            <Tag className="w-10 h-10 opacity-70" style={{ color: accentColor }} /> {/* Icon color */}
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 group-hover:text-red-700 transition-colors duration-300 mb-1">Kategori Terbanyak</p> {/* Text hover color */}
            <p className="text-2xl font-bold mt-1 text-gray-800 group-hover:text-red-900 transition-colors duration-300">
              {mostFrequentCategory.category}
              {mostFrequentCategory.count > 0 && <span className="text-base font-normal block mt-1">({mostFrequentCategory.count} Artikel)</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Tabel Data Artikel */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg mb-8">
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="text-white" style={{ backgroundColor: primaryColor }}> {/* Table header background */}
            <tr>
              <th className="px-5 py-3 font-semibold tracking-wider">Gambar</th>
              <th className="px-5 py-3 font-semibold tracking-wider">Judul Artikel</th>
              <th className="px-5 py-3 font-semibold tracking-wider">Penulis</th>
              <th className="px-5 py-3 font-semibold tracking-wider">Kategori</th>
              <th className="px-5 py-3 font-semibold tracking-wider">Tanggal Publish</th>
              <th className="px-5 py-3 font-semibold tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150"
                  style={{ backgroundColor: index % 2 === 0 ? 'white' : softGray }}
                >
                  <td className="px-5 py-3">
                    <img src={item.image} alt={item.title} className="w-16 h-12 object-cover rounded-md border border-gray-200 shadow-sm" />
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-800">{item.title}</td>
                  <td className="px-5 py-3 text-gray-700">{item.author}</td>
                  <td className="px-5 py-3" style={{ color: primaryColor, fontWeight: 'semibold' }}>{item.category}</td> {/* Category text color */}
                  <td className="px-5 py-3 text-gray-700">{item.date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  <td className="px-5 py-3 flex gap-3 items-center">
                    <button
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-150 p-1 rounded-full hover:bg-blue-100"
                      onClick={() => handleEditArticle(item)}
                      title="Edit Artikel"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition-colors duration-150 p-1 rounded-full hover:bg-red-100"
                      onClick={() => handleDeleteArticle(item.id, item.title)}
                      title="Hapus Artikel"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-5 py-8 text-center text-gray-500 text-lg">
                  <p className="mb-2">Tidak ada data artikel yang ditemukan.</p>
                  <p>Coba sesuaikan filter atau tambahkan artikel baru.</p>
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
          className="bg-white text-gray-700 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          style={{ color: primaryColor, borderColor: primaryColor }} // Pagination button colors
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-lg font-semibold text-gray-700">
          Halaman {currentPage} dari {totalPages === 0 ? 1 : totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="bg-white text-gray-700 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          style={{ color: primaryColor, borderColor: primaryColor }} // Pagination button colors
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ArticleForm Komponen (Modal) */}
      <ArticleForm
        isOpen={showArticleForm}
        onClose={handleCloseForm}
        onSubmit={handleSaveArticle}
        initialData={editingArticle}
      />
    </div>
  );
}