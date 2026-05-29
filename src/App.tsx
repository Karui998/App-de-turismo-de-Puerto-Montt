import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Map, Store, Bus, Sparkles } from "lucide-react";
import { PuntoTuristico, RutaBus, UserSession } from "./types";
import Header from "./components/Header";
import LugaresTab from "./components/LugaresTab";
import ComercioTab from "./components/ComercioTab";
import BusesTab from "./components/BusesTab";
import LoginView from "./components/LoginView";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [currentView, setCurrentView] = useState<"public" | "login" | "admin">("public");
  const [activeTab, setActiveTab] = useState<"lugares" | "comercios" | "buses">("lugares");
  const [session, setSession] = useState<UserSession | null>(null);

  // Business Data States
  const [lugares, setLugares] = useState<PuntoTuristico[]>([]);
  const [rutas, setRutas] = useState<RutaBus[]>([]);
  
  // Loading & error states
  const [loadingLugares, setLoadingLugares] = useState(true);
  const [loadingRutas, setLoadingRutas] = useState(true);
  const [globalError, setGlobalError] = useState("");

  // Load Admin session from localStorage on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem("turismo_admin_session");
      if (stored) {
        const parsed: UserSession = JSON.parse(stored);
        // Basic expiry/integrity proof
        if (parsed.token && parsed.nombre) {
          setSession(parsed);
        }
      }
    } catch (e) {
      console.error("Error reading session from local storage:", e);
    }
  }, []);

  // Fetch Public Data (Lugares & Comercios)
  const fetchLugares = async () => {
    setLoadingLugares(true);
    setGlobalError("");
    try {
      const res = await fetch("/api/turismo/lugares");
      if (!res.ok) {
        throw new Error("Error " + res.status + " recuperando datos turísticos");
      }
      const data = await res.json();
      setLugares(data);
    } catch (error) {
      console.error("Error fetching places:", error);
      setGlobalError("No pudimos conectar con el servidor para cargar los atractivos turísticos. Reintentando...");
    } finally {
      setLoadingLugares(false);
    }
  };

  // Fetch Bus Routes and Schedules
  const fetchRutas = async () => {
    setLoadingRutas(true);
    try {
      const res = await fetch("/api/turismo/rutas");
      if (!res.ok) {
        throw new Error("Error " + res.status + " recuperando rutas de buses");
      }
      const data = await res.json();
      setRutas(data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoadingRutas(false);
    }
  };

  // Fetch all initial data on mount
  useEffect(() => {
    fetchLugares();
    fetchRutas();
  }, []);

  // API Call handlers for Admin CRUD operations
  const handleLogin = async (email: string, pass: string) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const userSession: UserSession = {
          nombre: data.user.nombre,
          email: data.user.email,
          token: data.token,
        };
        setSession(userSession);
        localStorage.setItem("turismo_admin_session", JSON.stringify(userSession));
        setCurrentView("admin");
        return { success: true };
      } else {
        return { success: false, error: data.error || "Datos incorrectos" };
      }
    } catch (err) {
      return { success: false, error: "Servidor no disponible" };
    }
  };

  const handleRegister = async (nombre: string, email: string, pass: string) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true };
      } else {
        return { success: false, error: data.error || "Error al crear cuenta" };
      }
    } catch (err) {
      return { success: false, error: "Servidor no disponible" };
    }
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem("turismo_admin_session");
    setCurrentView("public");
  };

  // ADMIN CRUD API proxy actions
  const handleAddLugar = async (payload: Omit<PuntoTuristico, "id">): Promise<boolean> => {
    if (!session) return false;
    try {
      const res = await fetch("/api/turismo/lugares", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchLugares();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleUpdateLugar = async (id: number, payload: Omit<PuntoTuristico, "id">): Promise<boolean> => {
    if (!session) return false;
    try {
      const res = await fetch(`/api/turismo/lugares/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchLugares();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleDeleteLugar = async (id: number): Promise<boolean> => {
    if (!session) return false;
    try {
      const res = await fetch(`/api/turismo/lugares/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });
      if (res.ok) {
        await fetchLugares();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Router dispatcher
  if (currentView === "login") {
    return (
      <LoginView
        onLogin={handleLogin}
        onRegister={handleRegister}
        onBack={() => setCurrentView("public")}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 selection:bg-blue-500 selection:text-white" id="app-root-view">
      {/* Universal header */}
      <Header
        session={session}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onLogout={handleLogout}
      />

      {currentView === "admin" && session ? (
        // ADMINISTRATOR MANAGEMENT PORTAL
        <AdminPanel
          session={session}
          lugares={lugares}
          loading={loadingLugares}
          onRefresh={fetchLugares}
          onAdd={handleAddLugar}
          onUpdate={handleUpdateLugar}
          onDelete={handleDeleteLugar}
        />
      ) : (
        // PUBLIC FACING TOURIST INFORMATION SITE
        <main className="pb-16" id="public-main">
          {/* Navigation Tabs bar centered */}
          <div className="border-b border-gray-200 bg-white sticky top-0 z-30 shadow-xs" id="navigation-tabs-wrapper">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center -mb-px space-x-2 md:space-x-8" id="navigation-tabs">
                
                {/* Tab 1 */}
                <button
                  id="tab-lugares"
                  onClick={() => setActiveTab("lugares")}
                  className={`flex items-center gap-2 py-4 px-4 border-b-2 font-bold text-xs md:text-sm transition-all duration-200 uppercase tracking-wider cursor-pointer ${
                    activeTab === "lugares"
                      ? "border-blue-600 text-blue-600 font-extrabold"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Map className="w-4 h-4" />
                  Lugares Turísticos
                </button>

                {/* Tab 2 */}
                <button
                  id="tab-comercios"
                  onClick={() => setActiveTab("comercios")}
                  className={`flex items-center gap-2 py-4 px-4 border-b-2 font-bold text-xs md:text-sm transition-all duration-200 uppercase tracking-wider cursor-pointer ${
                    activeTab === "comercios"
                      ? "border-blue-600 text-blue-600 font-extrabold"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Store className="w-4 h-4" />
                  Tiendas y Restaurantes
                </button>

                {/* Tab 3 */}
                <button
                  id="tab-buses"
                  onClick={() => setActiveTab("buses")}
                  className={`flex items-center gap-2 py-4 px-4 border-b-2 font-bold text-xs md:text-sm transition-all duration-200 uppercase tracking-wider cursor-pointer ${
                    activeTab === "buses"
                      ? "border-blue-600 text-blue-600 font-extrabold"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Bus className="w-4 h-4" />
                  Buses y Horarios
                </button>
              </div>
            </div>
          </div>

          {/* Subheader info block for engagement */}
          <div className="bg-white py-10 border-b border-gray-100 flex flex-col items-center justify-center text-center shadow-xs mb-8">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100/50 mb-3">
              <Sparkles className="w-3 h-3 text-blue-600 animate-pulse" />
              Puerto Montt Oficial
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight max-w-xl px-4">
              {activeTab === "lugares" && "Destinos inolvidables bañados de mar y volcanes"}
              {activeTab === "comercios" && "Sabores milenarios y artesanía patagónica única"}
              {activeTab === "buses" && "Líneas de movilización y recorridos locales detallados"}
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mt-2 max-w-md px-4 font-medium">
              {activeTab === "lugares" && "Planifica tu viaje recorriendo miradores marinos, catedrales de alerce nativo, y lagunas andinas mágicas."}
              {activeTab === "comercios" && "Disfruta de las mejores picadas tradicionales de curantos y alfajores, o la lana chilota más fina en Angelmó."}
              {activeTab === "buses" && "Encuentra frecuencias, terminales de buses satélite, y horas de salida programadas por ruta."}
            </p>
          </div>

          {/* Main Public Content Tab Frame with Motion transitions */}
          <div className="max-w-7xl mx-auto px-4" id="tab-content-frame">
            {globalError && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-xl flex items-center justify-between">
                <span>{globalError}</span>
                <button 
                  onClick={() => {
                    fetchLugares();
                    fetchRutas();
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1 px-3 rounded text-[11px] uppercase tracking-wider transition cursor-pointer"
                >
                  Reintentar
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                id="active-tab-container"
              >
                {activeTab === "lugares" && (
                  <LugaresTab lugares={lugares} loading={loadingLugares} />
                )}
                {activeTab === "comercios" && (
                  <ComercioTab comercios={lugares} loading={loadingLugares} />
                )}
                {activeTab === "buses" && (
                  <BusesTab rutas={rutas} loading={loadingRutas} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Elegant "Acerca de" Section */}
            <section className="mt-20 border-t border-gray-200/80 pt-16" id="about-section">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 md:p-12 relative overflow-hidden max-w-4xl mx-auto">
                {/* Decorative visual accent */}
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
                
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Acerca del Portal
                </span>
                
                <h3 className="text-xl md:text-2xl font-black text-gray-800 mt-4 mb-4 tracking-tight">
                  ¿Por qué existe esta plataforma?
                </h3>
                
                <div className="space-y-4 text-sm md:text-base text-gray-500 leading-relaxed font-medium">
                  <p>
                    Este portal turístico ha sido creado de forma integral para dotar a la comuna de <strong>Puerto Montt</strong> de una ventana digital oficial y moderna. Su objetivo primordial es centralizar y democratizar la información relevante tanto para viajeros chilenos e internacionales como para los propios habitantes de la zona.
                  </p>
                  <p>
                    A través de esta plataforma, resolvemos tres necesidades fundamentales:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-400">
                    <li><strong className="text-gray-500">Puesta en valor de atractivos:</strong> Visibilizamos de manera interactiva lugares icónicos como el Mercado de Angelmó, el Monumento de la Costanera o el majestuoso Parque Alerce Andino.</li>
                    <li><strong className="text-gray-500">Apoyo al Comercio Local:</strong> Facilitamos un escaparate digital para restaurantes, picadas típicas y tiendas de artesanía patagónica, conectándolos directamente con sus clientes.</li>
                    <li><strong className="text-gray-500">Fomento de la Movilidad:</strong> Informamos de manera transparente sobre las frecuencias, tarifas y los recorridos de los buses locales y satélites.</li>
                  </ul>
                  <p className="mt-4">
                    Con esto, promovemos un turismo sustentable, informado y ordenado, impulsando el desarrollo socioeconómico de la puerta de entrada a la Patagonia Chilena.
                  </p>
                </div>

                {/* Direct alternative administrative access card embedded inside */}
                <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">¿Eres parte del equipo Municipal?</h4>
                    <p className="text-xs text-gray-400">Accede directamente al panel para gestionar los destinos de la comuna.</p>
                  </div>
                  <button
                    onClick={() => setCurrentView("login")}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-xs font-bold text-gray-600 hover:text-blue-600 rounded-xl transition duration-200 cursor-pointer text-center"
                  >
                    Iniciar Sesión Administrador
                  </button>
                </div>
              </div>
            </section>

          </div>
        </main>
      )}

      {/* Footer credits bar */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center text-xs text-gray-400 font-medium z-10 relative">
        <p>© {new Date().getFullYear()} Turismo Comuna Puerto Montt. Todos los derechos reservados.</p>
        <p className="mt-1">Puerta de Entrada a la Carretera Austral y la Patagonia Chilena.</p>
      </footer>
    </div>
  );
}
