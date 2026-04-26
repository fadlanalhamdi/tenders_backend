import { useState } from "react";

export default function LoyaltyPredict() {
  const [membership, setMembership] = useState("0");
  const [status, setStatus] = useState("0");
  const [transaksi, setTransaksi] = useState("");
  const [lamaBergabung, setLamaBergabung] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "https://2953152a95d3.ngrok-free.app/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            membership_encoded: parseInt(membership),
            status_encoded: parseInt(status),
            total_transaksi: parseFloat(transaksi),
            lama_bergabung: parseInt(lamaBergabung),
          }),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setResult({ error: "Gagal mengirim data." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Prediksi Loyalitas Pelanggan
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropdown Membership */}
          <div>
            <label className="block mb-1 font-medium">Membership</label>
            <select
              value={membership}
              onChange={(e) => setMembership(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="0">Classic</option>
              <option value="1">Silver</option>
              <option value="2">Gold</option>
              <option value="3">Platinum</option>
            </select>
          </div>

          {/* Dropdown Status */}
          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="0">Tidak Aktif</option>
              <option value="1">Aktif</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Total Transaksi</label>
            <input
              type="number"
              value={transaksi}
              onChange={(e) => setTransaksi(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Lama Bergabung (bulan)
            </label>
            <input
              type="number"
              value={lamaBergabung}
              onChange={(e) => setLamaBergabung(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {loading ? "Memproses..." : "Prediksi"}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            {result.success ? (
              <div>
                <p>
                  <strong>Kategori Loyalitas:</strong> {result.label_nama}
                </p>
                <p>
                  <strong>Kode:</strong> {result.label_kode}
                </p>
                <p>
                  <strong>Status Loyalitas:</strong>{" "}
                  {result.label_nama === "Gold" ||
                  result.label_nama === "Platinum"
                    ? "Pelanggan Loyal"
                    : "Belum Loyal"}
                </p>
              </div>
            ) : (
              <p className="text-red-600">
                {result.error || "Prediksi gagal."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
