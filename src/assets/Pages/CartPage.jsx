// src/assets/pages/CartPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Percent, Bell, Trash2, ChevronDown, Plus, Minus, Info, ChevronRight } from "lucide-react";
import { useCart } from '../../assets/contexts/CartContext'; // Pastikan path ini benar!

// Fungsi helper untuk memformat mata uang
const formatCurrency = (number) => {
  const num = number ?? 0;
  if (typeof num !== "number") return "Rp 0";
  return num.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeItem,
    toggleItemSelection,
    toggleShopSelection,
    toggleSelectAll,
    totalProductsSelected,
    totalPrice
  } = useCart(); // Ambil state dan fungsi dari CartContext

  // State lokal untuk 'Pilih Semua' di bagian footer
  const [selectAllFooter, setSelectAllFooter] = useState(false);

  useEffect(() => {
    const allSelected = cartItems.length > 0 && cartItems.every(shop => 
      shop.products.length > 0 && shop.products.every(p => p.selected)
    );
    setSelectAllFooter(allSelected);

    console.log("CartPage - cartItems updated:", cartItems);
    console.log("Total Selected Products:", totalProductsSelected);
    console.log("Total Price:", totalPrice);
    
  }, [cartItems]); // Dependency array harus memantau `cartItems`

  // Handle 'Pilih Semua' di footer
  const handleSelectAllFooter = (event) => {
    const isChecked = event.target.checked;
    toggleSelectAll(isChecked);
  };

  // Handle 'Hapus' item yang dipilih
  const handleDeleteSelectedItems = () => {
    const selectedItems = cartItems.flatMap(shop =>
      shop.products.filter(product => product.selected)
    );

    if (selectedItems.length > 0) {
      // Hapus item satu per satu. Ini akan memicu render ulang.
      selectedItems.forEach(item => removeItem(item.shopId || item.shop.id, item.itemId));
    } else {
      alert("Pilih produk yang ingin dihapus terlebih dahulu.");
    }
  };
  
  // Fungsi untuk menampilkan message box (seperti yang digunakan di HomePage)
  const displayMessageBox = (message) => {
    const messageBox = document.createElement("div");
    messageBox.className =
      "fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50";
    messageBox.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 text-center">
        <p class="text-lg text-gray-800 mb-4">${message}</p>
        <button id="closeMessageBox" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">OK</button>
      </div>
    `;
    document.body.appendChild(messageBox);
    document.getElementById("closeMessageBox").onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  return (
    <div className="w-full flex flex-col items-center min-h-screen bg-gray-100">
      {/* Header (Putih dengan logo Hawaii) */}
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
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-gray-800">Keranjang Belanja</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link to="/notification" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-red-600 shadow-md hover:bg-gray-200 transition">
              <Bell size={20} />
            </Link>
            <Link to="/promo-page" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-red-600 shadow-md hover:bg-gray-200 transition">
              <Percent size={20} />
            </Link>
            <Link to="/cart" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-red-600 shadow-md hover:bg-gray-200 transition">
              <ShoppingCart size={20} />
            </Link>
            <Link to="/signin" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-red-600 shadow-md hover:bg-gray-200 transition">
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full bg-white rounded-lg shadow-lg my-6 md:my-8 overflow-hidden">
        {/* Header Tabel/Daftar Produk */}
        <div className="flex items-center p-4 border-b border-gray-200 text-gray-500 text-sm font-semibold">
          <div className="w-1/12 flex-shrink-0">
            <input
              type="checkbox"
              className="form-checkbox text-red-600 rounded"
              checked={selectAllFooter}
              onChange={handleSelectAllFooter}
            />
          </div>
          <div className="w-4/12 md:w-5/12 flex-grow">Produk</div>
          <div className="w-2/12 hidden md:block text-center">Harga Satuan</div>
          <div className="w-1/12 hidden md:block text-center">Kuantitas</div>
          <div className="w-2/12 hidden md:block text-right">Total Harga</div>
          <div className="w-1/12 text-right">Aksi</div>
        </div>

        {/* Info Promo di Atas Tabel */}
        <div className="bg-red-50 p-3 flex items-center justify-between text-red-600 text-sm font-semibold">
          <span className="flex items-center">
            Promo Menarik Hari Ini!
            <Info size={16} className="ml-1" />
          </span>
          <button className="text-blue-600 hover:underline" onClick={() => displayMessageBox("Fungsi 'Lihat Detail Promo' akan diimplementasikan!")}>Lihat Detail</button>
        </div>

        {/* Daftar Item Keranjang */}
        {cartItems && cartItems.length > 0 ? (
          cartItems.map(shop => (
            shop.products && shop.products.length > 0 && (
              <div key={shop.id} className="border-b border-gray-200 last:border-b-0">
                {/* Header Toko */}
                <div className="p-4 flex items-center space-x-2 border-b border-gray-100 bg-gray-50">
                  <input
                    type="checkbox"
                    className="form-checkbox text-red-600 rounded"
                    checked={shop.products.every(p => p.selected)} // Menggunakan state 'selected' dari produk
                    onChange={(e) => toggleShopSelection(shop.id, e.target.checked)} // Menggunakan fungsi dari context
                  />
                  {shop.isMall && (
                    <span className="bg-red-600 text-white px-2 py-0.5 text-xs font-bold rounded-sm">Mall.ORI</span>
                  )}
                  <span className="font-semibold text-gray-800">{shop.shopName}</span>
                  {shop.shopName && ( // Hanya tampilkan tombol chat jika ada nama toko
                    <Link to="#" className="text-red-600 hover:text-red-700" onClick={() => displayMessageBox("Fungsi 'Chat Toko' akan diimplementasikan!")}>
                      <img src="https://img.icons8.com/ios-filled/24/null/mail.png" alt="Chat" className="w-5 h-5" />
                    </Link>
                  )}
                  <button className="text-gray-500 hover:text-gray-700 ml-auto" onClick={() => displayMessageBox("Opsi 'Lebih Lanjut' akan diimplementasikan!")}>
                    <ChevronDown size={20} />
                  </button>
                </div>

                {/* Produk dalam Toko */}
                {shop.products.map(product => (
                  <div key={product.itemId} className="p-4 flex items-center border-b border-gray-100 last:border-b-0">
                    <div className="w-1/12 flex-shrink-0">
                      <input
                        type="checkbox"
                        className="form-checkbox text-red-600 rounded"
                        checked={product.selected} // Menggunakan state 'selected' dari produk
                        onChange={() => toggleItemSelection(shop.id, product.itemId)} // Menggunakan fungsi dari context
                      />
                    </div>
                    <div className="w-4/12 md:w-5/12 flex-grow flex items-center">
                      <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-contain mr-3 border rounded" />
                      <div>
                        <p className="text-gray-800 font-medium line-clamp-2">{product.name}</p>
                        {product.variant && (
                          <span className="text-sm text-gray-500 flex items-center group">
                            {product.variant} <ChevronDown size={14} className="ml-1 text-gray-400 group-hover:text-gray-600" />
                          </span>
                        )}
                        {product.hasDiscount && (
                          <span className="bg-red-100 text-red-600 text-xs font-semibold px-1 py-0.5 rounded mt-1 inline-block">
                            Diskon {product.discountPercent}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-2/12 hidden md:block text-center">
                      {product.hasDiscount && (
                        <p className="text-gray-500 text-xs line-through">{formatCurrency(product.originalPrice)}</p>
                      )}
                      <p className="text-gray-800 font-semibold">{formatCurrency(product.currentPrice)}</p>
                    </div>
                    <div className="w-1/12 flex justify-center items-center">
                      <div className="flex items-center border border-gray-300 rounded-sm">
                        <button
                          className="p-1 text-gray-600 hover:bg-gray-100"
                          onClick={() => updateQuantity(shop.id, product.itemId, -1)} // Menggunakan fungsi dari context
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="text"
                          value={product.qty}
                          readOnly
                          className="w-10 text-center border-l border-r border-gray-300 py-1 text-sm outline-none"
                        />
                        <button
                          className="p-1 text-gray-600 hover:bg-gray-100"
                          onClick={() => updateQuantity(shop.id, product.itemId, 1)} // Menggunakan fungsi dari context
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="w-2/12 text-right">
                      <p className="text-red-600 font-semibold">{formatCurrency(product.currentPrice * product.qty)}</p>
                    </div>
                    <div className="w-1/12 text-right">
                      <button
                        className="text-gray-500 hover:text-red-600"
                        onClick={() => removeItem(shop.id, product.itemId)} // Menggunakan fungsi dari context
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Voucher Toko */}
                {shop.hasShopVoucher && (
                  <div className="p-4 flex items-center justify-between border-b border-gray-100">
                    <span className="text-blue-600 flex items-center">
                      <img src="https://img.icons8.com/ios-filled/20/null/discount.png" alt="Voucher" className="mr-2 h-5 w-5" />
                      Tambahkan Voucher Toko
                    </span>
                    <ChevronRight size={20} className="text-blue-600" />
                  </div>
                )}
                {/* Gratis Ongkir */}
                <div className="p-4 flex items-center justify-between">
                  <div className="text-green-600 flex items-center">
                    <img src="/images/delivery-truck.png" alt="Free Shipping" className="h-5 w-5 mr-2" />
                    Gratis Ongkir s/d Rp40.000 dengan min. belanja Rp0; Gratis Ongkir s/d Rp500.000 dengan min. belanja Rp300.000
                  </div>
                  <Link to="#" className="text-blue-600 hover:underline text-sm" onClick={() => displayMessageBox("Fungsi 'Pelajari lebih lanjut ongkir' akan diimplementasikan!")}>Pelajari lebih lanjut</Link>
                </div>
              </div>
            )
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">Keranjang Anda kosong.</div>
        )}
      </div>

      {/* Bagian Bawah: Pilih Semua, Hapus, Total, Checkout */}
      <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 shadow-lg py-4 px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center">
          {/* Kiri: Pilih Semua, Hapus, Pindahkan */}
          <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-auto">
            <input
              type="checkbox"
              className="form-checkbox text-red-600 rounded"
              checked={selectAllFooter}
              onChange={handleSelectAllFooter}
            />
            <span className="text-gray-800">Pilih Semua ({totalProductsSelected})</span>
            <button className="text-gray-500 hover:text-red-600 flex items-center ml-4" onClick={handleDeleteSelectedItems}>
              <Trash2 size={20} className="mr-1" /> Hapus
            </button>
            <button className="text-blue-600 hover:underline hidden md:block" onClick={() => displayMessageBox("Fungsi 'Pindahkan ke Favorit' akan diimplementasikan!")}>Pindahkan ke Favorit Saya</button>
          </div>

          {/* Kanan: Total & Checkout */}
          <div className="flex items-center justify-end w-full md:w-auto">
            <div className="flex flex-col items-end mr-4">
              <div className="flex items-center text-gray-800 font-semibold mb-1">
                Total ({totalProductsSelected} produk):
                <span className="ml-2 text-red-600 font-bold text-xl">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex items-center text-gray-500 text-xs">
                <img src="https://placehold.co/16x16/FFD700/000000?text=K" alt="Koin" className="mr-1" />
                Tukarkan 80 Koin Hawaii
                <ChevronRight size={14} className="ml-1" />
              </div>
            </div>
            <button
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => navigate('/checkout')} // Menghubungkan ke halaman Checkout
              disabled={totalProductsSelected === 0} // Disable jika tidak ada produk terpilih
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Footer (Mirroring HomePage footer) */}
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
        <div className="text-center text-white-500 text-xs mt-8 border-t border-gray-700 pt-4">
          © 2024 HAWAII. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default CartPage;