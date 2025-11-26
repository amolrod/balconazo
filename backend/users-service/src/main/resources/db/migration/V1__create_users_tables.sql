-- V1__create_users_tables.sql
-- Esquema inicial para users-service

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(150) NOT NULL,
    keycloak_id VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabla de roles (para referencia local, los roles reales están en Keycloak)
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- Tabla de relación usuarios-roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_keycloak_id ON users(keycloak_id);

-- Datos iniciales de roles
INSERT INTO roles (name, description) VALUES 
    ('ROLE_USER', 'Usuario base - puede buscar y reservar espacios'),
    ('ROLE_HOST', 'Anfitrión - puede publicar y gestionar espacios'),
    ('ROLE_ADMIN', 'Administrador - gestión global del sistema')
ON CONFLICT (name) DO NOTHING;
