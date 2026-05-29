import React, { useState } from "react";
import { LogIn, LogOut, Settings, MapPin, Menu, Info, FileText } from "lucide-react";
import { UserSession } from "../types";

interface HeaderProps {
  session: UserSession | null;
  onNavigate: (view: "public" | "login" | "admin") => void;
  onLogout: () => void;
  currentView: "public" | "login" | "admin";
}

export default function Header({ session, onNavigate, onLogout, currentView }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white shadow-md relative z-40" id="main-header">
      {/* Decorative southern background glow */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/30 to-transparent pointer-events-none rounded-r-lg" />
      
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row justify-between items-center relative z-10">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <span className="text-3xl font-extrabold tracking-tight" id="header-title">
              Turismo Puerto Montt
            </span>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Chile
            </span>
          </div>
          <p className="text-blue-100 text-sm md:text-base mt-2 font-medium" id="header-subtitle">
            Descubre la puerta de entrada a la Patagonia Chilena
          </p>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex flex-col md:flex-row items-center gap-3 bg-blue-700/50 px-4 py-2 rounded-lg border border-blue-500/30">
              <div className="text-center md:text-right">
                <p className="text-xs text-blue-200">Conectado como</p>
                <p className="text-xs font-bold text-white">{session.nombre}</p>
              </div>
              <div className="flex gap-2">
                {currentView !== "admin" ? (
                  <button
                    id="btn-goto-admin"
                    onClick={() => onNavigate("admin")}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-xs font-bold px-3 py-1.5 rounded-md transition duration-200 shadow-sm"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Panel Admin
                  </button>
                ) : (
                  <button
                    id="btn-goto-public"
                    onClick={() => onNavigate("public")}
                    className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-400 text-xs font-bold px-3 py-1.5 rounded-md transition duration-200 shadow-sm"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Ver Sitio
                  </button>
                )}
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 bg-transparent hover:bg-red-600 border border-blue-400 hover:border-red-600 text-xs font-bold px-3 py-1.5 rounded-md transition duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Salir
                </button>
              </div>
            </div>
          ) : (
            currentView !== "login" && (
              <div className="relative">
                <button
                  id="btn-menu-toggle"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-blue-700/60 border border-blue-500/30 text-blue-100 hover:text-white transition duration-200 cursor-pointer"
                  title="Menú de Navegación"
                >
                  <Menu className="w-5 h-5" />
                </button>
                {isMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-4 py-1.5 border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                        Opciones
                      </div>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          const element = document.getElementById("lugares-interes") || document.getElementById("restaurants-grid");
                          element?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition"
                      >
                        <Info className="w-3.5 h-3.5 text-gray-400" />
                        Información Turística
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        id="btn-login-access"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onNavigate("login");
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-medium transition text-left"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        Acceso Administrativo
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          )}
          
          {currentView === "login" && (
            <button
              id="btn-back-home"
              onClick={() => onNavigate("public")}
              className="text-sm font-semibold text-blue-100 hover:text-white border border-blue-400 hover:border-white px-4 py-2 rounded-lg transition duration-200"
            >
              Volver al Inicio
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
