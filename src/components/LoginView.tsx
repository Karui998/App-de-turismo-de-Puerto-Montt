import React, { useState } from "react";
import { Mail, KeyRound, ArrowLeft, LogIn, Check, Info } from "lucide-react";

interface LoginViewProps {
  onLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  onBack: () => void;
  onRegister: (nombre: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
}

export default function LoginView({ onLogin, onBack, onRegister }: LoginViewProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!nombre || !email || !password) {
          setErrorMsg("Todos los campos son obligatorios.");
          setLoading(false);
          return;
        }
        const res = await onRegister(nombre, email, password);
        if (res.success) {
          setSuccessMsg("Administrador creado con éxito. Ya puedes iniciar sesión.");
          setIsRegisterMode(false);
          setPassword(""); // Clear pass
        } else {
          setErrorMsg(res.error || "Error al registrar el administrador.");
        }
      } else {
        if (!email || !password) {
          setErrorMsg("Por favor ingrese su correo y contraseña.");
          setLoading(false);
          return;
        }
        const res = await onLogin(email, password);
        if (!res.success) {
          setErrorMsg(res.error || "Credenciales incorrectas.");
        }
      }
    } catch (err) {
      setErrorMsg("Ocurrió un error inesperado al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.8)), url("https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80")',
      }}
      id="login-view-container"
    >
      {/* Floating Header Actions */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs py-2 px-4 rounded-full backdrop-blur-md transition cursor-pointer border border-white/10"
          id="login-back-home-button"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Turismo Público
        </button>
      </div>

      {/* Main card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-10" id="login-card">
        {/* Top graphic header */}
        <div className="bg-blue-600 px-6 py-8 text-center text-white relative">
          <div className="mx-auto w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight" id="login-card-title">
            {isRegisterMode ? "Registro de Admin" : "Inicio de Sesión"}
          </h2>
          <p className="text-blue-100 text-xs mt-1">
            {isRegisterMode
              ? "Crea una nueva cuenta de administrador"
              : "Panel de Gestión de Turismo de Puerto Montt"}
          </p>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4" id="login-form">
          
          {/* Default values Helper banner */}
          {!isRegisterMode && (
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-2.5 text-xs text-blue-800" id="login-helper-banner">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Acceso de prueba preestablecido:</p>
                <p className="mt-0.5">Correo: <span className="font-mono bg-blue-100/50 px-1 py-0.5 rounded text-[11px] font-bold">admin@turismopuertomontt.cl</span></p>
                <p>Contraseña: <span className="font-mono bg-blue-100/50 px-1 py-0.5 rounded text-[11px] font-bold">admin123</span></p>
              </div>
            </div>
          )}

          {/* Messages */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-xs font-semibold" id="login-error-msg">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-lg text-xs font-semibold" id="login-success-msg">
              {successMsg}
            </div>
          )}

          {isRegisterMode && (
            <div className="space-y-1.5" id="group-nombre">
              <label className="text-gray-700 text-xs font-bold uppercase tracking-wider block">
                Nombre Completo
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <span className="w-4 text-xs font-bold">Aa</span>
                </span>
                <input
                  type="text"
                  required
                  placeholder="Ej: Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold text-gray-800 transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5" id="group-email">
            <label className="text-gray-700 text-xs font-bold uppercase tracking-wider block">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="admin@correo.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold text-gray-800 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5" id="group-password">
            <div className="flex justify-between items-center">
              <label className="text-gray-700 text-xs font-bold uppercase tracking-wider block">
                Contraseña
              </label>
              {!isRegisterMode && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Para restablecer su contraseña de administrador, comuníquese con el departamento técnico local.");
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  id="forgot-password-link"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold text-gray-800 transition"
              />
            </div>
          </div>

          {/* Recordarme option */}
          {!isRegisterMode && (
            <div className="flex items-center" id="group-remember">
              <label className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                Recordarme en este equipo
              </label>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-blue-500/10 hover:shadow-xl transition duration-200 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:bg-blue-400"
            id="btn-login-submit"
          >
            {loading ? "Procesando..." : isRegisterMode ? "Crear Cuenta de Admin" : "Iniciar Sesión"}
          </button>

          {/* Footer toggle Account */}
          <div className="text-center pt-4 border-t border-gray-100 text-xs text-gray-500" id="login-footer">
            {isRegisterMode ? (
              <p>
                ¿Ya posees una cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                >
                  Iniciar Sesión
                </button>
              </p>
            ) : (
              <p>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                >
                  Crear una
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
