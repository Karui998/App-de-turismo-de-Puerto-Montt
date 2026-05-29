import React from "react";
import { Star, MapPin, Phone, Clock } from "lucide-react";
import { PuntoTuristico } from "../types";

interface ComercioTabProps {
  comercios: PuntoTuristico[];
  loading: boolean;
}

export default function ComercioTab({ comercios, loading }: ComercioTabProps) {
  // Filter for comercio type
  const listComercios = comercios.filter((l) => l.tipo === "comercio");

  // Classify into Restaurants and Shops (by category keywords or explicitly mapped)
  const restaurantes = listComercios.filter(
    (c) =>
      c.categoria.toLowerCase().includes("comida") ||
      c.categoria.toLowerCase().includes("restaurante") ||
      c.categoria.toLowerCase().includes("café") ||
      c.categoria.toLowerCase().includes("cafetería")
  );

  const tiendas = listComercios.filter(
    (c) =>
      !c.categoria.toLowerCase().includes("comida") &&
      !c.categoria.toLowerCase().includes("restaurante") &&
      !c.categoria.toLowerCase().includes("café") &&
      !c.categoria.toLowerCase().includes("cafetería")
  );

  if (loading) {
    return (
      <div className="space-y-12 animate-pulse" id="comercios-loading">
        <div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[420px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Helper card component to avoid repetition
  const RenderCard = ({ c }: { c: PuntoTuristico }) => (
    <div
      key={c.id}
      id={`comercio-card-${c.id}`}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300 flex flex-col group h-full"
    >
      {/* Top Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={c.url_imagen}
          alt={c.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";
          }}
        />
        {/* Category Orange Tag at top left */}
        <div className="absolute top-3 left-3">
          <span className="bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm" id={`comercio-cat-${c.id}`}>
            {c.categoria}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h5 className="text-base font-bold text-gray-800 text-center mb-2 group-hover:text-amber-600 transition" id={`comercio-title-${c.id}`}>
            {c.titulo}
          </h5>
          <p className="text-gray-500 text-xs leading-relaxed mb-4" id={`comercio-desc-${c.id}`}>
            {c.descripcion}
          </p>

          {/* Details list (map pin and phone) */}
          <div className="space-y-2 mt-2 pt-2 border-t border-gray-50 text-xs text-gray-500">
            {c.direccion && (
              <div className="flex items-start gap-2" id={`comercio-dir-${c.id}`}>
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{c.direccion}</span>
              </div>
            )}
            {c.telefono && (
              <div className="flex items-center gap-2" id={`comercio-tel-${c.id}`}>
                <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>{c.telefono}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer info (Rating and Clock) */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4 text-xs font-medium text-gray-400">
          <div className="flex items-center gap-1 text-amber-500" id={`comercio-rating-${c.id}`}>
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="text-gray-700">{Number(c.rating).toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1.5" id={`comercio-time-${c.id}`}>
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{c.horario}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12" id="comercios-container">
      {/* SECTION 1: RESTAURANTES */}
      <section id="section-restaurants">
        <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3" id="restaurants-header">
          <span className="w-1.5 h-6 bg-orange-500 rounded-full" />
          Restaurantes
        </h4>

        {restaurantes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">No hay restaurantes registrados en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="restaurants-grid">
            {restaurantes.map((c) => (
              <div key={c.id}>
                <RenderCard c={c} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: TIENDAS */}
      <section id="section-shops" className="pt-4">
        <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3" id="shops-header">
          <span className="w-1.5 h-6 bg-orange-500 rounded-full" />
          Tiendas
        </h4>

        {tiendas.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">No hay tiendas registradas en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="shops-grid">
            {tiendas.map((c) => (
              <div key={c.id}>
                <RenderCard c={c} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
