# CHANTIERS — MentiAnalyser

État au **02/11/2026**, réalisation `ca5ec4f`, cadrage `e9a79cf`.

## En cours

- Vérification directe du HTML publié encore bloquée par le proxy (403 vers
  maswaddpt47-cmyk.github.io) ; API GitHub également bloquée. Le vérificateur
  MD-LIB ne peut donc pas conclure malgré le succès affiché par Actions.
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
  jsDelivr. Extraction IA réelle non validée.
- Push réalisé ; le workflow Actions #15 du commit `a67d23f` affiche Success
  (test 10 s, deploy 57 s). Preuve :
  https://github.com/maswaddpt47-cmyk/MentiAnalyser/actions/runs/41483403999
  Aucun changement applicatif après ce commit.
- Les fichiers de travail de la classe sont dans /workspace/output,
  hors dépôt : ne pas les ajouter à Git. Relecture de l'animateur requise.

## Points à ne pas défaire

- Une déclaration d'usage ou de difficulté n'est pas une bonne/mauvaise réponse.
- Ne pas convertir une ancienne note en réponses de sondage : réimport requis.
- Réponses multiples : pas d'addition en score ni de croisement individuel.
- Effectif de classe et répondants par question sont distincts ; inconnus
  conservés, aucune moyenne d'âge calculée sur des contributions ambiguës.
- Données fictives pour les tests ; aucune donnée réelle d'élève dans Git.
