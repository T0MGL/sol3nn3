-- ================================================================
-- SOLENNE: Chat Automation Tables
-- Target: Supabase project qapqhhyfzmgkvzvtoluq
-- Run in: Supabase SQL Editor (https://supabase.com/dashboard/project/qapqhhyfzmgkvzvtoluq/sql/new)
-- IMPORTANT: This creates tables in the SAME Supabase as NOCTE but with solenne_ prefix
-- NEVER modify nocte_ tables
-- ================================================================

BEGIN;

-- 1. Chat Histories (LangChain Postgres Chat Memory format)
CREATE TABLE IF NOT EXISTS solenne_chat_histories (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  message JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_solenne_chat_session ON solenne_chat_histories(session_id);
CREATE INDEX IF NOT EXISTS idx_solenne_chat_created ON solenne_chat_histories(created_at DESC);

ALTER TABLE solenne_chat_histories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON solenne_chat_histories;
CREATE POLICY "Service role full access"
  ON solenne_chat_histories
  FOR ALL
  USING (auth.role() = 'service_role');

-- 2. Contacts / Conversation State
CREATE TABLE IF NOT EXISTS solenne_contacts (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(200),
  awaiting_location BOOLEAN DEFAULT FALSE,
  awaiting_data BOOLEAN DEFAULT FALSE,
  data_step VARCHAR(50),
  order_status VARCHAR(30),
  escalated BOOLEAN DEFAULT FALSE,
  pending_order_id VARCHAR(100),
  last_faq_sent VARCHAR(100),
  last_route VARCHAR(50),
  last_ai_at TIMESTAMPTZ,
  last_interaction TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_solenne_contacts_phone ON solenne_contacts(phone);

ALTER TABLE solenne_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON solenne_contacts;
CREATE POLICY "Service role full access"
  ON solenne_contacts
  FOR ALL
  USING (auth.role() = 'service_role');

-- 3. Order Drafts (temporary capture data during order flow)
CREATE TABLE IF NOT EXISTS solenne_order_drafts (
  phone VARCHAR(30) PRIMARY KEY,
  draft_json JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE solenne_order_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON solenne_order_drafts;
CREATE POLICY "Service role full access"
  ON solenne_order_drafts
  FOR ALL
  USING (auth.role() = 'service_role');

-- 4. Knowledge Base (FAQ content for keyword routing)
CREATE TABLE IF NOT EXISTS solenne_knowledge_base (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  trigger_keywords TEXT[],
  content TEXT NOT NULL,
  priority INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE solenne_knowledge_base ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON solenne_knowledge_base;
CREATE POLICY "Service role full access"
  ON solenne_knowledge_base
  FOR ALL
  USING (auth.role() = 'service_role');

-- 5. Few-Shot Examples (conversation examples for AI agent)
CREATE TABLE IF NOT EXISTS solenne_few_shot_examples (
  id SERIAL PRIMARY KEY,
  scenario TEXT NOT NULL,
  conversation_text TEXT NOT NULL,
  outcome TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE solenne_few_shot_examples ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON solenne_few_shot_examples;
CREATE POLICY "Service role full access"
  ON solenne_few_shot_examples
  FOR ALL
  USING (auth.role() = 'service_role');

-- 6. Upsert Contact RPC (atomic upsert for conversation state)
CREATE OR REPLACE FUNCTION solenne_upsert_contact(
  p_phone TEXT,
  p_name TEXT DEFAULT NULL,
  p_awaiting_location BOOLEAN DEFAULT NULL,
  p_awaiting_data BOOLEAN DEFAULT NULL,
  p_data_step TEXT DEFAULT NULL,
  p_order_status TEXT DEFAULT NULL,
  p_escalated BOOLEAN DEFAULT NULL,
  p_pending_order_id TEXT DEFAULT NULL,
  p_last_faq_sent TEXT DEFAULT NULL,
  p_last_route TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO solenne_contacts (
    phone, name, awaiting_location, awaiting_data, data_step,
    order_status, escalated, pending_order_id, last_faq_sent,
    last_route, last_interaction
  )
  VALUES (
    p_phone, p_name,
    COALESCE(p_awaiting_location, FALSE),
    COALESCE(p_awaiting_data, FALSE),
    p_data_step, p_order_status,
    COALESCE(p_escalated, FALSE),
    p_pending_order_id, p_last_faq_sent,
    p_last_route, NOW()
  )
  ON CONFLICT (phone)
  DO UPDATE SET
    name = COALESCE(p_name, solenne_contacts.name),
    awaiting_location = COALESCE(p_awaiting_location, solenne_contacts.awaiting_location),
    awaiting_data = COALESCE(p_awaiting_data, solenne_contacts.awaiting_data),
    data_step = COALESCE(p_data_step, solenne_contacts.data_step),
    order_status = COALESCE(p_order_status, solenne_contacts.order_status),
    escalated = COALESCE(p_escalated, solenne_contacts.escalated),
    pending_order_id = COALESCE(p_pending_order_id, solenne_contacts.pending_order_id),
    last_faq_sent = COALESCE(p_last_faq_sent, solenne_contacts.last_faq_sent),
    last_route = COALESCE(p_last_route, solenne_contacts.last_route),
    last_interaction = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Seed Knowledge Base
INSERT INTO solenne_knowledge_base (category, trigger_keywords, content, priority, active) VALUES
('producto', ARRAY['serum','pdrn','peptido','ingredientes','que es','que tiene'],
 'PDRN Pink Peptide Serum 30ml. PDRN 1%, Complejo de 5 Peptidos 5%, Acido Hialuronico 3%, Niacinamida 4%. Regeneracion celular + hidratacion profunda + luminosidad.', 10, true),

('precio', ARRAY['precio','cuanto','costo','vale','cuesta'],
 'Personal (1): Gs. 189.000 | Kit Duo (2): Gs. 299.000 (ahorras Gs. 79.000) | Kit Familiar (3): Gs. 399.000 (ahorras Gs. 168.000). Extras: Gs. 133.000 c/u. Envio GRATIS.', 10, true),

('envio', ARRAY['envio','delivery','demora','llega','cuanto tarda','entrega'],
 'Envio GRATIS a todo Paraguay. Entrega en 1-3 dias habiles.', 9, true),

('garantia', ARRAY['garantia','devolver','devolucion','cambio','reembolso'],
 'Garantia de satisfaccion de 30 dias. Si no ves resultados, devolvemos tu dinero.', 9, true),

('uso', ARRAY['como se usa','aplicar','uso','rutina','cuantas veces','gotas'],
 '2-3 gotas sobre piel limpia, manana y noche, antes de crema hidratante. Resultados desde primera semana.', 8, true),

('resultados', ARRAY['funciona','resultado','sirve','efectivo','cuanto tarda','antes despues'],
 'Resultados visibles desde semana 1: piel mas luminosa e hidratada. Resultados completos en 4-6 semanas.', 8, true),

('pago', ARRAY['pago','pagar','transferencia','tarjeta','efectivo','contraentrega'],
 'Pago contra entrega (efectivo al recibir), tarjeta de credito/debito por la web, transferencia bancaria.', 7, true),

('local', ARRAY['local','tienda','donde estan','retirar','pasar a buscar'],
 'No tenemos local fisico. Solo delivery a todo Paraguay. Envio GRATIS.', 7, true);

-- 8. Seed Few-Shot Examples
INSERT INTO solenne_few_shot_examples (scenario, conversation_text, outcome, active) VALUES
('precio_y_cierre',
 'Clienta: Hola, cuanto cuesta el serum?
Sofia: Hola! El PDRN Serum esta a Gs. 189.000 la unidad. Pero el Kit Duo (2 unidades) te sale Gs. 299.000 y ahorras Gs. 79.000. Es ideal para compartir con alguien o tener uno de repuesto. Te gustaria aprovechar el Kit Duo?
Clienta: Si dale, quiero el kit duo
Sofia: Perfecto! Para enviarte tu Kit Duo necesito tu nombre completo y tu ubicacion (un link de Google Maps o tu direccion). El envio es GRATIS a todo Paraguay!',
 'venta_kit_duo', true),

('objecion_precio',
 'Clienta: Esta caro
Sofia: Entiendo! Pero considera que cada serum rinde 60 aplicaciones (2 meses). Son menos de Gs. 3.200 por dia por una piel radiante. Ademas, con el Kit Duo ahorras Gs. 79.000. Y si no ves resultados en 30 dias, te devolvemos tu dinero. Te gustaria probarlo?',
 'manejo_objecion', true),

('duda_ingredientes',
 'Clienta: Que ingredientes tiene?
Sofia: El PDRN Serum tiene una formula premium: PDRN 1% (regeneracion celular), Complejo de 5 Peptidos 5% (firmeza), Acido Hialuronico 3% (hidratacion profunda) y Niacinamida 4% (luminosidad). Es K-beauty de verdad! Te gustaria probarlo?',
 'informacion', true),

('seguimiento_ubicacion',
 'Clienta: Quiero comprar
Sofia: Genial! Cuantos serums te gustaria? 1 (Gs. 189.000), Kit Duo de 2 (Gs. 299.000), o Kit Familiar de 3 (Gs. 399.000)?
Clienta: 2
Sofia: Excelente eleccion! El Kit Duo es nuestro mas vendido. Para enviarte tu pedido necesito tu nombre completo y tu ciudad. Desde donde nos escribis?
Clienta: Maria, de Encarnacion
Sofia: Perfecto Maria! Nos podrias compartir un link de Google Maps con tu ubicacion exacta? Solo abriendo Maps y mantener presionado tu ubicacion. El envio es totalmente GRATIS!',
 'captura_datos', true);

COMMIT;

-- ================================================================
-- VERIFICATION: Run after migration
-- ================================================================
-- SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'solenne_%';
-- SELECT id, category, content, priority FROM solenne_knowledge_base ORDER BY priority DESC;
-- SELECT id, scenario, outcome FROM solenne_few_shot_examples;
