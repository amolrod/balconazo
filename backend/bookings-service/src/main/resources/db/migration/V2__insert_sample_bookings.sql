-- V2__insert_sample_bookings.sql
-- Datos de prueba para bookings-service

-- =====================================================
-- RESERVAS DE EJEMPLO
-- =====================================================

-- Reservas para Terraza Panorámica Madrid (Space 1)
INSERT INTO bookings (id, space_id, guest_id, host_id, start_time, end_time, total_price, status, notes, created_at, updated_at) VALUES
-- Reserva completada
('c0000001-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', 
 '2025-11-15 18:00:00', '2025-11-15 22:00:00', 180.00, 'COMPLETED', 'Cumpleaños de 30 años. Todo perfecto.', NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days'),
-- Reserva confirmada próxima
('c0000001-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440101', 
 '2025-12-10 19:00:00', '2025-12-10 23:00:00', 180.00, 'CONFIRMED', 'Afterwork de empresa, 25 personas.', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
-- Reserva pendiente
('c0000001-0001-0001-0001-000000000003', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440101', 
 '2025-12-20 20:00:00', '2025-12-21 00:00:00', 180.00, 'PENDING', 'Cena de Navidad con amigos.', NOW(), NOW());

-- Reservas para Loft Industrial Barcelona (Space 2)
INSERT INTO bookings (id, space_id, guest_id, host_id, start_time, end_time, total_price, status, notes, created_at, updated_at) VALUES
('c0000002-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440102', 
 '2025-11-20 10:00:00', '2025-11-20 18:00:00', 600.00, 'COMPLETED', 'Sesión de fotos para marca de moda.', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days'),
('c0000002-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440102', 
 '2025-12-15 18:00:00', '2025-12-15 23:00:00', 375.00, 'CONFIRMED', 'Evento corporativo tech startup.', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days');

-- Reservas para Jardín Secreto Sevilla (Space 3)
INSERT INTO bookings (id, space_id, guest_id, host_id, start_time, end_time, total_price, status, notes, created_at, updated_at) VALUES
('c0000003-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440206', '550e8400-e29b-41d4-a716-446655440103', 
 '2025-10-28 20:00:00', '2025-10-29 00:00:00', 220.00, 'COMPLETED', 'Cena bajo las estrellas. Espectacular.', NOW() - INTERVAL '35 days', NOW() - INTERVAL '30 days'),
('c0000003-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440207', '550e8400-e29b-41d4-a716-446655440103', 
 '2025-12-24 19:00:00', '2025-12-24 23:00:00', 220.00, 'CONFIRMED', 'Nochebuena familiar.', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- Reservas para Ático Modernista Valencia (Space 4)
INSERT INTO bookings (id, space_id, guest_id, host_id, start_time, end_time, total_price, status, notes, created_at, updated_at) VALUES
('c0000004-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440208', '550e8400-e29b-41d4-a716-446655440104', 
 '2025-11-10 17:00:00', '2025-11-10 21:00:00', 200.00, 'COMPLETED', 'Presentación de libro.', NOW() - INTERVAL '25 days', NOW() - INTERVAL '20 days'),
('c0000004-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440209', '550e8400-e29b-41d4-a716-446655440104', 
 '2025-12-31 21:00:00', '2026-01-01 02:00:00', 250.00, 'PENDING', 'Fiesta de Nochevieja.', NOW(), NOW());

-- Reservas para Bodega Histórica Rioja (Space 5)
INSERT INTO bookings (id, space_id, guest_id, host_id, start_time, end_time, total_price, status, notes, created_at, updated_at) VALUES
('c0000005-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440210', '550e8400-e29b-41d4-a716-446655440105', 
 '2025-11-05 12:00:00', '2025-11-05 18:00:00', 510.00, 'COMPLETED', 'Cata corporativa con clientes VIP.', NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days'),
('c0000005-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440105', 
 '2025-12-18 13:00:00', '2025-12-18 19:00:00', 510.00, 'CONFIRMED', 'Comida de empresa.', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days');

-- Reservas para Rooftop Bilbao (Space 6)
INSERT INTO bookings (id, space_id, guest_id, host_id, start_time, end_time, total_price, status, notes, created_at, updated_at) VALUES
('c0000006-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440101', 
 '2025-11-22 19:00:00', '2025-11-22 23:00:00', 260.00, 'COMPLETED', 'Cóctel de bienvenida congreso.', NOW() - INTERVAL '12 days', NOW() - INTERVAL '8 days'),
('c0000006-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440101', 
 '2025-12-28 18:00:00', '2025-12-28 22:00:00', 260.00, 'PENDING', 'Celebración de fin de año.', NOW(), NOW());

-- Reservas para Masía Catalana (Space 7)
INSERT INTO bookings (id, space_id, guest_id, host_id, start_time, end_time, total_price, status, notes, created_at, updated_at) VALUES
('c0000007-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440102', 
 '2025-10-15 11:00:00', '2025-10-15 23:00:00', 1440.00, 'COMPLETED', 'Boda íntima 80 invitados.', NOW() - INTERVAL '50 days', NOW() - INTERVAL '45 days'),
('c0000007-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440102', 
 '2026-06-20 10:00:00', '2026-06-20 22:00:00', 1440.00, 'CONFIRMED', 'Boda con 120 invitados.', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

-- Reservas para Estudio Fotográfico Madrid (Space 8)
INSERT INTO bookings (id, space_id, guest_id, host_id, start_time, end_time, total_price, status, notes, created_at, updated_at) VALUES
('c0000008-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440206', '550e8400-e29b-41d4-a716-446655440103', 
 '2025-11-25 09:00:00', '2025-11-25 17:00:00', 320.00, 'COMPLETED', 'Sesión de producto e-commerce.', NOW() - INTERVAL '8 days', NOW() - INTERVAL '5 days'),
('c0000008-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440207', '550e8400-e29b-41d4-a716-446655440103', 
 '2025-12-05 10:00:00', '2025-12-05 18:00:00', 320.00, 'CONFIRMED', 'Rodaje spot publicitario.', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Reservas para Casa de Playa Tarifa (Space 9)
INSERT INTO bookings (id, space_id, guest_id, host_id, start_time, end_time, total_price, status, notes, created_at, updated_at) VALUES
('c0000009-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440208', '550e8400-e29b-41d4-a716-446655440104', 
 '2025-09-10 08:00:00', '2025-09-10 20:00:00', 1140.00, 'COMPLETED', 'Retiro de yoga con 20 personas.', NOW() - INTERVAL '85 days', NOW() - INTERVAL '80 days'),
('c0000009-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440209', '550e8400-e29b-41d4-a716-446655440104', 
 '2026-07-15 10:00:00', '2026-07-15 22:00:00', 1140.00, 'PENDING', 'Fiesta de verano.', NOW(), NOW());

-- Reservas para Palacete San Sebastián (Space 10)
INSERT INTO bookings (id, space_id, guest_id, host_id, start_time, end_time, total_price, status, notes, created_at, updated_at) VALUES
('c0000010-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440210', '550e8400-e29b-41d4-a716-446655440105', 
 '2025-10-20 12:00:00', '2025-10-20 20:00:00', 1200.00, 'COMPLETED', 'Gala benéfica 70 personas.', NOW() - INTERVAL '45 days', NOW() - INTERVAL '40 days'),
('c0000010-0001-0001-0001-000000000002', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440105', 
 '2026-08-25 13:00:00', '2026-08-25 23:00:00', 1500.00, 'CONFIRMED', 'Boda de lujo.', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

-- Reserva cancelada (ejemplo)
INSERT INTO bookings (id, space_id, guest_id, host_id, start_time, end_time, total_price, status, notes, created_at, updated_at) VALUES
('c0000011-0001-0001-0001-000000000001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440101', 
 '2025-11-30 19:00:00', '2025-11-30 23:00:00', 180.00, 'CANCELLED', 'Cancelada por cambio de planes.', NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days');
