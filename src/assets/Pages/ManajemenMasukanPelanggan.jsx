import React, { useState, useEffect } from 'react';
import { Mail, XCircle, CheckCircle, Clock, Send } from 'lucide-react'; // Menambahkan ikon Send

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

// Custom message/confirmation box (replacing alert/confirm)
const displayMessageBox = (message, type = 'alert', onConfirm = null) => {
  const messageBox = document.createElement('div');
  messageBox.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
  messageBox.innerHTML = `
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 text-center">
      <p class="text-lg text-gray-800 mb-4">${message}</p>
      <div class="flex justify-center space-x-4">
        ${type === 'confirm' ? `<button id="cancelMessageBox" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">Batal</button>` : ''}
        <button id="okMessageBox" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">OK</button>
      </div>
    </div>
  `;
  document.body.appendChild(messageBox);

  document.getElementById('okMessageBox').onclick = () => {
    document.body.removeChild(messageBox);
    if (type === 'confirm' && onConfirm) {
      onConfirm();
    }
  };

  if (type === 'confirm') {
    document.getElementById('cancelMessageBox').onclick = () => {
      document.body.removeChild(messageBox);
    };
  }
};


const initialFeedback = [
  {
    id: 1,
    name: 'Ayu Wulandari',
    email: 'ayu@example.com',
    message: 'Tolong sediakan lebih banyak produk organik.',
    status: 'Belum dibaca',
  },
  {
    id: 2,
    name: 'Dimas Rahman',
    email: 'dimas@example.com',
    message: 'Pelayanan kasir sangat ramah, terima kasih!',
    status: 'Diproses',
  },
  {
    id: 3,
    name: 'Bambang Sudiro',
    email: 'bambang@example.com',
    message: 'Harga produk di aplikasi seringkali tidak update.',
    status: 'Belum dibaca',
  },
  {
    id: 4,
    name: 'Citra Kirana',
    email: 'citra@example.com',
    message: 'Aplikasi sering crash saat pembayaran.',
    status: 'Selesai',
  },
];

const statusColors = {
  'Belum dibaca': { bg: lightRed, text: darkerRed, border: primaryRed, icon: <Clock size={16} /> },
  'Diproses': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: accentYellow, icon: <Mail size={16} /> },
  'Selesai': { bg: 'bg-green-100', text: 'text-green-800', border: accentGreen, icon: <CheckCircle size={16} /> },
};


export default function CustomerFeedbackManager() {
  const [feedbackList, setFeedbackList] = useState(initialFeedback);
  const [replyContent, setReplyContent] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Sort feedback: Belum dibaca di atas
  const sortedFeedback = [...feedbackList].sort((a, b) => {
    const statusPriority = {
      'Belum dibaca': 0,
      'Diproses': 1,
      'Selesai': 2,
    };
    return statusPriority[a.status] - statusPriority[b.status];
  });

  const updateStatus = (id, newStatus) => {
    setFeedbackList(
      feedbackList.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleReply = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyContent('');
  };

  const sendReply = () => {
    if (selectedFeedback && replyContent.trim()) {
      displayMessageBox(`Email terkirim ke ${selectedFeedback.email}\n\nIsi: ${replyContent}`);
      updateStatus(selectedFeedback.id, 'Selesai'); // Otomatis ubah status menjadi Selesai setelah dibalas
      setReplyContent('');
      setSelectedFeedback(null);
    } else {
      displayMessageBox("Pesan balasan tidak boleh kosong.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="flex justify-between items-center px-6 py-4 mb-8 bg-white text-gray-800 rounded-xl shadow-lg border-b-4" style={{ borderColor: primaryRed }}>
        <h1 className="text-3xl font-extrabold tracking-wide" style={{ color: primaryRed }}>
          Manajemen Masukan Pelanggan
        </h1>
      </div>

      <div className="space-y-6">
        {sortedFeedback.map((item) => (
          <div
            key={item.id}
            className="w-full bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-l-4"
            style={{ borderColor: statusColors[item.status].border }} // Border kiri sesuai status
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{item.name}</h2>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status].bg} ${statusColors[item.status].text}`}>
                  {statusColors[item.status].icon}
                  <span className="ml-1">{item.status}</span>
                </span>
                <select
                  className={`border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none`}
                  value={item.status}
                  onChange={(e) => updateStatus(item.id, e.target.value)}
                >
                  <option value="Belum dibaca">Belum dibaca</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>
            <p className="text-sm text-gray-500 italic mb-2">{item.email}</p>
            <p className="text-gray-900 mb-4 text-base md:text-lg leading-relaxed">{item.message}</p>
            
            <div className="mt-4 flex justify-end"> {/* Pindah ke kanan */}
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white shadow-md transition-colors"
                style={{ backgroundColor: primaryRed }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = darkerRed}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryRed}
                onClick={() => handleReply(item)}
              >
                <Mail className="w-5 h-5" /> Balas via Email
              </button>
            </div>
          </div>
        ))}

        {selectedFeedback && (
          <div className="mt-12 p-8 rounded-xl shadow-xl bg-white border-b-4" style={{ borderColor: primaryRed }}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ color: darkerRed }}>
                  Balas untuk: <span style={{ color: primaryRed }}>{selectedFeedback.name}</span>
                </h2>
                <button onClick={() => setSelectedFeedback(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <XCircle size={24} />
                </button>
            </div>
            <p className="text-sm text-gray-600 italic mb-4">Email: {selectedFeedback.email}</p>
            <textarea
              placeholder="Tulis balasan email di sini..."
              className="w-full min-h-[150px] border border-gray-300 rounded-lg p-4 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex justify-end gap-4 mt-5">
              <button
                onClick={sendReply}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-colors"
                style={{ backgroundColor: primaryRed }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = darkerRed}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = primaryRed}
              >
                <Send className="w-5 h-5" /> Kirim Balasan
              </button>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
