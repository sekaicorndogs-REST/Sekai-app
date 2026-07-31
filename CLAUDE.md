# Sekai Corndogs — contexte projet

Ce fichier est lu automatiquement au démarrage de chaque session Claude Code.
Il contient le contexte métier durable. **À mettre à jour dès qu'une donnée change.**

## L'app

- Front : React + Vite, un seul gros fichier `vitejs-vite-4btbmycn (1)/src/App.tsx`
- Données : Supabase, projet `ldpxgfgcnlzktaymtnwd`, accès via MCP Supabase
- L'app lit tout depuis la base via l'API REST Supabase. Les catégories de menu sont
  **dérivées dynamiquement** des données (`App.tsx` ~ligne 4969 pour le simulateur,
  ~ligne 5243 pour l'analyse) : ajouter une catégorie en base suffit, aucun code à toucher.

## Le commerce

- Corndogs coréens, Rue Neuve à Bruxelles (rue commerçante, très fort flux piéton)
- CA moyen **1 028 €/jour** sur 12 mois — 878 € bornes + 150 € caisse/Uber
- Rythme récent (avril–juillet) plus haut : ~1 061 €/jour. Objectif fixé : 922 €/jour
- Marge nette ~17 %, soit ~5 100 €/mois
- Forte saisonnalité : creux en mars (832 €/j), pic en juillet (1 278 €/j)
- Masse salariale à 30,3 % du CA, plafond fixé à 35 %

### Le hors-bornes vaut 150 €/jour, pas 250 €

Confirmé par le gérant (juillet 2026). C'est le CA caisse + Uber qui ne passe pas par
les bornes de commande. `saisonnalite.hors_bornes` et `parametres.ca_hors_bornes`
sont tous deux alignés sur 150. **Ne pas réintroduire 250.**

## Tables clés

| Table | Contenu |
|---|---|
| `menu_produits` | Produits vendus : `nom`, `categorie` (texte libre), `prix_vente`, `actif` |
| `menu_ingredients` | Coût unitaire de chaque ingrédient |
| `menu_recettes` | Lie produit ↔ ingrédients avec quantités. Seule FK vers `menu_produits` |
| `saisonnalite` | CA bornes par mois, détail semaine/week-end. **Source de référence pour le CA** |
| `ventes_produits` | Historique quantités + CA par produit et par période (extrait partiel) |
| `top_produits` | Moyennes/jour par produit, marge unitaire, part de marge |
| `finances_charges` / `finances_dettes` | Charges mensuelles et plans de remboursement |

⚠️ `ventes_produits` est un **extrait des produits principaux, pas le CA complet**.
Il sous-estime le CA d'environ 15 %. Pour toute analyse de CA, utiliser `saisonnalite`.
Ne pas refaire l'erreur de reconstruire un compte de résultat depuis `ventes_produits`.

## Carte actuelle

| Catégorie | Prix | Food cost |
|---|---|---|
| Corndog seul (Saucisse / Mozza / S+M) | 6,00–6,50 € | 12–15 % |
| Signatures (Saitama / Ace / Suisse / Sekai) | 6,00–7,50 € | 12–16 % |
| Sides (Gyoza / Karaage / Tempura x4) | 4,30 / 4,60 / 4,90 € | 22–28 % |
| Menu Bubble Dogs | 10,00 € | 12–15 % |
| Menu Good Deal | 10,00 € | 15–17 % |
| Bubble Dog XL | 12,30 € | 18–20 % |
| Good Deal XL | 12,30 € | 20–22 % |

- **Bubble Dog XL n'a pas de frites** (choix assumé : le bubble tea porte la valeur perçue).
  Good Deal XL en a. C'est volontaire, ne pas « corriger ».
- Menu Gyoza : supprimé (jamais activé).
- Menu Étudiant : renommé **Menu Good Deal**. L'historique de ventes garde le libellé
  `MENU ETUDIANT` — en tenir compte pour toute comparaison dans le temps.
- Coûts matière : karaage 0,24 €/pièce, tempura crevette 0,28 €/pièce.

## Constats d'analyse (juillet 2026)

1. **Taux de prise de menu : 21 %.** ~117 corndogs/jour pour 25 menus, donc ~92 corndogs
   partent nus. Convertir 25 % d'entre eux en menu vaut **~1 900 €/mois**, soit 37 % de la
   marge nette. C'est le plus gros levier identifié, et il ne coûte ni stock ni personnel.
2. **Les accompagnements ne se vendent pas** : ~2 ventes/jour toutes références confondues,
   6 €/jour de marge (1 % du total). Ne pas bâtir de plan de croissance dessus.
   Karaage et tempura existent surtout comme contenu des XL.
3. **Les menus XL rapportent 130–260 €/mois**, soit 2–5 % de la marge nette. Utiles,
   sans risque, mais marginaux.
4. Répartition de la marge : Corndog 63 %, Menu 29 %, Signature 5 %, Bubble tea 2 %, Side 1 %.

## Conventions de travail

- Répondre en français.
- Branche de développement : `claude/project-status-5xiop2`.
- Avant toute suppression en base, vérifier les dépendances (FK + références par texte
  dans `ventes_produits`, `top_produits`, `produits_marges`, qui ne sont **pas** liées par FK).
- Les modifications de données passent par `apply_migration` (idempotentes, avec `NOT EXISTS`).
- Toujours recalculer et afficher le food cost après un changement de prix ou de recette.

## Points ouverts

- Septembre est marqué `estime` dans `saisonnalite` (basé sur la moyenne avril-sept 2025),
  tous les autres mois sont `mesure`. À remplacer par le réel dès que disponible.
- Écart matière : ~17,5 % réel (ligne « Courses ») contre ~14 % théorique en recettes.
  Environ 1 200 €/mois de perte/gaspillage. À investiguer par inventaire si besoin.
- Pas de données bornes détaillées par jour ou par heure. Avec ça, on pourrait identifier
  les créneaux où le taux de prise de menu s'effondre.
