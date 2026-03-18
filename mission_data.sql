-- Copiez et collez ce code dans l'éditeur SQL de Supabase (SQL Editor) puis cliquez sur "Run".

-- 1. On commence par créer les deux colonnes manquantes dans votre table
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS button_text TEXT;
ALTER TABLE public.site_content ADD COLUMN IF NOT EXISTS button_link TEXT;

-- 2. Ensuite on insère les données de la page Mission
INSERT INTO site_content (section_key, title, content, button_text, button_link)
VALUES 
(
  'mission_main', 
  'Une organisation humanitaire médicale internationale et indépendante', 
  'Nous apportons une aide médicale aux populations touchées par les conflits, les épidémies, les catastrophes naturelles ou l''exclusion des soins de santé. Nos équipes sont composées de dizaines de milliers de professionnels de santé, de personnel logistique et administratif, recrutés pour la plupart localement. Nos actions sont guidées par l''éthique médicale et les <strong>principes d''impartialité, d''indépendance et de neutralité</strong>.', 
  'APPRENDRE ENCORE PLUS', 
  '#'
),
(
  'mission_report', 
  'Rapport sur les activités internationales 2024', 
  '', 
  'LIRE LE RAPPORT', 
  '#'
),
(
  'mission_stats', 
  '', 
  '[{"value": "16,5 m", "label": "CONSULTATIONS EXTERNES"}, {"value": "3,9 M", "label": "CAS DE PALUDISME TRAITÉS"}, {"value": "1,7 m", "label": "PATIENTS ADMIS"}, {"value": "75", "label": "PAYS"}]', 
  '', 
  ''
);
