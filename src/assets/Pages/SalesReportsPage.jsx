import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, DollarSign, Package, Users } from 'lucide-react';

const SalesReportsPage = () => {
  const primaryRed = '#B82329';
  const secondaryGray = '#f0f4f8';

  const [salesData, setSalesData] = useState([]);
  const [reportSummary, setReportSummary] = useState({
    totalSales: 0,
    totalTransactions: 0,
    avgTransactionValue: 0,
    topProduct: 'Monitor Gaming',
    topCustomer: 'Budi Saputra',
  });

  useEffect(() => {
    const generateMonthlySalesData = () => {
      const data = [];
      const now = new Date();
      let totalSales = 0;
      let totalTransactions = 0;

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthYear = date.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
        const sales = Math.floor(Math.random() * 50000000) + 10000000;
        const transactions = Math.floor(Math.random() * 200) + 50;

        totalSales += sales;
        totalTransactions += transactions;

        data.push({
          name: monthYear,
          Penjualan: sales,
          Transaksi: transactions,
        });
      }

      setSalesData(data);
      setReportSummary({
        totalSales: totalSales,
        totalTransactions: totalTransactions,
        avgTransactionValue: totalTransactions > 0 ? totalSales / totalTransactions : 0,
        topProduct: 'Monitor Gaming XYZ',
        topCustomer: 'Ahmad Santoso',
      });
    };

    generateMonthlySalesData();
  }, []);

  // ✅ Fungsi untuk tombol
  const handleLihatLaporan = () => {
    alert('Fitur Lihat Laporan Lengkap sedang dikembangkan atau bisa diarahkan ke halaman lain!');
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <main className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center px-6 py-4 mb-8 bg-white text-gray-800 rounded-xl shadow-lg border-b-4" style={{ borderColor: primaryRed }}>
        <h2 className="text-3xl font-extrabold tracking-wide" style={{ color: primaryRed }}>
          Laporan Penjualan
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ReportCard
          title="Total Penjualan"
          value={`Rp${reportSummary.totalSales.toLocaleString('id-ID')}`}
          icon={<DollarSign size={24} color={primaryRed} />}
          color={primaryRed}
        />
        <ReportCard
          title="Total Transaksi"
          value={reportSummary.totalTransactions.toLocaleString('id-ID')}
          icon={<Package size={24} color={primaryRed} />}
          color={primaryRed}
        />
        <ReportCard
          title="Rata-rata Transaksi"
          value={`Rp${reportSummary.avgTransactionValue.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`}
          icon={<TrendingUp size={24} color={primaryRed} />}
          color={primaryRed}
        />
        <ReportCard
          title="Produk Terlaris"
          value={reportSummary.topProduct}
          icon={<Users size={24} color={primaryRed} />}
          color={primaryRed}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4" style={{ borderColor: primaryRed }}>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Tren Penjualan Bulanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={secondaryGray} />
              <XAxis dataKey="name" stroke={primaryRed} />
              <YAxis stroke={primaryRed} tickFormatter={(v) => `Rp${(v / 1000000).toLocaleString('id-ID')}jt`} />
              <Tooltip formatter={(v, n) => [`Rp${v.toLocaleString('id-ID')}`, n]} />
              <Legend />
              <Line type="monotone" dataKey="Penjualan" stroke={primaryRed} strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-t-4" style={{ borderColor: primaryRed }}>
          <h3 className="text-xl font-bold mb-4 text-gray-800">Jumlah Transaksi Bulanan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={secondaryGray} />
              <XAxis dataKey="name" stroke={primaryRed} />
              <YAxis stroke={primaryRed} />
              <Tooltip formatter={(v, n) => [v.toLocaleString('id-ID'), n]} />
              <Legend />
              <Bar dataKey="Transaksi" fill={primaryRed} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail Section */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md border-t-4" style={{ borderColor: primaryRed }}>
        <h3 className="text-xl font-bold mb-4 text-gray-800">Detail Laporan Penjualan</h3>
        <p className="text-gray-600">
          Bagian ini bisa menampilkan tabel penjualan terbaru, daftar pelanggan dengan pembelian terbesar,
          atau filter untuk melihat laporan berdasarkan rentang waktu atau kategori produk tertentu.
        </p>
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <button
            onClick={handleLihatLaporan}
            className="px-5 py-2 rounded-xl flex items-center justify-center shadow hover:brightness-90 text-white"
            style={{ backgroundColor: primaryRed }}>
            Lihat Laporan Lengkap
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 shadow">
            Download PDF
          </button>
        </div>
      </div>
    </main>
  );
};

// Card Komponen
const ReportCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 border-l-4" style={{ borderColor: color }}>
    <div className="p-3 rounded-full" style={{ backgroundColor: `${color}1A` }}>
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default SalesReportsPage;
