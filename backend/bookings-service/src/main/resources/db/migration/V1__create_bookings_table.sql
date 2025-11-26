-- V1__create_bookings_table.sql
-- Esquema inicial para bookings-service

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY,
    space_id UUID NOT NULL,
    guest_id UUID NOT NULL,
    host_id UUID NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Validación: startTime debe ser menor que endTime
    CONSTRAINT chk_booking_time_range CHECK (start_time < end_time)
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_bookings_space_id ON bookings(space_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_host_id ON bookings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);

-- Índice compuesto para detectar solapamientos
CREATE INDEX IF NOT EXISTS idx_bookings_space_time 
    ON bookings(space_id, start_time, end_time) 
    WHERE status IN ('PENDING', 'CONFIRMED');

-- Comentarios para documentación
COMMENT ON TABLE bookings IS 'Tabla principal de reservas de espacios';
COMMENT ON COLUMN bookings.space_id IS 'Referencia lógica al espacio en spaces-service';
COMMENT ON COLUMN bookings.guest_id IS 'Referencia lógica al usuario huésped en users-service';
COMMENT ON COLUMN bookings.host_id IS 'Referencia lógica al anfitrión del espacio';
COMMENT ON COLUMN bookings.status IS 'Estados: PENDING, CONFIRMED, CANCELLED, COMPLETED';
