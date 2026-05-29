import React from "react";
import { Star, Clock } from "lucide-react";
import { PuntoTuristico } from "../types";

interface LugaresTabProps {
  lugares: PuntoTuristico[];
  loading: boolean;
}

export default function LugaresTab({ lugares, loading }: LugaresTabProps) {
  const lugaresTurismo = lugares.filter((l) => l.tipo === "lugar");

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse" id="lugares-loading">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[400px]" />
        ))}
      </div>
    );
  }

  if (lugaresTurismo.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200" id="lugares-empty">
        <p className="text-gray-500 font-medium">No se encontraron lugares turísticos disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="lugares-grid">
      {lugaresTurismo.map((lugar) => (
        <div
          key={lugar.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300 flex flex-col group h-full"
          id={`lugar-card-${lugar.id}`}
        >
          {/* Panoramic Image */}
          <div className="relative h-48 overflow-hidden bg-gray-100">
            <img
              src={lugar.url_imagen}
              alt={lugar.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback image in case of broken link
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80";
              }}
            />
            <div className="absolute top-3 left-3">
              <span className="bg-blue-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                {lugar.categoria}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 text-center mb-2 group-hover:text-blue-600 transition" id={`lugar-title-${lugar.id}`}>
                {lugar.titulo}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed" id={`lugar-desc-${lugar.id}`}>
                {lugar.descripcion}
              </p>
              {lugar.direccion && (
                <p className="text-xs text-gray-400 mt-2 italic">
                  {lugar.direccion}
                </p>
              )}
            </div>

            {/* Footer containing Rating and Horario at opposite ends */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-1 text-amber-500" id={`lugar-rating-${lugar.id}`}>
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{Number(lugar.rating).toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-400" id={`lugar-time-${lugar.id}`}>
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{lugar.horario}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
