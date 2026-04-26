// src/pages/ProfilePage.jsx (Versi Final yang Bersih dan Lengkap)

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, History, Settings, LogOut, Edit, Trash2, PlusCircle, Bell, Mail, MessageSquare, X, AlertTriangle } from 'lucide-react';

// --- DATA DUMMY & FUNGSI HELPER ---
const initialUserData = {
  name: 'Suci Sucipto',
  email: 'suci@email.com',
  tel: '081234564234',
  avatarUrl: 'https://i.pravatar.cc/150?u=suci',
  stats: { points: 1, transactions: 17, spending: 150000, level: 'Classic' },
};
const initialUserAddresses = [
  { id: 1, label: "Rumah", recipient: "Suci Sucipto", phone: "081234564234", fullAddress: "Gg. Intisari, Umbansari - Rumbai, Pekanbaru, 28265", isPrimary: true },
  { id: 2, label: "Kantor", recipient: "Suci (Work)", phone: "081234567890", fullAddress: "Jl. Jend. Sudirman No. 123, Pusat Kota, Pekanbaru, 28111", isPrimary: false },
];
const formatCurrency = (amount) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(amount) || 0);

// ====================================================================
// === DEFINISI SEMUA KOMPONEN KECIL (SUB-KOMPONEN) DI SINI DULU ===
// ====================================================================

// Komponen Modal untuk Form Alamat
const AddressFormModal = ({ isOpen, onClose, onSave, address }) => {
    const [formData, setFormData] = useState({});
    useEffect(() => { setFormData(address ? { ...address } : { id: null, label: '', recipient: '', phone: '', fullAddress: '', isPrimary: false }); }, [address, isOpen]);
    const handleChange = (e) => { const { name, value, type, checked } = e.target; setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value })); };
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fade-in-up">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-5 border-b"><h3 className="text-xl font-bold text-gray-900">{address ? 'Edit Alamat' : 'Tambah Alamat Baru'}</h3><button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={20}/></button></div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div><label className="block text-sm font-medium text-gray-700">Label Alamat</label><input type="text" name="label" value={formData.label || ''} onChange={handleChange} placeholder="Contoh: Rumah, Kantor" className="mt-1 w-full p-2 border rounded-md" required/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Nama Penerima</label><input type="text" name="recipient" value={formData.recipient || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Nomor Telepon</label><input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" required/></div>
                        <div><label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label><textarea name="fullAddress" value={formData.fullAddress || ''} onChange={handleChange} rows="3" className="mt-1 w-full p-2 border rounded-md" required/></div>
                        <div className="flex items-center"><input type="checkbox" name="isPrimary" id="isPrimary" checked={formData.isPrimary || false} onChange={handleChange} className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"/><label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-900">Jadikan alamat utama</label></div>
                    </div>
                    <div className="p-5 border-t bg-gray-50 flex justify-end"><button type="submit" className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Simpan</button></div>
                </form>
            </div>
        </div>
    );
};

// Komponen Modal untuk Konfirmasi Hapus
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, addressLabel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center animate-fade-in-up">
                <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-900">Hapus Alamat?</h3>
                <p className="text-gray-600 text-sm mt-2 mb-6">Apakah Anda yakin ingin menghapus alamat <span className="font-bold">{addressLabel}</span>? Aksi ini tidak dapat dibatalkan.</p>
                <div className="flex gap-4 justify-center">
                    <button onClick={onClose} className="px-8 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Batal</button>
                    <button onClick={onConfirm} className="px-8 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Ya, Hapus</button>
                </div>
            </div>
        </div>
    );
};

// Komponen Toggle Switch
const ToggleSwitch = ({ label, description, icon: Icon, enabled, setEnabled }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
        <div className="flex items-center gap-4"><Icon className="text-gray-500" size={24} /><div><p className="font-semibold text-gray-800">{label}</p><p className="text-sm text-gray-500">{description}</p></div></div>
        <button onClick={() => setEnabled(!enabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-red-600' : 'bg-gray-200'}`}><span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}/></button>
    </div>
);

// Komponen Sidebar Navigasi
const ProfileSidebar = ({ activeSection, setActiveSection }) => {
    const navItems = [
        { id: 'profil', label: 'Edit Profil', icon: User }, { id: 'alamat', label: 'Alamat Saya', icon: MapPin },
        { id: 'riwayat', label: 'Riwayat Pesanan', icon: History }, { id: 'pengaturan', label: 'Pengaturan Akun', icon: Settings },
        { id: 'logout', label: 'Keluar', icon: LogOut, isDanger: true },
    ];
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg h-full">
            <div className="flex flex-col items-center text-center mb-8"><div className="relative mb-4"><img src={initialUserData.avatarUrl} alt="User Avatar" className="w-28 h-28 rounded-full border-4 border-white shadow-lg"/><button className="absolute -bottom-1 -right-1 bg-red-600 text-white p-2 rounded-full border-2 border-white hover:bg-red-700 transition-transform hover:scale-110"><Edit size={16} /></button></div><h2 className="text-2xl font-bold text-gray-800">{initialUserData.name}</h2><p className="text-sm text-gray-500">{initialUserData.email}</p></div>
            <nav className="space-y-2">{navItems.map((item) => (<Link key={item.id} to={item.id === 'riwayat' ? '/riwayat-pesanan' : '#'} onClick={(e) => { if (item.id !== 'riwayat') { e.preventDefault(); setActiveSection(item.id); } }} className={`flex items-center gap-4 px-4 py-3 rounded-lg text-base font-semibold transition-colors ${activeSection === item.id ? 'bg-red-50 text-red-700' : item.isDanger ? 'text-red-600 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}><item.icon size={20} /><span>{item.label}</span></Link>))}
            </nav>
        </div>
    );
};

// Komponen Konten di Sebelah Kanan
const ProfileContent = ({ activeSection, addresses, onOpenAddressModal, onSetAddressToDelete, onSetPrimary }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [settings, setSettings] = useState({ promoEmail: true, orderStatus: true, news: false });
    const handleLogout = () => { logout(); navigate('/signin'); };

    switch (activeSection) {
      case 'alamat': return (<div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in"><div className="flex flex-wrap justify-between items-center border-b pb-4 mb-6 gap-4"><h2 className="text-2xl font-bold text-gray-800">Alamat Saya</h2><button onClick={() => onOpenAddressModal()} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"><PlusCircle size={18}/> Tambah Alamat Baru</button></div><div className="space-y-5">{addresses.map(addr => (<div key={addr.id} className={`p-5 border-2 rounded-lg transition-all ${addr.isPrimary ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}><div className="flex justify-between items-start"><div className="flex items-center gap-3"><h4 className="font-bold text-lg text-gray-800">{addr.label}</h4>{addr.isPrimary && <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">Utama</span>}</div><div className="flex gap-2"><button onClick={() => onOpenAddressModal(addr)} title="Edit" className="p-2 text-gray-500 hover:text-blue-600"><Edit size={16} /></button><button onClick={() => onSetAddressToDelete(addr)} title="Hapus" className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={16} /></button></div></div><div className="mt-4 text-sm"><p className="font-semibold text-gray-700">{addr.recipient} ({addr.phone})</p><p className="text-gray-600 mt-1">{addr.fullAddress}</p></div>{!addr.isPrimary && (<div className="mt-4 border-t pt-3"><button onClick={() => onSetPrimary(addr.id)} className="text-sm font-semibold text-red-600 hover:underline">Jadikan Alamat Utama</button></div>)}</div>))}</div></div>);
      case 'pengaturan': return (<div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in"><h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Pengaturan Akun & Notifikasi</h2><div className="space-y-4"><ToggleSwitch label="Notifikasi Promo" description="Terima info promo & diskon terbaru via Email" icon={Mail} enabled={settings.promoEmail} setEnabled={(val) => setSettings({...settings, promoEmail: val})} /><ToggleSwitch label="Notifikasi Status Pesanan" description="Dapatkan update saat status pesananmu berubah" icon={MessageSquare} enabled={settings.orderStatus} setEnabled={(val) => setSettings({...settings, orderStatus: val})} /><ToggleSwitch label="Newsletter Mingguan" description="Berlangganan berita & artikel menarik dari kami" icon={Bell} enabled={settings.news} setEnabled={(val) => setSettings({...settings, news: val})} /></div><div className="mt-8 text-right"><button className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg">Simpan Pengaturan</button></div></div>);
      case 'logout': return (<div className="bg-white p-8 rounded-xl shadow-lg text-center h-full flex flex-col justify-center items-center animate-fade-in"><LogOut className="text-red-500 mb-4" size={48} /><h2 className="text-3xl font-bold text-gray-800">Keluar dari Akun</h2><p className="mt-2 text-gray-600 max-w-sm">Apakah Anda yakin ingin mengakhiri sesi Anda?</p><div className="mt-8 flex gap-4"><button onClick={() => alert("Batal Logout")} className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Batal</button><button onClick={handleLogout} className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">Ya, Keluar</button></div></div>);
      default: return (<div className="space-y-8 animate-fade-in"><div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-6 rounded-xl shadow-lg"><div className="flex justify-between items-start mb-4"><div><p className="text-sm opacity-80 tracking-wider">Level Member</p><p className="text-3xl font-bold">{initialUserData.stats.level}</p></div></div><div className="grid grid-cols-3 gap-4 text-center mt-6"><div><p className="text-sm opacity-80">Poin Reward</p><p className="text-xl font-semibold">{initialUserData.stats.points}</p></div><div><p className="text-sm opacity-80">Jml. Transaksi</p><p className="text-xl font-semibold">{initialUserData.stats.transactions}</p></div><div><p className="text-sm opacity-80">Total Pengeluaran</p><p className="text-xl font-semibold">{formatCurrency(initialUserData.stats.spending)}</p></div></div></div><form className="bg-white p-8 rounded-xl shadow-lg"><h3 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">User Settings</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Depan</label><input type="text" defaultValue="Suci" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Belakang</label><input type="text" defaultValue="Sucipto" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" defaultValue={initialUserData.email} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" readOnly/></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label><input type="tel" defaultValue={initialUserData.tel} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"/></div></div><div className="mt-8 text-right"><button type="submit" className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg">Simpan Perubahan</button></div></form></div>);
    }
}


// ===============================================================
// === KOMPONEN UTAMA HALAMAN PROFIL (YANG DI-EXPORT) ===
// ===============================================================
const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('profil');
  
  // State dan fungsi untuk CRUD Alamat dipusatkan di sini
  const [addresses, setAddresses] = useState(initialUserAddresses);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const handleOpenAddressModal = (address = null) => {
    setEditingAddress(address);
    setAddressModalOpen(true);
  };

  const handleSaveAddress = (formData) => {
    let newAddresses = [...addresses];
    if (formData.isPrimary) {
      newAddresses = newAddresses.map(addr => ({ ...addr, isPrimary: false }));
    }
    if (editingAddress) {
      newAddresses = newAddresses.map(addr => addr.id === editingAddress.id ? { ...formData } : addr);
    } else {
      newAddresses.push({ ...formData, id: Date.now() });
    }
    setAddresses(newAddresses);
    setAddressModalOpen(false);
  };
  
  const handleConfirmDelete = () => {
    setAddresses(addresses.filter(addr => addr.id !== addressToDelete.id));
    setAddressToDelete(null);
  };
  
  const handleSetPrimary = (addressId) => {
    setAddresses(addresses.map(addr => ({ ...addr, isPrimary: addr.id === addressId })));
  };

  return (
    <>
      {/* Semua Modal dirender di level atas agar bisa menutupi seluruh layar */}
      <AddressFormModal 
          isOpen={isAddressModalOpen} 
          onClose={() => setAddressModalOpen(false)}
          onSave={handleSaveAddress}
          address={editingAddress}
      />
      <ConfirmDeleteModal 
          isOpen={!!addressToDelete}
          onClose={() => setAddressToDelete(null)}
          onConfirm={handleConfirmDelete}
          addressLabel={addressToDelete?.label}
      />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ProfileSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            </div>
            <div className="lg:col-span-3">
              <ProfileContent 
                activeSection={activeSection}
                addresses={addresses}
                onOpenAddressModal={handleOpenAddressModal}
                onSetAddressToDelete={setAddressToDelete}
                onSetPrimary={handleSetPrimary}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;