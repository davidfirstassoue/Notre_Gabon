-- Ce fichier contient les requêtes SQL à exécuter dans l'éditeur SQL de Supabase
-- pour installer la fonctionnalité "Bénévolat".

-- 1. Création de la table
CREATE TABLE public.missions_benevolat (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    titre text NOT NULL,
    description text,
    date_mission timestamp with time zone,
    lieu text,
    image_url text,
    statut text DEFAULT 'Ouvert', -- 'Ouvert' ou 'Complet'
    lien_inscription text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Activer RLS (Row Level Security) sur la table
ALTER TABLE public.missions_benevolat ENABLE ROW LEVEL SECURITY;

-- 3. Politique de lecture publique
CREATE POLICY "Les missions sont publiques" 
ON public.missions_benevolat 
FOR SELECT 
USING (true);

-- 4. Polique de modification globale pour l'admin
CREATE POLICY "Insertion missions" 
ON public.missions_benevolat 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Mise à jour missions" 
ON public.missions_benevolat 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Suppression missions" 
ON public.missions_benevolat 
FOR DELETE 
USING (auth.role() = 'authenticated');
