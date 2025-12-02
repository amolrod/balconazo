-- V5__add_category_column.sql
-- Añade columna category para filtrado de espacios

-- Añadir columna category
ALTER TABLE spaces ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- Crear índice para búsquedas por categoría
CREATE INDEX IF NOT EXISTS idx_spaces_category ON spaces(category);

-- Actualizar espacios existentes con categorías basadas en el título/descripción
UPDATE spaces SET category = 'terraza' WHERE LOWER(title) LIKE '%terraza%' OR LOWER(title) LIKE '%rooftop%';
UPDATE spaces SET category = 'jardin' WHERE LOWER(title) LIKE '%jardín%' OR LOWER(title) LIKE '%jardin%' OR LOWER(title) LIKE '%masía%' OR LOWER(title) LIKE '%masia%';
UPDATE spaces SET category = 'atico' WHERE LOWER(title) LIKE '%ático%' OR LOWER(title) LIKE '%atico%';
UPDATE spaces SET category = 'salon' WHERE LOWER(title) LIKE '%loft%' OR LOWER(title) LIKE '%estudio%' OR LOWER(title) LIKE '%piso%' OR LOWER(title) LIKE '%apartamento%';
UPDATE spaces SET category = 'piscina' WHERE LOWER(description) LIKE '%piscina%';
UPDATE spaces SET category = 'azotea' WHERE LOWER(title) LIKE '%azotea%';
UPDATE spaces SET category = 'patio' WHERE LOWER(title) LIKE '%patio%' OR LOWER(title) LIKE '%bodega%';

-- Espacios específicos que pueden no haber sido categorizados
UPDATE spaces SET category = 'terraza' WHERE category IS NULL AND (LOWER(title) LIKE '%carmen%' OR LOWER(title) LIKE '%villa%');
UPDATE spaces SET category = 'salon' WHERE category IS NULL AND LOWER(title) LIKE '%palacete%';

-- Default: si aún no tiene categoría, asignar 'otros'
UPDATE spaces SET category = 'otros' WHERE category IS NULL;
