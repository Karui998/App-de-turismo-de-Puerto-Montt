-- ==========================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS
-- Plataforma de Turismo Puerto Montt
-- Diseñado para PostgreSQL (compatible con Neon.com)
-- ==========================================

-- Tabla de Administradores
CREATE TABLE IF NOT EXISTS usuarios_admin (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Lugares Turísticos, Restaurantes y Tiendas
CREATE TABLE IF NOT EXISTS puntos_turisticos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL, -- Ej: "Paisaje Natural", "Comida tradicional", "Tienda de Souvenirs"
    descripcion TEXT NOT NULL,
    direccion TEXT,
    telefono VARCHAR(50),
    rating NUMERIC(3,2) DEFAULT 5.00,
    horario VARCHAR(100) NOT NULL, -- Ej: "08:00 - 20:00"
    url_imagen TEXT,
    tipo VARCHAR(50) NOT NULL, -- 'lugar' (Pestaña 1) o 'comercio' (Pestaña 2)
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Rutas de Buses y Horarios
CREATE TABLE IF NOT EXISTS rutas_buses (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL, -- Ej: "Ruta 1: Centro - Angelmó"
    icono VARCHAR(50) NOT NULL, -- Ej: "bus", "navigation"
    color VARCHAR(50) NOT NULL, -- Ej: "blue", "green", "red"
    paradas TEXT[] NOT NULL, -- Lista de paradas en orden
    horarios VARCHAR(5)[] NOT NULL, -- Horas de salida
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INSERCIÓN DE DATOS INICIALES (MOCK DATA)
-- ==========================================

-- Administrador Inicial (Contraseña hash cifrada con bcrypt para desarrollo o producción)
-- Nota: La contraseña en texto plano es 'admin123'
-- Hash generado de forma segura: $2a$10$Wp89UaXFf4GgDWhh016dpeLqKbe.8RkNoU.R/7VunrN8M793vAEPi
INSERT INTO usuarios_admin (nombre, email, password_hash)
VALUES ('Administrador Turismo', 'admin@turismopuertomontt.cl', '$2a$10$Wp89UaXFf4GgDWhh016dpeLqKbe.8RkNoU.R/7VunrN8M793vAEPi')
ON CONFLICT (email) DO NOTHING;

-- Atractivos Turísticos y Comercios
INSERT INTO puntos_turisticos (titulo, categoria, descripcion, direccion, telefono, rating, horario, url_imagen, tipo) VALUES
-- Pestaña 1: Atractivos Turísticos (tipo = 'lugar')
('Mercado de Angelmó', 'Patrimonio y Gastronomía', 'Famoso centro artesanal y gastronómico de la zona. Destaca por sus palafitos, artesanías en lana o madera, y cocinerías tradicionales con los mariscos más frescos frente a la Isla Tenglo.', 'Av. Angelmó 2200, Puerto Montt', NULL, 4.70, '08:00 - 18:30', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', 'lugar'),
('Senda Costanera', 'Paseo Peatonal', 'Amplio paseo costero que bordea el Seno de Reloncaví. Ideal para caminatas familiares, running nocturno, espectaculares atardeceres y contemplar las esculturas icónicas frente al mar.', 'Av. Diego Portales, Puerto Montt', NULL, 4.50, 'Abierto 24 horas', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', 'lugar'),
('Parque Nacional Alerce Andino', 'Naturaleza Salvaje', 'Parte de la Reserva de la Biosfera de los Bosques Templados Lluviosos de los Andes Australes. Hogar de alerces milenarios, hermosas lagunas y una abundante fauna nativa como el pudú y el monito del monte.', 'Carretera Austral Km 40, Puerto Montt', '+56 65 248 6115', 4.90, '09:00 - 17:00', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80', 'lugar'),
('Isla Tenglo y Cruz del Milenio', 'Mirador Natural', 'Preciosa isla ubicada frente a la ciudad de Puerto Montt. Ofrece el tradicional mirador de la Cruz del Milenio, con una espectacular vista panorámica de 360 grados de toda la bahía y volcanes.', 'Embarcadero Angelmó (Cruce en lancha)', NULL, 4.60, '09:00 - 18:00', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', 'lugar'),
('Catedral de Puerto Montt', 'Monumento Histórico', 'Emblemática iglesia construida enteramente en maderas nativas como el alerce en el año 1856. Situada frente a la Plaza de Armas, representando la edificación más antigua de la comuna chilena.', 'Urmeneta 450, Puerto Montt', NULL, 4.40, '09:00 - 19:00', 'https://images.unsplash.com/photo-1548625361-155deea22300?auto=format&fit=crop&w=800&q=80', 'lugar'),

-- Pestaña 2: Tiendas y Restaurantes (tipo = 'comercio')
('Restaurante El Estaleiro', 'Comida tradicional', 'Restaurante rústico con vista al mar que ofrece la mejor selección de mariscos chilenos, pescados a la plancha y el tradicional cancato salmón.', 'Av. Angelmó 2230, Puerto Montt', '+56 65 243 4567', 4.80, '12:00 - 22:00', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', 'comercio'),
('Cocinería Doña Olga', 'Comida tradicional', 'La picada ultra-famosa de Angelmó. Ven a degustar el curanto en hoyo original, pulmay en olla, empanadas fritas de mariscos gigantescas y sopaipillas pasadas caseras.', 'Mercado Costanera Angelmó, Local 14', '+56 9 8765 4321', 4.70, '09:00 - 18:00', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', 'comercio'),
('Café Haussmann Puerto Montt', 'Cafetería y Repostería', 'Tranquilo rincón de herencia colonial alemana. Disfruta de sus insuperables sándwiches crudos, tártaros tradicionales, y exquisitos kuchens de frambuesa, arándanos o manzana.', 'Calle San Martín 115, Puerto Montt', '+56 65 225 1251', 4.60, '09:30 - 20:30', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', 'comercio'),
('Artesanías Melipulli', 'Tienda de Souvenirs', 'Galería comercial de locatarios locales. Podrás comprar hermosos chalecos tejidos a mano con lana natural chilota, figuras talladas en madera de alerce y recuerdos típicos marinos.', 'Av. Diego Portales 1100, Puerto Montt', '+56 9 1234 5678', 4.50, '10:00 - 19:30', 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=800&q=80', 'comercio'),
('Chocolates Varsovienne', 'Tienda de Chocolates', 'Destacada chocolatería fina con materias primas de la Patagonia. Alfajores de calafate, trufas licorescas chilenas, tabletas de chocolate de leche con avellanas tostadas silvestres.', 'Mall Paseo del Mar, Local 112', '+56 65 228 9081', 4.70, '10:00 - 21:00', 'https://images.unsplash.com/photo-1481391319762-47dff72954d4?auto=format&fit=crop&w=800&q=80', 'comercio');

-- Pestaña 3: Rutas de buses y horarios
INSERT INTO rutas_buses (nombre, icono, color, paradas, horarios) VALUES
('Ruta 1: Centro - Angelmó', 'bus', 'blue', 
 ARRAY['Plaza de Armas', 'Centro Comercial', 'Terminal de Buses', 'Muelle de Paseos', 'Mercado Angelmó'], 
 ARRAY['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']),
 
('Ruta 3: Centro - Alerce', 'bus', 'green', 
 ARRAY['Terminal de Buses', 'Avenida Presidente Ibáñez', 'Viaducto Alerce', 'Alerce Histórico', 'Alerce Norte'], 
 ARRAY['06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']),
 
('Ruta 5: Pelluco - Chinquihue', 'bus', 'red', 
 ARRAY['Balneario Pelluco', 'Universidad Austral', 'Plaza de Armas', 'Terminal de Buses', 'Estadio Chinquihue'], 
 ARRAY['07:15', '07:45', '08:15', '08:45', '09:15', '09:45', '10:15', '11:15', '12:15', '13:15', '14:15', '15:15', '16:15', '17:15', '18:15', '19:15', '20:15');
