// src/assets/pages/OrderDetailPage.jsx (VERSI BARU DENGAN TRACKER DINAMIS)
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';
import { ArrowLeft, HelpCircle, MapPin, ClipboardList, PackageSearch, Truck, Home } from 'lucide-react';

const formatCurrency = (amount) => `Rp ${Number(amount).toLocaleString('id-ID')}`;

// --- KOMPONEN BARU UNTUK TRACKER STATUS ---
const allStatusSteps = [
  { id: 'Pesanan Dibuat', icon: ClipboardList, text: 'Dipesan' },
  { id: 'Sedang Diproses', icon: PackageSearch, text: 'Diproses' },
  { id: 'Dalam Pengiriman', icon: Truck, text: 'Dikirim' },
  { id: 'Selesai', icon: Home, text: 'Selesai' }
];

const OrderStatusTracker = ({ currentStatus }) => {
  const currentIndex = allStatusSteps.findIndex(step => step.id === currentStatus);

  return (
    <div className="flex items-center w-full px-4 py-6">
      {allStatusSteps.map((step, index) => {
        const isActive = index <= currentIndex;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${isActive ? 'bg-red-500' : 'bg-gray-300'}`}>
                <step.icon size={20} className="text-white" />
              </div>
              <p className={`mt-2 text-xs font-semibold transition-colors duration-500 ${isActive ? 'text-red-600' : 'text-gray-500'}`}>{step.text}</p>
            </div>
            {index < allStatusSteps.length - 1 && (
              <div className="flex-1 h-1 mx-2 relative">
                <div className="absolute top-0 left-0 h-full w-full bg-gray-300 rounded-full" />
                <div className="absolute top-0 left-0 h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: isActive && index < currentIndex ? '100%' : '0%' }}/>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};


// --- KOMPONEN UTAMA HALAMAN DETAIL ---
const OrderDetailPage = () => {
  const { id } = useParams();
  const { getOrderById, updateOrderStatus } = useOrders();
  const order = getOrderById(id);

  // --- LOGIKA SIMULASI STATUS ---
  useEffect(() => {
    if (!order || order.status === 'Selesai') {
      return; // Jangan jalankan simulasi jika pesanan tidak ada atau sudah selesai
    }

    const timeouts = [
      setTimeout(() => updateOrderStatus(id, 'Sedang Diproses', 'Pesananmu sedang disiapkan oleh penjual.'), 1000), // 3 detik
      setTimeout(() => updateOrderStatus(id, 'Dalam Pengiriman', 'Paketmu sudah di tangan kurir dan menuju lokasimu.'), 3000), // +5 detik
      setTimeout(() => updateOrderStatus(id, 'Selesai', `Pesanan telah selesai pada ${new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}.`), 5000) // +7 detik
    ];

    // Cleanup function untuk membersihkan timeout jika user meninggalkan halaman
    return () => timeouts.forEach(clearTimeout);
  }, []); // Hanya jalankan sekali saat komponen dimuat


  if (!order) {
    return <div className="flex items-center justify-center min-h-screen">Memuat pesanan...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center min-h-screen bg-gray-50">
      <main className="flex-grow w-full max-w-4xl bg-white rounded-lg shadow-lg my-6">
        {/* --- Bagian Status Dinamis & Tracker --- */}
        <div className="p-6 border-b border-gray-200">
          <div className={`p-4 rounded-lg mb-4 text-center ${order.status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
            <h2 className="text-2xl font-bold">{order.status}</h2>
            <p className="text-sm mt-1">{order.statusText}</p>
          </div>
          <OrderStatusTracker currentStatus={order.status} />
        </div>

        {/* --- Sisa Tampilan (Alamat, Produk, dll) --- */}
        <div className="p-6">
          <div className="border-b pb-4 mb-4">
            <p className="text-lg font-bold text-gray-800 flex items-center mb-2"><MapPin size={18} className="text-red-500 mr-2"/>Alamat Pengiriman</p>
            <p className="font-semibold text-gray-700">{order.address.recipient}</p>
            <p className="text-sm text-gray-600">{order.address.street}, {order.address.details}</p>
          </div>
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Produk Dipesan</h3>
            {order.products.map((product, index) => (
              <div key={index} className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                  <div>
                    <p className="text-gray-800 font-medium">{product.qty} x {product.name}</p>
                  </div>
                </div>
                <p className="text-gray-800 font-semibold">{formatCurrency(product.price * product.qty)}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Ringkasan Pembayaran</h3>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between"><p>Subtotal Produk</p><p>{formatCurrency(order.pricing.subtotal)}</p></div>
                <div className="flex justify-between"><p>Biaya Pengiriman</p><p>{formatCurrency(order.pricing.shipping)}</p></div>
                <div className="flex justify-between items-center pt-4 border-t mt-4">
                    <span className="font-bold text-lg">Total</span>
                    <p className="text-red-600 font-bold text-2xl">{formatCurrency(order.totalPaid)}</p>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetailPage;