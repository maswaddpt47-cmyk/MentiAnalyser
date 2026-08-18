# CLAUDE.md — Règles de travail pour ce projet

---

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
4. Pusher sur `main` : `git push origin HEAD:main`

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

---

## 4. Règles de collaboration — priorité haute

### Côté Claude

1. Ne jamais présenter une explication technique plausible comme un fait : marquer explicitement "hypothèse non vérifiée" tant qu'aucune preuve (log, capture, test réel) ne la confirme.
2. Ne jamais déclarer "c'est réparé" ou "testé" sans vérification réelle du chemin critique — pas une lecture de code qui "devrait marcher".
3. Sur toute demande de correction d'un bug de calcul, livrer un **audit complet de tous les points d'impact** avant la première correction, pas des trouvailles ponctuelles.
4. Signaler explicitement toute déviation d'une spec fournie ou toute décision de design prise seul, au moment où elle est prise.
5. Poser une question de clarification dès qu'une demande est ambiguë ou sous-spécifiée plutôt que de trancher en silence.
5bis. Utiliser des dates explicites (JJ/MM ou JJ/MM/AAAA) plutôt que des termes relatifs ("hier", "aujourd'hui", "la semaine dernière") — la perception du temps vient d'un contexte injecté en début de session, pas d'une horloge en temps réel, et devient peu fiable sur une session qui s'étale sur plusieurs jours.
6. Toujours faire un `git pull` avant de lire ou modifier le moindre fichier. Respecter la politique de push du projet (`git push origin HEAD:main` depuis la branche de travail `claude/jolly-carson-fp7sjo`) et signaler tout conflit avec les instructions de session avant d'agir.
7. Après toute reprise de session, relire l'état réel du fichier concerné avant de le modifier — ne jamais présumer qu'un correctif précédent est encore en place.
8. Avant de pousser un changement visuel (CSS/layout), vérifier les interactions connues à risque (stacking context, overflow, position sticky/fixed) sur les zones sensibles existantes.

### Côté utilisateur

1. Donner le contexte temporel et les tentatives déjà faites dès le premier message ("ça marchait hier", "j'ai déjà testé X") plutôt qu'après coup.
2. Pour un bug visuel ou "bizarre", décrire le symptôme précis ou annoter la capture — éviter les formules vagues ("toujours erreur").
3. **Ctrl+Shift+R en premier** après chaque déploiement, avant de reporter un bug persistant.
4. **Copier-coller l'erreur console** plutôt que screenshot quand c'est du texte — plus rapide et rien n'est tronqué.
5. Pour les nouvelles fonctionnalités, une demande à la fois avec une phrase sur le "pourquoi" ; hiérarchiser si plusieurs besoins ("priorité 1 : X, priorité 2 : Y").
6. Donner un retour de validation réelle après test terrain, même court ("testé, ça marche" / "ça casse en fait").
