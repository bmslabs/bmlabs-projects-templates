-- =============================================================================
-- SCRIPT INICIAL DE BASE DE DATOS - POSTGRESQL
-- =============================================================================
-- 
-- Este script crea la estructura inicial de la base de datos para el sistema
-- de facturación con las siguientes tablas:
-- - facturas: Tabla principal de facturas
-- - lineas: Líneas de detalle de cada factura  
-- - bitacora: Registro de eventos y cambios de las facturas
--
-- Características:
-- - PKs con UUID autogenerados
-- - Referencias con integridad referencial
-- - Índices optimizados para consultas frecuentes
-- - Campos de auditoría (created_at, updated_at)
-- - Estructura preparada para escalabilidad
--
-- Uso: psql -U usuario -d postgres -f initial-script.sql
-- =============================================================================

-- Crear la base de datos test (si no existe)
-- NOTA: Este comando debe ejecutarse conectado a 'postgres' u otra BD
SELECT 'CREATE DATABASE test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'test')\gexec

-- Conectar a la base de datos test
\c test;

-- =============================================================================
-- CONFIGURACIÓN INICIAL
-- =============================================================================

-- Habilitar extensión para generar UUIDs automáticamente
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Habilitar extensión para funciones de texto (opcional)
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Configurar zona horaria
SET timezone = 'America/Santiago';

-- =============================================================================
-- TABLA: facturas
-- =============================================================================
-- Tabla principal que almacena la información de las facturas

CREATE TABLE IF NOT EXISTS facturas (
    -- Clave primaria con UUID autogenerado
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información básica de la factura
    numero_factura VARCHAR(20) NOT NULL UNIQUE,
    fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    
    -- Información del cliente
    rut_cliente VARCHAR(12) NOT NULL,
    nombre_cliente VARCHAR(255) NOT NULL,
    direccion_cliente TEXT,
    
    -- Montos y totales
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    descuento DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    impuestos DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    
    -- Estado y clasificación
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE' 
        CHECK (estado IN ('BORRADOR', 'PENDIENTE', 'PAGADA', 'VENCIDA', 'ANULADA')),
    tipo_factura VARCHAR(20) NOT NULL DEFAULT 'VENTA'
        CHECK (tipo_factura IN ('VENTA', 'DEVOLUCION', 'NOTA_CREDITO', 'NOTA_DEBITO')),
    
    -- Información adicional
    observaciones TEXT,
    referencia_externa VARCHAR(50),
    
    -- Campos de auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) DEFAULT CURRENT_USER,
    updated_by VARCHAR(50) DEFAULT CURRENT_USER
);

-- Comentarios de la tabla facturas
COMMENT ON TABLE facturas IS 'Tabla principal de facturas del sistema';
COMMENT ON COLUMN facturas.id IS 'Identificador único de la factura (UUID)';
COMMENT ON COLUMN facturas.numero_factura IS 'Número correlativo único de la factura';
COMMENT ON COLUMN facturas.estado IS 'Estado actual de la factura (BORRADOR, PENDIENTE, PAGADA, VENCIDA, ANULADA)';
COMMENT ON COLUMN facturas.total IS 'Monto total de la factura incluyendo impuestos';

-- =============================================================================
-- TABLA: lineas
-- =============================================================================
-- Tabla de líneas de detalle para cada factura

CREATE TABLE IF NOT EXISTS lineas (
    -- Clave primaria con UUID autogenerado
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relación con la factura (FK)
    factura_id UUID NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
    
    -- Información del producto/servicio
    codigo_producto VARCHAR(50),
    nombre_producto VARCHAR(255) NOT NULL,
    descripcion TEXT,
    
    -- Cantidades y precios
    cantidad DECIMAL(10,3) NOT NULL DEFAULT 1.000,
    precio_unitario DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    descuento_linea DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    subtotal_linea DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    
    -- Impuestos específicos de la línea
    tasa_impuesto DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- Ej: 19.00 para IVA 19%
    monto_impuesto DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_linea DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    
    -- Información adicional
    unidad_medida VARCHAR(10) DEFAULT 'UNI', -- UNI, KG, LT, M2, etc.
    numero_linea INTEGER NOT NULL DEFAULT 1, -- Orden de la línea en la factura
    
    -- Campos de auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comentarios de la tabla lineas
COMMENT ON TABLE lineas IS 'Líneas de detalle de las facturas';
COMMENT ON COLUMN lineas.factura_id IS 'Referencia a la factura principal';
COMMENT ON COLUMN lineas.numero_linea IS 'Número de orden de la línea dentro de la factura';
COMMENT ON COLUMN lineas.total_linea IS 'Total de la línea incluyendo impuestos y descuentos';

-- =============================================================================
-- TABLA: bitacora
-- =============================================================================
-- Tabla de bitácora para registrar todos los eventos y cambios de las facturas

CREATE TABLE IF NOT EXISTS bitacora (
    -- Clave primaria con UUID autogenerado
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relación con la factura (FK)
    factura_id UUID NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
    
    -- Información del evento
    tipo_evento VARCHAR(30) NOT NULL
        CHECK (tipo_evento IN (
            'CREACION', 'MODIFICACION', 'CAMBIO_ESTADO', 'ELIMINACION',
            'PAGO_REGISTRADO', 'PAGO_ANULADO', 'NOTA_CREDITO', 'VENCIMIENTO',
            'ENVIO_CLIENTE', 'RECHAZO_CLIENTE', 'ANULACION'
        )),
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20),
    
    -- Detalles del cambio
    descripcion_evento TEXT NOT NULL,
    datos_anteriores JSONB, -- Almacenar estado previo en formato JSON
    datos_nuevos JSONB,     -- Almacenar nuevo estado en formato JSON
    
    -- Información del cambio
    usuario_evento VARCHAR(50) NOT NULL DEFAULT CURRENT_USER,
    ip_origen INET,
    user_agent TEXT,
    
    -- Información adicional
    referencia_externa VARCHAR(100), -- ID de sistema externo si aplica
    observaciones TEXT,
    
    -- Timestamp del evento
    fecha_evento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Comentarios de la tabla bitacora
COMMENT ON TABLE bitacora IS 'Bitácora de eventos y cambios de las facturas';
COMMENT ON COLUMN bitacora.tipo_evento IS 'Tipo de evento registrado (CREACION, MODIFICACION, etc.)';
COMMENT ON COLUMN bitacora.datos_anteriores IS 'Estado anterior de los datos en formato JSON';
COMMENT ON COLUMN bitacora.datos_nuevos IS 'Nuevo estado de los datos en formato JSON';
COMMENT ON COLUMN bitacora.fecha_evento IS 'Timestamp exacto cuando ocurrió el evento';

-- =============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN DE CONSULTAS
-- =============================================================================

-- Índices en tabla facturas
CREATE INDEX IF NOT EXISTS idx_facturas_numero ON facturas(numero_factura);
CREATE INDEX IF NOT EXISTS idx_facturas_cliente ON facturas(rut_cliente);
CREATE INDEX IF NOT EXISTS idx_facturas_fecha ON facturas(fecha_emision);
CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);
CREATE INDEX IF NOT EXISTS idx_facturas_created_at ON facturas(created_at);

-- Índices en tabla lineas
CREATE INDEX IF NOT EXISTS idx_lineas_factura_id ON lineas(factura_id);
CREATE INDEX IF NOT EXISTS idx_lineas_producto ON lineas(codigo_producto);
CREATE INDEX IF NOT EXISTS idx_lineas_factura_numero ON lineas(factura_id, numero_linea);

-- Índices en tabla bitacora
CREATE INDEX IF NOT EXISTS idx_bitacora_factura_id ON bitacora(factura_id);
CREATE INDEX IF NOT EXISTS idx_bitacora_tipo_evento ON bitacora(tipo_evento);
CREATE INDEX IF NOT EXISTS idx_bitacora_fecha ON bitacora(fecha_evento);
CREATE INDEX IF NOT EXISTS idx_bitacora_usuario ON bitacora(usuario_evento);

-- Índice compuesto para consultas frecuentes de bitácora
CREATE INDEX IF NOT EXISTS idx_bitacora_factura_fecha ON bitacora(factura_id, fecha_evento DESC);

-- =============================================================================
-- TRIGGERS PARA AUDITORÍA AUTOMÁTICA
-- =============================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.updated_by = CURRENT_USER;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para facturas
CREATE TRIGGER tr_facturas_updated_at
    BEFORE UPDATE ON facturas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

-- Trigger para lineas
CREATE TRIGGER tr_lineas_updated_at
    BEFORE UPDATE ON lineas
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_updated_at();

-- =============================================================================
-- FUNCIÓN PARA REGISTRAR EVENTOS EN BITÁCORA
-- =============================================================================

CREATE OR REPLACE FUNCTION registrar_evento_factura(
    p_factura_id UUID,
    p_tipo_evento VARCHAR(30),
    p_descripcion TEXT,
    p_estado_anterior VARCHAR(20) DEFAULT NULL,
    p_estado_nuevo VARCHAR(20) DEFAULT NULL,
    p_datos_anteriores JSONB DEFAULT NULL,
    p_datos_nuevos JSONB DEFAULT NULL,
    p_observaciones TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_bitacora_id UUID;
BEGIN
    INSERT INTO bitacora (
        factura_id, tipo_evento, descripcion_evento,
        estado_anterior, estado_nuevo,
        datos_anteriores, datos_nuevos, observaciones
    ) VALUES (
        p_factura_id, p_tipo_evento, p_descripcion,
        p_estado_anterior, p_estado_nuevo,
        p_datos_anteriores, p_datos_nuevos, p_observaciones
    ) RETURNING id INTO v_bitacora_id;
    
    RETURN v_bitacora_id;
END;
$$ LANGUAGE plpgsql;

-- Comentario de la función
COMMENT ON FUNCTION registrar_evento_factura IS 'Función helper para registrar eventos en la bitácora de facturas';

-- =============================================================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =============================================================================

-- Insertar una factura de ejemplo
INSERT INTO facturas (
    numero_factura, rut_cliente, nombre_cliente, direccion_cliente,
    subtotal, impuestos, total, observaciones
) VALUES (
    'F-2026-001', '12345678-9', 'Cliente de Ejemplo S.A.', 
    'Av. Ejemplo 123, Santiago, Chile',
    100000.00, 19000.00, 119000.00, 
    'Factura de ejemplo creada por script inicial'
) ON CONFLICT (numero_factura) DO NOTHING;

-- Obtener el ID de la factura de ejemplo para las líneas
DO $$
DECLARE
    factura_ejemplo_id UUID;
BEGIN
    SELECT id INTO factura_ejemplo_id FROM facturas WHERE numero_factura = 'F-2026-001';
    
    IF factura_ejemplo_id IS NOT NULL THEN
        -- Insertar líneas de ejemplo
        INSERT INTO lineas (
            factura_id, codigo_producto, nombre_producto, 
            cantidad, precio_unitario, subtotal_linea, 
            monto_impuesto, total_linea, numero_linea
        ) VALUES 
        (factura_ejemplo_id, 'PROD-001', 'Producto de Ejemplo 1', 2.000, 25000.00, 50000.00, 9500.00, 59500.00, 1),
        (factura_ejemplo_id, 'PROD-002', 'Producto de Ejemplo 2', 1.000, 50000.00, 50000.00, 9500.00, 59500.00, 2);
        
        -- Registrar evento de creación en bitácora
        PERFORM registrar_evento_factura(
            factura_ejemplo_id,
            'CREACION',
            'Factura creada mediante script inicial de base de datos',
            NULL,
            'PENDIENTE',
            NULL,
            jsonb_build_object('numero_factura', 'F-2026-001', 'total', 119000.00),
            'Datos de ejemplo generados automáticamente'
        );
    END IF;
END $$;


