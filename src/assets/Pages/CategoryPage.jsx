// src/assets/pages/CategoryPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, ShoppingCart, User, Percent, Bell } from "lucide-react";
import allProductsData from '../data/productsData'; // Pastikan data ini di-export dengan benar

// ProductCard component (tidak ada perubahan, sudah benar)
const ProductCard = ({ product }) => (
  <Link to={`/product/${product.id}`} className="block h-full">
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-200 hover:scale-[1.02] border border-gray-100 flex flex-col h-full">
      <div className="flex justify-between items-center p-2 text-gray-400">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" className="sr-only peer" disabled />
          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
          <span className="ml-2 text-sm text-gray-500">To activated</span>
        </label>
        <button className="p-1 rounded-full hover:bg-gray-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z"></path>
          </svg>
        </button>
      </div>

      <div className="p-4 pt-0 flex flex-col items-center text-center flex-grow">
        <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-contain mb-3" />
        <h3 className="text-gray-800 font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-red-600 font-bold text-lg mb-2">Rp {product.price}</p>
        <p className="text-gray-500 text-xs">
          <span className="font-semibold">{product.stock}</span> In Stock
        </p>
        {product.rating && (
          <div className="flex items-center text-yellow-500 text-sm mt-1">
            <span className="mr-1">⭐</span> {product.rating}
          </div>
        )}
      </div>
    </div>
  </Link>
);

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [productsPerPage, setProductsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = categoryName === "Semua"
    ? allProductsData || [] // Fallback ke array kosong jika data undefined
    : allProductsData?.filter(product => {
        return product.category?.toLowerCase() === categoryName.toLowerCase();
      }) || []; // Fallback ke array kosong jika hasil filter undefined

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryName, productsPerPage]);

  return (
    <div className="w-full flex flex-col items-center min-h-screen bg-gray-100">
      <div className="w-full bg-white py-3 px-4 md:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2 text-red-600 font-bold text-2xl">
            <Link to="/">
              <img src="/images/logo hawai.png" alt="Logo Hawai" className="w-11 h-11 rounded-full border-2 border-red-600" />
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
            <Link to="/notifications" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-red-600 shadow-md hover:bg-gray-200 transition">
              <Bell size={20} />
            </Link>
            <Link to="/promo" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-red-600 shadow-md hover:bg-gray-200 transition">
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

      <div className="max-w-7xl mx-auto w-full bg-white rounded-lg shadow-lg my-8 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Produk Kategori: {categoryName}
        </h1>

        <div className="flex items-center justify-end mb-6 text-gray-600">
          <span className="mr-2">Jumlah produk per halaman</span>
          {[20, 40, 80].map(num => (
            <button
              key={num}
              onClick={() => setProductsPerPage(num)}
              className={`px-4 py-2 mx-1 rounded-md ${productsPerPage === num ? "bg-red-600 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
            >
              {num}
            </button>
          ))}
        </div>

        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 items-stretch">
            {currentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg py-10">
            Tidak ada produk ditemukan untuk kategori ini.
          </div>
        )}

        {totalPages > 1 && (
          <nav className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 border rounded-md ${currentPage === number ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      <footer className="w-full bg-red-800 text-white py-8 mt-8 md:mt-auto">
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

export default CategoryPage;