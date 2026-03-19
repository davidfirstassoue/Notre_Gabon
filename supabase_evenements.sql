-- Ce fichier contient les requêtes SQL à exécuter dans l'éditeur SQL de Supabase
-- pour installer la fonctionnalité "Événements".

-- 1. Création de la table evenements
CREATE TABLE public.evenements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    titre text NOT NULL,
    description text,
    date_evenement timestamp with time zone NOT NULL,
    lieu text,
    image_url text NOT NULL,
    lien_inscription text,
    est_passe boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Activer RLS (Row Level Security) sur la table
ALTER TABLE public.evenements ENABLE ROW LEVEL SECURITY;

-- 3. Politique de lecture publique (tout le monde peut voir les événements)
CREATE POLICY "Les événements sont publics" 
ON public.evenements 
FOR SELECT 
USING (true);

-- 4. Polique de modification globale (temporaire, à ajuster si besoin)
-- Permet à l'admin (connecté) d'insérer/modifier/supprimer
CREATE POLICY "Insertion événements" 
ON public.evenements 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Mise à jour événements" 
ON public.evenements 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Suppression événements" 
ON public.evenements 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- 5. Création du bucket de stockage 'site-images' s'il n'existe pas déjà
-- (Normalement il existe déjà car vous l'utilisez pour d'autres parties du site,
-- mais si ce n'est pas le cas, exécutez ceci)
insert into storage.buckets (id, name, public) 
values ('site-images', 'site-images', true)
on conflict do nothing;
