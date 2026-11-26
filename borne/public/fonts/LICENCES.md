# Polices de la borne

Les deux fichiers de ce dossier sont **auto-hébergés** et non chargés depuis
Google Fonts : une borne qui perd le wifi du magasin doit garder son texte.
Ce sont des polices **variables**, donc un seul `woff2` par famille couvre
toutes les graisses.

| Fichier | Famille | Licence | Source |
|---|---|---|---|
| `comfortaa.woff2` | Comfortaa | SIL Open Font License 1.1 | fonts.google.com/specimen/Comfortaa |
| `fredoka.woff2` | Fredoka | SIL Open Font License 1.1 | fonts.google.com/specimen/Fredoka |

L'OFL autorise l'usage commercial, la modification et la redistribution.

## 🔴 Pourquoi pas Keepsmile

La charte officielle (`../../photos-recues/charte-branding-guideline.pdf`)
désigne **Keepsmile** pour les titres. Elle **n'est pas libre pour un usage
commercial** — c'est une démo pour usage personnel, la licence commerciale
s'achète chez Almarkhatype. Une borne de commande dans un restaurant est un
usage commercial, donc elle n'est pas dans ce dépôt.

**Fredoka la remplace** : même famille de formes, capitales arrondies et
grasses. Le jour où la licence est achetée, poser le `woff2` ici, ajouter son
`@font-face` dans `src/styles.css` et changer la seule ligne `--titre`.

⚠️ Le graphiste de la charte (Moupress) a peut-être déjà cette licence : la
question vaut d'être posée avant d'en racheter une.
