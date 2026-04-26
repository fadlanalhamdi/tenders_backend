import { useState } from "react";
import { Send, CheckCircle, User, MessageSquareText } from 'lucide-react'; // Menggunakan ikon Lucide

export default function ComplaintForm({ onSubmit }) {
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi pengiriman data
    console.log("Formulir disubmit:", formData);
    if (onSubmit) {
      onSubmit(formData);
    }
    setSubmitted(true);
    setFormData({ name: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    // Kontainer utama formulir dengan background gradient, bayangan mendalam, dan border yang elegan
    // Menambahkan efek subtle parallax dan tilt pada hover
    // Menyesuaikan margin dan padding untuk kepadatan yang lebih baik
    <div className="max-w-2xl mx-auto my-8 p-8 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-3xl border border-blue-100 transform transition-all duration-500 hover:shadow-4xl hover:-translate-y-1 hover:rotate-z-0.5">
      {/* Mengurangi ukuran teks judul agar pas 1 baris, dan menyesuaikan margin */}
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900 text-center tracking-tight leading-tight">
        Sampaikan Keluhan & Masukan Anda
        {/* Mengurangi margin atas untuk mendekatkan garis ke judul */}
        <span className="block w-32 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-3 rounded-full"></span> 
      </h1>

      {submitted && (
        // Notifikasi sukses yang lebih menarik dengan animasi dan ikon
        // Mengurangi padding dan margin
        <div className="flex items-center justify-center p-4 mb-6 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-xl shadow-lg border border-green-300 animate-slide-in-top">
          <CheckCircle size={28} className="mr-4 text-green-600 animate-bounce-scale" />
          <span className="font-bold text-lg leading-tight">Terima kasih banyak! <br/> Keluhan/masukan Anda sudah kami terima.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6"> {/* Mengurangi spasi antar elemen formulir */}
        <div>
          <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-1.5"> {/* Mengurangi margin bawah label */}
            Nama Lengkap Anda
          </label>
          <div className="relative">
            <User size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="name"
              required
              placeholder="Contoh: Budi Santoso"
              className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 outline-none text-gray-800 placeholder-gray-500 text-lg shadow-inner hover:border-gray-400 font-medium" // Mengurangi padding vertikal
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-base font-semibold text-gray-700 mb-1.5"> {/* Mengurangi margin bawah label */}
            Keluhan / Masukan Anda
          </label>
          <div className="relative">
            <MessageSquareText size={22} className="absolute left-4 top-4 text-gray-400" />
            <textarea
              id="message"
              required
              placeholder="Sampaikan keluhan atau masukan Anda di sini secara detail dan jelas..."
              className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 outline-none resize-y text-gray-800 placeholder-gray-500 text-lg shadow-inner hover:border-gray-400 font-medium" // Mengurangi padding vertikal
              rows="7" // Mengurangi tinggi default textarea sedikit
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-extrabold text-xl rounded-xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 transition-all duration-400 transform hover:scale-102 active:scale-98 active:bg-blue-800 tracking-wider group relative overflow-hidden" // Mengurangi padding vertikal tombol
        >
          {/* Efek visual tambahan untuk tombol */}
          <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center">
            <Send size={28} className="mr-3 transform group-hover:translate-x-1 transition-transform duration-300" />
            Kirim Keluhan Anda
          </span>
        </button>
      </form>
      {/* Tambahan styling untuk keyframes animasi yang lebih kompleks */}
      <style>
        {`
          /* Custom CSS for a very subtle 3D hover effect (rotate-z-0.5) */
          .rotate-z-0\\.5:hover {
            transform: translateY(-4px) rotateZ(0.5deg) translateZ(10px); /* Subtle Z-axis move and rotation */
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* Deeper shadow */
          }
          
          .shadow-3xl {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          .hover\\:shadow-4xl:hover {
            box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.35);
          }

          @keyframes slideInTop {
            from {
              opacity: 0;
              transform: translateY(-50px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes bounceScale {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }

          .animate-slide-in-top {
            animation: slideInTop 0.6s ease-out forwards;
          }

          .animate-bounce-scale {
            animation: bounceScale 1s infinite alternate;
          }
        `}
      </style>
    </div>
  );
}
