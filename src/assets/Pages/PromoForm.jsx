import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; // Import ikon 'X' untuk tombol tutup

export default function PromoForm({ isOpen, onClose, onSubmit, initialData }) {
  const [promoName, setPromoName] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setPromoName(initialData.name || '');
      setPrice(initialData.price || '');
      setDiscount(initialData.discount || '');
      setStartDate(initialData.startDate ? initialData.startDate.toISOString().split('T')[0] : '');
      setEndDate(initialData.endDate ? initialData.endDate.toISOString().split('T')[0] : '');
      setImage(initialData.image || '');
    } else if (!isOpen) {
      // Reset form ketika modal ditutup
      setPromoName('');
      setPrice('');
      setDiscount('');
      setStartDate('');
      setEndDate('');
      setImage('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!promoName || !price || !discount || !startDate || !endDate || !image) {
      alert('Semua kolom harus diisi!');
      return;
    }

    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    // Format periode untuk tampilan
    const startDay = newStartDate.getDate();
    const startMonth = newStartDate.toLocaleString('id-ID', { month: 'short' });
    const endDay = newEndDate.getDate();
    const endMonth = newEndDate.toLocaleString('id-ID', { month: 'short' });
    const formattedPeriod = `${startDay} ${startMonth} - ${endDay} ${endMonth}`;


    const promoData = {
      name: promoName,
      price: parseFloat(price),
      discount: parseInt(discount, 10),
      period: formattedPeriod, // Gunakan yang sudah diformat
      startDate: newStartDate,
      endDate: newEndDate,
      image: image,
    };
    onSubmit(promoData);
  };

  if (!isOpen) return null;

  return (
    // Latar belakang transparan dengan filter blur
    // backdrop-blur-sm akan membuat halaman di belakangnya blur
    // bg-black/50 atau bg-gray-800/75 akan membuat overlay gelap transparan
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border-t-4 border-red-700 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold" style={{ color: "#B82329" }}>
            {initialData ? 'Edit Promo' : 'Tambah Promo Baru'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="promoName">
              Nama Produk
            </label>
            <input
              type="text"
              id="promoName"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-200"
              value={promoName}
              onChange={(e) => setPromoName(e.target.value)}
              placeholder="Masukkan nama produk"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="price">
              Harga (Rp)
            </label>
            <input
              type="number"
              id="price"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-200"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Contoh: 15000"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="discount">
              Diskon (%)
            </label>
            <input
              type="number"
              id="discount"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-200"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              min="0"
              max="100"
              placeholder="Contoh: 10"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="startDate">
              Tanggal Mulai
            </label>
            <input
              type="date"
              id="startDate"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-200"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="endDate">
              Tanggal Berakhir
            </label>
            <input
              type="date"
              id="endDate"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-200"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="imageURL">
              URL Gambar Produk
            </label>
            <input
              type="url" // Ganti type menjadi url untuk validasi URL
              id="imageURL"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-200"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Contoh: https://example.com/gambar_produk.jpg"
              required
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              className="bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-red-700 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-800 transition-colors duration-200"
            >
              {initialData ? 'Perbarui Promo' : 'Tambah Promo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}