// src/assets/pages/ChatPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Send,
  Paperclip,
  Smile,
  Bell,
  Percent,
  ShoppingCart,
  User,
  ArrowLeft,
} from "lucide-react";
// Import data produk lengkap dari file terpisah (pastikan src/data/productsData.js ada dan up-to-date)
import allProductsData from "../data/productsData";

const ChatPage = () => {
  // Pertanyaan yang sudah ditentukan dan jawabannya untuk simulasi AI
  const predefinedQuestions = [
    {
      id: "status",
      text: "Status Pesanan",
      answer:
        "Untuk melacak pesanan Anda, silakan kunjungi halaman Riwayat Pesanan dan masukkan nomor pesanan Anda.",
    },
    {
      id: "promo",
      text: "Promo Terbaru",
      answer:
        "Cek halaman Promo untuk melihat diskon dan penawaran terbaru kami! Kami selalu punya kejutan menarik setiap minggu.",
    },
    {
      id: "return",
      text: "Kebijakan Pengembalian",
      answer:
        "Kami memiliki kebijakan pengembalian dalam 7 hari setelah barang diterima, dengan syarat dan ketentuan berlaku. Silakan lihat bagian FAQ untuk detail lebih lanjut.",
    },
    // Menambahkan pertanyaan spesifik produk dari allProductsData
    {
      id: "product_13",
      text: "Info Popok MamyPoko S40",
      type: "product",
      productId: 13,
    },
    {
      id: "product_1",
      text: "Info Indomie Goreng Jumbo",
      type: "product",
      productId: 1,
    },
    {
      id: "product_5",
      text: "Info Nugget Ayam Fiesta",
      type: "product",
      productId: 5,
    },
    {
      id: "product_2",
      text: "Info Aqua Botol 1500ml",
      type: "product",
      productId: 2,
    }, // Tambahan contoh produk
    {
      id: "product_7",
      text: "Info Beras Cap Ayam Jago",
      type: "product",
      productId: 7,
    }, // Tambahan contoh produk
    {
      id: "product_15",
      text: "Info Shampo Pantene Anti Ketombe",
      type: "product",
      productId: 15,
    }, // Tambahan contoh produk
    {
      id: "other",
      text: "Lain-lain",
      answer:
        "Jika pertanyaan Anda tidak ada dalam daftar ini, silakan ketik pertanyaan Anda secara detail dan kami akan membantu.",
    },
  ];

  // State untuk menyimpan pesan, awalnya kosong
  const [messages, setMessages] = useState([]);
  // State untuk mengontrol apakah chat sudah dimulai dan menampilkan UI chat
  const [chatStarted, setChatStarted] = useState(false);
  // State untuk input pesan baru
  const [newMessage, setNewMessage] = useState("");
  // State untuk menyimpan pertanyaan yang disarankan oleh AI
  const [currentSuggestedQuestions, setCurrentSuggestedQuestions] = useState(
    []
  );
  // State untuk menunjukkan AI sedang mengetik
  const [isAiTyping, setIsAiTyping] = useState(false);
  // Ref untuk menggulir ke bagian bawah area pesan (tidak otomatis digulir)
  const messagesEndRef = useRef(null);

  // Ref untuk menyimpan ID timer agar bisa dibersihkan
  const suggestionTimerRef = useRef(null);
  const INACTIVITY_DELAY = 5000; // 5 detik jeda untuk menampilkan saran jika tidak ada respons

  // Fungsi untuk membersihkan timer jika ada
  const clearTimeoutIfExists = () => {
    if (suggestionTimerRef.current) {
      clearTimeout(suggestionTimerRef.current);
      suggestionTimerRef.current = null;
    }
  };

  // Effect to automatically scroll to the bottom of the chat (optional, but good for UX)
  //   useEffect(() => {
  // Gulir ke bawah setiap kali ada pesan baru atau status typing berubah
  //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }, [messages, isAiTyping]); // Scroll when messages change or typing indicator appears/disappears

  // Effect to manage delayed suggestions based on inactivity
  useEffect(() => {
    // Clear any previous timer when messages change (e.g., new user message)
    clearTimeoutIfExists();

    // Check if the last message is from 'other' (AI) and AI is not typing,
    // and if there are no suggestions currently displayed
    const lastMessage = messages[messages.length - 1];
    // Only set timer if chat has started, AI is not typing,
    // the last message is from AI, and no suggestions are currently visible.
    // Also, ensure the last message from AI is *not* already a suggestion prompt
    // to avoid continuous prompting.
    const isLastAiMessageSuggestionPrompt =
      lastMessage &&
      lastMessage.text.includes(
        "Apakah ada hal lain yang ingin Anda tanyakan?"
      );

    if (
      chatStarted &&
      !isAiTyping &&
      lastMessage &&
      lastMessage.sender === "other" &&
      currentSuggestedQuestions.length === 0 &&
      !isLastAiMessageSuggestionPrompt // Prevent re-prompting if already prompted
    ) {
      // Set a timer to show suggestions if no user interaction after AI's last message
      suggestionTimerRef.current = setTimeout(() => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          // Check if the last message is still the AI's and hasn't been followed by user input
          if (updatedMessages[updatedMessages.length - 1] === lastMessage) {
            // Add a subtle prompt before showing suggestions again
            const promptMsg = {
              id: new Date().getTime() + 100, // Unique ID
              text: "Apakah ada hal lain yang ingin Anda tanyakan?",
              sender: "other",
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
            updatedMessages.push(promptMsg);
            setCurrentSuggestedQuestions(predefinedQuestions); // Now display suggestions
          }
          return updatedMessages;
        });
        suggestionTimerRef.current = null; // Clear the ref after execution
      }, INACTIVITY_DELAY);
    }

    // Cleanup function: clear timer when component unmounts or dependencies change
    return () => clearTimeoutIfExists();
  }, [messages, chatStarted, isAiTyping, predefinedQuestions]);

  // Fungsi untuk memulai chat, hanya mengubah tampilan tanpa menambahkan pesan
  const startChat = useCallback(() => {
    setChatStarted(true);
    setMessages([]); // Pastikan daftar pesan kosong saat memulai chat
    setCurrentSuggestedQuestions([]); // Pastikan tidak ada saran pertanyaan awal
  }, []);

  // Fungsi untuk mengirim pesan dari AI dengan delay
  // Fungsi ini HANYA bertanggung jawab untuk mengirim pesan dan mengatur typing indicator
  const sendAiMessage = useCallback((responseText, delay = 1000) => {
    return new Promise((resolve) => {
      setIsAiTyping(true); // Mulai efek mengetik AI
      // clearTimeoutIfExists(); // Tidak perlu di sini, karena sudah diatur di caller

      setTimeout(() => {
        const aiMsg = {
          id: new Date().getTime(),
          text: responseText,
          sender: "other",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prevMessages) => [...prevMessages, aiMsg]);
        setIsAiTyping(false); // Hentikan efek mengetik AI setelah pesan muncul
        resolve(); // Selesaikan Promise setelah pesan terkirim
      }, delay);
    });
  }, []);

  // Fungsi untuk menangani pengiriman pesan oleh pengguna
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return; // Jangan kirim pesan kosong

    clearTimeoutIfExists(); // Bersihkan timer saran saat pengguna mengirim pesan

    const userMsg = {
      id: new Date().getTime() + 1, // ID unik untuk pesan pengguna
      text: newMessage.trim(),
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prevMessages) => [...prevMessages, userMsg]); // Tambahkan pesan pengguna
    setNewMessage(""); // Bersihkan input
    setCurrentSuggestedQuestions([]); // Hapus saran saat pengguna mengetik/mengirim pesan baru

    // AI response sequence for a typed user message
    await sendAiMessage(
      "Terima kasih atas pesan Anda. Mohon tunggu sebentar, kami sedang memproses permintaan Anda.",
      1000
    ); // AI processing message

    // Logika untuk mencari jawaban produk berdasarkan input teks
    const lowerCaseMessage = userMsg.text.toLowerCase();
    let productFound = null;

    // Coba cari produk berdasarkan nama atau kata kunci umum
    for (const product of allProductsData) {
      // Lebih spesifik dalam pencarian keyword
      const productKeywords = product.name.toLowerCase().split(" ");

      // Check if any product keyword is present in the user's message
      const isProductKeywordPresent = productKeywords.some((keyword) =>
        lowerCaseMessage.includes(keyword)
      );

      // Also check general category keywords if they are used to ask about a product
      const isGeneralKeywordPresent =
        (lowerCaseMessage.includes("popok") &&
          product.name.toLowerCase().includes("popok")) ||
        (lowerCaseMessage.includes("indomie") &&
          product.name.toLowerCase().includes("indomie")) ||
        (lowerCaseMessage.includes("nugget") &&
          product.name.toLowerCase().includes("nugget")) ||
        (lowerCaseMessage.includes("shampo") &&
          product.name.toLowerCase().includes("shampo")) ||
        (lowerCaseMessage.includes("mainan") &&
          product.name.toLowerCase().includes("mainan")) ||
        (lowerCaseMessage.includes("beras") &&
          product.name.toLowerCase().includes("beras")) ||
        (lowerCaseMessage.includes("aqua") &&
          product.name.toLowerCase().includes("aqua"));

      if (isProductKeywordPresent || isGeneralKeywordPresent) {
        productFound = product;
        break; // Ambil produk pertama yang cocok
      }
    }

    if (productFound) {
      await sendAiMessage(
        `Berikut informasi tentang ${productFound.name}: ${productFound.description} Harga: Rp ${productFound.price}. Stok: ${productFound.stock}.`,
        1000
      ); // Detailed product answer
    } else {
      await sendAiMessage(
        "Mohon maaf, saya tidak dapat menemukan informasi spesifik terkait pertanyaan Anda. Untuk bantuan lebih lanjut, silakan coba pilihan cepat di bawah atau ketik pertanyaan lain yang lebih spesifik.",
        1000
      ); // Generic fallback answer
    }

    // The useEffect for inactivity will now handle showing the "Apakah ada hal lain..." prompt
    // and the quick reply buttons after a delay if the user doesn't respond.
  };

  // Fungsi untuk mengirim pesan dengan tombol Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Kirim pesan saat Enter ditekan (tanpa Shift untuk baris baru)
      e.preventDefault(); // Mencegah baris baru di textarea
      handleSendMessage();
    }
  };

  // Fungsi untuk menangani klik pada pertanyaan yang disarankan oleh AI
  const handleSuggestedQuestionClick = async (question) => {
    clearTimeoutIfExists(); // Bersihkan timer saran saat pengguna memilih saran

    // Simulasi pengguna mengirim pertanyaan yang dipilih sebagai pesan
    const userMsg = {
      id: new Date().getTime() + 2,
      text: question.text,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prevMessages) => [...prevMessages, userMsg]); // Tambahkan pesan ini ke daftar

    setNewMessage(""); // Bersihkan input pesan jika ada teks yang diketik
    setCurrentSuggestedQuestions([]); // Hapus saran segera setelah dipilih

    // AI response sequence for a clicked suggested question
    await sendAiMessage(
      "Terima kasih atas pertanyaan Anda. Mohon tunggu sebentar, kami sedang mencari informasinya.",
      1000
    ); // AI processing message

    // Cek apakah pertanyaan yang disarankan adalah tentang produk
    if (question.type === "product" && question.productId) {
      const product = allProductsData.find((p) => p.id === question.productId);
      if (product) {
        await sendAiMessage(
          `Berikut informasi tentang ${product.name}: ${product.description} Harga: Rp ${product.price}. Stok: ${product.stock}.`,
          1000
        ); // Actual detailed product answer
      } else {
        await sendAiMessage("Mohon maaf, detail produk tidak ditemukan.", 1000); // Fallback if product ID not found
      }
    } else {
      // Jika bukan pertanyaan produk, gunakan jawaban langsung dari predefinedQuestions
      await sendAiMessage(question.answer, 1000); // Actual detailed answer from predefinedQuestions
    }

    // The useEffect for inactivity will now handle showing the "Apakah ada hal lain..." prompt
    // and the quick reply buttons after a delay if the user doesn't respond.
  };

  return (
    <div className="w-full flex flex-col items-center min-h-screen bg-gray-100 font-sans">
      {/* Header (White with Hawaii logo) */}
      <div className="w-full bg-white py-3 px-4 md:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-2 text-red-600 font-bold text-2xl">
            <Link to="/">
              <img
                src="/images/logo hawai.png"
                alt="Hawaii Logo"
                className="w-11 h-11 rounded-full border-2 border-red-600"
              />
            </Link>
            <span>HAWAII</span>
          </div>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-gray-800">
              Pusat Bantuan Chat
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to="/notification"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-red-600 shadow-md hover:bg-gray-200 transition"
            >
              <Bell size={20} />
            </Link>
            <Link
              to="/promo-page"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-red-600 shadow-md hover:bg-gray-200 transition"
            >
              <Percent size={20} />
            </Link>
            <Link
              to="/cart"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-red-600 shadow-md hover:bg-gray-200 transition"
            >
              <ShoppingCart size={20} />
            </Link>
            <Link
              to="/signin"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-red-600 shadow-md hover:bg-gray-200 transition"
            >
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="relative flex flex-col max-w-3xl w-full bg-white rounded-lg shadow-lg my-6 md:my-8 h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Chat Header (Contact Info) */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-red-50">
          <Link to="/" className="text-gray-600 hover:text-red-600 mr-3">
            <ArrowLeft size={24} />
          </Link>
          <div className="relative">
            <img
              src="https://placehold.co/40x40/FF0000/FFFFFF?text=CS"
              alt="Customer Service"
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            {/* Online indicator - can be dynamic */}
            <span className="absolute bottom-0 right-3 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">
              Customer Service Hawaii
            </h2>
            <p className="text-green-600 text-sm">Online</p>
          </div>
        </div>

        {/* Conditional rendering for chat content */}
        {!chatStarted ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-gray-600">
            <h2 className="text-2xl font-bold mb-4">
              Selamat Datang di Pusat Bantuan Hawaii!
            </h2>
            <p className="mb-6 max-w-sm">
              Kami siap membantu Anda. Silakan mulai chat untuk terhubung dengan
              Customer Service kami.
            </p>
            <button
              onClick={startChat}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              Mulai Chat
            </button>
          </div>
        ) : (
          <>
            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
              {messages.length === 0 &&
                !isAiTyping && ( // Display initial message if no interaction and AI is not typing
                  <div className="text-center text-gray-500 mt-10">
                    <p className="text-lg">
                      Ketik pesan pertama Anda untuk memulai percakapan...
                    </p>
                    <p className="mt-2 text-sm">
                      Contoh: "Halo", "Berapa harga popok?"
                    </p>
                  </div>
                )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-4 ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm text-sm ${
                      msg.sender === "me"
                        ? "bg-red-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-xs mt-1 ${
                        msg.sender === "me" ? "text-gray-200" : "text-gray-600"
                      } text-right`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {isAiTyping && ( // Display AI typing indicator
                <div className="flex justify-start mb-4">
                  <div className="max-w-[70%] px-4 py-2 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none shadow-sm animate-pulse">
                    <div className="typing-indicator flex space-x-1">
                      {/* You might need to add these keyframes to your global CSS file (e.g., index.css) */}
                      {/*
                      @keyframes bounce1 { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
                      @keyframes bounce2 { 0%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
                      @keyframes bounce3 { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1.0); } }
                      .animate-bounce1 { animation: bounce1 1.4s infinite ease-in-out both; }
                      .animate-bounce2 { animation: bounce2 1.4s infinite ease-in-out both; animation-delay: .2s; }
                      .animate-bounce3 { animation: bounce3 1.4s infinite ease-in-out both; animation-delay: .4s; }
                      */}
                      <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce1"></span>
                      <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce2"></span>
                      <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce3"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} /> {/* Element for scrolling */}
              {/* Suggested Questions */}
              {currentSuggestedQuestions.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg shadow-sm">
                  <p className="text-blue-800 font-semibold mb-2">
                    Pilihan Cepat:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentSuggestedQuestions.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handleSuggestedQuestionClick(q)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors shadow-md"
                      >
                        {q.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Message Input Area */}
            <div className="flex items-center p-4 border-t border-gray-200 bg-gray-50">
              <button className="text-gray-500 hover:text-gray-700 mr-3">
                <Paperclip size={24} />
              </button>
              <button className="text-gray-500 hover:text-gray-700 mr-3">
                <Smile size={24} />
              </button>
              <textarea
                className="flex-1 border border-gray-300 rounded-full py-2 px-4 resize-none focus:outline-none focus:ring-1 focus:ring-red-300 text-gray-700 h-10 overflow-hidden"
                rows="1"
                placeholder="Ketik pesan..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  minHeight: "40px",
                  maxHeight: "120px",
                  lineHeight: "24px",
                }}
              ></textarea>
              <button
                className="ml-3 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSendMessage}
                disabled={newMessage.trim() === "" || isAiTyping} // Disable when AI is typing
              >
                <Send size={24} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer (Mirroring HomePage footer) */}
      <footer className="w-full bg-red-800 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-white mb-4">QUICK LINKS</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/form-pengaduan" className="hover:text-white transition-colors">
                  Pengaduan Pelanggan
                </Link>
              </li>
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
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="https://www.instagram.com/hawaiiswalayanpku?igsh=amN0c2VkeGh2eXhm"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition-colors"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Location</h3>
            <p className="text-sm">
              Jl Yos Sudarso
              <br />
              Jl Juanda Tarumai
              <br />
              Jl Hitam Ujung
              <br />
              Simpang Jengkol
              <br />
              Jl Durian No.1E Payung Sekaki
            </p>
          </div>
        </div>
        <div className="text-center text-white-500 text-xs mt-8 border-t border-gray-700 pt-4">
          © 2024 HAWAII. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
