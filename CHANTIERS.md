# CHANTIERS — MentiAnalyser

État au **02/11/2026**, base relue `0c6302c`, application publiée `d9feb3f`.

## En cours

- Vérification directe du HTML publié encore bloquée par le proxy (403 vers
  maswaddpt47-cmyk.github.io) ; API GitHub également bloquée. Le vérificateur
  MD-LIB ne peut donc pas conclure malgré le succès affiché par Actions.
- AG-002 : réponse indépendante de Claude reçue dans `0c6302c`, verdict
  **amendé**. Réponse conservée intégralement dans AGORA.md. Le pull n'a
  modifié aucun code ; constats du contradicteur à reproduire avant correctif.
- Rapport Claude : clarifier le statut non vérifié de la prose, respecter les
  constats retenus, conserver les actions et le suivi saisis par l'animateur ;
  expliciter les textes libres et le contexte transmis à Anthropic. Mettre
  les réserves avant l'analyse et afficher la date de génération.
- Graphiques/radar : expliciter l'échelle des barres sans base de répondants,
  vérifier l'éligibilité des pourcentages sans base connue, rendre le choix
  et l'ordre des axes explicites, distinguer les questions au titre identique.
- Compléter les tests ciblés de géométrie et de bornes des graphiques, de
  transmission des réserves et des limites de la réponse Claude selon AG-002.
  Ces réserves techniques ne sont pas en attente d'une nouvelle autorisation
  générale ; les changements de sens ou de portée restent à expliquer.

## État vérifié

- Mode prévention distinct, options éditables, inconnus conservés, sélection
  des constats, JSON versionné et rapport imprimable avec annexe et réserves.
- 81 tests passaient sous Node 20 sur `d9feb3f`, dont 17 prévention ; sept
  mutations détectées sur sept (six d'AG-001 + échappement), dans la CI. Cela
  ne mesure pas toute la couverture d'AG-002 : Claude rapporte des mutations
  supplémentaires survivantes, détaillées dans sa réponse ; non rejouées
  lors de ce pull documentaire.
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
- Rapport Claude et visualisations publiés : workflow du commit `d9feb3f`
  terminé avec WORKFLOW_RUN_CONCLUSION_SUCCESS (test et déploiement) :
  https://github.com/maswaddpt47-cmyk/MentiAnalyser/actions/runs/41499087705
  Aucun changement applicatif après ce commit.
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
