-- V2__insert_sample_users.sql
-- Datos de prueba para users-service

-- =====================================================
-- USUARIOS (Hosts y Guests)
-- =====================================================

-- Hosts (propietarios de espacios)
INSERT INTO users (id, email, name, surname, keycloak_id, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'carlos.martinez@balconazo.com', 'Carlos', 'Martínez García', 'kc-carlos-martinez-001', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440102', 'maria.garcia@balconazo.com', 'María', 'García López', 'kc-maria-garcia-002', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440103', 'antonio.lopez@balconazo.com', 'Antonio', 'López Fernández', 'kc-antonio-lopez-003', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440104', 'laura.sanchez@balconazo.com', 'Laura', 'Sánchez Ruiz', 'kc-laura-sanchez-004', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440105', 'pablo.fernandez@balconazo.com', 'Pablo', 'Fernández Torres', 'kc-pablo-fernandez-005', NOW(), NOW());

-- Guests (usuarios que reservan)
INSERT INTO users (id, email, name, surname, keycloak_id, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440201', 'elena.rodriguez@gmail.com', 'Elena', 'Rodríguez Martín', 'kc-elena-rodriguez-101', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440202', 'javier.moreno@gmail.com', 'Javier', 'Moreno Díaz', 'kc-javier-moreno-102', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440203', 'carmen.jimenez@gmail.com', 'Carmen', 'Jiménez Navarro', 'kc-carmen-jimenez-103', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440204', 'david.ruiz@gmail.com', 'David', 'Ruiz Hernández', 'kc-david-ruiz-104', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440205', 'ana.torres@gmail.com', 'Ana', 'Torres Gil', 'kc-ana-torres-105', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440206', 'miguel.hernandez@gmail.com', 'Miguel', 'Hernández Soto', 'kc-miguel-hernandez-106', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440207', 'lucia.diaz@gmail.com', 'Lucía', 'Díaz Ortega', 'kc-lucia-diaz-107', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440208', 'sergio.navarro@gmail.com', 'Sergio', 'Navarro Ramos', 'kc-sergio-navarro-108', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440209', 'patricia.ortega@gmail.com', 'Patricia', 'Ortega Vega', 'kc-patricia-ortega-109', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440210', 'raul.vega@gmail.com', 'Raúl', 'Vega Castro', 'kc-raul-vega-110', NOW(), NOW());

-- Usuarios que son tanto hosts como guests
INSERT INTO users (id, email, name, surname, keycloak_id, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440301', 'isabel.castro@balconazo.com', 'Isabel', 'Castro Prieto', 'kc-isabel-castro-201', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440302', 'fernando.prieto@balconazo.com', 'Fernando', 'Prieto Muñoz', 'kc-fernando-prieto-202', NOW(), NOW());

-- =====================================================
-- ASIGNACIÓN DE ROLES
-- =====================================================

-- Hosts (role_id = 2 para ROLE_HOST, asumiendo que role_id 1 es ROLE_USER)
INSERT INTO user_roles (user_id, role_id) VALUES
('550e8400-e29b-41d4-a716-446655440101', 1), -- Carlos también es USER
('550e8400-e29b-41d4-a716-446655440101', 2), -- Carlos es HOST
('550e8400-e29b-41d4-a716-446655440102', 1),
('550e8400-e29b-41d4-a716-446655440102', 2),
('550e8400-e29b-41d4-a716-446655440103', 1),
('550e8400-e29b-41d4-a716-446655440103', 2),
('550e8400-e29b-41d4-a716-446655440104', 1),
('550e8400-e29b-41d4-a716-446655440104', 2),
('550e8400-e29b-41d4-a716-446655440105', 1),
('550e8400-e29b-41d4-a716-446655440105', 2);

-- Guests (solo ROLE_USER)
INSERT INTO user_roles (user_id, role_id) VALUES
('550e8400-e29b-41d4-a716-446655440201', 1),
('550e8400-e29b-41d4-a716-446655440202', 1),
('550e8400-e29b-41d4-a716-446655440203', 1),
('550e8400-e29b-41d4-a716-446655440204', 1),
('550e8400-e29b-41d4-a716-446655440205', 1),
('550e8400-e29b-41d4-a716-446655440206', 1),
('550e8400-e29b-41d4-a716-446655440207', 1),
('550e8400-e29b-41d4-a716-446655440208', 1),
('550e8400-e29b-41d4-a716-446655440209', 1),
('550e8400-e29b-41d4-a716-446655440210', 1);

-- Usuarios mixtos (HOST y USER)
INSERT INTO user_roles (user_id, role_id) VALUES
('550e8400-e29b-41d4-a716-446655440301', 1),
('550e8400-e29b-41d4-a716-446655440301', 2),
('550e8400-e29b-41d4-a716-446655440302', 1),
('550e8400-e29b-41d4-a716-446655440302', 2);
