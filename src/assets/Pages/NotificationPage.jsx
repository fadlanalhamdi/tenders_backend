// KODE FINAL - Silakan salin semua isi file ini.
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Percent, Bell, ArrowLeft, Tag } from "lucide-react";

const PromoDetailModal = ({ promo, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!promo) return null; // Jika tidak ada promo yg dipilih, jangan tampilkan apa-apa.

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.7)] z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      {/* Konten Pop Up */}
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fade-in-up"
        onClick={(e) => e.stopPropagation()} // Agar pop up tidak tertutup saat bagian dalamnya di-klik
      >
        {/* Header Pop Up */}
        <div className="p-5 rounded-t-xl bg-gray-50 border-b-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Tag className="w-6 h-6 mr-3 text-red-600"/>
                Detail Promo & Informasi
            </h2>
        </div>
        
        {/* === BAGIAN KONTEN DETAIL YANG TAMPIL DI POP UP === */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Judul Promo */}
          <h3 className="text-xl font-bold text-gray-900">{promo.title}</h3>
          
          {/* Deskripsi/Detail Promo */}
          <p className="text-gray-600 leading-relaxed">
            {promo.details}
          </p>
          
          {/* Syarat & Ketentuan (hanya tampil jika ada) */}
          {promo.terms && promo.terms.length > 0 && (
            <div>
                <h4 className="font-semibold text-gray-800 mb-2">Syarat & Ketentuan:</h4>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600">
                    {promo.terms.map((term, index) => <li key={index}>{term}</li>)}
                </ul>
            </div>
          )}
        </div>

        {/* Footer Pop Up */}
        <div className="flex justify-end p-4 bg-gray-50 rounded-b-xl border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};


// --- HALAMAN UTAMA NOTIFIKASI (VERSI FINAL) ---
const NotificationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  // === DATA NOTIFIKASI DENGAN KONTEN DETAIL YANG LENGKAP ===
  // Kunci agar pop up berisi teks adalah mengisi properti 'details' dan 'terms' di sini.
  const notifications = [
    {
      id: 1,
      type: "diskon",
      title: "🎉 Diskon Spesial!",
      message: "Dapatkan potongan 15% untuk semua produk kategori Grocery hari ini.",
      time: "2 jam yang lalu",
      // INI ADALAH KONTEN YANG AKAN MUNCUL DI POP UP
      details: `Nikmati kemudahan berbelanja dengan potongan harga spesial sebesar 15% untuk seluruh produk dalam kategori Grocery. Promo ini hanya berlaku untuk pembelanjaan hari ini, ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`,
      terms: [
          "Promo berlaku tanpa minimum pembelian.",
          "Potongan harga akan otomatis diterapkan di keranjang belanja Anda.",
          "Tidak dapat digabungkan dengan promo atau voucher lainnya.",
          "Berlaku untuk pembelian melalui aplikasi dan langsung di toko.",
      ],
      isClickable: true,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      textColor: "text-blue-800",
    },
    {
      id: 2,
      type: "pesanan",
      title: "✅ Pesanan #HAW20240618 Berhasil Dikirim!",
      message: "Pesanan Anda dengan nomor #HAW20240618 telah berhasil dikirim dan sedang dalam perjalanan.",
      time: "Kemarin",
      details: "Kabar baik! Pesanan Anda telah kami serahkan kepada mitra kurir dan sedang dalam perjalanan menuju alamat Anda. Anda dapat melacak posisi paket secara berkala.",
      terms: [
          "Nomor Pesanan: #HAW20240618",
          "Jasa Kirim: HAWAII Express",
          "Nomor Resi: HW0123456789",
          "Estimasi Tiba: 1 hari kerja.",
      ],
      isClickable: true, 
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      textColor: "text-green-800",
    },
    {
      id: 4, // ID bisa apa saja, yang penting unik
      type: "info",
      title: "⚠️ Pemeliharaan Sistem",
      message: "Sistem akan mengalami pemeliharaan pada esok hari pukul 00:00 - 02:00 WIB.",
      time: "5 hari yang lalu",
      details: "Untuk meningkatkan kualitas dan keamanan layanan, kami akan melakukan pemeliharaan sistem rutin. Selama periode ini, beberapa fitur pada aplikasi dan website mungkin tidak dapat diakses untuk sementara waktu. Mohon maaf atas ketidaknyamanannya.",
      terms: [
          "Waktu pemeliharaan: Sabtu, 29 Juni 2025, pukul 00:00 hingga 02:00 WIB.",
          "Layanan akan kembali normal setelah periode pemeliharaan selesai."
      ],
      isClickable: true,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-300",
      textColor: "text-orange-800",
    },
    {
      id: 3,
      type: "pengingat",
      title: "🔔 Pengingat!",
      message: "Jangan lewatkan flash sale untuk produk elektronik besok pukul 10.00 WIB.",
      time: "3 hari yang lalu",
      details: "Jangan sampai ketinggalan! Flash Sale produk elektronik terbesar akan segera dimulai. Dapatkan diskon luar biasa untuk berbagai produk impian seperti Smartphone, Laptop, TV, dan banyak lagi.",
      terms: [
        "Waktu: Besok, pukul 10:00 WIB.",
        "Stok sangat terbatas, siapa cepat dia dapat!",
        "Pastikan Anda sudah login untuk proses checkout yang lebih cepat."
      ],
      isClickable: true, 
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
      textColor: "text-yellow-800",
    },
  ];

  const handleOpenModal = (promoData) => {
    if (promoData.isClickable) {
      setSelectedPromo(promoData);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => { setSelectedPromo(null); }, 300);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center min-h-screen bg-gray-100">
        
        {/* --- HEADER LENGKAP --- */}
        <header className="w-full bg-white py-3 px-4 md:px-8 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2 text-red-600 font-bold text-2xl"> 
              <Link to="/">
                <img
                  src="/images/logo hawai.png"
                  alt="Logo Hawai"
                  className="w-11 h-11 rounded-full border-2 border-red-600" 
                />
              </Link>
              <span>HAWAII</span>
            </div>
            <div className="flex-1 max-w-md relative">
              <input
                type="text"
                placeholder="Cari kebutuhan sehari-hari..."
                className="w-full pl-4 pr-10 py-2.5 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-inner"
                disabled
              />
              <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/notification" className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm hover:bg-red-200 transition">
                <Bell size={20} />
              </Link>
              <Link to="/promo-page" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition">
                <Percent size={20} />
              </Link>
              <Link to="/cart" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition">
                <ShoppingCart size={20} />
              </Link>
              <Link to="/signin" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition">
                <User size={20} />
              </Link>
            </div>
          </div>
        </header>

        {/* --- KONTEN UTAMA --- */}
        <main className="max-w-4xl mx-auto w-full bg-white rounded-lg shadow-lg my-8 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Notifikasi Anda</h1>
          <div className="space-y-4">
            {notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleOpenModal(notif)}
                className={`p-4 ${notif.bgColor} rounded-lg ${notif.borderColor} border-l-4 transition-all duration-200 ${notif.isClickable ? 'cursor-pointer hover:shadow-md hover:border-l-red-500' : ''}`}
              >
                <p className={`font-semibold ${notif.textColor} mb-1`}>{notif.title}</p>
                <p className="text-sm text-gray-700">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali ke Beranda
            </Link>
          </div>
        </main>

        {/* --- FOOTER LENGKAP --- */}
        <footer className="w-full bg-red-800 text-white py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-white mb-4">QUICK LINKS</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors">Pengaduan Pelanggan</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm">
                <li>📞 081378237282</li>
                <li>📧 hawaii@gmail.com</li>
                <li>☎️ 1334314</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Follow Us</h3>
              <div className="flex space-x-4 text-2xl text-white">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400"><i className="fab fa-twitter"></i></a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600"><i className="fab fa-facebook"></i></a>
                <a href="https://www.instagram.com/hawaiiswalayanpku?igsh=amN0c2VkeGh2eXhm" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500"><i className="fab fa-instagram"></i></a>
                <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-white"><i className="fab fa-tiktok"></i></a>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Location</h3>
              <p className="text-sm">Jl Yos Sudarso<br />Jl Juanda Tarumai<br />Jl Hitam Ujung<br />Simpang Jengkol<br />Jl Durian No.1E Payung Sekaki</p>
            </div>
          </div>
          <div className="text-center text-gray-300 text-xs mt-8 border-t border-red-700 pt-4">
            © {new Date().getFullYear()} HAWAII. All rights reserved.
          </div>
        </footer>

      </div>

      {/* Render Modal secara kondisional di sini */}
      {isModalOpen && <PromoDetailModal promo={selectedPromo} onClose={handleCloseModal} />}
    </>
  );
};

export default NotificationPage;