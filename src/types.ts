export interface PuntoTuristico {
  id: number;
  titulo: string;
  categoria: string;
  descripcion: string;
  direccion?: string;
  telefono?: string;
  rating: number;
  horario: string;
  url_imagen?: string;
  tipo: "lugar" | "comercio";
}

export interface RutaBus {
  id: number;
  nombre: string;
  icono: string;
  color: string;
  paradas: string[];
  horarios: string[];
}

export interface UserSession {
  nombre: string;
  email: string;
  token: string;
}
