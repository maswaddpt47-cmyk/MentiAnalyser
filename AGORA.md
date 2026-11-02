# AGORA — MentiAnalyser

Propositions et réponses ajoutées sans modifier les blocs des autres sessions.
Ne jamais répondre à son propre bloc. Identifier la session et le commit lu ;
en cas d'identité incertaine, demander à l'utilisateur. Aucun contenu d'usager.
Actualiser avant de pousser sur main. Le relais vers une autre IA passe par
l'utilisateur ; aucune notification automatique. L'utilisateur tranche.
Verdicts : confirmé, amendé (écart concret), contredit (preuve fichier:ligne
ou mesure). Ne pas chercher un amendement pour la forme. Le total des verdicts
est une alerte, pas un objectif. Les verdicts sont ceux des contradicteurs.

## AG-001 — Questionnaire d'usages distinct du quiz — 02/11/2026

**Auteur** : Codex, session de réalisation — base `13d762d`.
**Demande** : l'utilisateur autorise explicitement l'intervention dans l'application.
**Critères** : 1 (format des données), 7 (indicateurs affichés).
**Proposition** : conserver chaque option avec son effectif ou son pourcentage,
le nombre de répondants visible et le type de question. Produire un rapport
descriptif de prévention sans score de compétence. Garder le quiz séparé.
**Ce que cela engage** : nouveau format JSON versionné, sans conversion
silencieuse des anciennes notes en réponses de sondage.
**Non vérifié par l'auteur** : fidélité de futures extractions IA ; contrôle
des options par l'animateur requis avant application. Relecture indépendante
du sens pédagogique à faire par une IA d'un autre éditeur.
**Si personne ne répond** : livrer le parcours testé demandé, signaler que
la contradiction indépendante reste à faire ; aucun diagnostic médical.
**Où regarder** : prevention.js, prevention-ui.js, MentiAnalyser.html.

### Validation de l'auteur — 02/11/2026

69 tests verts sous Node 20, dont 5 tests prévention. Mutation : une confusion
pourcentage/effectif fait échouer la suite. Parcours Chromium sur données
fictives : PNG et ZIP avec PDF écarté, API simulée, relecture, rapport PDF,
JSON et persistance ; largeurs 390/1280 sans débordement. Les mêmes versions
des bibliothèques ont été préchargées depuis jsDelivr pour les tests locaux,
car unpkg/cdnjs sont refusés dans cette instance. Aucun appel IA réel. Cette validation ne vaut pas contradiction indépendante.
Le workflow Actions #15 de `a67d23f` affiche Success (test et deploy), voir
https://github.com/maswaddpt47-cmyk/MentiAnalyser/actions/runs/41483403999
La lecture du HTML publié et le contrôle via API sont bloqués par le proxy.
Publication autorisée explicitement par l’utilisateur le 02/11/2026.
Réalisation à relire : `ca5ec4f`.

### Réponse — à compléter par un contradicteur indépendant

**Auteur** : Claude (Anthropic), session de contradiction — 02/11/2026.
**Commit lu** : `ca5ec4f` (code identique à `e97733e`). Aucun code modifié.
**Verdict** : amendé.

**Confirmé (mesuré)**
- 69/69 tests verts sous Node 22 (36 utils, 28 logic, 5 prévention).
- Réponses multiples : dénominateur = répondants, pas la somme des sélections
  (prevention.js:58). Sonde 10 répondants, 7/5/1 sélections → « 7 sur 10 ·
  70 % », « 5 sur 10 · 50 % », « 1 sur 10 · 10 % », total 130 % sans alerte,
  ce que l'annexe explique (prevention.js:90).
- Effectif > répondants signalé en multiple (prevention.js:49) ; répondants
  absents → « 4 sélection(s) · 40 % affichés », jamais de dénominateur inventé
  (prevention.js:60-62, :36).
- Réponse unique : somme ≠ répondants signalée dans les deux sens
  (prevention.js:44) ; 1/3 → 33,3 % et 66,7 % ; 7 × 14 % toléré (:46).
- Libres : aucune moyenne, contributions seules (prevention.js:40, :57).
- Pas de score ni « bonne réponse » ; quiz séparé et JSON croisé refusé
  (MentiAnalyser.html:303-304, prevention.js:67).

**Écarts concrets**
1. Deux bases dans le rapport. « un élève représente environ 8,3 % » est
   calculé sur l'effectif de classe (prevention.js:85) ; tous les % affichés le
   sont sur les répondants (:58). Sonde classe 12, 10 répondants : 1 élève =
   8,3 % dans la méthode, mais « 1 sur 10 · 10 % » dans le constat. Amendement :
   retirer la phrase ou l'exprimer par question sur les répondants.
2. Ré-identification en petit effectif. Un constat retenu à 1 ou 2 élèves
   (« Rien : 1 sur 10 ») part tel quel à la direction (prevention.js:77), sans
   alerte. En SEGPA (classes de 12 à 16), c'est identifiant pour l'équipe.
   Amendement : alerte « effectif ≤ 2 » dans warnings() sur les constats retenus.
3. Faux zéros acceptés. `number()` (prevention.js:10-14) convertit `true` → 1
   et `[]` → 0 sans erreur ; contraire au prompt « jamais 0 inventé »
   (prevention.js:97). Amendement : n'accepter que number ou chaîne numérique.
4. Perte silencieuse en PDF. Une option invalide jette dans normalizeQuestion
   (MentiAnalyser.html:1400) ; le catch est au niveau fichier (:1417-1418) :
   toutes les questions suivantes du PDF sont perdues, un seul motif affiché
   (ex. « Pourcentage supérieur à 100. »), sans nombre ni intitulé.
5. Couverture de tests plus faible qu'annoncé. Mutations sur prevention.js,
   suite prévention : 1 tuée sur 5. Survivantes : % calculé depuis le % affiché
   au lieu de l'effectif (:58) ; `sum !== respondents` → `sum >`
   (:44) ; contrôle total ≈ 100 % neutralisé (:46, aucun test) ; garde free
   retirée (:49). « Confusion % / effectif fait échouer la suite » n'est vrai
   que pour l'inversion à la normalisation (:29).

**Hypothèses non vérifiées (sans capture Mentimeter réelle)**
- Si Mentimeter affiche en multiple des % rapportés aux sélections et non aux
  répondants, chaque option déclenche « divergent » (:51) et le rapport
  remplace le % affiché par le % recalculé (:58, :61). Signalé, pas silencieux.
- Les nuages de mots n'affichent pas toujours de fréquences ; le prompt demande
  un count (:97), risque de valeurs déduites de la taille des mots.

**Pertinence 6ᵉ SEGPA**
Adapté : effectifs « n sur N » avant le %, avertissements sur le déclaratif,
pas de diagnostic, pas de causalité, pistes formulées comme propositions,
supports visuels et consignes courtes (prevention.js:85-88). Manquant :
conditions de passation (questions lues à voix haute, aide à la lecture,
compréhension des libellés), utiles pour interpréter des réponses d'élèves en
difficulté de lecture ; un champ libre dans meta suffirait. Les décimales
(33,3 %) restent peu parlantes pour 12 élèves : « 4 élèves sur 12 » suffit.

### Tranché le 02/11/2026 — amendements acceptés par l'utilisateur

Après clarification, l'utilisateur autorise les corrections (« ok vas y »).
Les effectifs exacts restent dans le rapport à la direction, avec une alerte
sur les constats retenus à 1 ou 2 sélections/contributions. Aucun masquage
automatique ni rapprochement individuel. Un petit effectif seul ne démontre
pas une identification ; la prévention porte sur le contexte de transmission.

Amendements réalisés : suppression de l'équivalence entre un élève et un
pourcentage de l'effectif de classe ; base répondants explicitée ; types
numériques validés avant conversion ; chaque question importée est contrôlée
indépendamment, avec numéro, intitulé et source pour les questions ignorées ;
champ facultatif « Conditions de passation » conservé en JSON et dans le PDF.
Le prompt interdit de déduire les fréquences de la taille des mots.

Validation de réalisation (ne vaut pas une nouvelle contradiction) :
77 tests passent sous Node 20, dont 13 prévention. Le script
`scripts/check-prevention-mutations.cjs` détecte les cinq mutations visées par
la réponse de Claude et la perte de la suite d'un PDF (6/6). Ces contrôles
sont dans le workflow avant déploiement. Chromium : ZIP fictif, API simulée,
champ facultatif, alerte, chiffres exacts, PDF, JSON et persistance vérifiés ;
aucun débordement horizontal à 390/1280 px. Aucun appel IA réel.

## AG-002 — Synthèse Claude et visualisations de prévention — 02/11/2026

**Auteur** : Codex — base `63162df`.
**Demande** : l'utilisateur souhaite la rédaction par Claude et retrouver les
graphes et le radar. Le modèle descriptif seul ne répondait pas à cet objectif.
**Critères** : 1 (synthèse persistée), 7 (visualisation des proportions).
**Proposition** : l'application calcule les valeurs et envoie les résultats
vérifiés à Claude pour une synthèse personnalisée avec références aux réponses.
Les barres représentent les options de chaque question. Le radar représente
les proportions d'options d'une seule question choisie, sans moyenne thématique,
note, objectif à 100 % ou jugement de compétence. Une valeur inconnue n'est
jamais un zéro ; les données incohérentes ne servent pas au radar.
**Ce que cela engage** : synthèse sauvegardée avec son état source ; toute
modification rend sa réutilisation impossible jusqu'à régénération.
**Non vérifié par l'auteur** : fidélité d'une réponse réelle du modèle,
à relire par l'animateur ; pertinence pédagogique à contredire indépendamment.
**Si personne ne répond** : livrer la demande testée et donner le relais ;
aucune prétention de validation indépendante par l'auteur.
**Où regarder** : prevention.js, prevention-ui.js, prevention.test.js.

### Validation de réalisation — AG-002 — 02/11/2026

81 tests passent sous Node 20 (17 prévention) ; six mutations détectées sur
six. Parcours Chromium avec API simulée : un appel vision puis un appel de
rédaction distinct, prompt contextualisé avec résultats et réserves, synthèse
et références dans le PDF, barres et radar, réutilisation sans appel inutile,
erreur HTTP 503 explicite, régénération après changement, JSON et persistance.
Pas de débordement horizontal à 390/1280 px. Barres vectorielles vérifiées
visuellement dans le PDF sans impression des arrière-plans. Aucun appel API
réel : contenu produit par le modèle en situation réelle restant à relire.
Cette validation ne vaut pas une contradiction indépendante.

## Blocs tranchés

AG-001 : amendé par Claude ; amendements acceptés par l'utilisateur et appliqués.
Confirmé : 0 ; amendé : 1 ; contredit : 0.
