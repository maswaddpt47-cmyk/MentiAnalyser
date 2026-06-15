# CLAUDE.md — Règles de travail pour ce projet

## 1. Git pull obligatoire avant toute intervention

Avant de toucher à n'importe quel fichier, toujours exécuter :

```bash
git pull origin main
```

Cela garantit que le travail effectué entre deux sessions n'est pas écrasé.

---

## 2. Backup daté des fichiers sensibles

Avant de modifier un fichier sensible, créer un backup daté dans le repo :

```bash
cp <fichier> <fichier>.backup.YYYYMMDD-HHMM
```

**Exemples :**
- `index.html` → `index.backup.20260615-1430.html`
- `styles.css` → `styles.backup.20260615-1430.css`

**Fichiers considérés comme sensibles** (à étendre si besoin) :
- `index.html`
- `*.css`
- `*.js` (fichiers racine ou de configuration)
- Tout fichier de configuration à la racine

Les backups restent dans le repo pour traçabilité.

---

## 3. Un commit séparé par modification logique

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
2. Créer le backup daté du/des fichier(s) sensible(s) concerné(s)
3. Effectuer les modifications
4. Committer chaque modification séparément avec le bon préfixe
5. Pusher sur `main` : `git push origin main`
