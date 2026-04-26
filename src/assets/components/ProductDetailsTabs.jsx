// src/assets/components/ProductDetailsTabs.jsx
import React, { useState } from 'react';

const ProductDetailsTabs = ({ product }) => {
    // State untuk mengelola tab yang aktif
    const [activeTab, setActiveTab] = useState('detail');
    
    // State untuk mengontrol tampilan 'Lihat Lebih Sedikit'
    const [showFullDescription, setShowFullDescription] = useState(false);

    // Lakukan pemeriksaan awal pada objek product
    if (!product || !product.description) {
        return null; // Jangan tampilkan komponen jika data tidak lengkap
    }

    // Pisahkan deskripsi menjadi baris-baris
    const descriptionLines = product.description.split('\n');

    // Tentukan jumlah baris yang akan ditampilkan di awal (misalnya 8 baris)
    const initialLineCount = 8;
    const linesToDisplay = showFullDescription ? descriptionLines : descriptionLines.slice(0, initialLineCount);
    const hasMoreLines = descriptionLines.length > initialLineCount;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`py-3 px-6 text-sm font-bold transition-colors ${activeTab === 'detail' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('detail')}
                >
                    Detail
                </button>
                <button
                    className={`py-3 px-6 text-sm font-bold transition-colors ${activeTab === 'spesifikasi' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('spesifikasi')}
                >
                    Spesifikasi
                </button>
                <button
                    className={`py-3 px-6 text-sm font-bold transition-colors ${activeTab === 'panduan' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('panduan')}
                >
                    Panduan
                </button>
                <button
                    className={`py-3 px-6 text-sm font-bold transition-colors ${activeTab === 'info' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('info')}
                >
                    Info Penting
                </button>
            </div>

            {/* Isi Konten Tab */}
            <div className="p-6">
                {/* Tab Detail Produk */}
                {activeTab === 'detail' && (
                    <div className="text-gray-700 space-y-2">
                        {/* Render setiap baris dari deskripsi */}
                        {linesToDisplay.map((line, index) => {
                            // Trim spasi di awal dan akhir baris
                            const trimmedLine = line.trim();

                            // Cek apakah baris dimulai dengan bullet point atau tanda khusus
                            if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
                                // Jika ya, render sebagai list item
                                return (
                                    <p key={index} className="pl-4 text-sm relative before:content-['•'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:text-gray-500 before:text-base">
                                        {trimmedLine.substring(1).trim()}
                                    </p>
                                );
                            }
                            // Jika tidak, render sebagai paragraf biasa
                            return <p key={index} className="text-sm">{trimmedLine}</p>;
                        })}

                        {/* Tombol 'Lihat Lebih Sedikit/Banyak' */}
                        {hasMoreLines && (
                            <button
                                onClick={() => setShowFullDescription(prev => !prev)}
                                className="mt-4 text-sm font-bold text-red-600 hover:underline"
                            >
                                {showFullDescription ? 'Lihat Lebih Sedikit' : 'Lihat Lebih Banyak'}
                            </button>
                        )}
                    </div>
                )}
                
                {/* Konten tab lain (Spesifikasi, Panduan, Info) dapat ditambahkan di sini */}
                {activeTab === 'spesifikasi' && (
                    <div><p className="text-gray-600">Konten Spesifikasi belum tersedia.</p></div>
                )}
                {activeTab === 'panduan' && (
                    <div><p className="text-gray-600">Konten Panduan belum tersedia.</p></div>
                )}
                {activeTab === 'info' && (
                    <div><p className="text-gray-600">Konten Info Penting belum tersedia.</p></div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsTabs;