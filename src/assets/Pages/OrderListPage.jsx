// src/pages/OrderListPage.jsx (VERSI BARU YANG LEBIH BAGUS)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';
import { ArrowLeft, PackageX, ShoppingBag } from 'lucide-react';

const formatCurrency = (amount) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(amount) || 0);

// Helper untuk styling status badge
const getStatusBadge = (status) => {
  switch (status) {
    case 'Selesai':
      return 'bg-green-100 text-green-800';
    case 'Dalam Pengiriman':
      return 'bg-blue-100 text-blue-800';
    case 'Sedang Diproses':
      return 'bg-orange-100 text-orange-800';
    case 'Dibatalkan':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrderListPage = () => {
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState('Semua');

  const filterTabs = ['Semua', 'Sedang Diproses', 'Dalam Pengiriman', 'Selesai'];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Semua') return true;
    return order.status === activeTab;
  });

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <header className="w-full bg-white py-4 px-4 md:px-8 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center relative">
          <Link to="/" className="absolute left-0 text-gray-800">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-gray-800 text-center flex-grow">Riwayat Pesanan</h1>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto p-4 md:p-6">
        {/* --- Filter Tabs --- */}
        <div className="flex items-center border-b border-gray-200 mb-6">
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === tab 
                ? 'border-b-2 border-red-600 text-red-600' 
                : 'text-gray-500 hover:text-red-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- Daftar Pesanan --- */}
        <div className="space-y-5">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => {
              const firstProduct = order.products[0];
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-md transition-shadow hover:shadow-lg">
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="text-red-600" size={20} />
                        <div>
                            <p className="font-bold text-gray-800 text-sm">Belanja</p>
                            <p className="text-xs text-gray-500">{order.orderTime}</p>
                        </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Card Body - Link ke Detail */}
                  <Link to={`/order/${order.id}`} className="block p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <img 
                        src={firstProduct?.imageUrl || 'https://via.placeholder.com/80'} 
                        alt={firstProduct?.name} 
                        className="w-20 h-20 rounded-md object-cover border"
                      />
                      <div className="flex-grow">
                        <p className="font-bold text-gray-900 leading-tight">{firstProduct?.name}</p>
                        {order.products.length > 1 && (
                          <p className="text-sm text-gray-500 mt-1">+{order.products.length - 1} produk lainnya</p>
                        )}
                      </div>
                    </div>
                  </Link>
                  
                  {/* Card Footer */}
                  <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Total Belanja</p>
                      <p className="font-bold text-lg text-gray-800">{formatCurrency(order.totalPaid)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200">
                        Beri Ulasan
                      </button>
                      <button className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Beli Lagi
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            // --- Tampilan Jika Pesanan Kosong ---
            <div className="text-center py-16">
              <PackageX className="mx-auto text-gray-300" size={64} />
              <h3 className="mt-4 text-xl font-bold text-gray-800">Oops, Belum Ada Pesanan</h3>
              <p className="mt-2 text-sm text-gray-500">Yuk, mulai belanja dan penuhi kebutuhanmu sekarang!</p>
              <Link to="/" className="mt-6 inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-transform hover:scale-105">
                Mulai Belanja
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderListPage;