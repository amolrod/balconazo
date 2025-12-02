-- V2__insert_sample_spaces.sql
-- Datos de prueba para spaces-service

-- =====================================================
-- USUARIOS HOST (UUIDs que coinciden con users-service)
-- =====================================================
-- Host 1: Carlos Martínez (550e8400-e29b-41d4-a716-446655440101)
-- Host 2: María García (550e8400-e29b-41d4-a716-446655440102)
-- Host 3: Antonio López (550e8400-e29b-41d4-a716-446655440103)
-- Host 4: Laura Sánchez (550e8400-e29b-41d4-a716-446655440104)
-- Host 5: Pablo Fernández (550e8400-e29b-41d4-a716-446655440105)

-- =====================================================
-- ESPACIOS
-- =====================================================

-- Espacio 1: Terraza Panorámica Madrid (ID usado en el frontend)
INSERT INTO spaces (id, host_id, title, description, city, address, capacity, price_per_hour, active, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440101',
    'Terraza Panorámica con Vistas a Gran Vía',
    'Disfruta de una de las mejores vistas de Madrid en este exclusivo ático. Perfecto para afterworks, cumpleaños tranquilos o sesiones de fotos. El espacio cuenta con una zona chill-out con sofás, una barra americana totalmente equipada y un sistema de sonido Sonos de alta fidelidad.

La iluminación nocturna está diseñada para crear un ambiente íntimo y sofisticado. Acceso directo por ascensor privado. Capacidad máxima de 30 personas con posibilidad de catering externo.',
    'Madrid',
    'Gran Vía 42, Ático, 28013 Madrid',
    30,
    45.00,
    true,
    NOW(),
    NOW()
);

-- Espacio 2: Loft Industrial Barcelona
INSERT INTO spaces (id, host_id, title, description, city, address, capacity, price_per_hour, active, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440102',
    'Loft Industrial en El Born',
    'Espectacular loft de 200m² en el corazón del Born. Antiguo almacén reconvertido con techos de 5 metros, vigas de hierro originales y grandes ventanales que inundan el espacio de luz natural.

Ideal para eventos corporativos, rodajes, sesiones de fotos o fiestas privadas. Equipado con cocina profesional, zona lounge y espacio diáfano polivalente. Sistema de sonido profesional integrado.',
    'Barcelona',
    'Carrer del Rec 45, 08003 Barcelona',
    50,
    75.00,
    true,
    NOW(),
    NOW()
);

-- Espacio 3: Jardín Secreto Sevilla
INSERT INTO spaces (id, host_id, title, description, city, address, capacity, price_per_hour, active, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440103',
    'Jardín Secreto en Casa Palacio',
    'Un oasis escondido en el centro histórico de Sevilla. Este jardín andaluz de 150m² forma parte de una casa palacio del siglo XVIII, con fuentes, naranjos y jazmines que perfuman el ambiente.

Perfecto para celebraciones íntimas, cenas bajo las estrellas o eventos de empresa con encanto. Incluye zona cubierta con arcos de herradura y salón auxiliar climatizado.',
    'Sevilla',
    'Calle Águilas 12, 41004 Sevilla',
    40,
    55.00,
    true,
    NOW(),
    NOW()
);

-- Espacio 4: Ático Modernista Valencia
INSERT INTO spaces (id, host_id, title, description, city, address, capacity, price_per_hour, active, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440104',
    'Ático Modernista con Terraza',
    'Precioso ático en edificio modernista de la calle Colón con terraza de 80m² y vistas a la Catedral y el Miguelete. Interior decorado con muebles de diseño y obras de artistas locales.

Dispone de dos ambientes: salón interior con capacidad para 25 personas y terraza exterior para cócteles. Cocina americana equipada y baño de diseño.',
    'Valencia',
    'Calle Colón 28, Ático, 46004 Valencia',
    35,
    50.00,
    true,
    NOW(),
    NOW()
);

-- Espacio 5: Bodega Histórica Rioja
INSERT INTO spaces (id, host_id, title, description, city, address, capacity, price_per_hour, active, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440105',
    'Bodega Centenaria en Haro',
    'Bodega del siglo XIX excavada en roca, con 300m² de espacio subterráneo a temperatura constante de 14°C. Barricas originales de roble francés y americano decoran el espacio.

Ideal para catas de vino, cenas maridaje o eventos exclusivos. Capacidad para 60 personas sentadas o 100 en cóctel. Incluye visita guiada y cata de 3 vinos.',
    'Haro',
    'Barrio de la Estación s/n, 26200 Haro, La Rioja',
    60,
    85.00,
    true,
    NOW(),
    NOW()
);

-- Espacio 6: Rooftop Bilbao
INSERT INTO spaces (id, host_id, title, description, city, address, capacity, price_per_hour, active, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440101',
    'Rooftop con Vistas al Guggenheim',
    'Terraza exclusiva en la última planta de un edificio de diseño con vistas privilegiadas al Museo Guggenheim y la ría del Nervión. 120m² de espacio al aire libre con pérgola retráctil.

Mobiliario de exterior premium, iluminación LED programable y sistema de calefacción por infrarrojos para eventos en cualquier época del año. Barra de bar integrada.',
    'Bilbao',
    'Alameda Mazarredo 15, Ático, 48001 Bilbao',
    45,
    65.00,
    true,
    NOW(),
    NOW()
);

-- Espacio 7: Masía Catalana
INSERT INTO spaces (id, host_id, title, description, city, address, capacity, price_per_hour, active, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440007',
    '550e8400-e29b-41d4-a716-446655440102',
    'Masía del Siglo XVII con Viñedos',
    'Auténtica masía catalana rodeada de viñedos en el corazón del Penedès. 500m² de espacio interior con salones abovedados, chimeneas originales y suelos de terracota.

Jardines de 2000m² con piscina, zona de barbacoa y carpa para eventos. Perfecta para bodas, retiros de empresa o celebraciones especiales. Alojamiento disponible.',
    'Sant Sadurní d''Anoia',
    'Camí de la Masía 5, 08770 Sant Sadurní d''Anoia',
    150,
    120.00,
    true,
    NOW(),
    NOW()
);

-- Espacio 8: Estudio Fotográfico Madrid
INSERT INTO spaces (id, host_id, title, description, city, address, capacity, price_per_hour, active, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440008',
    '550e8400-e29b-41d4-a716-446655440103',
    'Estudio Creativo en Malasaña',
    'Estudio polivalente de 180m² en el barrio más creativo de Madrid. Paredes de ladrillo visto, suelo de hormigón pulido y luz natural cenital. Equipado para fotografía, vídeo y eventos.

Incluye cyclorama de 6x4m, flashes profesionales Profoto, vestuario y zona de maquillaje. WiFi de alta velocidad y cocina office. Parking disponible en las inmediaciones.',
    'Madrid',
    'Calle del Pez 27, Bajo, 28004 Madrid',
    25,
    40.00,
    true,
    NOW(),
    NOW()
);

-- Espacio 9: Casa de Playa Tarifa
INSERT INTO spaces (id, host_id, title, description, city, address, capacity, price_per_hour, active, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440009',
    '550e8400-e29b-41d4-a716-446655440104',
    'Villa Frente al Mar en Tarifa',
    'Espectacular villa de estilo mediterráneo con acceso directo a la playa de Valdevaqueros. 300m² de espacios interiores luminosos con decoración boho-chic y vistas al estrecho de Gibraltar.

Terraza de 150m² con piscina infinity, zona chill-out con camas balinesas y barbacoa. Perfecta para retiros de yoga, sesiones de surf o celebraciones junto al mar.',
    'Tarifa',
    'Carretera N-340 Km 76, 11380 Tarifa',
    30,
    95.00,
    true,
    NOW(),
    NOW()
);

-- Espacio 10: Palacete San Sebastián
INSERT INTO spaces (id, host_id, title, description, city, address, capacity, price_per_hour, active, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440010',
    '550e8400-e29b-41d4-a716-446655440105',
    'Palacete Belle Époque',
    'Elegante palacete de principios del siglo XX en el paseo de La Concha. Arquitectura señorial con salones de techos altos, molduras originales, suelos de parquet y lámparas de araña.

Jardín francés con fuente central y vistas al mar. Ideal para bodas de ensueño, galas benéficas o eventos corporativos de alto nivel. Servicio de catering propio disponible.',
    'San Sebastián',
    'Paseo de La Concha 8, 20007 Donostia',
    80,
    150.00,
    true,
    NOW(),
    NOW()
);

-- Espacio 11: Coworking Granada
INSERT INTO spaces (id, host_id, title, description, city, address, capacity, price_per_hour, active, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440101',
    'Espacio de Eventos en el Albaicín',
    'Carmen tradicional granadino con vistas directas a la Alhambra. 200m² de espacio entre el interior con arcos árabes y el jardín escalonado con vegetación mediterránea.

Ambiente único para presentaciones de producto, cenas íntimas o sesiones de fotos con el mejor telón de fondo. Calefacción y aire acondicionado. Fácil acceso pese a estar en el Albaicín.',
    'Granada',
    'Cuesta del Chapiz 15, 18010 Granada',
    35,
    60.00,
    true,
    NOW(),
    NOW()
);

-- Espacio 12: Apartamento Salamanca Madrid
INSERT INTO spaces (id, host_id, title, description, city, address, capacity, price_per_hour, active, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440102',
    'Piso Señorial en Barrio Salamanca',
    'Elegante apartamento de 250m² en la milla de oro madrileña. Techos de 4 metros con molduras, chimeneas de mármol y balcones a la calle Serrano. Decoración clásica actualizada con piezas de diseño.

Tres salones comunicados ideales para cócteles, showrooms o reuniones exclusivas. Cocina profesional y office de servicio. Portería 24h y parking en el edificio.',
    'Madrid',
    'Calle Serrano 45, 2º, 28001 Madrid',
    50,
    90.00,
    true,
    NOW(),
    NOW()
);
