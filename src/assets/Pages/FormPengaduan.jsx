import React, { useState } from 'react';

export default function FormPengaduanPage() {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [tanggalKejadian, setTanggalKejadian] = useState('');
  const [waktuKejadian, setWaktuKejadian] = useState('');
  const [lokasiHawaii, setLokasiHawaii] = useState('');
  const [deskripsiPengaduan, setDeskripsiPengaduan] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form berhasil dikirim!');
    console.log({
      namaLengkap,
      noHp,
      email,
      tanggalKejadian,
      waktuKejadian,
      lokasiHawaii,
      deskripsiPengaduan,
    });
    // Reset form
    setNamaLengkap('');
    setNoHp('');
    setEmail('');
    setTanggalKejadian('');
    setWaktuKejadian('');
    setLokasiHawaii('');
    setDeskripsiPengaduan('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 px-4">
      <div className="bg-white w-full max-w-4xl px-10 py-10 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-red-700 mb-12 text-center">
          Form Pengaduan Pelanggan
        </h1>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold mb-2">Nama Lengkap</label>
              <input
                type="text"
                required
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                className="w-full border border-gray-300 bg-red-50 p-4 rounded-lg"
                placeholder="Nama Lengkap"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">Tanggal Kejadian</label>
              <input
                type="date"
                required
                value={tanggalKejadian}
                onChange={(e) => setTanggalKejadian(e.target.value)}
                className="w-full border border-gray-300 bg-red-50 p-4 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">Nomor HP</label>
              <input
                type="tel"
                required
                value={noHp}
                onChange={(e) => setNoHp(e.target.value)}
                className="w-full border border-gray-300 bg-red-50 p-4 rounded-lg"
                placeholder="081234567890"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">Waktu Kejadian</label>
              <input
                type="time"
                value={waktuKejadian}
                onChange={(e) => setWaktuKejadian(e.target.value)}
                className="w-full border border-gray-300 bg-red-50 p-4 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">Email (Opsional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 bg-red-50 p-4 rounded-lg"
                placeholder="Email Anda"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">Lokasi Hawaii</label>
              <input
                type="text"
                required
                value={lokasiHawaii}
                onChange={(e) => setLokasiHawaii(e.target.value)}
                className="w-full border border-gray-300 bg-red-50 p-4 rounded-lg"
                placeholder="Contoh: Cabang Rumbai"
              />
            </div>
          </div>

          <div className="mt-10">
            <label className="block text-lg font-semibold mb-2">Deskripsi Pengaduan</label>
            <textarea
              required
              value={deskripsiPengaduan}
              onChange={(e) => setDeskripsiPengaduan(e.target.value)}
              className="w-full border border-gray-300 bg-red-50 p-4 rounded-lg"
              placeholder="Jelaskan pengaduan Anda secara detail..."
              rows={6}
            ></textarea>
          </div>

          <div className="mt-10 flex justify-end">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-lg px-10 py-4 rounded-lg transition duration-300"
            >
              Kirim Pengaduan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
