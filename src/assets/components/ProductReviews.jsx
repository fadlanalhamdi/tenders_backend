// src/components/ProductReviews.jsx
import React from 'react';
import { FaStar, FaChevronDown, FaRegThumbsUp } from 'react-icons/fa6';
import { FaEllipsisV } from 'react-icons/fa';

const ProductReviews = () => {
    const reviews = [
        {
            user: "Ade",
            time: "5 hari lalu",
            variant: "4 PCS RANDOM CAMPUR WARNA - L to XL (28-33) (BB 60-80 KG)",
            text: "Mantap nih... Murah,cepat, akurat juga packing rapih.. Thanks kak Semoga semakin sukses dan profesional 🙏❤️🥰💖💜💚",
            images: [
                "https://images.tokopedia.net/img/cache/900/VqbcmM/2024/6/15/d40d9904-8998-466d-a77a-6242a781b0f5.jpg",
                "https://images.tokopedia.net/img/cache/900/VqbcmM/2024/6/15/d40d9904-8998-466d-a77a-6242a781b0f5.jpg",
                "https://images.tokopedia.net/img/cache/900/VqbcmM/2024/6/15/d40d9904-8998-466d-a77a-6242a781b0f5.jpg",
                "https://images.tokopedia.net/img/cache/900/VqbcmM/2024/6/15/d40d9904-8998-466d-a77a-6242a781b0f5.jpg",
            ],
            likes: 3,
            profilePic: "https://cf.shopee.co.id/file/a721731631522a578966c1b3f9b7c89f_tn",
        },
        {
            user: "A***n",
            time: "1 hari lalu",
            variant: "4 PCS RANDOM CAMPUR WARNA - XXL to XXL (JUMBO) (BB 90-100KG+)",
            text: "Model, bahan n jahitan bagus untuk harga segitu. Bravo, recommended seller.",
            images: [],
            likes: null,
            profilePic: "https://ui-avatars.com/api/?name=A&background=random",
        }
    ];

    const ratingSummary = {
        average: 4.9,
        totalReviews: 10,
        totalRatings: 2,
        satisfiedPercent: 100,
        breakdown: [
            { stars: 5, count: 9 },
            { stars: 4, count: 1 },
            { stars: 3, count: 0 },
            { stars: 2, count: 0 },
            { stars: 1, count: 0 },
        ]
    };

    // ✅ Tambahkan ini untuk memperbaiki lebar progress bar
    const totalCountAllStars = ratingSummary.breakdown.reduce((acc, item) => acc + item.count, 0);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900">ULASAN PEMBELI</h2>

            {/* Rating Summary */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex-shrink-0 flex items-center gap-4">
                    <div className="text-center">
                        <div className="flex items-center text-3xl font-bold text-gray-900">
                            {ratingSummary.average} / 5.0
                        </div>
                        <div className="flex text-yellow-400 text-base">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} />
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            {ratingSummary.totalRatings} rating • {reviews.length} ulasan
                        </p>
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    {ratingSummary.breakdown.map((item) => (
                        <div key={item.stars} className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-gray-600 text-sm w-8 justify-end">
                                {item.stars} <FaStar className="text-yellow-400" />
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-green-500 h-2.5 rounded-full"
                                    style={{
                                        width: `${(item.count / totalCountAllStars) * 100}%`
                                    }}
                                ></div>
                            </div>
                            <div className="text-sm text-gray-600 w-8">{`(${item.count})`}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FILTER + CONTENT */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* FILTER SECTION */}
                <div className="col-span-1 border-r border-gray-200 pr-6 hidden md:block">
                    <h3 className="font-bold text-gray-800 mb-4">FILTER ULASAN</h3>
                    <div className="mb-4">
                        <button className="w-full flex justify-between items-center py-2 text-gray-700 font-semibold border-b border-gray-200">
                            Media <FaChevronDown className="text-xs text-gray-500" />
                        </button>
                    </div>
                    <div className="mb-4">
                        <button className="w-full flex justify-between items-center py-2 text-gray-700 font-semibold border-b border-gray-200">
                            Rating <FaChevronDown className="text-xs text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* ULASAN SECTION */}
                <div className="col-span-1 md:col-span-3">
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 mb-4">FOTO & VIDEO PEMBELI</h3>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {[...Array(5)].map((_, i) => (
                                <img
                                    key={i}
                                    src="https://images.tokopedia.net/img/cache/900/VqbcmM/2024/6/15/d40d9904-8998-466d-a77a-6242a781b0f5.jpg"
                                    alt="Review media"
                                    className="w-20 h-20 object-cover rounded-md flex-shrink-0 cursor-pointer"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">ULASAN PILIHAN</h3>
                        <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">Urutkan</span>
                            <div className="relative">
                                <select className="appearance-none bg-white border border-gray-300 rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer">
                                    <option>Paling Membantu</option>
                                    <option>Terbaru</option>
                                    <option>Terlama</option>
                                </select>
                                <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {reviews.map((review, index) => (
                            <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <img src={review.profilePic} alt="User" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <div className="font-bold text-gray-900">{review.user}</div>
                                            <div className="text-yellow-400 text-sm flex gap-1">
                                                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-gray-500 text-xs flex items-center gap-2">
                                        <span>{review.time}</span>
                                        <FaEllipsisV className="cursor-pointer" />
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                    <span className="font-semibold">Varian:</span> {review.variant}
                                </div>
                                <p className="text-gray-800 mb-4">{review.text}</p>
                                {review.images.length > 0 && (
                                    <div className="flex gap-2 mb-4">
                                        {review.images.map((img, i) => (
                                            <img key={i} src={img} alt="Review media" className="w-16 h-16 object-cover rounded-md" />
                                        ))}
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-2 hover:text-green-600 transition">
                                            <FaRegThumbsUp /> Membantu
                                        </button>
                                        {review.likes && <span className="text-xs text-gray-500">{review.likes} orang terbantu</span>}
                                    </div>
                                    <button className="flex items-center gap-2 hover:text-green-600 transition">
                                        Lihat Balasan <FaChevronDown className="text-xs" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-6">
                        <button className="text-green-600 font-bold hover:underline">Lihat Semua Ulasan</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductReviews;
