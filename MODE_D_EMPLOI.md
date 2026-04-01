# Mode d'Emploi - Site Web "Notre Gabon"

Ce document est un guide complet destiné aux utilisateurs du site **Notre Gabon**. Il détaille l'arborescence du site pour les visiteurs ainsi que le fonctionnement complet de l'interface d'administration pour la gestion du contenu.

---

## 1. Arborescence du Site (Interface Publique)

L'interface publique est structurée pour offrir une navigation fluide et intuitive. Voici l'organisation des pages accessibles aux visiteurs :

### • Accueil (`/`)
La vitrine principale de l'association. Elle contient :
*   **Bannière dynamique** : Alternance d'images et de messages clés.
*   **Mission & Chiffres clés** : Présentation de l'impact de l'association.
*   **Dernières Actualités** : Aperçu des articles récents.
*   **Section Rapport Annuel** : Bouton d'accès au document de référence.

### • Actualités (`/actualites`)
*   **Liste des articles** : Affichage chronologique de toutes les publications.
*   **Détail d'un article** (`/article/:id`) : Page complète de lecture d'une actualité avec texte et images.

### • Événements (`/evenements`)
*   Présentation des actions passées et futures organisées par Notre Gabon.

### • Bénévolat (`/benevolat`)
*   Page dédiée aux personnes souhaitant s'engager. Elle présente les missions et les modalités de participation.

### • Professionnel (`/professionnel`)
*   Informations et services destinés aux partenaires institutionnels et entreprises.

### • Dialogue (`/dialogue`)
*   Espace de communication et d'échange sur les thématiques sociales.

### • Média (`/media`)
*   Galerie photo et vidéo des activités de l'association.

### • Nous (Menu déroulant)
*   **Partenariats** (`/partenariats`) : Liste et logos des partenaires qui soutiennent l'association.
*   **Impact** (`/impact`) : Détails chiffrés et témoignages sur les résultats des actions menées.

---

## 2. Guide de Manipulation - Menu Admin

L'interface d'administration permet de modifier presque tout le contenu du site sans toucher au code.

### 2.1. Accès à l'Administration
1.  Rendez-vous sur la page `/login`.
2.  Saisissez vos identifiants (Email et Mot de passe).
3.  Une fois connecté, vous arrivez sur le **Tableau de Bord**.

### 2.2. Structure de l'Interface Admin
L'écran est divisé en deux parties :
*   **Barre latérale (Gauche)** : Le menu de navigation entre les différents modules.
*   **Zone de contenu (Droite)** : L'espace où vous effectuez les modifications.

### 2.3. Gestion des Modules Standard (Articles, Événements, Partenaires, etc.)
Tous ces modules fonctionnent selon le même principe :

#### A. Consulter la liste
En cliquant sur un module (ex: "Articles"), vous voyez la liste de tous les éléments déjà créés. Vous pouvez voir leur titre, leur image d'aperçu et leur date.

#### B. Ajouter un élément
1.  Cliquez sur le bouton **"+ Nouveau"** (ex: "+ Nouvel article").
2.  Remplissez les champs (Titre, Catégorie, Date, Résumé, Contenu).
3.  **Gestion de l'image** : 
    *   Vous pouvez cliquer sur "Choisir un fichier" pour envoyer une photo depuis votre ordinateur.
    *   Ou coller directement un lien (URL) vers une image existante sur internet.
4.  Cliquez sur **"Publier/Enregistrer"**.

#### C. Modifier un élément
1.  Cherchez l'élément dans la liste et cliquez sur le bouton **"Modifier"**.
2.  Changez les informations souhaitées.
3.  Cliquez sur **"Sauvegarder"**.

#### D. Supprimer un élément
1.  Cliquez sur le bouton **"Supprimer"**.
2.  Une confirmation apparaîtra. Cliquez sur **"Confirmer ?"** pour valider définitivement la suppression.

### 2.4. Gestion Spécifique

#### • Bannière (Hero Section)
Ce module gère les images et les messages qui défilent sur la page d'accueil. Chaque "slide" possède un titre, une description et une image de fond. L'ordre d'affichage suit l'ordre de création.

#### • Mission & Chiffres Clés
Contrairement aux listes, cette page propose un formulaire unique :
*   **Texte Principal** : Titre et description de la mission (le code HTML comme `<strong>` est autorisé pour mettre en gras).
*   **Chiffres Clés** : 4 blocs pour définir une valeur (ex: "16,5 m") et un libellé (ex: "PAYS").
*   **Rapport Annuel** : Permet de changer le titre du bouton et le lien vers le fichier PDF du rapport.

---

## 3. Conseils de Redaction et Manipulation

*   **Format des images** : Utilisez de préférence des fichiers `.jpg` ou `.png`. Pour les bannières, préférez des images larges (paysage).
*   **Textes longs** : Pour une meilleure lisibilité, aérez vos paragraphes dans les articles.
*   **Liens** : Lorsque vous ajoutez un lien pour un bouton (ex: `/contact` ou `https://...`), assurez-vous qu'il est correct avant d'enregistrer.
*   **Déconnexion** : N'oubliez pas de vous déconnecter en fin de session via le bouton rouge en bas du menu latéral.

---
*Ce document sert de base contractuelle pour la livraison du site et peut être complété par des captures d'écran pour une version finale en format Word.*
