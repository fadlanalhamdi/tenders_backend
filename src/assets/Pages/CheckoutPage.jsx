// KODE LENGKAP - Salin semua isi file ini
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useOrders } from "../contexts/OrderContext";
import {
  MapPin,
  ShoppingCart,
  User,
  Percent,
  Bell,
  Edit3,
  ChevronRight,
  CreditCard,
  CheckCircle,
  Tag,
  MessageSquare,
  Truck,
  Wallet,
  Landmark,
  Building,
  X,
} from "lucide-react";

// --- DATA DUMMY UNTUK DEMO ---
const userAddresses = [
  {
    id: 1,
    name: "Rumah",
    recipient: "Sakura",
    phone: "0895410950887",
    street: "Gg. Intisari",
    details: "Umbansari - Rumbai, Pekanbaru 28265",
    isPrimary: true,
  },
  {
    id: 2,
    name: "Kantor",
    recipient: "Obito (Work)",
    phone: "081234567890",
    street: "Jl. Jend. Sudirman No. 123",
    details: "Pusat Kota, Pekanbaru 28111",
    isPrimary: true,
  },
  {
    id: 3,
    name: "Rumah Ortu",
    recipient: "Madara",
    phone: "082345678901",
    street: "Jl. Durian No. 45",
    details: "Sukajadi, Pekanbaru 28121",
    isPrimary: true,
  },
];
const paymentOptions = {
  ewallet: [
    { id: "gopay", name: "GoPay" },
    { id: "ovo", name: "OVO" },
    { id: "dana", name: "DANA" },
    { id: "shopeepay", name: "ShopeePay" },
    { id: "linkaja", name: "LinkAja" },
    { id: "qris", name: "QRIS (Scan dari semua aplikasi)" },
  ],
  bank: [
    { id: "bca", name: "BCA Virtual Account" },
    { id: "mandiri", name: "Mandiri Virtual Account" },
    { id: "bri", name: "BRI Virtual Account" },
    { id: "bni", name: "BNI Virtual Account" },
    { id: "permata", name: "Permata Virtual Account" },
    { id: "cimb", name: "CIMB Niaga Virtual Account" },
  ],
};
const shippingOptions = [
  {
    id: "reguler",
    name: "Reguler",
    duration: "Estimasi tiba dalam 2-4 hari kerja",
    price: 25000,
  },
  {
    id: "ekspres",
    name: "Ekspres",
    duration: "Estimasi tiba dalam 1-2 hari kerja",
    price: 40000,
  },
];
const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value) || 0);

// --- KOMPONEN MODAL UNTUK UBAH ALAMAT ---
const AddressModal = ({
  isOpen,
  onClose,
  addresses,
  selectedAddress,
  onSelectAddress,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-xl font-bold text-gray-900">
            Pilih Alamat Pengiriman
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => onSelectAddress(address)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedAddress.id === address.id
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-red-300"
              }`}
            >
              <p className="font-bold text-gray-800">
                {address.name}{" "}
                {address.isPrimary && (
                  <span className="text-xs font-normal bg-red-100 text-red-600 px-2 py-0.5 rounded-full ml-2">
                    Utama
                  </span>
                )}
              </p>
              <p className="text-sm font-semibold mt-1">
                {address.recipient} ({address.phone})
              </p>
              <p className="text-sm text-gray-600">
                {address.street}, {address.details}
              </p>
            </div>
          ))}
        </div>
        <div className="p-5 border-t">
          <button
            onClick={onClose}
            className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA CHECKOUT PAGE ---
const CheckoutPage = () => {
  const { getSelectedCartItems } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [productsToCheckout, setProductsToCheckout] = useState([]);
  const [pricing, setPricing] = useState({
    subtotal: 0,
    shipping: shippingOptions[0].price,
    serviceFee: 1000,
    voucher: -5000,
    coins: -80,
  });
  const [selectedShipping, setSelectedShipping] = useState(
    shippingOptions[0].id
  );
  const [selectedPayment, setSelectedPayment] = useState({
    group: "ewallet",
    option: "gopay",
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(
    userAddresses.find((addr) => addr.isPrimary)
  );

  useEffect(() => {
    const selectedItems = getSelectedCartItems?.() ?? [];
    setProductsToCheckout(
      selectedItems.filter((item) => item && typeof item === "object")
    );
  }, [getSelectedCartItems]);

  useEffect(() => {
    const subtotal = productsToCheckout.reduce(
      (total, item) =>
        total + Number(item?.price ?? 0) * Number(item?.qty ?? 1),
      0
    );
    setPricing((prev) => ({ ...prev, subtotal }));
  }, [productsToCheckout]);

  const handleShippingChange = (option) => {
    setSelectedShipping(option.id);
    setPricing((prev) => ({ ...prev, shipping: option.price }));
  };

  const handleSelectAddress = (address) => {
    setCurrentAddress(address);
  };

  const handlePaymentGroupChange = (group) => {
    const defaultOption =
      group === "ewallet"
        ? paymentOptions.ewallet[0].id
        : group === "bank"
        ? paymentOptions.bank[0].id
        : "cod";
    setSelectedPayment({ group, option: defaultOption });
  };

  const handlePlaceOrder = () => {
    const newOrder = {
      id: `HAW-${Date.now()}`,
      status: "Pesanan Dibuat", 
      statusText: "Kami telah menerima pesananmu.", 
      products: productsToCheckout,
      pricing: pricing,
      totalPaid: totalPayment,
      shipping: shippingOptions.find((opt) => opt.id === selectedShipping),
      paymentMethod: selectedPayment,
      address: currentAddress,
      orderTime: new Date().toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short",
      }),
    };
    addOrder(newOrder);
    setShowSuccessDialog(false);
    navigate(`/order/${newOrder.id}`);
  };

  const totalPayment = Object.values(pricing).reduce(
    (acc, val) => acc + val,
    0
  );

  return (
    <>
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        addresses={userAddresses}
        selectedAddress={currentAddress}
        onSelectAddress={handleSelectAddress}
      />
      <div className="bg-gray-50 min-h-screen font-sans">
        <header className="w-full bg-white py-4 px-6 shadow-md sticky top-0 z-40">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link
              to="/"
              className="flex items-center text-red-600 font-bold text-2xl space-x-2"
            >
              <img
                src="/images/logo hawai.png"
                alt="Logo"
                className="w-11 h-11 rounded-full border-2 border-red-600"
              />
              <span>HAWAII</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Link
                to="/notification"
                className="p-2 rounded-full hover:bg-red-50"
              >
                <Bell size={20} className="text-gray-600" />
              </Link>
              <Link
                to="/promo-page"
                className="p-2 rounded-full hover:bg-red-50"
              >
                <Percent size={20} className="text-gray-600" />
              </Link>
              <Link to="/cart" className="p-2 rounded-full hover:bg-red-50">
                <ShoppingCart size={20} className="text-gray-600" />
              </Link>
              <Link to="/signin" className="p-2 rounded-full hover:bg-red-50">
                <User size={20} className="text-gray-600" />
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center text-sm text-gray-400 mb-8">
            <span className="flex items-center">
              Keranjang <ChevronRight size={16} className="mx-2" />
            </span>
            <span className="font-bold text-red-600 flex items-center">
              Checkout <ChevronRight size={16} className="mx-2" />
            </span>
            <span>Pembayaran</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <MapPin className="text-red-500 mr-3" size={24} />
                    Alamat Pengiriman
                  </h2>
                  <button
                    onClick={() => setAddressModalOpen(true)}
                    className="flex items-center text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Edit3 size={14} className="mr-1" /> Ubah Alamat
                  </button>
                </div>
                <div className="text-gray-700">
                  <p className="font-bold">
                    {currentAddress.recipient} ({currentAddress.phone})
                  </p>
                  <p>
                    {currentAddress.street}, {currentAddress.details}
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Truck className="text-red-500 mr-3" size={24} />
                  Metode Pengiriman
                </h2>
                <div className="space-y-4">
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      onClick={() => handleShippingChange(option)}
                      className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center ${
                        selectedShipping === option.id
                          ? "border-red-500 ring-2 ring-red-200"
                          : "border-gray-200"
                      }`}
                    >
                      <div>
                        <p className="font-bold text-gray-800">{option.name}</p>
                        <p className="text-sm text-gray-500">
                          {option.duration}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(option.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <CreditCard className="text-red-500 mr-3" size={24} />
                  Metode Pembayaran
                </h2>
                <div className="space-y-3">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPayment.group === "ewallet"
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-gray-200"
                    }`}
                    onClick={() => handlePaymentGroupChange("ewallet")}
                  >
                    <p className="font-bold text-gray-800 flex items-center">
                      <Wallet className="mr-3 text-blue-500" size={20} />
                      E-Wallet / QRIS
                    </p>
                    {selectedPayment.group === "ewallet" && (
                      <div className="mt-4 pl-8">
                        <label
                          htmlFor="ewallet-select"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Pilih E-Wallet:
                        </label>
                        <select
                          id="ewallet-select"
                          value={selectedPayment.option}
                          onChange={(e) =>
                            setSelectedPayment((prev) => ({
                              ...prev,
                              option: e.target.value,
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        >
                          <option disabled>-- Pilih --</option>
                          {paymentOptions.ewallet.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPayment.group === "bank"
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-gray-200"
                    }`}
                    onClick={() => handlePaymentGroupChange("bank")}
                  >
                    <p className="font-bold text-gray-800 flex items-center">
                      <Landmark className="mr-3 text-purple-500" size={20} />
                      Transfer Bank (Virtual Account)
                    </p>
                    {selectedPayment.group === "bank" && (
                      <div className="mt-4 pl-8">
                        <label
                          htmlFor="bank-select"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Pilih Bank:
                        </label>
                        <select
                          id="bank-select"
                          value={selectedPayment.option}
                          onChange={(e) =>
                            setSelectedPayment((prev) => ({
                              ...prev,
                              option: e.target.value,
                            }))
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        >
                          <option disabled>-- Pilih --</option>
                          {paymentOptions.bank.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div
                    className={`p-4 border rounded-lg cursor-pointer ${
                      selectedPayment.group === "cod"
                        ? "border-red-500 ring-2 ring-red-200"
                        : "border-gray-200"
                    }`}
                    onClick={() => handlePaymentGroupChange("cod")}
                  >
                    <p className="font-bold text-gray-800 flex items-center">
                      <Building className="mr-3 text-green-500" size={20} />
                      COD (Bayar di Tempat)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-28">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <ShoppingCart className="text-red-500 mr-3" size={24} />
                  Ringkasan Pesanan
                </h2>
                <div className="space-y-4 border-b pb-4 mb-4 max-h-60 overflow-y-auto pr-2">
                  {productsToCheckout.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      Keranjang Anda kosong.
                    </p>
                  ) : (
                    productsToCheckout.map((product, idx) => (
                      <div
                        key={product?.id ?? idx}
                        className="flex items-start space-x-3"
                      >
                        <img
                          src={
                            product?.imageUrl ||
                            "https://via.placeholder.com/64"
                          }
                          alt={product?.name || "Produk"}
                          className="w-14 h-14 rounded-md border"
                        />
                        <div className="flex-grow">
                          <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {product?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {product.qty}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {formatCurrency(product.price * product.qty)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="space-y-2 border-b pb-4 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal Produk</span>
                    <span>{formatCurrency(pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Ongkir</span>
                    <span>{formatCurrency(pricing.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Biaya Layanan</span>
                    <span>{formatCurrency(pricing.serviceFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Voucher</span>
                    <span>-{formatCurrency(Math.abs(pricing.voucher))}</span>
                  </div>
                  <div className="flex justify-between text-sm text-yellow-600">
                    <span>Hawaii Coin</span>
                    <span>-{formatCurrency(Math.abs(pricing.coins))}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-red-600">
                    {formatCurrency(totalPayment)}
                  </span>
                </div>
                <button
                  onClick={() => setShowSuccessDialog(true)}
                  className="w-full bg-red-600 text-white font-bold text-lg py-3 rounded-lg shadow-lg hover:bg-red-700 transition-transform hover:scale-105 flex items-center justify-center"
                >
                  <CheckCircle size={20} className="mr-2" /> Bayar Sekarang
                </button>
              </div>
            </div>
          </div>
        </main>
        {showSuccessDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center transform transition-all animate-fade-in-up">
              <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">
                Pesanan Berhasil!
              </h3>
              <p className="text-gray-600 text-sm mt-2 mb-6">
                Terima kasih telah berbelanja. Anda akan diarahkan ke halaman
                detail pesanan.
              </p>
              <button
                onClick={handlePlaceOrder}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
              >
                Lihat Detail Pesanan
              </button>
            </div>
          </div>
        )}
        <footer className="w-full text-center py-6 text-xs text-gray-500 mt-auto">
          © {new Date().getFullYear()} HAWAII. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default CheckoutPage;
