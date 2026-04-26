// GANTI SELURUH ISI FILE AuthLayout.jsx KAMU DENGAN INI

import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { MapPin, ChevronDown, MessageSquare, Globe, ArrowLeft, FileText } from 'lucide-react';

// Custom Hook untuk deteksi klik di luar (dari perbaikan sebelumnya, ini berguna)
const useClickOutside = (ref, callback) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, callback]);
  };


const AuthLayout = () => {
    const navigate = useNavigate();
    // --- State asli dari kodemu, kita pertahankan ---
    const [selectedCountry, setSelectedCountry] = useState("IND"); // Diberi nilai awal
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("Jl Yos Sudarso - Rumbai");

    // --- State & Ref baru untuk logika ---
    const location = useLocation(); // Untuk tahu kita di halaman mana
    const params = useParams();     // Untuk dapatkan :id dari URL
    const countryDropdownRef = useRef(null);
    const addressDropdownRef = useRef(null);
    useClickOutside(countryDropdownRef, () => setIsCountryDropdownOpen(false));
    useClickOutside(addressDropdownRef, () => setIsAddressOpen(false));


    // Data asli dari kodemu
    const countries = [ { code: 'IND', name: 'Indonesia' }, { code: 'MYS', name: 'Malaysia' }, { code: 'SGP', name: 'Singapura' }, { code: 'THA', name: 'Thailand' }, ];
    const addresses = [ "Jl Yos Sudarso - Rumbai", "Jl Juanda Tarumai", "Jl Hitam Ujung", "Simpang Jengkol", "Jl Durian No.1E Payung Sekaki", ];

    // Fungsi-fungsi asli dari kodemu
    const toggleAddressDropdown = () => setIsAddressOpen(!isAddressOpen);
    const selectAddress = (address) => {
        setSelectedAddress(address);
        setIsAddressOpen(false);
    };
    const handleChatClick = () => {
        navigate('/chat');
    };

    // --- FUNGSI UNTUK MERENDER HEADER YANG TEPAT ---
    const renderHeader = () => {
        // Cek apakah kita sedang di halaman detail pesanan
        if (location.pathname.startsWith('/order/')) {
            // Jika ya, tampilkan header simpel ini
            return (
                <header className="w-full bg-white py-3 px-4 md:px-8 shadow-sm">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <Link to="/" className="text-gray-800">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-800">Rincian Pesanan</h1>
                        <Link
                            to={`/order/${params.id}/invoice`} // <-- Link dinamis yang aman
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 shadow-sm hover:bg-gray-200 transition"
                            title="Lihat Invoice"
                        >
                            <FileText size={20} />
                        </Link>
                    </div>
                </header>
            );
        }

        // Jika tidak, tampilkan header utama dari kodemu yang awal
        return (
            <header className="w-full bg-red-600 py-3 px-4 md:px-8 shadow-md relative">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-white">
                    {/* Sisi Kiri: Bahasa/Negara */}
                    <div ref={countryDropdownRef} className="relative">
                        <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}>
                            <Globe className="w-4 h-4" />
                            <span>{selectedCountry}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                        {isCountryDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-md shadow-lg min-w-[120px] z-10">
                                {countries.map((country) => (
                                    <div key={country.code} className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { setSelectedCountry(country.code); setIsCountryDropdownOpen(false); }}>
                                        {country.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sisi Kanan: Lokasi & Chat */}
                    <div className="flex items-center space-x-4">
                        <div ref={addressDropdownRef} className="relative">
                            <div className="flex items-center space-x-1 cursor-pointer" onClick={toggleAddressDropdown}>
                                <MapPin size={16} />
                                <span className="text-sm">{selectedAddress}</span>
                                <ChevronDown size={16} />
                            </div>
                            {isAddressOpen && (
                                <div className="absolute top-full right-0 mt-2 bg-white text-gray-900 rounded-md shadow-md w-56 z-50">
                                    {addresses.map((addr, idx) => (
                                        <div key={idx} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm" onClick={() => selectAddress(addr)}>
                                            {addr}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-1 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleChatClick}>
                            <MessageSquare size={16} />
                            <span className="text-sm">Chat</span>
                        </div>
                    </div>
                </div>
            </header>
        );
    };

    return (
        // Bagian ini sekarang menggunakan div biasa, bukan flex, agar konten tidak selalu terpusat
        <div className="min-h-screen bg-gray-100 font-sans antialiased">
            {/* Panggil fungsi renderHeader untuk menampilkan header yang benar secara otomatis */}
            {renderHeader()}

            {/* Konten halaman akan dirender di sini oleh <Outlet /> */}
            <div className="w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;