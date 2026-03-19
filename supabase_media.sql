-- CONFIGURATION SUPABASE : ESPACE MÉDIA

CREATE TABLE public.communiques_presse (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    titre text NOT NULL,
    resume text,
    date_publication timestamp with time zone DEFAULT timezone('utc'::text, now()),
    url_document text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.communiques_presse ENABLE ROW LEVEL SECURITY;

-- Politique de lecture publique
CREATE POLICY "Lecture publique communiqués" ON public.communiques_presse FOR SELECT USING (true);

-- Politiques Admin
CREATE POLICY "Insertion communiqués" ON public.communiques_presse FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Mise à jour communiqués" ON public.communiques_presse FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression communiqués" ON public.communiques_presse FOR DELETE USING (auth.role() = 'authenticated');

-- Assurer la présence du bucket pour stocker les PDF s'il n'existe pas
insert into storage.buckets (id, name, public) 
values ('media-docs', 'media-docs', true)
on conflict do nothing;

-- TABLE 2 : PLATEFORMES MEDIA (Teasers YouTube, Instagram...)
CREATE TABLE public.plateformes_media (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    titre text NOT NULL,
    description text NOT NULL,
    lien_url text NOT NULL,
    type_plateforme text DEFAULT 'YouTube', -- 'YouTube', 'Instagram', 'Autre'
    image_fond text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.plateformes_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique plateformes" ON public.plateformes_media FOR SELECT USING (true);
CREATE POLICY "Insertion plateformes" ON public.plateformes_media FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Mise à jour plateformes" ON public.plateformes_media FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression plateformes" ON public.plateformes_media FOR DELETE USING (auth.role() = 'authenticated');
