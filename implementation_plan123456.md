# Plan d'ajout de sections à la page d'accueil

Ce plan détaille l'implémentation de quatre nouvelles sections sur la page principale (`Home.jsx`) en réutilisant et adaptant des composants et logiques existants dans les pages dédiées.

## User Review Required

> [!IMPORTANT]
> Les styles seront extraits ou adaptés des fichiers CSS existants (`Evenements.css`, `Benevolat.css`, etc.) pour assurer une cohérence visuelle parfaite.

## Proposed Changes

### 1. Section Événements
#### [NEW] [HomeEvenements.jsx](file:///c:/Users/david/Downloads/PROJETS%20FIRST/Notre_Gabon/src/sections/HomeEvenements.jsx)
- Récupération des 3 événements les plus proches (futurs en priorité, puis passés si besoin) via Supabase.
- Utilisation du composant `EventCard` (style identique à la page Événements).
- Titre de section : "Événements à venir".

### 2. Section Bénévolat
#### [NEW] [HomeBenevolat.jsx](file:///c:/Users/david/Downloads/PROJETS%20FIRST/Notre_Gabon/src/sections/HomeBenevolat.jsx)
- Un grand rectangle jaune (`var(--yellow)`).
- **Partie gauche** : Texte d'incitation blanc sur fond jaune (thème : engagement pour le bien du pays).
- **Partie droite** : Teaser d'une mission de bénévolat (récupérée de Supabase).
- Bouton "Je suis partant" sur la carte de mission.

### 3. Section Programme de Mentorat
#### [NEW] [HomeMentorat.jsx](file:///c:/Users/david/Downloads/PROJETS%20FIRST/Notre_Gabon/src/sections/HomeMentorat.jsx)
- Import de la structure de la section "Programme de Mentorat" présente dans `Professionnel.jsx`.
- Affichage du texte informatif et du logo de mentorat.
- **Ajout** : Bouton en bas de section "En savoir plus" redirigeant vers `/professionnel`.

### 4. Section Médiatique
#### [NEW] [HomeMedia.jsx](file:///c:/Users/david/Downloads/PROJETS%20FIRST/Notre_Gabon/src/sections/HomeMedia.jsx)
- Import de la section "Derniers Communiqués" de `Media.jsx`.
- Affichage des derniers communiqués (CP).
- **Ajout** : Bouton redirigeant directement vers la page `/media`.

### 5. Assemblage Final
#### [MODIFY] [Home.jsx](file:///c:/Users/david/Downloads/PROJETS%20FIRST/Notre_Gabon/src/pages/Home.jsx)
- Importation et ajout des 4 nouvelles sections dans le rendu de la page.
- L'ordre sera : Hero -> Actualites -> **Evenements** -> Mission -> **Benevolat** -> **Mentorat** -> **Media**.

## Verification Plan

### Automated Tests
- Vérification visuelle du rendu responsive (Mobile / Desktop) via l'outil navigateur.
- Vérification des liens de redirection vers les pages respectives.

### Manual Verification
- Vérifier que les données Supabase s'affichent correctement dans les teasers.
- Confirmer que le bouton "Je suis partant" dans la section Bénévolat fonctionne.
