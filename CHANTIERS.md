# CHANTIERS — MentiAnalyser

État au **02/11/2026**, réalisation `ca5ec4f`, cadrage `e9a79cf`.

## En cours

- Publication du mode prévention autorisée explicitement par l’utilisateur le
  02/11/2026 : push et vérification du déploiement à terminer.
- AG-001 ouvert dans AGORA.md : contradiction indépendante à relayer à une
  IA d'un autre éditeur ; les définitions métier restent à l'utilisateur.

## État vérifié

- Mode prévention distinct, options éditables, inconnus conservés, sélection
  des constats, JSON versionné et rapport imprimable avec annexe et réserves.
- 69 tests passent sous Node 20, dont 5 nouveaux ; confusion effectif /
  pourcentage détectée par mutation d'une copie temporaire.
- Chromium : PNG et ZIP fictifs, ancien PDF du ZIP ignoré, API simulée,
  contrôle puis rapport/PDF, JSON, persistance et séparation des modes.
  Aucun débordement horizontal à 390 px et 1280 px.
- Les CDN unpkg/cdnjs restent bloqués dans cette instance ; les tests
  navigateur utilisent les mêmes versions publiques préchargées depuis
  jsDelivr. Extraction IA réelle et déploiement non validés.
- Les fichiers de travail de la classe sont dans /workspace/output,
  hors dépôt : ne pas les ajouter à Git. Relecture de l'animateur requise.

## Points à ne pas défaire

- Une déclaration d'usage ou de difficulté n'est pas une bonne/mauvaise réponse.
- Ne pas convertir une ancienne note en réponses de sondage : réimport requis.
- Réponses multiples : pas d'addition en score ni de croisement individuel.
- Effectif de classe et répondants par question sont distincts ; inconnus
  conservés, aucune moyenne d'âge calculée sur des contributions ambiguës.
- Données fictives pour les tests ; aucune donnée réelle d'élève dans Git.
