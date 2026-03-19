-- Ce fichier contient les requêtes SQL à exécuter dans l'éditeur SQL de Supabase
-- pour installer la fonctionnalité "Professionnel" (Offres d'emploi, stages, etc.).

-- 1. Création de la table
CREATE TABLE public.offres_emploi (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    titre text NOT NULL,
    type_contrat text NOT NULL, -- ex: 'Stage', 'CDI', 'Service Civique'
    description text NOT NULL,
    lieu text,
    statut text DEFAULT 'Ouvert', -- 'Ouvert' ou 'Pourvu'
    lien_postuler text, -- url ou mailto
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Activer RLS (Row Level Security) sur la table
ALTER TABLE public.offres_emploi ENABLE ROW LEVEL SECURITY;

-- 3. Politique de lecture publique
CREATE POLICY "Les offres sont publiques" 
ON public.offres_emploi 
FOR SELECT 
USING (true);

-- 4. Polique de modification globale pour l'admin
CREATE POLICY "Insertion offres" 
ON public.offres_emploi 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Mise à jour offres" 
ON public.offres_emploi 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Suppression offres" 
ON public.offres_emploi 
FOR DELETE 
USING (auth.role() = 'authenticated');
