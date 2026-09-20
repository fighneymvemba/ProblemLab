# ProblemLab V1

ProblemLab est une application web mobile-first destinée à transformer une recherche de problème en projet structuré :

PROBLÈME → CAUSES → BESOINS → OPPORTUNITÉS → IDÉES → SOLUTION → PMV → MARCHÉ → BMC → PITCH → LANCEMENT.

## Ce que contient cette V1

- tableau de bord moderne ;
- recherche contextualisée (monde/continent/pays/province/ville/territoire, urbain/rural, secteur) ;
- génération locale de résultats de démonstration ;
- analyse problème/solution ;
- constructeur d'idée ;
- étude de marché ;
- BMC en 11 blocs ;
- PMV ;
- pitch ;
- projets sauvegardés dans le navigateur ;
- écran de configuration Supabase ;
- structure prête pour Vercel ;
- architecture prête à connecter à un moteur IA/recherche côté serveur.

## Important

Cette version ne prétend pas effectuer des recherches Internet en temps réel. Les résultats de démonstration sont générés localement. La prochaine étape consiste à connecter une fonction serveur à des sources de recherche/IA, sans exposer de clé secrète dans le navigateur.

## Lancer sur ordinateur

1. Installer Node.js LTS.
2. Ouvrir un terminal dans ce dossier.
3. `npm install`
4. `npm run dev`
5. Ouvrir l'adresse affichée par Vite.

## Déploiement Vercel

1. Créer un dépôt GitHub et y envoyer ce dossier.
2. Importer le dépôt dans Vercel.
3. Ajouter les variables :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy.

## Supabase

Créer un projet Supabase puis récupérer :
- Project URL
- Publishable/anon key

Ne jamais mettre une `service_role` key dans le navigateur, GitHub ou une variable `VITE_*`.

## Prochaine version

- authentification réelle ;
- tables Supabase ;
- sauvegarde cloud ;
- récupération de mot de passe ;
- recherche web côté serveur ;
- IA côté serveur ;
- citations/sources ;
- génération de documents ;
- espace administrateur ;
- paiements éventuels ;
- domaine personnalisé.
