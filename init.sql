CREATE TABLE IF NOT EXISTS registro_laboratorio (
    id SERIAL PRIMARY KEY,
    modulo VARCHAR(50) NOT NULL,
    tema VARCHAR(100) NOT NULL,
    entrada_json JSONB NOT NULL,
    salida_json JSONB NOT NULL,
    ejecutado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registros semilla
INSERT INTO registro_laboratorio (modulo, tema, entrada_json, salida_json) 
VALUES ('Unidad 2', 'U2-T4 Pureza', '{"x": 10}', '{"resultado": 20}');