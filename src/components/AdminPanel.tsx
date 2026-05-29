import React, { useState } from "react";
import { Plus, Edit, Trash2, Star, Clock, MapPin, Phone, Save, X, RefreshCw, FileImage, Upload } from "lucide-react";
import { PuntoTuristico, UserSession } from "../types";

interface AdminPanelProps {
  session: UserSession;
  lugares: PuntoTuristico[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onAdd: (data: Omit<PuntoTuristico, "id">) => Promise<boolean>;
  onUpdate: (id: number, data: Omit<PuntoTuristico, "id">) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

export default function AdminPanel({
  session,
  lugares,
  loading,
  onRefresh,
  onAdd,
  onUpdate,
  onDelete
}: AdminPanelProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rating, setRating] = useState("5.0");
  const [horario, setHorario] = useState("");
  const [url_imagen, setUrl_imagen] = useState("");
  const [tipo, setTipo] = useState<"lugar" | "comercio">("lugar");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("La imagen supera el límite recomendado de 10 MB. Por favor use una imagen de menor tamaño.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setUrl_imagen(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setTitulo("");
    setCategoria("");
    setDescripcion("");
    setDireccion("");
    setTelefono("");
    setRating("5.0");
    setHorario("");
    setUrl_imagen("");
    setTipo("lugar");
    setErrorMsg("");
    setShowModal(true);
  };

  const handleOpenEdit = (p: PuntoTuristico) => {
    setEditingId(p.id);
    setTitulo(p.titulo);
    setCategoria(p.categoria);
    setDescripcion(p.descripcion);
    setDireccion(p.direccion || "");
    setTelefono(p.telefono || "");
    setRating(String(p.rating));
    setHorario(p.horario);
    setUrl_imagen(p.url_imagen || "");
    setTipo(p.tipo);
    setErrorMsg("");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !categoria || !descripcion || !horario || !tipo) {
      setErrorMsg("Los campos Título, Categoría, Descripción, Horario y Tipo son obligatorios.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    
    const payload = {
      titulo,
      categoria,
      descripcion,
      direccion,
      telefono,
      rating: parseFloat(rating) || 5.0,
      horario,
      url_imagen: url_imagen || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
      tipo
    };

    try {
      let success = false;
      if (editingId !== null) {
        success = await onUpdate(editingId, payload);
      } else {
        success = await onAdd(payload);
      }

      if (success) {
        setSuccessMsg(editingId !== null ? "Recurso actualizado con éxito." : "Recurso creado con éxito.");
        setShowModal(false);
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("Error al salvar el registro. Inicie sesión de nuevo.");
      }
    } catch (e) {
      setErrorMsg("Ocurrió un error inesperado al guardar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = async (id: number, name: string) => {
    if (confirm(`¿Está seguro de que desea eliminar "${name}" permanentemente de la plataforma?`)) {
      setSubmitting(true);
      const res = await onDelete(id);
      if (res) {
        setSuccessMsg("Registro eliminado correctamente.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg("Error al eliminar el registro.");
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-8" id="admin-panel-viewport">
      <div className="max-w-7xl mx-auto px-4" id="admin-panel-container">
        
        {/* Top bar description */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6" id="admin-bar-desc">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
              Gestor de Contenidos Turísticos
            </h1>
            <p className="text-sm text-gray-400 font-medium">
              Administre la base de datos de Atractivos Turísticos, Comercios y Restaurantes de Puerto Montt.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onRefresh()}
              className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold px-3 py-2.5 rounded-lg transition"
              title="Sincronizar"
              id="admin-sync-btn"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refrescar
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition transform active:scale-95 cursor-pointer"
              id="admin-create-btn"
            >
              <Plus className="w-4 h-4" />
              Nuevo Atractivo / Comercio
            </button>
          </div>
        </div>

        {/* Global state messages */}
        {successMsg && (
          <div className="mb-4 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm font-bold animate-fadeIn">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-bold">
            {errorMsg}
          </div>
        )}

        {/* Management Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden" id="admin-table-wrapper">
          {loading && lugares.length === 0 ? (
            <div className="py-20 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-sm">Cargando base de datos de turismo...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" id="admin-table">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Elemento</th>
                    <th className="py-4 px-6">Tipo</th>
                    <th className="py-4 px-6">Categoría</th>
                    <th className="py-4 px-6">Contacto / Dirección</th>
                    <th className="py-4 px-6">Horario / Valoración</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm font-semibold text-gray-700">
                  {lugares.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition" id={`admin-row-${p.id}`}>
                      {/* Element info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.url_imagen}
                            alt={p.titulo}
                            className="w-12 h-12 object-cover rounded-lg bg-gray-100 border"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-gray-800 block text-sm">{p.titulo}</span>
                            <span className="text-[11px] text-gray-400 font-medium block max-w-xs truncate">{p.descripcion}</span>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-6">
                        {p.tipo === "lugar" ? (
                          <span className="bg-blue-100/70 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Atractivo
                          </span>
                        ) : (
                          <span className="bg-orange-100/70 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Comercio
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="text-gray-600 text-xs">{p.categoria}</span>
                      </td>

                      {/* Contact / Direction */}
                      <td className="py-4 px-6 text-xs text-gray-500">
                        {p.direccion ? (
                          <p className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {p.direccion}</p>
                        ) : (
                          <p className="text-gray-300 italic">No especificada</p>
                        )}
                        {p.telefono && (
                          <p className="flex items-center gap-1 mt-1 font-mono"><Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {p.telefono}</p>
                        )}
                      </td>

                      {/* Schedules & Rating */}
                      <td className="py-4 px-6 text-xs text-gray-500">
                        <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {p.horario}</p>
                        <p className="flex items-center gap-1 mt-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" /> {Number(p.rating).toFixed(1)}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex gap-1.5 justify-end">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar Atractivo"
                            id={`admin-edit-btn-${p.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(p.id, p.titulo)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar del Sitio"
                            id={`admin-delete-btn-${p.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && lugares.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-gray-400 font-medium">No se encontraron atractivos en el sistema. Registre uno nuevo arriba.</p>
            </div>
          )}
        </div>

        {/* CREATE / EDIT MODAL DIALOG */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn" id="admin-modal">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border overflow-hidden">
              {/* Header */}
              <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
                <h3 className="font-extrabold text-lg">
                  {editingId !== null ? `Editar: ${titulo}` : "Registrar Nuevo Atractivo o Comercio"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full cursor-pointer"
                  id="admin-modal-close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSave} className="p-6 space-y-4" id="admin-modal-form">
                
                {/* Error Box */}
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-lg">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Título del Lugar *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Mercado de Angelmó"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border focus:border-blue-500 focus:ring-1 py-2 px-3 rounded-xl text-sm"
                    />
                  </div>

                  {/* Type Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Tipo de Recurso *</label>
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value as "lugar" | "comercio")}
                      className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border focus:border-blue-500 focus:ring-1 py-2 px-3 rounded-xl text-sm font-semibold text-gray-700"
                    >
                      <option value="lugar">Atractivo Turístico (Pestaña 1)</option>
                      <option value="comercio">Tiendas y Restaurantes (Pestaña 2)</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Categoría *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Comida tradicional / Paisaje Natural"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border focus:border-blue-500 focus:ring-1 py-2 px-3 rounded-xl text-sm"
                    />
                  </div>

                  {/* Rating */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Calificación inicial (Rating 1.0 - 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border focus:border-blue-500 focus:ring-1 py-2 px-3 rounded-xl text-sm"
                    />
                  </div>

                  {/* Horario */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Horario de Funcionamiento *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 08:00 - 20:00 / Abierto 24h"
                      value={horario}
                      onChange={(e) => setHorario(e.target.value)}
                      className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border focus:border-blue-500 focus:ring-1 py-2 px-3 rounded-xl text-sm"
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Teléfono de contacto</label>
                    <input
                      type="text"
                      placeholder="Ej: +56 65 225 1111"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border focus:border-blue-500 focus:ring-1 py-2 px-3 rounded-xl text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Dirección Física</label>
                  <input
                    type="text"
                    placeholder="Ej: Av. Costanera Diego Portales 1200, Puerto Montt"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border focus:border-blue-500 focus:ring-1 py-2 px-3 rounded-xl text-sm"
                  />
                </div>

                {/* Imagen del Atractivo (URL o Local) */}
                <div className="space-y-2 bg-gray-50/50 p-4 rounded-xl border border-gray-200">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block flex items-center gap-1.5">
                    <FileImage className="w-4 h-4 text-blue-500" />
                    Imagen del Atractivo o Comercio (Elegir fuente)
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                    {/* Opción 1: Enlace Web / URL */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Opción 1: Enlace Web (URL)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={url_imagen.startsWith('data:') ? "" : url_imagen}
                        onChange={(e) => setUrl_imagen(e.target.value)}
                        className="w-full bg-white border focus:border-blue-500 focus:ring-1 py-1.5 px-3 rounded-xl text-xs"
                      />
                      <p className="text-[10px] text-gray-400">Pegue un enlace de Unsplash o cualquier servidor de imágenes.</p>
                    </div>

                    {/* Opción 2: Subir archivo Local */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Opción 2: Subir desde el Equipo</label>
                      <div className="relative flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl bg-white p-2.5 text-center transition cursor-pointer min-h-[46px]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold pointer-events-none">
                          <Upload className="w-4 h-4 text-blue-500" />
                          <span>Buscar imagen local...</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400">Seleccione un archivo PNG o JPG de su dispositivo.</p>
                    </div>
                  </div>

                  {/* Thumbnail Preview Area if an image is provided */}
                  {url_imagen && (
                    <div className="mt-2 pt-3 border-t border-gray-200 flex items-center gap-3 bg-white p-2 rounded-lg">
                      <img
                        src={url_imagen}
                        alt="Vista previa"
                        className="w-12 h-12 object-cover rounded-lg border bg-gray-50 shrink-0"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-gray-700 block text-xs">Imagen cargada activa</span>
                        <span className="text-[10px] text-gray-400 block truncate font-mono">
                          {url_imagen.startsWith('data:') ? 'Imagen local (Codificada Base64)' : url_imagen}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUrl_imagen("")}
                        className="text-xs text-red-600 hover:text-red-800 font-bold hover:underline px-2"
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Descripción Detallada *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describa las maravillas turísticas de este lugar..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full bg-gray-50 hover:bg-gray-100/50 focus:bg-white border focus:border-blue-500 focus:ring-1 py-2 px-3 rounded-xl text-sm"
                  />
                </div>

                {/* Submit buttons */}
                <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-2.5 px-4 rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs py-2.5 px-5 rounded-xl cursor-pointer shadow-md"
                    id="admin-save-item-btn"
                  >
                    <Save className="w-4 h-4" />
                    {submitting ? "Guardando..." : "Guardar Registro"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
