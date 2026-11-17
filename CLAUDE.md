# CLAUDE.md — Règles de travail pour ce projet

Communication (consigne du 02/11/2026) : terminer chaque message par la
prochaine étape concrète (action de l'IA, travail restant ou action attendue
de l'utilisateur). Si le travail est terminé, le dire sans attendre une relance.

Reprise : lire `CHANTIERS.md`. Décisions à trancher : consulter `AGORA.md`.
AGORA : ouvrir un bloc avant tout changement de calcul, filtre, chiffre affiché,
format de stockage, coût irréversible, contradiction d'une note, troisième
itération sans résolution, abandon d'un existant inexpliqué ou choix non arbitré.
Soumettre d'office sans bloquer ; le relais est humain et la décision revient
à l'utilisateur. Rendu pur et correctif réversible sans calcul : pas de bloc.
Sécurité et chiffres : relecteur d'un autre éditeur, dans les deux sens (Claude
auteur → Codex ; Codex auteur → Claude, `agora.md` §12) ; l'IA qui écrit ne se
relit pas. Annonce en tête de message, sur une ligne distincte :
« 🔴 ⚖️ AGORA : critère N — <sujet>. Bloc AG-00N publié dans
maswaddpt47-cmyk/MentiAnalyser. → Dis « pull » à <Codex ou Claude>. »
Règles complètes : `MD-LIB/agora.md` (non requis pour répondre au bloc).

---

## 1. Synchroniser avant toute intervention

Avant de toucher à n'importe quel fichier, toujours exécuter (règle 63 de
MD-LIB : jamais de fusion implicite par `git pull`) :

```bash
git fetch origin main
git merge --ff-only origin/main
```

Cela garantit que le travail effectué entre deux sessions n'est pas écrasé.

---

## 2. Un commit séparé par modification logique

Chaque modification doit faire l'objet d'un commit distinct avec un message clair et préfixé :

| Préfixe | Usage |
|---------|-------|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `refactor:` | Restructuration sans changement de comportement |
| `chore:` | Maintenance, config, nettoyage |

**Exemple :**
```bash
git commit -m "feat: ajout du filtre par catégorie dans le tableau de bord"
```

---

## Résumé du workflow par session

1. `git fetch origin main` puis `git merge --ff-only origin/main`
2. Effectuer les modifications
3. Committer chaque modification séparément avec le bon préfixe
4. Pusher sur `main` : `git push origin HEAD:main`

> L'historique git (commits) sert de système de rollback. Pas de backup physique daté en complément : ça duplique l'historique et alourdit le repo.

---

## 3. Tests unitaires — règle obligatoire

| Fichier source | Fichier de tests | Runner |
|---|---|---|
| `utils.js` — fonctions bas niveau | `utils.test.js` | `node --test utils.test.js` |
| `logic.js` — logique métier | `logic.test.js` | `node --test logic.test.js` |
| `prevention.js` — mode prévention | `prevention.test.js` | `node --test prevention.test.js` |
| mutations ciblées (copies temporaires) | `scripts/check-prevention-mutations.cjs` | `node scripts/check-prevention-mutations.cjs` |

La CI (`.github/workflows/deploy.yml`) lance ces quatre commandes avant chaque
déploiement : les lancer toutes avant de pousser.

Ces fichiers sont chargés dans le navigateur ET testés sous Node.js (≥ 18).
Une seule source de vérité — ne jamais dupliquer une fonction entre `utils.js`/`logic.js` et `MentiAnalyser.html`.

Après toute modification de `utils.js` ou `logic.js` :
1. Modifier la fonction
2. Exécuter le runner correspondant
3. Commiter source + tests ensemble si un test a été mis à jour

Règles :
- Bug corrigé → corriger le code, pas le test
- Changement intentionnel → mettre à jour code ET test dans le même commit
- Ne jamais supprimer un test pour faire passer le commit
- La CI bloque le déploiement si un test échoue

---

## 4. Collaboration

Règles communes de collaboration : MD-LIB/collaboration.md, chargé
automatiquement par MD-LIB/CLAUDE.md (04/11/2026). Ici, seulement ce qui est
propre au projet.

- Branche de travail `claude/jolly-carson-fp7sjo` (ou celle imposée par la
  session) ; publication par `git push origin HEAD:main`.
- Côté utilisateur : **Ctrl+Shift+R en premier** après chaque déploiement,
  avant de signaler un bug persistant ; copier-coller l'erreur console plutôt
  qu'une capture quand c'est du texte ; une demande à la fois, avec une phrase
  sur le « pourquoi », hiérarchisée s'il y en a plusieurs.
