// src/components/HeaderPelanggan.jsx (File Baru)

import React from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext'; // <-- Impor useOrders
import { ArrowLeft, Bell, Percent, ShoppingCart, User, FileText, Package } from 'lucide-react';

const HeaderPelanggan = ({ pageType, orderId }) => {
  // Ambil data pesanan terakhir langsung dari context!
  const { latestOrder } = useOrders();

  // Jika ini adalah halaman detail pesanan, tampilkan header khusus
  if (pageType === 'orderDetail') {
    return (
      <header className="w-full bg-white py-3 px-4 md:px-8 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-gray-800"><ArrowLeft size={24} /></Link>
          <h1 className="text-xl font-bold text-gray-800">Rincian Pesanan</h1>
          <Link
            to={orderId ? `/order/${orderId}/invoice` : '#'}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm hover:bg-gray-200 transition"
            title="Lihat Invoice"
          >
            <FileText size={20} />
          </Link>
        </div>
      </header>
    );
  }

  // Jika tidak, tampilkan header default (untuk HomePage, Cart, dll)
  return (
    <header className="w-full bg-white py-3 px-4 md:px-8 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center text-red-600 font-bold text-2xl space-x-2">
          <img src="/images/logo hawai.png" alt="Logo Hawaii" className="w-11 h-11 rounded-full border-2 border-red-600"/>
          <span>HAWAII</span>
        </Link>
        <div className="flex-1 max-w-lg mx-4">
            <input type="text" placeholder="Cari kebutuhan sehari-hari..." className="w-full px-4 py-2.5 rounded-full bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-red-300"/>
        </div>
        <div className="flex items-center space-x-2">
          {/* --- IKON BARU YANG KAMU INGINKAN --- */}
          {/* Ikon ini hanya muncul jika sudah ada pesanan */}
          {latestOrder && (
            <Link 
              to={`/order/${latestOrder.id}`} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm hover:bg-red-200 transition" 
              title="Lihat Pesanan Terakhir"
            >
              <Package size={20} />
            </Link>
          )}
          
          <Link to="/notification" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition" title="Notifikasi"><Bell size={20} /></Link>
          <Link to="/cart" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition" title="Keranjang"><ShoppingCart size={20} /></Link>
          <Link to="/profile" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition" title="Profil"><User size={20} /></Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderPelanggan;