// TransaksiPelangganDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TransaksiPelangganDetail = ({ pelangganData, transaksiData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('semua');

  const pelanggan = pelangganData.find(p => p.id === id);
  if (!pelanggan) return <div className="p-6">Pelanggan tidak ditemukan.</div>;

  const transaksiPelanggan = transaksiData.filter(t => t.customerId === id);

  const transaksiTerfilter = transaksiPelanggan.filter(t => {
    const tanggal = new Date(t.tanggal);
    const hariIni = new Date();
    if (filter === 'harian') {
      return tanggal.toDateString() === hariIni.toDateString();
    } else if (filter === 'bulanan') {
      return tanggal.getMonth() === hariIni.getMonth() && tanggal.getFullYear() === hariIni.getFullYear();
    } else if (filter === 'tahunan') {
      return tanggal.getFullYear() === hariIni.getFullYear();
    }
    return true;
  });

  const totalTransaksi = transaksiPelanggan.reduce((acc, trx) => acc + trx.total, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600 hover:underline">← Kembali</button>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-bold mb-2">Detail Pelanggan</h2>
        <p><strong>ID:</strong> {pelanggan.id}</p>
        <p><strong>Nama:</strong> {pelanggan.name}</p>
        <p><strong>Email:</strong> {pelanggan.email}</p>
        <p><strong>Telepon:</strong> {pelanggan.phone}</p>
        <p><strong>Membership:</strong> {pelanggan.membership}</p>
        <p><strong>Total Transaksi:</strong> Rp{totalTransaksi.toLocaleString()}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Riwayat Transaksi</h3>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded p-1">
            <option value="semua">Semua</option>
            <option value="harian">Hari Ini</option>
            <option value="bulanan">Bulan Ini</option>
            <option value="tahunan">Tahun Ini</option>
          </select>
        </div>

        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">ID Transaksi</th>
              <th className="px-4 py-2 text-left">Produk</th>
              <th className="px-4 py-2 text-left">Jumlah</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {transaksiTerfilter.length > 0 ? transaksiTerfilter.map(trx => (
              <tr key={trx.id} className="border-b">
                <td className="px-4 py-2">{trx.id}</td>
                <td className="px-4 py-2">{trx.produk}</td>
                <td className="px-4 py-2">{trx.jumlah}</td>
                <td className="px-4 py-2">Rp{trx.total.toLocaleString()}</td>
                <td className="px-4 py-2">{trx.tanggal}</td>
              </tr>
            )) : (
              <tr><td colSpan="5" className="text-center text-gray-500 py-4">Tidak ada transaksi.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransaksiPelangganDetail;