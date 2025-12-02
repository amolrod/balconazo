-- V3__insert_sample_photos_features.sql
-- Fotos y características de los espacios

-- =====================================================
-- FOTOS DE ESPACIOS
-- =====================================================

-- Espacio 1: Terraza Panorámica Madrid
INSERT INTO space_photos (id, space_id, url, sort_order, created_at) VALUES
('a0000001-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?q=80&w=2073&auto=format&fit=crop', 0, NOW()),
('a0000001-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1887&auto=format&fit=crop', 1, NOW()),
('a0000001-0001-0001-0001-000000000003', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1695221945112-25c792474147?q=80&w=2070&auto=format&fit=crop', 2, NOW()),
('a0000001-0001-0001-0001-000000000004', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1572370836561-26b2700e4085?q=80&w=2070&auto=format&fit=crop', 3, NOW()),
('a0000001-0001-0001-0001-000000000005', '550e8400-e29b-41d4-a716-446655440001', 'https://images.unsplash.com/photo-1496417263034-38ec4f0d665a?q=80&w=2071&auto=format&fit=crop', 4, NOW());

-- Espacio 2: Loft Industrial Barcelona
INSERT INTO space_photos (id, space_id, url, sort_order, created_at) VALUES
('a0000002-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=2071&auto=format&fit=crop', 0, NOW()),
('a0000002-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', 1, NOW()),
('a0000002-0001-0001-0001-000000000003', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=2070&auto=format&fit=crop', 2, NOW()),
('a0000002-0001-0001-0001-000000000004', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop', 3, NOW()),
('a0000002-0001-0001-0001-000000000005', '550e8400-e29b-41d4-a716-446655440002', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop', 4, NOW());

-- Espacio 3: Jardín Secreto Sevilla
INSERT INTO space_photos (id, space_id, url, sort_order, created_at) VALUES
('a0000003-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop', 0, NOW()),
('a0000003-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1598928506311-c55ez361a092?q=80&w=2070&auto=format&fit=crop', 1, NOW()),
('a0000003-0001-0001-0001-000000000003', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', 2, NOW()),
('a0000003-0001-0001-0001-000000000004', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop', 3, NOW()),
('a0000003-0001-0001-0001-000000000005', '550e8400-e29b-41d4-a716-446655440003', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop', 4, NOW());

-- Espacio 4: Ático Modernista Valencia
INSERT INTO space_photos (id, space_id, url, sort_order, created_at) VALUES
('a0000004-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop', 0, NOW()),
('a0000004-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop', 1, NOW()),
('a0000004-0001-0001-0001-000000000003', '550e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', 2, NOW()),
('a0000004-0001-0001-0001-000000000004', '550e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop', 3, NOW()),
('a0000004-0001-0001-0001-000000000005', '550e8400-e29b-41d4-a716-446655440004', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop', 4, NOW());

-- Espacio 5: Bodega Histórica Rioja
INSERT INTO space_photos (id, space_id, url, sort_order, created_at) VALUES
('a0000005-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1528823872057-9c018a7a7553?q=80&w=2070&auto=format&fit=crop', 0, NOW()),
('a0000005-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2070&auto=format&fit=crop', 1, NOW()),
('a0000005-0001-0001-0001-000000000003', '550e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2070&auto=format&fit=crop', 2, NOW()),
('a0000005-0001-0001-0001-000000000004', '550e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1560148218-1a83060f7b32?q=80&w=2073&auto=format&fit=crop', 3, NOW()),
('a0000005-0001-0001-0001-000000000005', '550e8400-e29b-41d4-a716-446655440005', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop', 4, NOW());

-- Espacio 6: Rooftop Bilbao
INSERT INTO space_photos (id, space_id, url, sort_order, created_at) VALUES
('a0000006-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop', 0, NOW()),
('a0000006-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop', 1, NOW()),
('a0000006-0001-0001-0001-000000000003', '550e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop', 2, NOW()),
('a0000006-0001-0001-0001-000000000004', '550e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=2070&auto=format&fit=crop', 3, NOW()),
('a0000006-0001-0001-0001-000000000005', '550e8400-e29b-41d4-a716-446655440006', 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop', 4, NOW());

-- Espacio 7: Masía Catalana
INSERT INTO space_photos (id, space_id, url, sort_order, created_at) VALUES
('a0000007-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440007', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2089&auto=format&fit=crop', 0, NOW()),
('a0000007-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440007', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', 1, NOW()),
('a0000007-0001-0001-0001-000000000003', '550e8400-e29b-41d4-a716-446655440007', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop', 2, NOW()),
('a0000007-0001-0001-0001-000000000004', '550e8400-e29b-41d4-a716-446655440007', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', 3, NOW()),
('a0000007-0001-0001-0001-000000000005', '550e8400-e29b-41d4-a716-446655440007', 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2070&auto=format&fit=crop', 4, NOW());

-- Espacio 8: Estudio Fotográfico Madrid
INSERT INTO space_photos (id, space_id, url, sort_order, created_at) VALUES
('a0000008-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440008', 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', 0, NOW()),
('a0000008-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440008', 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=2070&auto=format&fit=crop', 1, NOW()),
('a0000008-0001-0001-0001-000000000003', '550e8400-e29b-41d4-a716-446655440008', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop', 2, NOW()),
('a0000008-0001-0001-0001-000000000004', '550e8400-e29b-41d4-a716-446655440008', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop', 3, NOW()),
('a0000008-0001-0001-0001-000000000005', '550e8400-e29b-41d4-a716-446655440008', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop', 4, NOW());

-- Espacio 9: Casa de Playa Tarifa
INSERT INTO space_photos (id, space_id, url, sort_order, created_at) VALUES
('a0000009-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440009', 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop', 0, NOW()),
('a0000009-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440009', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop', 1, NOW()),
('a0000009-0001-0001-0001-000000000003', '550e8400-e29b-41d4-a716-446655440009', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', 2, NOW()),
('a0000009-0001-0001-0001-000000000004', '550e8400-e29b-41d4-a716-446655440009', 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=2025&auto=format&fit=crop', 3, NOW()),
('a0000009-0001-0001-0001-000000000005', '550e8400-e29b-41d4-a716-446655440009', 'https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?q=80&w=2070&auto=format&fit=crop', 4, NOW());

-- Espacio 10: Palacete San Sebastián
INSERT INTO space_photos (id, space_id, url, sort_order, created_at) VALUES
('a0000010-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440010', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop', 0, NOW()),
('a0000010-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440010', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop', 1, NOW()),
('a0000010-0001-0001-0001-000000000003', '550e8400-e29b-41d4-a716-446655440010', 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop', 2, NOW()),
('a0000010-0001-0001-0001-000000000004', '550e8400-e29b-41d4-a716-446655440010', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop', 3, NOW()),
('a0000010-0001-0001-0001-000000000005', '550e8400-e29b-41d4-a716-446655440010', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop', 4, NOW());

-- Espacio 11: Coworking Granada
INSERT INTO space_photos (id, space_id, url, sort_order, created_at) VALUES
('a0000011-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440011', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop', 0, NOW()),
('a0000011-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440011', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop', 1, NOW()),
('a0000011-0001-0001-0001-000000000003', '550e8400-e29b-41d4-a716-446655440011', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', 2, NOW()),
('a0000011-0001-0001-0001-000000000004', '550e8400-e29b-41d4-a716-446655440011', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop', 3, NOW()),
('a0000011-0001-0001-0001-000000000005', '550e8400-e29b-41d4-a716-446655440011', 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?q=80&w=2074&auto=format&fit=crop', 4, NOW());

-- Espacio 12: Apartamento Salamanca Madrid
INSERT INTO space_photos (id, space_id, url, sort_order, created_at) VALUES
('a0000012-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440012', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop', 0, NOW()),
('a0000012-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440012', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop', 1, NOW()),
('a0000012-0001-0001-0001-000000000003', '550e8400-e29b-41d4-a716-446655440012', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop', 2, NOW()),
('a0000012-0001-0001-0001-000000000004', '550e8400-e29b-41d4-a716-446655440012', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop', 3, NOW()),
('a0000012-0001-0001-0001-000000000005', '550e8400-e29b-41d4-a716-446655440012', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070&auto=format&fit=crop', 4, NOW());
