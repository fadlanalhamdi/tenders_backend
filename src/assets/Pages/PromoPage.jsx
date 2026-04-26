// KODE 100% LENGKAP - Layout asli Anda dengan fungsionalitas pop-up & footer yang sudah diperbaiki.
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Percent, Bell, Tag } from "lucide-react";

// --- KOMPONEN POP UP / MODAL ---
const PromoDetailModal = ({ promo, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!promo) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.7)] z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 rounded-t-xl bg-gray-50 border-b-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Tag className="w-6 h-6 mr-3 text-red-600"/>
            Detail Promo & Diskon
          </h2>
        </div>
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <img src={promo.image} alt={promo.title} className="w-full h-48 object-cover rounded-lg shadow-md mb-4" />
          <h3 className="text-xl font-bold text-gray-900">{promo.title}</h3>
          <p className="text-gray-600 leading-relaxed">{promo.details}</p>
          {promo.terms && promo.terms.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Syarat & Ketentuan:</h4>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600">
                {promo.terms.map((term, index) => <li key={index}>{term}</li>)}
              </ul>
            </div>
          )}
        </div>
        <div className="flex justify-end p-4 bg-gray-50 rounded-b-xl border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};


// --- HALAMAN PROMO UTAMA ---
const PromoPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(null);

  const promos = [
    {
      id: 1,
      title: "🔥 Flash Sale Hebat!",
      description: "Diskon hingga 50% untuk produk-produk terpilih hanya untuk 24 jam ke depan.",
      validity: "Berlaku hingga 19 Juni 2025",
      image: "/images/Flash-sale.png",
      details: "Kejar diskon terbesar tahun ini di Flash Sale Hebat! Dapatkan produk impian Anda dari berbagai kategori seperti elektronik, fashion, dan kebutuhan sehari-hari dengan potongan harga hingga 50%. Jangan sampai kehabisan!",
      terms: ["Promo hanya berlaku untuk produk di halaman Flash Sale.", "Stok sangat terbatas, siapa cepat dia dapat.", "Tidak dapat digabungkan dengan promo lain."],
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-800",
    },
    {
      id: 2,
      title: "🎁 Voucher Cashback!",
      description: "Belanja minimal Rp 100.000, dapatkan cashback Rp 10.000. Kode: HAWAIIHEMAT",
      validity: "Berlaku s/d 30 Juni 2025",
      image: "/images/Cashback.png",
      details: "Belanja lebih hemat dengan Voucher Cashback! Gunakan kode HAWAIIHEMAT saat checkout untuk mendapatkan cashback sebesar Rp 10.000 untuk setiap transaksi minimal Rp 100.000. Cashback akan masuk ke saldo akun Anda.",
      terms: ["Cashback akan diterima 1x24 jam setelah pesanan selesai.", "Berlaku untuk satu kali penggunaan per akun.", "Berlaku untuk semua metode pembayaran."],
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
    },
    {
      id: 3,
      title: "⚡ Diskon Kilat Indomie!",
      description: "Indomie Goreng Jumbo hanya Rp 3.000 per bungkus. Stok terbatas!",
      validity: "Sampai stok habis",
      image: "https://bimg.akulaku.net/goods/spu/cb00cb83c63748af99eed5027e098d437235.jpg?w=726&q=80&fit=1",
      details: "Serbu harga spesial untuk Indomie Goreng Jumbo! Hanya dengan Rp 3.000, Anda bisa menikmati mi instan favorit semua orang. Promo berlaku di semua cabang Hawaii Supermarket selama persediaan masih ada.",
      terms: ["Maksimal pembelian 5 bungkus per pelanggan.", "Hanya berlaku untuk pembelian langsung di toko."],
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
    },
    {
      id: 4,
      title: "🚛 Gratis Ongkir!",
      description: "Nikmati gratis ongkir untuk setiap pembelian di atas Rp 75.000. Otomatis diterapkan saat checkout.",
      validity: "Berlaku sepanjang bulan ini",
      image: "https://www.sapx.id/blog/wp-content/uploads/2025/05/gratis-ongkir.png",
      details: "Belanja dari rumah jadi lebih mudah dan hemat! Nikmati promo gratis ongkos kirim untuk semua pesanan dengan total belanja minimal Rp 75.000. Promo akan otomatis diterapkan saat Anda checkout.",
      terms: ["Berlaku untuk area pengiriman dalam kota.", "Maksimal potongan ongkir adalah Rp 15.000."],
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
    },
  ];

  const handleOpenModal = (promo) => {
    setSelectedPromo(promo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => { setSelectedPromo(null); }, 300);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center min-h-screen bg-gray-100">
        <div className="w-full bg-white py-3 px-4 md:px-8 shadow-md"> 
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
              <Link to="/notification" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition">
                <Bell size={20} />
              </Link>
              <Link to="/promo-page" className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm hover:bg-red-200 transition">
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
        </div>

        <div className="max-w-4xl mx-auto w-full bg-white rounded-lg shadow-lg my-8 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Promo & Diskon Terbaru</h1>
          {promos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promos.map(promo => (
                <div key={promo.id} className={`flex flex-col ${promo.bgColor} rounded-lg ${promo.borderColor} border overflow-hidden shadow-md`}>
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/cccccc/000000?text=Gambar+Promo"; }}
                  />
                  <div className="p-4">
                    <h3 className={`font-semibold text-xl ${promo.textColor} mb-2`}>{promo.title}</h3>
                    <p className="text-sm text-gray-700 mb-3">{promo.description}</p>
                    <p className="text-xs text-gray-500">Berlaku: {promo.validity}</p>
                  </div>
                  <div className="p-4 border-t border-gray-200 flex justify-end">
                    <button 
                      onClick={() => handleOpenModal(promo)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg py-10">Tidak ada promo aktif saat ini.</p>
          )}
          <div className="mt-8 text-center">
            <Link to="/" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* --- FOOTER LENGKAP DIKEMBALIKAN --- */}
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
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors"><i className="fab fa-twitter"></i></a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors"><i className="fab fa-facebook"></i></a>
                <a href="https://www.instagram.com/hawaiiswalayanpku?igsh=amN0c2VkeGh2eXhm" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors"><i className="fab fa-instagram"></i></a>
                <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><i className="fab fa-tiktok"></i></a>
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

      {/* Render Modal secara kondisional */}
      {isModalOpen && <PromoDetailModal promo={selectedPromo} onClose={handleCloseModal} />}
    </>
  );
};

export default PromoPage;