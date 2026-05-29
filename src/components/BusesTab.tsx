import React, { useState, useEffect } from "react";
import { Bus, Clock, MapPin, Navigation } from "lucide-react";
import { RutaBus } from "../types";

interface BusesTabProps {
  rutas: RutaBus[];
  loading: boolean;
}

export default function BusesTab({ rutas, loading }: BusesTabProps) {
  const [selectedRutaId, setSelectedRutaId] = useState<number | null>(null);

  // Auto-select first route once loaded
  useEffect(() => {
    if (rutas.length > 0 && selectedRutaId === null) {
      setSelectedRutaId(rutas[0].id);
    }
  }, [rutas, selectedRutaId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse" id="buses-loading">
        <div className="space-y-4 col-span-1">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-12 bg-gray-200 rounded-lg w-full" />
          ))}
        </div>
        <div className="h-64 bg-gray-100 rounded-lg col-span-2" />
      </div>
    );
  }

  const selectedRuta = rutas.find((r) => r.id === selectedRutaId);

  // Color helper mapping for Tailwind
  const getIconColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "text-blue-500 bg-blue-50";
      case "green":
        return "text-emerald-500 bg-emerald-50";
      case "red":
        return "text-red-500 bg-red-50";
      default:
        return "text-indigo-500 bg-indigo-50";
    }
  };

  const getBorderColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "border-blue-500 bg-blue-500";
      case "green":
        return "border-emerald-500 bg-emerald-500";
      case "red":
        return "border-red-500 bg-red-500";
      default:
        return "border-gray-400 bg-gray-400";
    }
  };

  const getPillSelectedClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-600 text-white border-blue-600 shadow-sm";
      case "green":
        return "bg-emerald-600 text-white border-emerald-600 shadow-sm";
      case "red":
        return "bg-red-600 text-white border-red-600 shadow-sm";
      default:
        return "bg-indigo-600 text-white border-indigo-600 shadow-sm";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8" id="buses-tab-container">
      {/* COLUMN 1: SIDEBAR PILLS */}
      <div className="md:col-span-4" id="buses-sidebar">
        <h5 className="text-sm font-bold text-gray-500 tracking-wider uppercase mb-4" id="routes-sidebar-title">
          Seleccione una Ruta
        </h5>
        <div className="space-y-2.5 flex flex-col" id="buses-pills-list">
          {rutas.map((ruta) => {
            const isSelected = selectedRutaId === ruta.id;
            const styleClass = isSelected
              ? getPillSelectedClass(ruta.color)
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300";

            return (
              <button
                key={ruta.id}
                id={`btn-route-${ruta.id}`}
                onClick={() => setSelectedRutaId(ruta.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-semibold text-sm transition duration-200 uppercase tracking-wide cursor-pointer w-full ${styleClass}`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-white/15 text-white" : getIconColorClass(ruta.color)}`}>
                  <Bus className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="block truncate">{ruta.nombre}</span>
                  <span className={`text-[10px] mt-0.5 block ${isSelected ? "text-blue-100" : "text-gray-400"}`}>
                    {ruta.paradas.length} paradas • {ruta.horarios.length} salidas
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* COLUMN 2: ROUTE DETAIL CONTENT */}
      <div className="md:col-span-8" id="buses-content">
        {selectedRuta ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 md:p-8" id="buses-detail-card">
            {/* Header info */}
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-5">
              <div className={`p-4 rounded-xl ${getIconColorClass(selectedRuta.color)}`}>
                <Bus className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">RECORRIDO URBANO</span>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800" id="route-details-title">
                  {selectedRuta.nombre}
                </h3>
              </div>
            </div>

            {/* Diagram of Stops */}
            <div className="mb-10">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-gray-400" />
                Diagrama de Paradas ({selectedRuta.paradas.length})
              </h4>
              
              <div className="relative pl-2 md:pl-4 space-y-0" id="route-stops-diagram">
                {/* Vertical Line */}
                <div 
                  className={`absolute left-[19px] top-4 bottom-4 w-1 rounded-full ${
                    selectedRuta.color === "blue" ? "bg-blue-200" : selectedRuta.color === "green" ? "bg-emerald-200" : "bg-red-200"
                  }`} 
                />

                {selectedRuta.paradas.map((parada, index) => {
                  const isFirst = index === 0;
                  const isLast = index === selectedRuta.paradas.length - 1;

                  return (
                    <div key={index} className="relative flex items-center gap-6 pb-6 last:pb-0" id={`stop-item-${index}`}>
                      {/* Timeline dot */}
                      <div className="z-10 flex items-center justify-center w-[11px] h-[11px] rounded-full ring-4 ring-white">
                        <div 
                          className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                            getBorderColorClass(selectedRuta.color)
                          } ${isFirst || isLast ? "scale-125" : ""}`} 
                        />
                      </div>

                      {/* Stop Info */}
                      <div>
                        <span 
                          className={`font-semibold text-sm md:text-base ${
                            isFirst ? "text-blue-600 font-bold" : isLast ? "text-green-600 font-bold" : "text-gray-700"
                          }`}
                        >
                          {parada}
                        </span>
                        <span className="block text-xs text-gray-400 mt-0.5">
                          {isFirst ? "Estación de Origen / Terminal" : isLast ? "Termino de Recorrido" : `Paradero Urbano N° ${index}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Schedules Outlined Grid */}
            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                Horarios de Salida (Días hábiles)
              </h4>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2.5" id="route-schedules-grid">
                {selectedRuta.horarios.map((hora, hIndex) => (
                  <button
                    key={hIndex}
                    disabled
                    id={`schedule-btn-${hIndex}`}
                    className="border border-gray-200 text-gray-600 font-medium py-1.5 px-2 rounded-lg text-xs md:text-sm hover:border-blue-400 hover:text-blue-600 text-center bg-gray-50 disabled:opacity-100"
                  >
                    {hora}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-4 italic">
                * Las frecuencias estimadas son de 15 a 20 minutos. Sujeto a condiciones del tránsito local de Puerto Montt.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">Por favor seleccione una ruta de la columna izquierda para ver sus datos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
