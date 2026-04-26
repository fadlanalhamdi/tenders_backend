import React, { useState } from 'react';
import { Search, Filter, Plus, User, Bell, ArrowUp, ArrowDown, Sparkles, Copy } from 'lucide-react';

// Helper function for status badge classes
const getStatusClasses = (status) => {
  switch (status) {
    case 'Baru':
      return 'bg-blue-100 text-blue-800';
    case 'Belum Dihubungi':
      return 'bg-yellow-100 text-yellow-800';
    case 'Follow-up':
      return 'bg-green-100 text-green-800';
    case 'Tidak Tertarik':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Component for the Lead Management Page
const ManajemenLeadPage = () => {
  // Dummy data for leads
  const initialLeads = [
    {
      id: 'L001',
      name: 'Budi Santoso',
      email: 'budi.santoso@example.com',
      phone: '081234567890',
      source: 'Webinar Sukses Investasi',
      regDate: '2024-05-28',
      status: 'Baru',
      notes: 'Tertarik dengan produk investasi jangka panjang.',
    },
    {
      id: 'L002',
      name: 'Siti Aminah',
      email: 'siti.aminah@example.com',
      phone: '081298765432',
      source: 'Pameran Properti 2024',
      regDate: '2024-05-29',
      status: 'Belum Dihubungi',
      notes: 'Mencari rumah pertama di area suburban.',
    },
    {
      id: 'L003',
      name: 'Joko Susanto',
      email: 'joko.s@example.com',
      phone: '087811223344',
      source: 'Formulir Website',
      regDate: '2024-05-30',
      status: 'Follow-up',
      notes: 'Sudah dihubungi, dijadwalkan demo produk.',
    },
    {
      id: 'L004',
      name: 'Mariawati Dewi',
      email: 'maria.d@example.com',
      phone: '085677889900',
      source: 'Event Pelatihan Digital Marketing',
      regDate: '2024-06-01',
      status: 'Tidak Tertarik',
      notes: 'Tidak jadi melanjutkan karena anggaran terbatas.',
    },
    {
      id: 'L005',
      name: 'Ahmad Faisal',
      email: 'ahmad.f@example.com',
      phone: '081122334455',
      source: 'Webinar Sukses Investasi',
      regDate: '2024-06-02',
      status: 'Baru',
      notes: 'Tertarik dengan saham blue-chip.',
    },
    {
      id: 'L006',
      name: 'Putri Lestari',
      email: 'putri.l@example.com',
      phone: '087766554433',
      source: 'Formulir Website',
      regDate: '2024-06-03',
      status: 'Belum Dihubungi',
      notes: 'Bertanya tentang layanan cloud storage.',
    },
  ];

  const [leads, setLeads] = useState(initialLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetailModal, setShowLeadDetailModal] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState(''); // State for generated message
  const [isGenerating, setIsGenerating] = useState(false); // State for loading indicator

  // Filter state
  const [filterSource, setFilterSource] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Calculate metrics
  const totalLeads = leads.length;
  const leadsThisWeek = leads.filter(lead => {
    const today = new Date();
    const leadDate = new Date(lead.regDate);
    const diffTime = Math.abs(today - leadDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;
  const topLeadSource = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});
  const mostFrequentSource = Object.keys(topLeadSource).sort((a, b) => topLeadSource[b] - topLeadSource[a])[0] || 'N/A';
  const uncontactedLeads = leads.filter(lead => lead.status === 'Baru' || lead.status === 'Belum Dihubungi').length;

  // Filtered leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === '' || lead.source === filterSource;
    const matchesStatus = filterStatus === '' || lead.status === filterStatus;
    return matchesSearch && matchesSource && matchesStatus;
  });

  // Handle opening lead detail
  const handleViewLeadDetail = (lead) => {
    setSelectedLead(lead);
    setGeneratedMessage(''); // Clear previous message when opening new detail
    setShowLeadDetailModal(true);
  };

  // Handle adding new lead (placeholder)
  const handleAddNewLead = () => {
    // In a real app, this would open a form to add a new lead
    // Using a custom message box instead of alert()
    displayMessageBox('Fungsionalitas "Tambah Lead Baru" akan ditambahkan di sini.');
  };

  // Handle saving filter (placeholder)
  const applyFilters = () => {
    setShowFilterModal(false);
    // Filtering logic is already applied in filteredLeads state
  };

  // Function to display a custom message box (instead of alert)
  const displayMessageBox = (message) => {
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
    messageBox.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 text-center">
        <p class="text-lg text-gray-800 mb-4">${message}</p>
        <button id="closeMessageBox" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">OK</button>
      </div>
    `;
    document.body.appendChild(messageBox);
    document.getElementById('closeMessageBox').onclick = () => {
      document.body.removeChild(messageBox);
    };
  };

  // Function to call Gemini API and generate message
  const generateFollowUpMessage = async () => {
    if (!selectedLead) return;

    setIsGenerating(true);
    setGeneratedMessage('Sedang membuat draft pesan...');

    const prompt = `Buatkan draft pesan tindak lanjut yang profesional untuk calon pelanggan baru. Lead ini bernama ${selectedLead.name} (${selectedLead.email}, ${selectedLead.phone}), didapatkan dari sumber "${selectedLead.source}" pada tanggal ${selectedLead.regDate}. Status lead saat ini adalah "${selectedLead.status}". Catatan internal: "${selectedLead.notes}".

    Isi pesan harus:
    1. Menyapa lead dengan nama.
    2. Mengingatkan mereka dari mana kita mendapatkan kontak mereka (sumber lead).
    3. Merujuk pada ketertarikan mereka (jika ada di catatan).
    4. Menawarkan langkah selanjutnya (misalnya, demo produk, diskusi lebih lanjut).
    5. Bersikap sopan dan profesional.
    `;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    const apiKey = ""; // Canvas will provide this at runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setGeneratedMessage(text);
      } else {
        setGeneratedMessage('Gagal membuat draft pesan. Silakan coba lagi.');
        console.error('Gemini API response structure unexpected:', result);
      }
    } catch (error) {
      setGeneratedMessage('Terjadi kesalahan saat menghubungi API. Silakan coba lagi.');
      console.error('Error calling Gemini API:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    // Using document.execCommand('copy') as navigator.clipboard.writeText() might not work in iFrames
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      displayMessageBox('Draft pesan berhasil disalin ke clipboard!');
    } catch (err) {
      displayMessageBox('Gagal menyalin pesan.');
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textarea);
  };

  return (
    <main className="pt-8 px-0"> {/* Perubahan utama di sini: p-6 md:p-8 lg:p-10 dihilangkan, diganti dengan px-0 */}
      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-6 md:px-8 lg:px-10"> {/* Padding ditambahkan di dalam */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transform transition-transform hover:scale-105">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Lead Baru</h3>
          <p className="text-3xl font-bold text-blue-700">{totalLeads}</p>
          <span className="text-xs text-gray-400 mt-2">Sejak awal</span>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transform transition-transform hover:scale-105">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Lead Minggu Ini</h3>
          <p className="text-3xl font-bold text-green-600">{leadsThisWeek}</p>
          <div className="flex items-center text-xs text-green-500 mt-2">
            <ArrowUp size={14} />
            <span>+{(leadsThisWeek / totalLeads * 100).toFixed(0)}% dari total</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transform transition-transform hover:scale-105">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Sumber Lead Teratas</h3>
          <p className="text-2xl font-bold text-purple-700">{mostFrequentSource}</p>
          <span className="text-xs text-gray-400 mt-2">Paling banyak datang dari</span>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transform transition-transform hover:scale-105">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Lead Belum Dihubungi</h3>
          <p className="text-3xl font-bold text-red-600">{uncontactedLeads}</p>
          <span className="text-xs text-gray-400 mt-2">Segera tindak lanjuti!</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 mx-6 md:mx-8 lg:mx-10"> {/* Margin horizontal ditambahkan */}
        <div className="relative w-full md:w-1/2">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari Nama, Email, atau ID Lead..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex w-full md:w-auto space-x-2 justify-end">
          <button
            onClick={() => setShowFilterModal(true)}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
          >
            <Filter size={18} className="mr-2" />
            Filter
          </button>
          <button
            onClick={handleAddNewLead}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus size={18} className="mr-2" />
            Tambah Lead Baru
          </button>
        </div>
      </div>

      {/* Lead Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mx-6 md:mx-8 lg:mx-10"> {/* Margin horizontal ditambahkan */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Telepon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sumber Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Registrasi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Lead</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => handleViewLeadDetail(lead)}>
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.source}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{lead.regDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        lead.status === 'Baru' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'Belum Dihubungi' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'Follow-up' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewLeadDetail(lead)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">Tidak ada lead yang ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="p-4 flex justify-between items-center border-t border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-700">Menampilkan 1 sampai {filteredLeads.length} dari {filteredLeads.length} hasil</span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">Sebelumnya</button>
            <button className="px-3 py-1 border border-blue-500 bg-blue-500 text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">Selanjutnya</button>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all scale-100 opacity-100">
            <h2 className="text-xl font-bold mb-4">Filter Lead</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="filterSource" className="block text-sm font-medium text-gray-700 mb-1">Sumber Lead</label>
                <select
                  id="filterSource"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                >
                  <option value="">Semua Sumber</option>
                  <option value="Webinar Sukses Investasi">Webinar Sukses Investasi</option>
                  <option value="Pameran Properti 2024">Pameran Properti 2024</option>
                  <option value="Formulir Website">Formulir Website</option>
                  <option value="Event Pelatihan Digital Marketing">Event Pelatihan Digital Marketing</option>
                </select>
              </div>
              <div>
                <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">Status Lead</label>
                <select
                  id="filterStatus"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Semua Status</option>
                  <option value="Baru">Baru</option>
                  <option value="Belum Dihubungi">Belum Dihubungi</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Tidak Tertarik">Tidak Tertarik</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {showLeadDetailModal && selectedLead && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 transform transition-all scale-100 opacity-100">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Detail Lead: {selectedLead.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500">ID Lead</p>
                <p className="text-lg text-gray-900">{selectedLead.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                <p className="text-lg text-gray-900">{selectedLead.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg text-gray-900">{selectedLead.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nomor Telepon</p>
                <p className="text-lg text-gray-900">{selectedLead.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sumber Lead</p>
                <p className="text-lg text-gray-900">{selectedLead.source}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tanggal Registrasi</p>
                <p className="text-lg text-gray-900">{selectedLead.regDate}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Status Lead</p>
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                          selectedLead.status === 'Baru' ? 'bg-blue-100 text-blue-800' :
                          selectedLead.status === 'Belum Dihubungi' ? 'bg-yellow-100 text-yellow-800' :
                          selectedLead.status === 'Follow-up' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                  {selectedLead.status}
                </span>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Catatan</p>
                <p className="text-gray-900 leading-relaxed bg-gray-50 p-3 rounded-md border border-gray-200">{selectedLead.notes}</p>
              </div>
            </div>

            {/* Gemini API Feature: Generate Follow-up Message */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-bold mb-3 text-blue-700 flex items-center">
                <Sparkles size={20} className="mr-2 text-yellow-500" />
                Draft Pesan Tindak Lanjut
              </h3>
              <button
                onClick={generateFollowUpMessage}
                disabled={isGenerating}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors shadow-md ${
                  isGenerating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Membuat Draft...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="mr-2" />
                    Buat Draft Pesan
                  </>
                )}
              </button>
              {generatedMessage && (
                <div className="mt-4 bg-gray-50 p-3 rounded-md border border-gray-200 relative">
                  <textarea
                    readOnly
                    value={generatedMessage}
                    className="w-full h-32 p-2 border-none resize-none focus:outline-none bg-transparent text-gray-800"
                  ></textarea>
                  <button
                    onClick={() => copyToClipboard(generatedMessage)}
                    className="absolute top-2 right-2 p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                    title="Salin ke Clipboard"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowLeadDetailModal(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => displayMessageBox('Fungsionalitas "Edit Lead" akan ditambahkan di sini.')}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ManajemenLeadPage;
