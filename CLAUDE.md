# CLAUDE.md — Règles de travail pour ce projet

## 1. Git pull obligatoire avant toute intervention

Avant de toucher à n'importe quel fichier, toujours exécuter :

```bash
git pull origin main
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
| `backup:` | Commit de fichier backup |
| `chore:` | Maintenance, config, nettoyage |

**Exemple :**
```bash
git commit -m "feat: ajout du filtre par catégorie dans le tableau de bord"
```

---

## Résumé du workflow par session

1. `git pull origin main`
2. Effectuer les modifications
3. Committer chaque modification séparément avec le bon préfixe
4. Pusher sur `main` : `git push origin main`

> L'historique git (commits) sert de système de rollback. Pas de backup physique daté en complément : ça duplique l'historique et alourdit le repo.

---

## 3. Tests unitaires — règle obligatoire

| Fichier source | Fichier de tests | Runner |
|---|---|---|
| `utils.js` — fonctions bas niveau | `utils.test.js` | `node --test utils.test.js` |
| `logic.js` — logique métier | `logic.test.js` | `node --test logic.test.js` |

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
