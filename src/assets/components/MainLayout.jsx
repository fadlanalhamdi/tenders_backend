// src/assets/components/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import Sidebar
import Header from './Header';   // Import Header

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50"> {/* flex-col untuk menumpuk header di atas */}
      <Header /> {/* Header full-width di paling atas */}
      
      {/* Bagian di bawah header: Sidebar dan Konten */}
      <div className="flex flex-1"> {/* flex-1 agar div ini memenuhi sisa tinggi yang tersedia */}
        <Sidebar /> {/* Sidebar di sisi kiri, di bawah header */}
        <main className="flex-1 p-6"> {/* Konten utama di sisi kanan, di bawah header */}
          <Outlet /> {/* Di sinilah komponen halaman akan dirender */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
