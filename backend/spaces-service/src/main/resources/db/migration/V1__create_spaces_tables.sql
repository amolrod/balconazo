-- V1__create_spaces_tables.sql
-- Esquema inicial para spaces-service

-- Tabla de espacios
CREATE TABLE IF NOT EXISTS spaces (
    id UUID PRIMARY KEY,
    host_id UUID NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    capacity INTEGER NOT NULL,
    price_per_hour NUMERIC(10,2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de fotos de espacios
CREATE TABLE IF NOT EXISTS space_photos (
    id UUID PRIMARY KEY,
    space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de características de espacios
CREATE TABLE IF NOT EXISTS space_features (
    id UUID PRIMARY KEY,
    space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_spaces_host_id ON spaces(host_id);
CREATE INDEX IF NOT EXISTS idx_spaces_city ON spaces(city);
CREATE INDEX IF NOT EXISTS idx_spaces_price ON spaces(price_per_hour);
CREATE INDEX IF NOT EXISTS idx_spaces_active ON spaces(active);
CREATE INDEX IF NOT EXISTS idx_spaces_capacity ON spaces(capacity);
CREATE INDEX IF NOT EXISTS idx_space_photos_space_id ON space_photos(space_id);
CREATE INDEX IF NOT EXISTS idx_space_features_space_id ON space_features(space_id);
