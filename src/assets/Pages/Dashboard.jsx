import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { Package, Users, Tag, DollarSign, AlertTriangle, UserPlus, TrendingUp } from 'lucide-react'; // Import ikon yang relevan
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- Warna Tema (Dipindahkan ke luar komponen agar dapat diakses secara global) ---
const primaryRed = '#B82329';
const lightRed = '#FFEEEE';
const darkerRed = '#8e1b20';
const accentBlue = '#4A90E2';
const accentGreen = '#50E3C2';
const accentYellow = '#F8E71C';
const goldColor = '#DAA520';
const silverColor = '#C0C0C0';
const bronzeColor = '#CD7F32';

// --- Fungsi untuk format Rupiah (Juga dipindahkan ke luar komponen) ---
const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Dashboard = () => {
  const navigate = useNavigate();

  // --- Data Dummy Produk (dari ProductManagement) ---
  const products = [
    { id: 1, name: 'Susu UHT Full Cream 1L', category: 'Dairy & Frozen', stock: 150, price: 17500, status: 'Active', imageUrl: 'https://asbajayaberkah.com/wp-content/uploads/2024/01/ULTRA-MILK-SUSU-UHT-FULL-CREAM-1L.jpg' },
    { id: 2, name: 'Beras Premium 5kg', category: 'Staple Food', stock: 80, price: 62000, status: 'Active', imageUrl: 'https://asbajayaberkah.com/wp-content/uploads/2024/01/ULTRA-MILK-SUSU-UHT-FULL-CREAM-1L.jpg' },
    { id: 3, name: 'Minyak Goreng 2L', category: 'Cooking Needs', stock: 15, price: 35000, status: 'Low Stock', imageUrl: 'https://asbajayaberkah.com/wp-content/uploads/2024/01/ULTRA-MILK-SUSU-UHT-FULL-CREAM-1L.jpg' },
    { id: 4, name: 'Mie Instan Goreng', category: 'Snacks & Instant', stock: 200, price: 3000, status: 'Active', imageUrl: 'https://asbajayaberkah.com/wp-content/uploads/2024/01/ULTRA-MILK-SUSU-UHT-FULL-CREAM-1L.jpg' },
    { id: 5, name: 'Sabun Mandi Cair', category: 'Personal Care', stock: 0, price: 25000, status: 'Out of Stock', imageUrl: 'https://asbajayaberkah.com/wp-content/uploads/2024/01/ULTRA-MILK-SUSU-UHT-FULL-CREAM-1L.jpg' },
    { id: 6, name: 'Kopi Bubuk Murni 250gr', category: 'Beverages', stock: 75, price: 15000, status: 'Active', imageUrl: 'https://asbajayaberkah.com/wp-content/uploads/2024/01/ULTRA-MILK-SUSU-UHT-FULL-CREAM-1L.jpg' },
    { id: 7, name: 'Gula Pasir 1kg', category: 'Staple Food', stock: 120, price: 13500, status: 'Active', imageUrl: 'https://asbajayaberkah.com/wp-content/uploads/2024/01/ULTRA-MILK-SUSU-UHT-FULL-CREAM-1L.jpg' },
  ];

  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 20).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const criticalStockProductsCount = lowStockProducts + outOfStockProducts;

  // --- Data Dummy Penjualan (disesuaikan agar bisa dihitung) ---
  const salesData = [
    { date: '2025-06-27', amount: 1200000 }, // Hari ini
    { date: '2025-06-27', amount: 800000 }, // Hari ini
    { date: '2025-06-26', amount: 500000 },
    { date: '2025-06-15', amount: 3000000 },
    { date: '2025-05-20', amount: 4500000 },
    { date: '2025-06-05', amount: 2500000 },
    { date: '2025-04-10', amount: 1500000 },
    { date: '2025-06-20', amount: 1800000 },
    { date: '2025-06-22', amount: 900000 },
    { date: '2025-06-01', amount: 2000000 },
    { date: '2025-06-03', amount: 1000000 },
    { date: '2025-06-25', amount: 700000 },
  ];

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  const pendapatanHariIni = salesData
    .filter(s => s.date === todayString)
    .reduce((sum, s) => sum + s.amount, 0);

  const totalPenjualanBulanIni = salesData
    .filter(s => {
      const saleDate = new Date(s.date);
      return saleDate.getMonth() === thisMonth && saleDate.getFullYear() === thisYear;
    })
    .reduce((sum, s) => sum + s.amount, 0);

  // --- Data Dummy Members (disesuaikan untuk membership levels) ---
  const membersData = [
    { id: 'M001', name: 'Budi Santoso', joinDate: '2024-06-10', membershipLevel: 'Platinum' },
    { id: 'M002', name: 'Siti Aminah', joinDate: '2025-06-20', membershipLevel: 'Gold' }, // Join bulan ini
    { id: 'M003', name: 'Joko Susanto', joinDate: '2025-05-15', membershipLevel: 'Silver' },
    { id: 'M004', name: 'Mariawati Dewi', joinDate: '2025-06-27', membershipLevel: 'Bronze' }, // Join hari ini
    { id: 'M005', name: 'Ahmad Faisal', joinDate: '2024-12-01', membershipLevel: 'Platinum' },
    { id: 'M006', name: 'Putri Lestari', joinDate: '2025-06-05', membershipLevel: 'Gold' }, // Join bulan ini
    { id: 'M007', name: 'Kevin Tanaka', joinDate: '2025-06-27', membershipLevel: 'Silver' }, // Join hari ini
    { id: 'M008', name: 'Linda Wijaya', joinDate: '2025-06-18', membershipLevel: 'Bronze' }, // Join bulan ini
  ];

  const totalMembers = membersData.length;
  const newMembersThisMonth = membersData.filter(m => {
    const memberJoinDate = new Date(m.joinDate);
    return memberJoinDate.getMonth() === thisMonth && memberJoinDate.getFullYear() === thisYear;
  }).length;

  // --- Data Kartu Statistik Utama ---
  const stats = [
    { label: "Pendapatan Hari Ini", value: formatRupiah(pendapatanHariIni), icon: <DollarSign className="w-8 h-8" />, path: '/penjualan', color: primaryRed, bgColor: lightRed },
    { label: "Total Penjualan Bulan Ini", value: formatRupiah(totalPenjualanBulanIni), icon: <Tag className="w-8 h-8" />, path: '/penjualan', color: darkerRed, bgColor: lightRed },
    { label: "Produk Stok Kritis", value: criticalStockProductsCount.toLocaleString('id-ID'), icon: <AlertTriangle className="w-8 h-8" />, path: '/product', color: accentYellow, bgColor: '#FFFBEB' },
    { label: "Anggota Baru Bulan Ini", value: newMembersThisMonth.toLocaleString('id-ID'), icon: <UserPlus className="w-8 h-8" />, path: '/pelanggan', color: accentBlue, bgColor: '#EFF6FF' },
  ];

  // --- Data untuk Grafik Penjualan Bulanan (Bar Chart) ---
  // Menggunakan data dummy penjualan yang lebih relevan untuk grafik bulanan
  const monthlySales = Array(12).fill(0);
  salesData.forEach(sale => {
    const date = new Date(sale.date);
    if (date.getFullYear() === thisYear) { // Hanya tahun ini
      monthlySales[date.getMonth()] += sale.amount;
    }
  });

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    datasets: [
      {
        label: "Penjualan",
        data: monthlySales.map(amount => amount / 1000000), // Tampilkan dalam Juta Rp
        backgroundColor: primaryRed,
        borderColor: darkerRed,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#333' } },
      title: { display: true, text: 'Penjualan Bulanan Tahun Ini', color: darkerRed, font: { size: 18 } },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            if (context.parsed.y !== null) { label += formatRupiah(context.parsed.y * 1000000); }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Penjualan (Juta Rp)', color: '#555' },
        ticks: {
          color: '#666',
          callback: function(value) {
            return value + ' Jt';
          }
        },
        grid: { color: '#e0e0e0' }
      },
      x: {
        title: { display: true, text: 'Bulan', color: '#555' },
        ticks: { color: '#666' },
        grid: { color: '#e0e0e0' }
      }
    }
  };

  // --- Data untuk Grafik Pertumbuhan Anggota (Line Chart) ---
  const monthlyMembers = Array(12).fill(0);
  membersData.forEach(member => {
    const joinDate = new Date(member.joinDate);
    if (joinDate.getFullYear() === thisYear) { // Hanya tahun ini
        for (let i = joinDate.getMonth(); i < 12; i++) {
            monthlyMembers[i]++; // Anggota terhitung di bulan bergabung dan bulan-bulan berikutnya
        }
    }
  });

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    datasets: [
      {
        label: "Jumlah Anggota",
        data: monthlyMembers,
        borderColor: accentBlue,
        backgroundColor: '#EBF8FF',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: accentBlue,
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#333' } },
      title: { display: true, text: 'Pertumbuhan Anggota Tahun Ini', color: darkerRed, font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Jumlah Anggota', color: '#555' }, ticks: { color: '#666' }, grid: { color: '#e0e0e0' } },
      x: { title: { display: true, text: 'Bulan', color: '#555' }, ticks: { color: '#666' }, grid: { color: '#e0e0e0' } }
    }
  };

  // --- Data untuk Grafik Distribusi Produk Berdasarkan Kategori (Pie Chart) ---
  const productsByCategory = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const productCategoryLabels = Object.keys(productsByCategory);
  const productCategoryDataValues = Object.values(productsByCategory);
  const pieChartColors = [primaryRed, darkerRed, '#CD5C5C', '#FF6384', '#36A2EB', '#FFCE56', '#8e1b20', '#C0C0C0'];

  const pieData = {
    labels: productCategoryLabels,
    datasets: [
      {
        data: productCategoryDataValues,
        backgroundColor: productCategoryLabels.map((_, index) => pieChartColors[index % pieChartColors.length]),
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right', labels: { color: '#333' } },
      title: { display: true, text: 'Distribusi Produk per Kategori', color: darkerRed, font: { size: 18 } },
    },
  };

  // --- Data untuk Grafik Distribusi Level Membership (Doughnut Chart) ---
  const membersByMembershipLevel = membersData.reduce((acc, member) => {
    acc[member.membershipLevel] = (acc[member.membershipLevel] || 0) + 1;
    return acc;
  }, {});

  const membershipLevelLabels = Object.keys(membersByMembershipLevel);
  const membershipLevelDataValues = Object.values(membersByMembershipLevel);
  const doughnutChartColors = [primaryRed, goldColor, silverColor, bronzeColor, '#A52A2A', '#E9967A']; // Warna sesuai level membership

  const doughnutData = {
    labels: membershipLevelLabels,
    datasets: [
      {
        data: membershipLevelDataValues,
        backgroundColor: membershipLevelLabels.map((_, index) => doughnutChartColors[index % doughnutChartColors.length]),
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right', labels: { color: '#333' } },
      title: { display: true, text: 'Distribusi Level Membership Anggota', color: darkerRed, font: { size: 18 } },
    },
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-8 text-center md:text-left" style={{ color: primaryRed, textShadow: '1px 1px 3px rgba(0,0,0,0.1)' }}>Ringkasan Dashboard</h1>
      
      {/* Kartu Statistik Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon, path, color, bgColor }) => (
          <div
            key={label}
            className="rounded-xl shadow-lg p-5 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl border-b-4 cursor-pointer"
            style={{ backgroundColor: 'white', borderColor: color }}
            onClick={() => path && navigate(path)}
          >
            <div className="p-3 rounded-full mb-3" style={{ backgroundColor: bgColor, color: color }}>
              {icon}
            </div>
            <p className="text-sm font-semibold text-gray-600 mb-1">{label}</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1" style={{ color: color }}>
              {value}
            </h2>
          </div>
        ))}
      </div>

      {/* Bagian Grafik Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grafik Penjualan Bulanan */}
        <div className="rounded-xl shadow-lg p-6 bg-white border-b-4" style={{ borderColor: primaryRed }}>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4" style={{ color: darkerRed }}>Penjualan Bulanan</h3>
          <Bar options={barOptions} data={barData} />
        </div>

        {/* Grafik Pertumbuhan Anggota */}
        <div className="rounded-xl shadow-lg p-6 bg-white border-b-4" style={{ borderColor: accentBlue }}>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4" style={{ color: darkerRed }}>Pertumbuhan Anggota</h3>
          <Line options={lineOptions} data={lineData} />
        </div>
      </div>

      {/* Visualisasi Tambahan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Grafik Distribusi Produk per Kategori (Pie Chart) */}
        <div className="rounded-xl shadow-lg p-6 flex flex-col items-center bg-white border-b-4" style={{ borderColor: darkerRed }}>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center" style={{ color: darkerRed }}>Distribusi Produk per Kategori</h3>
          <div className="w-full max-w-md h-auto">
            <Pie options={pieOptions} data={pieData} />
          </div>
        </div>

        {/* Grafik Distribusi Level Membership (Doughnut Chart) */}
        <div className="rounded-xl shadow-lg p-6 flex flex-col items-center bg-white border-b-4" style={{ borderColor: goldColor }}>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center" style={{ color: darkerRed }}>Distribusi Level Membership Anggota</h3>
          <div className="w-full max-w-md h-auto">
            <Doughnut options={doughnutOptions} data={doughnutData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;