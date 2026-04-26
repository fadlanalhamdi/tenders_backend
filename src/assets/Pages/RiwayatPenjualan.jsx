import React, { useState, useRef, useEffect } from 'react';

const salesData = [
  { id: 1, date: '2025-05-01', product: 'Beras Organik 5kg', customer: 'Anisa Putri', amount: 120000, status: 'Selesai' },
  { id: 2, date: '2025-05-02', product: 'Minyak Kelapa 1L', customer: 'Rudi Hartono', amount: 35000, status: 'Selesai' },
  { id: 3, date: '2025-05-03', product: 'Telur Omega 10 butir', customer: 'Siti Aminah', amount: 28000, status: 'Menunggu Pembayaran' },
  { id: 4, date: '2025-05-10', product: 'Gula Merah 1kg', customer: 'Agus Santoso', amount: 45000, status: 'Selesai' },
  { id: 5, date: '2025-05-15', product: 'Tepung Terigu 2kg', customer: 'Lina Marlina', amount: 32000, status: 'Selesai' },
  // Tambah data kalau mau
];

const statusColors = {
  'Selesai': 'bg-green-100 text-green-700',
  'Menunggu Pembayaran': 'bg-yellow-100 text-yellow-700',
};

export default function SalesHistoryDropdownFilter() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSales = salesData.filter(sale => {
    if (!startDate && !endDate) return true;
    const saleDate = new Date(sale.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) return saleDate >= start && saleDate <= end;
    if (start) return saleDate >= start;
    if (end) return saleDate <= end;
    return true;
  });

  return (
    <div className="flex flex-col h-screen bg-white p-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Riwayat Penjualan</h1>

      <div className="relative mb-8" ref={dropdownRef}>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="inline-flex items-center gap-2 rounded border border-gray-300 bg-gray-100 px-5 py-2 text-gray-700 font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Penjualan
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${showFilter ? 'rotate-180' : 'rotate-0'}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showFilter && (
          <div className="absolute z-20 mt-2 w-64 rounded-md border border-gray-300 bg-white shadow-lg p-6 space-y-4">
            <div className="flex flex-col">
              <label htmlFor="start-date" className="mb-1 text-sm font-semibold text-gray-700">
                Tanggal Mulai
              </label>
              <input
                id="start-date"
                type="date"
                className="border border-gray-300 rounded px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="end-date" className="mb-1 text-sm font-semibold text-gray-700">
                Tanggal Akhir
              </label>
              <input
                id="end-date"
                type="date"
                className="border border-gray-300 rounded px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-sm text-red-600 hover:underline"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Terapkan
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-auto rounded-lg border border-gray-300 shadow-sm">
        <table className="min-w-full table-auto border-collapse text-gray-800">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {['Tanggal', 'Produk', 'Pelanggan', 'Total', 'Status'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-sm font-semibold border-b border-gray-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  Tidak ada data penjualan ditemukan untuk rentang tanggal ini.
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{sale.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sale.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sale.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rp{sale.amount.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[sale.status]}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
