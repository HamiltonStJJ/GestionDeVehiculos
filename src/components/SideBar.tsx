import React, { useState } from 'react';
import Link from "next/link";

interface SidebarProps {
  role: "admin" | "customer";
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = role === "admin"
    ? [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Gestionar Usuarios", href: "/admin/users" },
      { name: "Reportes", href: "/admin/reports" },
      { name: "Configuración", href: "/admin/settings" },
    ]
    : [
      { name: "Inicio", href: "/pages/customer" },
      { name: "Mis Reservas", href: "/customer/reservations" },
      { name: "Perfil", href: "/customer/profile" },
      { name: "Ayuda", href: "/customer/help" },
    ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-circle bg-gray-800 text-white hover:bg-gray-700"
      >
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div 
        className={`
          lg:w-64 w-64
          fixed lg:sticky
          top-0 left-0
          h-screen
          overflow-y-auto
          lg:translate-x-0 
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          z-40
        `}
      >
        <div className="flex flex-col h-full bg-gray-800 text-white shadow-xl">
          {/* Header */}
          <div className="p-4 bg-gray-900 text-center border-b border-gray-700">
            <h2 className="text-2xl font-bold">
              {role === "admin" ? "Admin Panel" : "Customer Panel"}
            </h2>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1">
            <ul className="menu p-4 w-full">
              {menuItems.map((item, index) => (
                <li key={index} className="mb-2">
                  <Link
                    href={item.href}
                    className="flex items-center p-3 text-white hover:bg-[#134B70] rounded-lg transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <button className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-[#134B70] transition duration-200">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;