-- SUPABASE CONFIGURATION : DIALOGUE & DEBATS

-- TABLE 1 : DEBATS CITOYENS
CREATE TABLE public.debats_citoyens (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    titre text NOT NULL,
    description text NOT NULL,
    date_debat timestamp with time zone,
    lieu text,
    statut text DEFAULT 'À venir', -- 'À venir', 'Passé', 'Annulé'
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.debats_citoyens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Voir les debats publics" ON public.debats_citoyens FOR SELECT USING (true);
CREATE POLICY "Insertion debats" ON public.debats_citoyens FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Mise à jour debats" ON public.debats_citoyens FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Suppression debats" ON public.debats_citoyens FOR DELETE USING (auth.role() = 'authenticated');


-- TABLE 2 : BOITE A IDEES CITOYENNE
CREATE TABLE public.boite_idees (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nom text NOT NULL,
    email text,
    sujet text NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.boite_idees ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs anonymes (visiteurs) peuvent insérer une idée
CREATE POLICY "Soumettre une idée" ON public.boite_idees FOR INSERT WITH CHECK (true);

-- Seuls les administrateurs peuvent lire et supprimer les idées
CREATE POLICY "Lire les idées" ON public.boite_idees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Supprimer des idées" ON public.boite_idees FOR DELETE USING (auth.role() = 'authenticated');
