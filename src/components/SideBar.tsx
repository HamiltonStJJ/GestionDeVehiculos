import React, { useState } from "react";
import Link from "next/link";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Users,
  FileText,
  
  Home,
  Calendar,
  
  
  ChevronRight,
  Car,
  
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface SidebarProps {
  role: "admin" | "customer" | "employee";
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const Router = useRouter();

  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        localStorage.removeItem("userData"); 
        Router.push("/pages/auth/Login");
        toast.success("Sesión cerrada correctamente");
      } else {
        localStorage.removeItem("userData"); 
        Router.push("/pages/auth/Login");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMenuItems = () => {
    switch (role) {
      case "admin":
        return [
          { name: "Gestionar Vehículos",
            href: "/pages/admin",
            icon: <LayoutDashboard size={20} />,
          },
          {
            name: "Gestionar Usuarios",
            href: "/pages/admin/users",
            icon: <Users size={20} />,
          },
          {
            name: "Reportes",
            href: "/pages/admin/reports",
            icon: <FileText size={20} />,
          },
         
        ];
      case "employee":
        return [
          {
            name: "Gestión Alquileres",
            href: "/pages/employee",
            icon: <Car size={20} />,
          },
          {
            name: "Gestión de Reservas",
            href: "/pages/employee/reservations",
            icon: <Calendar size={20} />,
          },
         /* {
            name: "Registrar Mantenimiento",
            href: "/pages/employee/maintenance",
            icon: <Wrench size={20} />,
          },
          {
            name: "Inspecciones",
            href: "/pages/employee/inspections",
            icon: <ClipboardCheck size={20} />,
          },
          */
        ];
      case "customer":
        return [
          {
            name: "Inicio",
            href: "/pages/customer",
            icon: <Home size={20} />,
          },
          {
            name: "Mis Reservas",
            href: "/pages/customer/reservations",
            icon: <Calendar size={20} />,
          },
         /* {
            name: "Perfil",
            href: "/pages/customer/profile",
            icon: <UserCircle size={20} />,
          },
          {
            name: "Ayuda",
            href: "/customer/help",
            icon: <HelpCircle size={20} />,
          },
          */
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
          transition-all duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          z-40
        `}
      >
        <div className="flex flex-col h-full bg-gray-800 text-white shadow-xl">
          {/* Header with animation */}
          <div className="p-6 bg-gray-900 text-center border-b border-gray-700">
            <h2 className="text-2xl font-bold bg-gradient-to-r text-white bg-clip-text">
              {role === "admin"
                ? "Admin Panel"
                : role === "employee"
                ? "Employee Panel"
                : "Customer Panel"}
            </h2>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-2">
            <ul className="space-y-2">
              {menuItems?.map((item, index) => (
                <li
                  key={index}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <Link
                    href={item.href}
                    className={`
                      flex items-center p-3 rounded-lg
                      transition-all duration-200
                      ${
                        isHovered === index
                          ? "bg-[#134B70] translate-x-2"
                          : "hover:bg-gray-700"
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-3 text-gray-400 group-hover:text-white transition-colors duration-200">
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.name}</span>
                    <ChevronRight
                      size={16}
                      className={`transition-all duration-200 
                        ${
                          isHovered === index
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2"
                        }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer with Logout Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={logout}
              disabled={isLoading}
              className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-[#134B70] transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              {isLoading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                <>
                  <LogOut
                    size={20}
                    className="group-hover:rotate-12 transition-transform duration-200"
                  />
                  <span>Cerrar Sesión</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile with fade animation */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
