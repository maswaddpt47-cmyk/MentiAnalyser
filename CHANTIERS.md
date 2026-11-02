# CHANTIERS — MentiAnalyser

État au **02/11/2026**, amendements d’AG-002 publiés dans `ec61cdb`.

## En cours

- Vérification directe du HTML publié encore bloquée par le proxy (403 vers
  maswaddpt47-cmyk.github.io) ; API GitHub également bloquée. Le vérificateur
  MD-LIB ne peut donc pas conclure malgré le succès affiché par Actions.
- Publication Pages bloquée côté GitHub : le workflow de `ec61cdb` expire
  après dix minutes, puis les créations suivantes sont refusées HTTP 400 :
  « due to in progress deployment. Please cancel ec61cdb… first ».
  Les workflows de récupération `6aa5a80` et `a0b3f55` n'ont pas libéré cette
  demande. La récupération temporaire et sa permission actions:read ont été
  retirées ; ne pas multiplier des relances identiques. Dernière preuve :
  https://github.com/maswaddpt47-cmyk/MentiAnalyser/actions/runs/41511879461
  Prochaine action externe : faire annuler/débloquer la demande Pages
  `ec61cdb16494c902389fcee989046e26e4e6a09f` dans GitHub, puis relancer
  Deploy to GitHub Pages. Signalement préparé hors dépôt dans
  /workspace/output/Signalement_blocage_GitHub_Pages.txt.

## État vérifié

- Mode prévention distinct, options éditables, inconnus conservés, sélection
  des constats, JSON versionné et rapport imprimable avec annexe et réserves.
- 90 tests application passent sous Node 20 ; 22 mutations ciblées
  détectées sur 22 dans la CI. Cela ne mesure pas une couverture exhaustive.
- Chromium : PNG et ZIP fictifs, ancien PDF du ZIP ignoré, API simulée,
  contrôle puis rapport/PDF, JSON, persistance et séparation des modes ;
  conditions de passation et alerte petits effectifs sans masquage vérifiées.
  Deux appels distincts testés (vision puis rédaction Claude), prompt
  contextualisé, références aux réponses, cache invalidé après modification,
  erreur API explicite, graphiques et radar repris dans le PDF et le JSON.
  Amendements : propres textes conservés, réserves avant prose, date de
  génération, choix indépendant de deux questions au titre identique.
  Aucun débordement horizontal à 390 px et 1280 px.
- Les CDN unpkg/cdnjs restent bloqués dans cette instance ; les tests
  navigateur utilisent les mêmes versions publiques préchargées depuis
  jsDelivr. Extraction IA réelle non validée.
- Rapport Claude et visualisations publiés : workflow du commit `d9feb3f`
  terminé avec WORKFLOW_RUN_CONCLUSION_SUCCESS (test et déploiement) :
  https://github.com/maswaddpt47-cmyk/MentiAnalyser/actions/runs/41499087705
  Cette preuve concerne la version précédente. Les amendements sont poussés
  dans `ec61cdb` ; leur étape Pages est encore en cours (voir En cours).
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
- AG-002 tranché et amendements appliqués : les nombres et références
  contrôlés ne prouvent pas le sens de la prose ; ne pas présenter le texte
  de Claude comme vérifié. Les propres actions/suivi restent imprimés.
- Radar : répondants et effectifs vérifiés, questions identifiées par ID,
  choix automatique signalé, surface sans signification d'indicateur.
- Données fictives pour les tests ; aucune donnée réelle d'élève dans Git.

- Communication : finir chaque message par la suite concrète, y compris
  après un pull ou un blocage ; consigne enregistrée dans MD-LIB règle 18
  (`bcfed2e`) et dans CLAUDE.md.

- Consigne de communication enregistrée dans MD-LIB (`bcfed2e`) et ici :
  chaque message se termine par la suite concrète ou l'état terminé.
