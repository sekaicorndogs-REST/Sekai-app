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
- CA moyen **1 015 €/jour** sur 12 mois — 865 € bornes + 150 € caisse/Uber
- Objectif fixé : 922 €/jour
- Juillet 2026 mesuré en entier : 970 €/j bornes (1 128 €/j du 1-18, puis 751 €/j du 19-31).
  La première quinzaine de juillet (soldes) n'est pas représentative du mois.
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

1. **Taux de prise de menu — le levier principal, et il bouge.** Mesuré sur les tickets
   bornes :

   | Période | Menus/jour | % de prise de menu |
   |---|---|---|
   | 1–18 juillet 2026 | 31,9 | 24,1 % |
   | 18–24 juillet | 17,9 | 22,2 % |
   | **25–31 juillet** | **32,9** | **36,5 %** |

   Bascule nette à partir du 25/07, après le renommage du menu et les changements de
   borne. À commandes identiques (418 vs 418), le ticket moyen passe de **12,24 € à
   13,75 €**, soit ~+2 600 €/mois de CA et ~1 000 €/mois de marge. À reconfirmer sur
   plusieurs semaines : l'échantillon est de 7 jours et les changements ont été lancés
   ensemble, donc impossible d'isoler lequel a produit l'effet.
2. **Les accompagnements ne se vendent pas** : ~2 ventes/jour toutes références confondues,
   6 €/jour de marge (1 % du total). Ne pas bâtir de plan de croissance dessus.
   Karaage et tempura existent surtout comme contenu des XL.
3. **Les menus XL démarrent au-dessus des prévisions.** Lancés le 30/07/2026, ils font
   déjà 30 % des menus sur leurs deux premiers jours (24 unités sur 80). Attention à ne
   pas leur attribuer la hausse du taux de menu : celle-ci a commencé le 25/07, cinq
   jours avant leur mise en ligne.
4. Répartition de la marge : Corndog 63 %, Menu 29 %, Signature 5 %, Bubble tea 2 %, Side 1 %.

## ⚠️ Décisions déjà prises — À LIRE AVANT TOUTE ANALYSE

Le travail des sessions précédentes est stocké en base, **pas dans la conversation**.
Toujours consulter ces deux tables avant de proposer quoi que ce soit, sous peine de
refaire du travail déjà fait :

- **`actions_conversion`** : 5 actions pour augmenter le taux de prise de menu, avec
  impact chiffré, effort et priorité. Colonne `fait` pour le suivi.
- **`propositions_menu`** : 5 menus étudiés, avec verdict, hypothèses de conversion,
  cannibalisation et impact/mois. Colonnes `recommande` et `verdict`.

Recommandés et **non lancés** à ce jour : le **Duo Menu** (18,50 €, +440 €/mois) et le
**Menu Famille** (34 €, +330 €/mois, seul segment groupe non couvert). Ils pèsent plus
lourd que les menus XL créés en juillet 2026.

Note : les libellés de ces tables parlent encore du « Menu Étudiant », renommé depuis
en Menu Good Deal.

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
