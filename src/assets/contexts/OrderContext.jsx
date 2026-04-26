// src/contexts/OrderContext.jsx (PASTIKAN ISINYA SEPERTI INI)

import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();
export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('hawaii_orders');
      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch (error) {
      console.error("Gagal memuat pesanan dari localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hawaii_orders', JSON.stringify(orders));
    } catch (error) {
      console.error("Gagal menyimpan pesanan ke localStorage", error);
    }
  }, [orders]);

  const addOrder = (newOrder) => {
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };
  
  // ==========================================================
  // --- INI FUNGSI YANG KEMUNGKINAN BESAR HILANG DI KODEMU ---
  const updateOrderStatus = (orderId, newStatus, newStatusText) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus, statusText: newStatusText } : order
      )
    );
  };
  // ==========================================================

  const latestOrder = orders.length > 0 ? orders[0] : null;

  // Objek 'value' inilah yang akan dibagikan ke seluruh aplikasi
  const value = {
    orders,
    addOrder,
    getOrderById,
    latestOrder,
    updateOrderStatus, // <-- PASTIKAN FUNGSI INI DIMASUKKAN DI SINI
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};