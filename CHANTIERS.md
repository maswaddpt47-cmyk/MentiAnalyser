# CHANTIERS — MentiAnalyser

État au **03/11/2026** (base `11a8d1e`), amendements d’AG-002 déployés par le run 24.

## En cours

- Adaptation des suggestions au titre / thème vérifiée localement ;
  publication de cette adaptation à vérifier.
- Vérification directe du HTML publié encore bloquée par le proxy (403 vers
  maswaddpt47-cmyk.github.io) ; API GitHub également bloquée. Le vérificateur
  MD-LIB ne peut donc pas conclure malgré le succès affiché par Actions.
- Version servie à confirmer par l'utilisateur : ouvrir les suggestions dans
  « Contexte du rapport » et modifier « Titre / thème de l’atelier ».

## État vérifié

- Sous les deux champs de contexte : suggestions dépliables, ajout explicite
  à la suite du texte, cumul, modification libre et prévention des doublons.
  Chromium sur données fictives : champs préservés, conditions laissées vides
  jusqu’au choix, persistance après rechargement et reprise dans le rapport
  descriptif. Aucun appel API ; pas de débordement à 390 et 1280 px, même avec
  les suggestions ouvertes. Pas de changement de calcul ou de format de
  stockage ; pas de nouveau bloc AGORA requis pour cet ajout réversible.
- Suggestions liées au champ existant « Titre / thème de l’atelier » : exemples
  pour écrans, harcèlement, réseaux sociaux, vie privée, sécurité et information ;
  formulations générales reprenant le thème saisi pour les autres sujets.
  Sans titre, invitation à le renseigner. Aucun remplacement automatique des
  textes déjà saisis quand le titre change. Chromium : changement écran /
  cyberharcèlement / mots de passe / thème libre / titre vide, ajouts et édition,
  persistance et rapport ; 390 et 1280 px sans débordement, aucun appel API.
- Première version des suggestions (`11a8d1e`) : la page GitHub du run 25
  indique Success, test 14 s et deploy 47 s :
  https://github.com/maswaddpt47-cmyk/MentiAnalyser/actions/runs/41621582093
  Lecture directe du HTML public refusée (HTTP 403) le 03/11/2026.
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
  Cette preuve concerne la version précédente.
- Amendements d'AG-002 (code de `ec61cdb`, identique à `5049ed6`) déployés
  le 02/11/2026 à 21:07 (Paris) : run 24 relancé sur main, tests, mutations
  et « Reported success! » (Created deployment 5049ed6) :
  https://github.com/maswaddpt47-cmyk/MentiAnalyser/actions/runs/41516160159
  Blocage précédent levé côté GitHub sans action de notre part : l'API
  répondait déjà deployment_cancelled pour ec61cdb tout en refusant les
  créations (runs 21-23) ; la relance 27 min plus tard est passée. Si cela
  se reproduit : attendre puis relancer une fois, sans étape de récupération.
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
  à renseigner par l'animateur ; ne pas les inventer. Les formulations suggérées
  ne sont ajoutées qu’à son clic, selon le déroulement réel de la séance.
- Le titre / thème pilote les suggestions de saisie ; un changement de thème
  impose de relire les textes précédemment choisis. Les thèmes non reconnus
  reçoivent des formulations générales à adapter, sans forcer les écrans.
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
