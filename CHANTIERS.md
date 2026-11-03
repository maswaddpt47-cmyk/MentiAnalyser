# CHANTIERS — MentiAnalyser

État au **03/11/2026** (base `057875f`), rapport récupérable et suggestions des quatre champs vérifiés localement.

## En cours

- Publier puis faire essayer le nouveau parcours du rapport et les suggestions
  des actions / du suivi. Le signalement
  réel est une rédaction qui reste en cours ; la cause côté appel réel à Claude
  n’est pas confirmée, sans réponse réseau de l’utilisateur ni appel API réel.
- Vérification directe du HTML publié encore bloquée par le proxy (403 vers
  maswaddpt47-cmyk.github.io) ; API GitHub également bloquée. Le vérificateur
  MD-LIB ne peut donc pas conclure malgré le succès affiché par Actions.
- Boutons de retrait des fichiers à confirmer dans la version servie à
  l’utilisateur, section « Importer les résultats sources ».

## État vérifié

- Actions et suivi : même aide que l’objectif et la passation, liée au titre /
  thème ; suggestions à ajouter, cumuler et modifier, sans écrasement ni doublon.
  Propositions à valider avec l’équipe, sans affirmation d’action déjà réalisée.
  Chromium : écrans, harcèlement, réseaux sociaux, vie privée, mots de passe,
  information, thème libre et titre vide ; texte conservé après changement de
  thème, rechargement et reprise à l’identique dans le rapport. Suggestions
  ouvertes sans débordement à 390/1280 px. Aucun nouvel appel API pour cette aide.
- Rédaction dans la page principale, puis lien explicite « Ouvrir le rapport »
  et copie HTML téléchargeable ; PDF via « Imprimer / Enregistrer en PDF ».
  Progression et erreurs près des commandes ; aucun onglet de préparation vide.
  Délai de 90 s indépendant d’AbortSignal.timeout, couvrant requête et corps JSON,
  avec annulation réseau quand disponible. Aucun nouvel appel automatique.
  Lien du rapport masqué après modification des données ou brouillon en attente.
  Chromium fictif : attente, ouverture, impression/PDF, copie HTML, cache,
  HTTP 503, délai dépassé, reprise, descriptif ; 390/1280 px sans débordement.
  91 tests réels sous Node 24, dont 27 prévention ; 22 mutations détectées.
  L’API est simulée dans ces vérifications. Aucun changement de calcul, de
  prompt de rédaction ou de format JSON ; le service réel reste à vérifier.
- Prévention : liste des fichiers retenus, « Retirer » par fichier et
  « Tout retirer », y compris pour les captures extraites d’un ZIP. Sélecteur
  réinitialisé pour permettre de reprendre un même fichier. Actions bloquées
  pendant la préparation et l’analyse ; aucune analyse possible sans fichier.
  Chromium sur données fictives : retrait PDF/PNG/ZIP extrait, suppression de
  la sélection et réimport identique ; seul le fichier conservé a été transmis
  à l’API simulée. Réponses déjà extraites conservées, explication affichée et
  confirmation de relecture décochée. 390/1280 px sans débordement, même avec
  un nom de fichier long. Aucun appel API réel ni calcul de rapport modifié.
- Retrait des fichiers (`209c135`) : la page GitHub du run 27 indique Success,
  test 13 s et deploy 16 s (durée totale 39 s) :
  https://github.com/maswaddpt47-cmyk/MentiAnalyser/actions/runs/41624718847
  Le vérificateur MD-LIB n’a pas conclu ; l’accès direct au site public reste
  bloqué dans cette instance. Le succès ci-dessus est celui indiqué par Actions.
- Capture utilisateur du 03/11/2026 : le titre / thème et les suggestions
  sont visibles dans la version publique ; les suggestions étaient repliées.
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
- Adaptation au thème (`f6d48b1`) : la page GitHub du run 26 indique Success,
  test 12 s et deploy 13 s (durée totale 34 s) :
  https://github.com/maswaddpt47-cmyk/MentiAnalyser/actions/runs/41622733874
  Le vérificateur MD-LIB n’a pas conclu ; cette preuve vient de la page Actions,
  pas d’une lecture du site public, toujours à confirmer par l’utilisateur.
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
- Retirer un fichier modifie la sélection de la prochaine analyse. Les réponses
  déjà extraites restent à retirer explicitement dans « Vérifier les réponses ».

- Communication : finir chaque message par la suite concrète, y compris
  après un pull ou un blocage ; consigne enregistrée dans MD-LIB règle 18
  (`bcfed2e`) et dans CLAUDE.md.

- Consigne de communication enregistrée dans MD-LIB (`bcfed2e`) et ici :
  chaque message se termine par la suite concrète ou l'état terminé.
