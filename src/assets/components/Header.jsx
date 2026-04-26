// src/assets/components/Header.jsx
import React, { useState } from 'react';
import { ChevronDown, Globe, User, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const [selectedCountry, setSelectedCountry] = useState('IND');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState('Jl Yasudars - Rumbai');
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);

  // --- Logika untuk Admin/Customer ---
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulasi: user sedang login
  const [userRole, setUserRole] = useState('admin'); // Simulasi: role user (bisa 'admin' atau 'customer')
  // --- Akhir Logika untuk Admin/Customer ---

  // Daftar negara
  const countries = [
    { code: 'IND', name: 'Indonesia' },
    { code: 'MYS', name: 'Malaysia' },
    { code: 'SGP', name: 'Singapura' },
    { code: 'THA', name: 'Thailand' },
  ];

  // Daftar alamat (4 opsi)
  const addresses = [
    'Jl Yasudars - Rumbai',
    'Jl Sudirman No. 123 - Pekanbaru',
    'Jl HR Subrantas Km. 12 - Panam',
    'Jl Soekarno Hatta No. 45 - Arengka',
  ];

  const getPageName = (pathname) => {
    const pathSegments = pathname.substring(1).split('/');
    if (pathname === '/') {
        return 'Promosi'; // Default untuk halaman root
    }

    // Handle specific paths for display names
    if (pathname === '/laporan-penjualan') return 'Laporan Penjualan';
    if (pathname === '/profile') return 'Profil Pengguna'; // Tambahkan ini

    const name = pathSegments[0].replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return name;
  };

  const currentPage = getPageName(location.pathname);

  // Close all dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCountryDropdownOpen && !event.target.closest('.country-dropdown')) {
        setIsCountryDropdownOpen(false);
      }
      if (isAddressDropdownOpen && !event.target.closest('.address-dropdown')) {
        setIsAddressDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryDropdownOpen, isAddressDropdownOpen]);

  // Fungsi untuk navigasi ke halaman profil
  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-[#B82329] text-white py-2 px-6 flex justify-between items-center text-sm sticky top-0 w-full z-50 shadow-md">
      {/* Sisi Kiri Header */}
      <div className="flex items-center gap-4">
        {/* Dropdown Negara (IND) */}
        <div className="relative country-dropdown">
          <div
            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity pr-4 border-r border-white border-opacity-30"
            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
          >
            <Globe className="w-4 h-4" />
            <span>{selectedCountry}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          {isCountryDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-md shadow-lg min-w-[120px] z-10">
              {countries.map((country) => (
                <div
                  key={country.code}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedCountry(country.code);
                    setIsCountryDropdownOpen(false);
                  }}
                >
                  {country.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nama Halaman Aktif */}
        <div className="font-semibold text-base ml-2">
          {currentPage}
        </div>
      </div>

      {/* Sisi Kanan Header */}
      <div className="flex items-center gap-6">
        {/* Dropdown Alamat */}
        <div className="relative address-dropdown">
          <div
            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity pr-4 border-r border-white border-opacity-30"
            onClick={() => setIsAddressDropdownOpen(!isAddressDropdownOpen)}
          >
            <MapPin className="w-4 h-4" />
            <span className="truncate max-w-[150px]">{selectedAddress}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isAddressDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          {isAddressDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white text-gray-800 rounded-md shadow-lg min-w-[250px] z-10">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedAddress(address);
                    setIsAddressDropdownOpen(false);
                  }}
                >
                  {address}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logika Tampilan Admin/Customer */}
        {isLoggedIn ? (
          userRole === 'admin' ? (
            // Tampilan untuk Admin
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleProfileClick} // Ubah ini untuk navigasi ke profil
            >
              <span>Admin</span>
              <User className="w-6 h-6 p-1 rounded-full bg-white text-[#B82329]" />
            </div>
          ) : (
            // Tampilan untuk Customer (atau role lain yang bukan admin)
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleProfileClick} // Ubah ini untuk navigasi ke profil
            >
              <span>{/* Anda bisa menampilkan nama user di sini jika ada */}Halo, Pengguna!</span>
              <User className="w-6 h-6 p-1 rounded-full bg-white text-[#B82329]" />
            </div>
          )
        ) : (
          // Tampilan jika belum login (misalnya tombol Sign In)
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/signin')} // Asumsi ada rute /signin
          >
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;