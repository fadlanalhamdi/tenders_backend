import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Trash2, Edit3 } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

// --- Warna Tema (Dipindahkan ke luar komponen agar dapat diakses secara global) ---
const primaryRed = '#B82329';
const lightRed = '#FFEEEE';
const darkerRed = '#8e1b20';
const accentBlue = '#4A90E2'; // Contoh warna aksen untuk Total Bulan Ini
const accentGreen = '#50E3C2'; // Contoh warna aksen untuk Total Keseluruhan

// --- Fungsi untuk format Rupiah (Dipindahkan ke luar komponen) ---
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const ManajemenPenjualanPage = () => {
  const [penjualan, setPenjualan] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const produkList = ['Beras', 'Minyak Goreng', 'Gula', 'Telur', 'Susu', 'Sabun', 'Mie Instan', 'Kopi'];
    const metode = ['Tunai', 'Transfer', 'QRIS'];

    const dummy = Array.from({ length: 25 }, (_, i) => {
      const id = `TRX${(i + 1).toString().padStart(4, '0')}`;
      const produk = produkList[i % produkList.length];
      const jumlah = Math.floor(Math.random() * 10 + 1);
      const total = jumlah * (Math.floor(Math.random() * 10000) + 5000);
      const metodePembayaran = metode[i % metode.length];
      // Tanggal acak dalam 30 hari terakhir
      const tanggal = new Date(Date.now() - Math.random() * 2592000000).toISOString().split('T')[0];

      return {
        id,
        produk,
        jumlah,
        total,
        metodePembayaran,
        tanggal
      };
    });
    setPenjualan(dummy);
  }, []);

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  const totalPenjualanHariIni = penjualan.filter(p => p.tanggal === todayString)
    .reduce((sum, p) => sum + p.total, 0);

  const totalBulanIni = penjualan
    .filter(p => {
      const saleDate = new Date(p.tanggal);
      return saleDate.getMonth() === thisMonth && saleDate.getFullYear() === thisYear;
    })
    .reduce((sum, p) => sum + p.total, 0);

  const totalKeseluruhan = penjualan.reduce((sum, p) => sum + p.total, 0);

  const filteredData = penjualan.filter(p =>
    p.produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 mb-8 bg-white text-gray-800 rounded-xl shadow-lg border-b-4" style={{ borderColor: primaryRed }}>
        <h2 className="text-3xl font-extrabold tracking-wide" style={{ color: primaryRed }}>Manajemen Penjualan</h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Card Penjualan Hari Ini */}
        <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg border-b-4" style={{ borderColor: primaryRed }}>
          <h3 className="text-sm text-gray-500">Penjualan Hari Ini</h3>
          <p className="text-2xl font-bold" style={{ color: darkerRed }}>{formatRupiah(totalPenjualanHariIni)}</p>
        </div>
        {/* Card Total Bulan Ini */}
        <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg border-b-4" style={{ borderColor: accentBlue }}>
          <h3 className="text-sm text-gray-500">Total Bulan Ini</h3>
          <p className="text-2xl font-bold" style={{ color: accentBlue }}>{formatRupiah(totalBulanIni)}</p>
        </div>
        {/* Card Total Keseluruhan */}
        <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg border-b-4" style={{ borderColor: accentGreen }}>
          <h3 className="text-sm text-gray-500">Total Keseluruhan</h3>
          <p className="text-2xl font-bold" style={{ color: accentGreen }}>{formatRupiah(totalKeseluruhan)}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari produk atau ID transaksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead style={{ backgroundColor: primaryRed, color: 'white' }}>
            <tr>
              <th className="px-6 py-3">ID Transaksi</th>
              <th className="px-6 py-3">Produk</th>
              <th className="px-6 py-3">Jumlah</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Metode Pembayaran</th>
              <th className="px-6 py-3">Tanggal</th>
              <th className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((trx) => (
              <tr key={trx.id} className="border-b hover:bg-red-50 transition-colors duration-150">
                <td className="px-6 py-4 font-mono text-gray-700">{trx.id}</td>
                <td className="px-6 py-4">{trx.produk}</td>
                <td className="px-6 py-4">{trx.jumlah}</td>
                <td className="px-6 py-4">{formatRupiah(trx.total)}</td>
                <td className="px-6 py-4">{trx.metodePembayaran}</td>
                <td className="px-6 py-4">{trx.tanggal}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-100 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50">
          <span className="text-sm text-gray-600">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} transaksi
          </span>
          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-xl border text-sm bg-white disabled:opacity-50 hover:bg-gray-100"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-xl border text-sm bg-white disabled:opacity-50 hover:bg-gray-100"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ManajemenPenjualanPage;
