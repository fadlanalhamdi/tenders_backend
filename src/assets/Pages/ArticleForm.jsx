import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ArticleForm({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    author: "",
    publishDate: "", // String representation for input type="date"
    category: "Teknologi", // Default category
    status: "Draft", // Default status
    views: 0,
  });

  const primaryRed = "#B82329"; // Warna Merah Utama Anda

  useEffect(() => {
    if (initialData) {
      // Jika ada data awal, isi form dengan data tersebut
      setFormData({
        ...initialData,
        // Konversi objek Date ke format string YYYY-MM-DD untuk input type="date"
        publishDate: initialData.publishDate
          ? initialData.publishDate.toISOString().split("T")[0]
          : "",
      });
    } else {
      // Reset form ketika menambahkan artikel baru
      setFormData({
        image: "",
        title: "",
        author: "",
        publishDate: "",
        category: "Teknologi",
        status: "Draft",
        views: 0,
      });
    }
  }, [initialData, isOpen]); // Dependency array: jalankan ulang efek jika initialData atau isOpen berubah

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Konversi string publishDate kembali ke objek Date sebelum disubmit
    const submittedData = {
      ...formData,
      publishDate: formData.publishDate ? new Date(formData.publishDate) : null,
      views: parseInt(formData.views, 10), // Pastikan views adalah angka
    };
    onSubmit(submittedData);
  };

  if (!isOpen) return null; // Jangan render modal jika isOpen false

  return (
    // Latar belakang transparan dengan filter blur, mirip dengan PromoForm
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border-t-4 border-red-700 relative"> {/* Menambahkan border-t-4 dan mengubah padding */}
        <div className="flex justify-between items-center mb-4"> {/* Menambahkan flex container untuk judul dan tombol tutup */}
          <h2
            className="text-2xl font-bold" // Mengubah gaya heading
            style={{ color: primaryRed }}
          >
            {initialData ? "Edit Artikel" : "Tambah Artikel Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700" // Mengubah gaya tombol tutup
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-semibold mb-2" // Mengubah gaya label
            >
              Judul Artikel
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-200" // Menyesuaikan gaya input
              required
            />
          </div>
          <div>
            <label
              htmlFor="author"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Penulis
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              URL Gambar Thumbnail
            </label>
            <input
              type="url" // Mengubah type menjadi url
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-200"
              placeholder="Contoh: https://example.com/gambar.jpg"
              required // Menambahkan required agar URL gambar wajib diisi
            />
          </div>
          <div>
            <label
              htmlFor="publishDate"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Tanggal Publikasi
            </label>
            <input
              type="date"
              id="publishDate"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Kategori
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-200 bg-white"
              required
            >
              <option value="Teknologi">Teknologi</option>
              <option value="Gaya Hidup">Gaya Hidup</option>
              <option value="Berita">Berita</option>
              <option value="Hiburan">Hiburan</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Olahraga">Olahraga</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Kuliner">Kuliner</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-200 bg-white"
              required
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <div className="mb-6"> {/* Menambahkan mb-6 untuk konsistensi jarak */}
            <label
              htmlFor="views"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >
              Jumlah Tayang
            </label>
            <input
              type="number"
              id="views"
              name="views"
              value={formData.views}
              onChange={handleChange}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-all duration-200"
              min="0"
              required
            />
          </div>
          <div className="flex items-center justify-end gap-3"> {/* Menambahkan flex container untuk tombol */}
            <button
              type="button"
              className="bg-gray-200 text-gray-700 font-semibold py-2 px-5 rounded-lg hover:bg-gray-300 transition-colors duration-200" // Mengubah gaya tombol batal
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-red-700 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-800 transition-colors duration-200" // Mengubah gaya tombol submit
            >
              {initialData ? "Simpan Perubahan" : "Tambah Artikel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}