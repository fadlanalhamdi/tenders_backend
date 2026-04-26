import React, { useState } from "react";
import { Plus, Trash2, Edit3, Award } from "lucide-react";

const LoyaltyManagementPage = () => {
  // --- Theme Colors ---
  const primaryRed = '#B82329'; // Main red color for theme
  const goldColor = '#DAA520';
  const silverColor = '#C0C0C0';
  const classicColor = '#CD7F32'; // Color for Classic membership

  // --- Membership Levels Definition ---
  const [membershipLevels, setMembershipLevels] = useState([
    {
      id: 1,
      level: 'Classic',
      criteria: 'Mendaftar sebagai member.',
      points: '1 poin untuk setiap Rp 50.000',
      benefits: [
        'Kartu Member Digital/Fisik',
        'Akses ke promo khusus',
        'Informasi produk baru',
      ],
      color: classicColor,
      count: 25, // Jumlah anggota di level ini
    },
    {
      id: 2,
      level: 'Silver',
      criteria: 'Belanja Rp 2.500.000 dalam 3 bulan atau 50 poin.',
      points: '1 poin untuk setiap Rp 40.000',
      benefits: [
        'Semua manfaat Classic Member',
        'Diskon tambahan',
        'Voucher ulang tahun',
      ],
      color: silverColor,
      count: 15,
    },
    {
      id: 3,
      level: 'Gold',
      criteria: 'Belanja Rp 7.000.000 dalam 3 bulan atau 150 poin.',
      points: '1 poin untuk setiap Rp 30.000',
      benefits: [
        'Semua manfaat Silver Member',
        'Diskon khusus',
        'Undangan acara eksklusif',
      ],
      color: goldColor,
      count: 10,
    },
    {
      id: 4,
      level: 'Platinum',
      criteria: 'Belanja Rp 15.000.000 dalam 3 bulan atau 300 poin.',
      points: '2 poin untuk setiap Rp 30.000',
      benefits: [
        'Semua manfaat Gold Member',
        'Gratis biaya pengiriman',
        'Hadiah kejutan',
      ],
      color: primaryRed,
      count: 5,
    },
  ]);

  const [editingLevel, setEditingLevel] = useState(null);

  const handleEdit = (level) => {
    setEditingLevel(level);
  };

  const handleDelete = (id) => {
    setMembershipLevels(membershipLevels.filter(level => level.id !== id));
  };

  const handleSaveEdit = () => {
    // Logika untuk menyimpan perubahan level keanggotaan
    setEditingLevel(null);
  };

  return (
    <main className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8 bg-white text-gray-800 rounded-xl shadow-lg border-b-4 border-[#B82329] p-6">
        <h2 className="text-3xl font-extrabold tracking-wide">Loyalty Management</h2>
        <button className="px-4 py-2 bg-[#B82329] text-white rounded-lg hover:bg-[#DAA520] transition duration-300">
          <Plus className="inline mr-2" /> Tambah Level
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {membershipLevels.map((level) => (
          <div key={level.id} className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 duration-300">
            <div className="flex items-center mb-4">
              <Award className="w-8 h-8" style={{ color: level.color }} />
              <h3 className="text-xl font-semibold text-gray-800">{level.level} Member</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{level.criteria}</p>
            <p className="font-bold text-gray-700 mb-4">{level.points}</p>
            <h4 className="font-bold text-gray-700">Manfaat:</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
              {level.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Total Anggota: <span className="font-bold">{level.count}</span></span>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => handleEdit(level)} className="flex items-center px-3 py-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300">
                <Edit3 size={16} className="mr-1" /> Edit
              </button>
              <button onClick={() => handleDelete(level.id)} className="flex items-center px-3 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300">
                <Trash2 size={16} className="mr-1" /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingLevel && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4" style={{ color: primaryRed }}>
              Edit {editingLevel.level} Member
            </h2>
            <div className="space-y-3">
              <input
                className="w-full border p-2 rounded-lg"
                placeholder="Kriteria"
                value={editingLevel.criteria}
                onChange={(e) => setEditingLevel({ ...editingLevel, criteria: e.target.value })}
              />
              <input
                className="w-full border p-2 rounded-lg"
                placeholder="Poin"
                value={editingLevel.points}
                onChange={(e) => setEditingLevel({ ...editingLevel, points: e.target.value })}
              />
              <textarea
                className="w-full border p-2 rounded-lg"
                placeholder="Manfaat (pisahkan dengan koma)"
                value={editingLevel.benefits.join(', ')}
                onChange={(e) => setEditingLevel({ ...editingLevel, benefits: e.target.value.split(', ') })}
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setEditingLevel(null)}
                className="px-4 py-2 bg-gray-300 text-sm rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-white text-sm rounded-lg hover:brightness-90"
                style={{ backgroundColor: primaryRed }} // Save button to red
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LoyaltyManagementPage;
