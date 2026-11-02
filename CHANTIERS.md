# CHANTIERS — MentiAnalyser

État au **02/11/2026**, réalisation d’AG-002 dans `4c3b2cd`, contrôles finaux réussis.

## En cours

- Vérification directe du HTML publié encore bloquée par le proxy (403 vers
  maswaddpt47-cmyk.github.io) ; API GitHub également bloquée. Le vérificateur
  MD-LIB ne peut donc pas conclure malgré le succès affiché par Actions.
- Publication de la synthèse Claude et des visualisations à terminer.
- AG-002 ouvert : rédaction personnalisée et radar descriptif à faire relire
  par Claude, IA d'un autre éditeur ; fournir la phrase relais à l'utilisateur.

## État vérifié

- Mode prévention distinct, options éditables, inconnus conservés, sélection
  des constats, JSON versionné et rapport imprimable avec annexe et réserves.
- 81 tests passent sous Node 20, dont 17 prévention ; sept mutations détectées
  sur sept par scripts/check-prevention-mutations.cjs, désormais dans la CI.
- Chromium : PNG et ZIP fictifs, ancien PDF du ZIP ignoré, API simulée,
  contrôle puis rapport/PDF, JSON, persistance et séparation des modes ;
  conditions de passation et alerte petits effectifs sans masquage vérifiées.
  Deux appels distincts testés (vision puis rédaction Claude), prompt
  contextualisé, références aux réponses, cache invalidé après modification,
  erreur API explicite, graphiques et radar repris dans le PDF et le JSON.
  Aucun débordement horizontal à 390 px et 1280 px.
- Les CDN unpkg/cdnjs restent bloqués dans cette instance ; les tests
  navigateur utilisent les mêmes versions publiques préchargées depuis
  jsDelivr. Extraction IA réelle non validée.
- Correctifs publiés : workflow du commit `1a34079` terminé avec conclusion
  WORKFLOW_RUN_CONCLUSION_SUCCESS (test et déploiement). Preuve :
  https://github.com/maswaddpt47-cmyk/MentiAnalyser/actions/runs/41485996506
  Cette preuve concerne AG-001 ; le déploiement d'AG-002 reste à vérifier.
- Les fichiers de travail de la classe sont dans /workspace/output,
  hors dépôt : ne pas les ajouter à Git. Relecture de l'animateur requise.

## Points à ne pas défaire

- Une déclaration d'usage ou de difficulté n'est pas une bonne/mauvaise réponse.
- Ne pas convertir une ancienne note en réponses de sondage : réimport requis.
- Réponses multiples : pas d'addition en score ni de croisement individuel.
- Effectif de classe et répondants par question sont distincts ; inconnus
  conservés, aucune moyenne d'âge calculée sur des contributions ambiguës.
- AG-001 tranché par l'utilisateur : effectifs exacts conservés pour la
  direction, alerte sur les constats retenus à 1 ou 2 sélections/contributions,
  aucun nom ni rapprochement individuel. Conditions de passation facultatives,
  à renseigner par l'animateur ; ne pas les inventer.
- Une erreur de validation porte sur une question, pas sur la suite du PDF.
- Le bouton principal du rapport fait rédiger la synthèse par Claude à partir
  des résultats calculés et vérifiés. Ne pas remplacer cette rédaction par un
  gabarit sans accord de l'utilisateur. Le rapport descriptif reste un choix
  secondaire explicite. Aucune réponse IA périmée après modification.
- Barres par option ; radar d'une seule question choisie, proportions connues
  et cohérentes, sans moyenne de thèmes ni objectif de réussite. Conserver les
  zéros réels ; les inconnus ne sont ni des zéros ni des axes de radar.
- Données fictives pour les tests ; aucune donnée réelle d'élève dans Git.
