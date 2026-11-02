# CHANTIERS — MentiAnalyser

État au **02/11/2026**, base relue `91fef35`, réalisation `ca5ec4f`.

## En cours

- Vérification directe du HTML publié encore bloquée par le proxy (403 vers
  maswaddpt47-cmyk.github.io) ; API GitHub également bloquée. Le vérificateur
  MD-LIB ne peut donc pas conclure malgré le succès affiché par Actions.
- AG-001 : réponse de Claude reçue dans `91fef35`, verdict **amendé**.
  L'utilisateur n'a pas encore tranché. Aucun correctif applicatif fait à
  l'occasion du pull ; conserver sa réponse sans la reformuler dans AGORA.md.
- Écarts rapportés par Claude à vérifier et traiter après arbitrage : phrase
  sur le poids d'un élève (classe / répondants), alerte sur les constats à
  petit effectif, validation des types numériques, poursuite de l'extraction
  après une question PDF invalide, couverture des tests par mutation.
- Suggestion pédagogique du contradicteur : documenter les conditions de
  passation (lecture à voix haute, aide à la lecture). À décider ; aucune
  condition réelle de passation n'est connue de cette session.

## État vérifié

- Mode prévention distinct, options éditables, inconnus conservés, sélection
  des constats, JSON versionné et rapport imprimable avec annexe et réserves.
- 69 tests passent sous Node 20, dont 5 nouveaux ; confusion effectif /
  pourcentage à la normalisation détectée par mutation d'une copie temporaire.
  Cette mesure ne couvre pas tous les calculs : Claude signale quatre
  mutations survivantes dans sa réponse AG-001 ; contrôle à compléter.
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
