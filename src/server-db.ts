import fs from "fs";
import path from "path";
import pg from "pg";
import bcrypt from "bcryptjs";

// Types
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

export interface UsuarioAdmin {
  id: number;
  nombre: string;
  email: string;
  password_hash: string;
}

// Data Store paths for JSON Fallback
const JSON_STORE_PATH = path.join(process.cwd(), "data_store.json");

// Default initial data to seed database or JSON fallback
const DEFAULT_PUNTOS: PuntoTuristico[] = [
  {
    id: 1,
    titulo: "Mercado de Angelmó",
    categoria: "Patrimonio y Gastronomía",
    descripcion: "Famoso centro artesanal y gastronómico de la zona. Destaca por sus palafitos, artesanías en lana o madera, y cocinerías tradicionales con los mariscos más frescos frente a la Isla Tenglo.",
    direccion: "Av. Angelmó 2200, Puerto Montt",
    rating: 4.7,
    horario: "08:00 - 18:30",
    url_imagen: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    tipo: "lugar"
  },
  {
    id: 2,
    titulo: "Senda Costanera",
    categoria: "Paseo Peatonal",
    descripcion: "Amplio paseo costero que bordea el Seno de Reloncaví. Ideal para caminatas familiares, running nocturno, espectaculares atardeceres y contemplar las esculturas icónicas frente al mar.",
    direccion: "Av. Diego Portales, Puerto Montt",
    rating: 4.5,
    horario: "Abierto 24 horas",
    url_imagen: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
    tipo: "lugar"
  },
  {
    id: 3,
    titulo: "Parque Nacional Alerce Andino",
    categoria: "Naturaleza Salvaje",
    descripcion: "Parte de la Reserva de la Biosfera de los Bosques Templados Lluviosos de los Andes Australes. Hogar de alerces milenarios, hermosas lagunas y una abundante fauna nativa como el pudú y el monito del monte.",
    direccion: "Carretera Austral Km 40, Puerto Montt",
    telefono: "+56 65 248 6115",
    rating: 4.9,
    horario: "09:00 - 17:00",
    url_imagen: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    tipo: "lugar"
  },
  {
    id: 4,
    titulo: "Isla Tenglo y Cruz del Milenio",
    categoria: "Mirador Natural",
    descripcion: "Preciosa isla ubicada frente a la ciudad de Puerto Montt. Ofrece el tradicional mirador de la Cruz del Milenio, con una espectacular vista panorámica de 360 grados de toda la bahía y volcanes.",
    direccion: "Embarcadero Angelmó (Cruce en lancha)",
    rating: 4.6,
    horario: "09:00 - 18:00",
    url_imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    tipo: "lugar"
  },
  {
    id: 5,
    titulo: "Catedral de Puerto Montt",
    categoria: "Monumento Histórico",
    descripcion: "Emblemática iglesia construida enteramente en maderas nativas como el alerce en el año 1856. Situada frente a la Plaza de Armas, representando la edificación más antigua de la comuna chilena.",
    direccion: "Urmeneta 450, Puerto Montt",
    rating: 4.4,
    horario: "09:00 - 19:00",
    url_imagen: "https://images.unsplash.com/photo-1548625361-155deea22300?auto=format&fit=crop&w=800&q=80",
    tipo: "lugar"
  },
  {
    id: 6,
    titulo: "Restaurante El Estaleiro",
    categoria: "Comida tradicional",
    descripcion: "Restaurante rústico con vista al mar que ofrece la mejor selección de mariscos chilenos, pescados a la plancha y el tradicional cancato salmón.",
    direccion: "Av. Angelmó 2230, Puerto Montt",
    telefono: "+56 65 243 4567",
    rating: 4.8,
    horario: "12:00 - 22:00",
    url_imagen: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    tipo: "comercio"
  },
  {
    id: 7,
    titulo: "Cocinería Doña Olga",
    categoria: "Comida tradicional",
    descripcion: "La picada ultra-famosa de Angelmó. Ven a degustar el curanto en hoyo original, pulmay en olla, empanadas fritas de mariscos gigantescas y sopaipillas pasadas caseras.",
    direccion: "Mercado Costanera Angelmó, Local 14",
    telefono: "+56 9 8765 4321",
    rating: 4.7,
    horario: "09:00 - 18:00",
    url_imagen: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    tipo: "comercio"
  },
  {
    id: 8,
    titulo: "Café Haussmann Puerto Montt",
    categoria: "Cafetería y Repostería",
    descripcion: "Tranquilo rincón de herencia colonial alemana. Disfruta de sus insuperables sándwiches crudos, tártaros tradicionales, y exquisitos kuchens de frambuesa, arándanos o manzana.",
    direccion: "Calle San Martín 115, Puerto Montt",
    telefono: "+56 65 225 1251",
    rating: 4.6,
    horario: "09:30 - 20:30",
    url_imagen: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    tipo: "comercio"
  },
  {
    id: 9,
    titulo: "Artesanías Melipulli",
    categoria: "Tienda de Souvenirs",
    descripcion: "Galería comercial de locatarios locales. Podrás comprar hermosos chalecos tejidos a mano con lana natural chilota, figuras talladas en madera de alerce y recuerdos típicos marinos.",
    direccion: "Av. Diego Portales 1100, Puerto Montt",
    telefono: "+56 9 1234 5678",
    rating: 4.5,
    horario: "10:00 - 19:30",
    url_imagen: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=800&q=80",
    tipo: "comercio"
  },
  {
    id: 10,
    titulo: "Chocolates Varsovienne",
    categoria: "Tienda de Chocolates",
    descripcion: "Destacada chocolatería fina con materias primas de la Patagonia. Alfajores de calafate, trufas licorescas chilenas, tabletas de chocolate de leche con avellanas tostadas silvestres.",
    direccion: "Mall Paseo del Mar, Local 112",
    telefono: "+56 65 228 9081",
    rating: 4.7,
    horario: "10:00 - 21:00",
    url_imagen: "https://images.unsplash.com/photo-1481391319762-47dff72954d4?auto=format&fit=crop&w=800&q=80",
    tipo: "comercio"
  }
];

const DEFAULT_RUTAS: RutaBus[] = [
  {
    id: 1,
    nombre: "Ruta 1: Centro - Angelmó",
    icono: "bus",
    color: "blue",
    paradas: ["Plaza de Armas", "Centro Comercial", "Terminal de Buses", "Muelle de Paseos", "Mercado Angelmó"],
    horarios: ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
  },
  {
    id: 2,
    nombre: "Ruta 3: Centro - Alerce",
    icono: "bus",
    color: "green",
    paradas: ["Terminal de Buses", "Avenida Presidente Ibáñez", "Viaducto Alerce", "Alerce Histórico", "Alerce Norte"],
    horarios: ["06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"]
  },
  {
    id: 3,
    nombre: "Ruta 5: Pelluco - Chinquihue",
    icono: "bus",
    color: "red",
    paradas: ["Balneario Pelluco", "Universidad Austral", "Plaza de Armas", "Terminal de Buses", "Estadio Chinquihue"],
    horarios: ["07:15", "07:45", "08:15", "08:45", "09:15", "09:45", "10:15", "11:15", "12:15", "13:15", "14:15", "15:15", "16:15", "17:15", "18:15", "19:15", "20:15"]
  }
];

// Default admin: user = admin@turismopuertomontt.cl, pass = admin123
const DEFAULT_USER: UsuarioAdmin = {
  id: 1,
  nombre: "Administrador Turismo",
  email: "admin@turismopuertomontt.cl",
  password_hash: "$2a$10$Wp89UaXFf4GgDWhh016dpeLqKbe.8RkNoU.R/7VunrN8M793vAEPi" // bcrypt hash of admin123
};

// Database Pool Initialization
let pool: pg.Pool | null = null;
const isPostgresConfigured = !!process.env.DATABASE_URL;

if (isPostgresConfigured) {
  console.log("PostgreSQL DATABASE_URL detected. Connecting to Neon...");
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  // Test connection & seed Postgres tables if configured
  pool.connect()
    .then(async (client) => {
      console.log("Successfully connected to PostgreSQL!");
      try {
        // Create tables if they don't exist
        await client.query(`
          CREATE TABLE IF NOT EXISTS usuarios_admin (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS puntos_turisticos (
            id SERIAL PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            categoria VARCHAR(255) NOT NULL,
            descripcion TEXT NOT NULL,
            direccion TEXT,
            telefono VARCHAR(50),
            rating NUMERIC(3,2) DEFAULT 5.00,
            horario VARCHAR(100) NOT NULL,
            url_imagen TEXT,
            tipo VARCHAR(50) NOT NULL,
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS rutas_buses (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            icono VARCHAR(50) NOT NULL,
            color VARCHAR(50) NOT NULL,
            paradas TEXT[] NOT NULL,
            horarios VARCHAR(5)[] NOT NULL,
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Check and seed default admin
        const adminCheck = await client.query("SELECT id, password_hash FROM usuarios_admin WHERE email = $1", [DEFAULT_USER.email]);
        if (adminCheck.rows.length === 0) {
          await client.query(
            "INSERT INTO usuarios_admin (nombre, email, password_hash) VALUES ($1, $2, $3)",
            [DEFAULT_USER.nombre, DEFAULT_USER.email, DEFAULT_USER.password_hash]
          );
          console.log("Seeded default admin into PostgreSQL database.");
        } else if (adminCheck.rows[0].password_hash !== DEFAULT_USER.password_hash) {
          await client.query(
            "UPDATE usuarios_admin SET password_hash = $1 WHERE email = $2",
            [DEFAULT_USER.password_hash, DEFAULT_USER.email]
          );
          console.log("Updated default admin password hash in PostgreSQL database to correct value.");
        }

        // Check and seed points
        const countCheck = await client.query("SELECT COUNT(*) FROM puntos_turisticos");
        if (parseInt(countCheck.rows[0].count) === 0) {
          for (const p of DEFAULT_PUNTOS) {
            await client.query(
              "INSERT INTO puntos_turisticos (titulo, categoria, descripcion, direccion, telefono, rating, horario, url_imagen, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
              [p.titulo, p.categoria, p.descripcion, p.direccion, p.telefono, p.rating, p.horario, p.url_imagen, p.tipo]
            );
          }
          console.log("Seeded tourist places into PostgreSQL database.");
        }

        // Check and seed routes
        const routesCheck = await client.query("SELECT COUNT(*) FROM rutas_buses");
        if (parseInt(routesCheck.rows[0].count) === 0) {
          for (const r of DEFAULT_RUTAS) {
            await client.query(
              "INSERT INTO rutas_buses (nombre, icono, color, paradas, horarios) VALUES ($1, $2, $3, $4, $5)",
              [r.nombre, r.icono, r.color, r.paradas, r.horarios]
            );
          }
          console.log("Seeded bus routes into PostgreSQL database.");
        }
      } catch (err) {
        console.error("Error setting up schemas in PostgreSQL:", err);
      } finally {
        client.release();
      }
    })
    .catch((err) => {
      console.error("Could not establish initial connection with PostgreSQL:", err);
      console.log("Falling back safely to local JSON file-based database.");
      pool = null; // Forces JSON fallback
    });
} else {
  console.log("No DATABASE_URL configured. Using secure local JSON file-based database.");
}

// Local JSON File DB Handlers
function readJsonDB(): { usuarios: UsuarioAdmin[]; puntos: PuntoTuristico[]; rutas: RutaBus[] } {
  try {
    if (fs.existsSync(JSON_STORE_PATH)) {
      const rawData = fs.readFileSync(JSON_STORE_PATH, "utf-8");
      return JSON.parse(rawData);
    }
  } catch (err) {
    console.error("Error reading JSON file database. Re-initializing...", err);
  }

  // Pre-seed default data
  const initialDB = {
    usuarios: [DEFAULT_USER],
    puntos: DEFAULT_PUNTOS,
    rutas: DEFAULT_RUTAS
  };
  writeJsonDB(initialDB);
  return initialDB;
}

function writeJsonDB(data: { usuarios: UsuarioAdmin[]; puntos: PuntoTuristico[]; rutas: RutaBus[] }) {
  try {
    fs.writeFileSync(JSON_STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving to JSON file database:", err);
  }
}

// DATABASE API SERVICE LAYER
export async function getPuntosTuristicos(): Promise<PuntoTuristico[]> {
  if (pool) {
    try {
      const res = await pool.query("SELECT id, titulo, categoria, descripcion, direccion, telefono, rating::float, horario, url_imagen, tipo FROM puntos_turisticos ORDER BY id DESC");
      return res.rows;
    } catch (err) {
      console.error("Postgres error, falling back to JSON:", err);
    }
  }
  const db = readJsonDB();
  return [...db.puntos].sort((a, b) => b.id - a.id);
}

export async function addPuntoTuristico(p: Omit<PuntoTuristico, "id">): Promise<PuntoTuristico> {
  if (pool) {
    try {
      const res = await pool.query(
        "INSERT INTO puntos_turisticos (titulo, categoria, descripcion, direccion, telefono, rating, horario, url_imagen, tipo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, titulo, categoria, descripcion, direccion, telefono, rating::float, horario, url_imagen, tipo",
        [p.titulo, p.categoria, p.descripcion, p.direccion, p.telefono, p.rating, p.horario, p.url_imagen, p.tipo]
      );
      return res.rows[0];
    } catch (err) {
      console.error("Postgres error writing, falling back to JSON:", err);
    }
  }
  const db = readJsonDB();
  const newId = db.puntos.length > 0 ? Math.max(...db.puntos.map(x => x.id)) + 1 : 1;
  const newItem: PuntoTuristico = { id: newId, ...p };
  db.puntos.push(newItem);
  writeJsonDB(db);
  return newItem;
}

export async function updatePuntoTuristico(id: number, p: Omit<PuntoTuristico, "id">): Promise<PuntoTuristico | null> {
  if (pool) {
    try {
      const res = await pool.query(
        "UPDATE puntos_turisticos SET titulo = $1, categoria = $2, descripcion = $3, direccion = $4, telefono = $5, rating = $6, horario = $7, url_imagen = $8, tipo = $9 WHERE id = $10 RETURNING id, titulo, categoria, descripcion, direccion, telefono, rating::float, horario, url_imagen, tipo",
        [p.titulo, p.categoria, p.descripcion, p.direccion, p.telefono, p.rating, p.horario, p.url_imagen, p.tipo, id]
      );
      if (res.rows.length > 0) return res.rows[0];
    } catch (err) {
      console.error("Postgres error updating, falling back to JSON:", err);
    }
  }
  const db = readJsonDB();
  const idx = db.puntos.findIndex(x => x.id === id);
  if (idx === -1) return null;
  const updatedItem: PuntoTuristico = { id, ...p };
  db.puntos[idx] = updatedItem;
  writeJsonDB(db);
  return updatedItem;
}

export async function deletePuntoTuristico(id: number): Promise<boolean> {
  if (pool) {
    try {
      const res = await pool.query("DELETE FROM puntos_turisticos WHERE id = $1 RETURNING id", [id]);
      return res.rows.length > 0;
    } catch (err) {
      console.error("Postgres error deleting, falling back to JSON:", err);
    }
  }
  const db = readJsonDB();
  const idx = db.puntos.findIndex(x => x.id === id);
  if (idx === -1) return false;
  db.puntos.splice(idx, 1);
  writeJsonDB(db);
  return true;
}

export async function getRutasBuses(): Promise<RutaBus[]> {
  if (pool) {
    try {
      const res = await pool.query("SELECT id, nombre, icono, color, paradas, horarios FROM rutas_buses ORDER BY id ASC");
      return res.rows;
    } catch (err) {
      console.error("Postgres query error for routes, falling back to JSON:", err);
    }
  }
  const db = readJsonDB();
  return db.rutas;
}

export async function findAdminByEmail(email: string): Promise<UsuarioAdmin | null> {
  if (pool) {
    try {
      const res = await pool.query("SELECT id, nombre, email, password_hash FROM usuarios_admin WHERE email = $1", [email]);
      if (res.rows.length > 0) return res.rows[0];
      return null;
    } catch (err) {
      console.error("Postgres error looking up user email:", err);
    }
  }
  const db = readJsonDB();
  const user = db.usuarios.find(x => x.email.toLowerCase() === email.toLowerCase());
  return user || null;
}

export async function registerAdmin(nombre: string, email: string, passRaw: string): Promise<UsuarioAdmin | null> {
  const hash = await bcrypt.hash(passRaw, 10);
  if (pool) {
    try {
      const res = await pool.query(
        "INSERT INTO usuarios_admin (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, email, password_hash",
        [nombre, email, hash]
      );
      return res.rows[0];
    } catch (err) {
      console.error("Postgres error registering, falling back to JSON:", err);
    }
  }
  const db = readJsonDB();
  if (db.usuarios.some(x => x.email.toLowerCase() === email.toLowerCase())) {
    return null; // Email taken
  }
  const newId = db.usuarios.length > 0 ? Math.max(...db.usuarios.map(x => x.id)) + 1 : 1;
  const newUser: UsuarioAdmin = { id: newId, nombre, email, password_hash: hash };
  db.usuarios.push(newUser);
  writeJsonDB(db);
  return newUser;
}
