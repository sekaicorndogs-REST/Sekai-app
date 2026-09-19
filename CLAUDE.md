# Sekai Corndogs — contexte projet

## 🧠 PROTOCOLE DE MÉMOIRE — À LIRE ET APPLIQUER À CHAQUE SESSION

Je ne me souviens de rien d'une session à l'autre. **Seuls ce fichier et la base
survivent.** Une conversation n'est pas un enregistrement : tout ce qui n'est pas écrit
est définitivement perdu. Un projet entier (l'intégration API Uber Eats / EasyOrder) a
déjà disparu comme ça.

**Au démarrage de chaque session, dans cet ordre :**
1. Lire ce fichier en entier.
2. `SELECT * FROM journal ORDER BY date DESC LIMIT 30;` — le journal de bord.
3. `SELECT * FROM actions_conversion; SELECT * FROM propositions_menu;` avant toute
   proposition, pour ne pas refaire un travail déjà fait.

**Pendant la session, écrire IMMÉDIATEMENT, sans attendre la fin :**

| Ce qui est dit | Où l'écrire |
|---|---|
| Un chiffre vérifié, une règle métier, une décision tranchée | `CLAUDE.md`, dans sa section |
| Une idée, un projet évoqué, une question ouverte, du contexte | table `journal` |
| Une correction d'un chiffre que ce fichier portait | `CLAUDE.md`, **et dire ce qui était faux** |
| Le CA annoncé le soir | table `ca_jour_declare` |

🔴 **Ne jamais finir une session sans avoir écrit.** Si le gérant dit quelque chose que
ce fichier ne contient pas — même en passant, même sans le demander — l'écrire. Le coût
d'une note inutile est nul ; le coût d'une information perdue est un projet entier.

🔴 **Le journal est append-only.** Ne jamais supprimer ni réécrire une ligne : on y ajoute
une correction datée. Même règle pour les dettes (voir « Dettes supprimées » plus bas).

**Quand le gérant dit « note ça » ou « retiens ça » :** écrire tout de suite, puis
confirmer où c'est écrit.


Ce fichier est lu automatiquement au démarrage de chaque session Claude Code.
Il contient le contexte métier durable. **À mettre à jour dès qu'une donnée change.**

## L'app

- **Adresse de production : https://project-ynxry.vercel.app** (confirmée par le gérant
  le 10/09/2026). ⚠️ Il existe aussi un projet Vercel **`sekai-corndogs`** qui n'est PAS
  celui que l'équipe utilise. Toujours vérifier que c'est bien `project-ynxry` qui reçoit
  les déploiements avant de conclure qu'une mise à jour est en ligne.
- Déploiement automatique à chaque push sur `main`. Le site n'est joignable ni depuis
  l'environnement Claude (proxy sortant bloqué) ni depuis le compte Vercel des outils MCP :
  **pour savoir quelle version tourne, demander au gérant la ligne « Version » affichée en
  bas de l'onglet Profil.** Elle porte la date et l'heure du build.
- Front : React + Vite, un seul gros fichier `vitejs-vite-4btbmycn (1)/src/App.tsx`
- Données : Supabase, projet `ldpxgfgcnlzktaymtnwd`, accès via MCP Supabase
- L'app lit tout depuis la base via l'API REST Supabase. Les catégories de menu sont
  **dérivées dynamiquement** des données (`App.tsx` ~ligne 4969 pour le simulateur,
  ~ligne 5243 pour l'analyse) : ajouter une catégorie en base suffit, aucun code à toucher.

## Le commerce

- Corndogs coréens, Rue Neuve à Bruxelles (rue commerçante, très fort flux piéton)
- **Un seul point de vente**, plus des events ponctuels. Les entrées « Event 1 » et
  « Event 2 » de `RESTAURANTS` sont des **kits de stock pour charger la camionnette**,
  pas des boutiques : leurs quantités vides sont normales, ce ne sont pas des alertes.
- CA moyen **1 032 €/jour** — **882 € bornes** + **150 € caisse/Uber tous les mois**,
  pondéré sur les douze mois mesurés de `saisonnalite`.
  Soit **~31 400 €/mois** et **~376 800 €/an**.
  ⚠️ Août est désormais celui de **2026** (complet, chargé le 31/08), pas 2025.
  ✅ **L'année est complète depuis le 11/08/2026** : septembre 2025 a été chargé
  (1 978 commandes, 25 073 €, 836 €/jour). Il n'y a plus aucun mois estimé dans
  `saisonnalite`, et les douze valeurs concordent avec `ventes` à l'euro près.
  Elles portent sur les seuls jours d'ouverture (mars est sur 30 jours, le 15/03/2026
  étant le dernier et unique jour sans vente de l'historique).
- **Seuil de rentabilité : 895 €/jour** = (25 071 € de charges + 1 793 € de dettes) / 30.
  Recalculé depuis `finances_charges` et `finances_dettes` le 12/08/2026. L'ancienne
  valeur de 922 € datait d'un état antérieur des charges.

### CA moyen par jour de semaine (année complète, aux bornes)

| Jour | CA bornes | Commandes | Ticket |
|---|---|---|---|
| Dimanche | 531 € | 39 | 13,42 € |
| Lundi | 881 € | 71 | 12,32 € |
| Mardi | 784 € | 65 | 11,98 € |
| Mercredi | 900 € | 73 | 12,43 € |
| Jeudi | 718 € | 60 | 11,98 € |
| Vendredi | 912 € | 75 | 12,14 € |
| **Samedi** | **1 414 €** | 107 | 13,19 € |

Le samedi pèse 23 % de la semaine, le dimanche 8,7 %. Le dimanche a le meilleur
ticket mais deux fois moins de flux à l'heure — il reste rentable à ouvrir en
raisonnement marginal (les charges fixes tombent de toute façon).

### Le jeudi — élucidé le 12/08/2026, sujet clos

**Ce n'est pas une anomalie, c'est un creux de flux piéton.** Il est présent
**tous les mois sans exception** sur les douze mesurés, donc structurel et permanent.
Il n'est apparu à aucune date : ne pas chercher d'événement déclencheur.

| Mois | Mer | **Jeu** | Ven | Écart du jeudi |
|---|---|---|---|---|
| Août 25 | 740 | 712 | 984 | −150 |
| Sept 25 | 794 | 789 | 828 | −22 |
| Oct 25 | 999 | 779 | 1 059 | −249 |
| Nov 25 | 799 | 614 | 942 | −257 |
| Déc 25 | 1 072 | 691 | 1 069 | **−380** |
| Jan 26 | 655 | 516 | 785 | −204 |
| Fév 26 | 881 | 715 | 709 | −80 |
| Mars 26 | 672 | 466 | 729 | −235 |
| Avr 26 | 1 069 | 997 | 998 | −36 |
| Mai 26 | 919 | 726 | 980 | −224 |
| Juin 26 | 918 | 660 | 609 | −104 |
| Juil 26 | 1 033 | 938 | 1 085 | −122 |

⚠️ Septembre (−22) et avril (−36) sont les mois où l'écart est le plus faible. **Ne pas
conclure depuis un seul mois que le jeudi va bien** — l'erreur a été commise une fois.

**C'est le flux qui manque, pas le ticket** — donc ni l'équipe ni la vente ne sont en cause :

| | Commandes/jour | Ticket |
|---|---|---|
| Mercredi | 72,2 | 12,42 € |
| **Jeudi** | **60,5** | 12,02 € |
| Vendredi | 74,6 | 12,14 € |

**Le trou est concentré de 14h à 16h.** À 12h le jeudi est le *meilleur* des trois jours
(91 € contre 81 et 67). Puis il décroche : −30 à −40 €/heure sur 14h-16h, soit ~100 € des
170 € manquants.

| Heure | Mer | **Jeu** | Ven |
|---|---|---|---|
| 12h | 81 | **91** | 67 |
| 13h | 124 | 102 | 121 |
| **14h** | 122 | **81** | 94 |
| **15h** | 117 | **91** | 124 |
| **16h** | 117 | **92** | 129 |
| 17h | 134 | 117 | 144 |
| 19h | 95 | 66 | 106 |

**Conséquence pour l'action :** ne pas tenter de « réparer » le jeudi. Deux options,
toutes deux à coût nul :
1. **Réduire l'effectif le jeudi 14h-17h** — 60 commandes sur la tranche, deux personnes
   suffisent. ~150 €/mois de masse salariale, disponible immédiatement. **Recommandé**,
   parce que ça rentre du cash tout de suite (contrainte trésorerie zéro).
2. Créer une offre nommée limitée au créneau jeudi 14h-17h pour attaquer la cause.
   Demande un test sur plusieurs semaines avant de savoir si ça marche.
- Juillet 2026 mesuré en entier : 970 €/j bornes (1 128 €/j du 1-18, puis 751 €/j du 19-31).
  La première quinzaine de juillet (soldes) n'est pas représentative du mois.
- **Résultat modélisé : 6 400 €/mois, soit 20,3 % du CA** (31 473 − 25 071 de charges).
  Après les 1 793 € de dettes : **~4 600 €/mois**.
  ⚠️ Avant impôt — `finances_charges` ne porte aucune ligne d'impôt (voir plus bas).
- Forte saisonnalité : creux en mars (832 €/j), pic en juillet (1 278 €/j)
- Masse salariale **28,9 % du CA** (9 100 € : gérants 5 900 + employé 2 300 + ménage 900),
  plafond fixé à 35 %. ⚠️ La cotisation sociale (900 €/mois) n'est **pas** comptée dedans
  par `finances.ts`, qui ne retient que les catégories `salaire` et `personnel`. Coût du
  travail réel : **10 000 €, soit 31,8 %**.

### Structure, équipe et positionnement

- **Trois gérants** : Abdel, Moha, Nabil. Ils se partagent la ligne « Salaire gérant »
  de 5 900 €/mois, soit ~1 967 € chacun. **C'est le nœud du dossier** : une unité qui
  fait 375 k€ fait vivre correctement un exploitant, pas trois.
- **Un employé** au restaurant en plus des gérants. Renforts ponctuels pour les events
  (d'où le nombre élevé de comptes dans `users`).
- **Horaires** : lun–ven 12h–20h · sam 13h–21h · dim 14h–20h = **54 h/semaine**.
  Le jeudi a les mêmes horaires que le mercredi, ce qui rend son écart de 180 €/jour
  d'autant plus anormal.
- **Capacité de service : deux personnes tiennent jusqu'à 1 350 €/jour** (tout compris),
  au-delà il en faut trois (gérant, 12/08/2026). C'est la règle qui pilote
  `saisonnalite.effectif_semaine` / `effectif_weekend`, recalculés depuis `ventes`.
  **Règle posée par le gérant, sans exception : 2 personnes tous les jours, 3 le samedi.**
  Réaffirmée le 13/09/2026. `effectifCible()` dans `App.tsx` l'applique déjà. L'exception
  de juin (week-end à 2, la moyenne du samedi y étant de 1 309 €) a été **supprimée de
  `saisonnalite` le 13/09/2026** : les douze mois portent désormais 2 en semaine et 3 le
  samedi. Ne pas la réintroduire au motif que juin est sous le seuil de 1 350 €.
  ⚠️ Le dimanche (685 €) est noyé dans la moyenne « week-end » : ne pas mettre 3 personnes
  le dimanche sous prétexte que c'est le week-end, c'est le samedi qui porte la charge.
- **Capacité ~50 corndogs/heure.** Le samedi, le meilleur jour, tourne autour de
  20/heure — soit **40 % d'utilisation**. ⚠️ **Le goulot n'est pas la production.**
  Tout investissement en capacité de cuisine est à écarter tant que ce ratio ne monte pas.
- **Un seul concurrent** à Bruxelles, installé dans le City 2, ~0,50 € plus cher.
  Sekai est sur la rue, mieux noté, et moins cher : il y a du pouvoir de prix inutilisé.
- **Clientèle** : 70–80 % de femmes, forte communauté maghrébine, étudiants, familles,
  touristes. Profil très fidélisable — et **aucune carte de fidélité à ce jour**.
- **Réseaux** : Instagram 9 940 abonnés, TikTok 5 600. 2 photos + 1 vidéo/semaine,
  sous-traité, c'est la totalité des 800 €/mois de marketing.
- **Google : 423 avis, note 4,8** — le corndog le mieux noté à ce niveau d'avis.
- **Uber Eats** : commission de 35 %. ~50 €/jour effectivement reçus, déjà compris
  dans les 150 €/jour hors bornes.
- **Dettes** : **23 839 € restants sur 5 plans, 1 793 €/mois** (vérifié en base le
  12/08/2026 ; 25 797 € à l'origine). Aucune trésorerie d'avance,
  fonctionnement au mois le mois depuis trois ans.

### L'écart passé — sujet clos, ne pas rouvrir

Le compte modélisé dégage ~6 400 €/mois de résultat, soit ~4 600 €/mois après dettes.
Or la trésorerie est restée à zéro pendant trois ans.

**Le gérant a tranché : cet argent a été consommé par de mauvais choix passés** —
rémunérations trop élevées et events ratés. Ce n'est donc **pas une fuite en cours**,
et il ne faut pas y consacrer d'analyse supplémentaire.

Conséquence pour les projections : le résultat modélisé est atteignable, et il
s'accumulera dès lors qu'il cesse d'être consommé. La seule condition est comportementale.

⚠️ La charge « Courses (18%/j) » est **mal nommée** : 6 000 € sur 31 473 € de CA font
**19,1 %**, pas 18 %. Le libellé date d'un CA supposé de 33 000 €.

⚠️ `finances_charges` ne contient **aucune ligne d'impôt**, alors que `finances_dettes`
porte une dette « Impôt Monab ». Le montant à provisionner mensuellement reste à
demander au comptable — c'est la seule correction encore utile à cette table.

### TVA : 900 €/mois — vérifié, ne pas y toucher

Calcul sur **2025, année pleine** (source Skytax) :

| | |
|---|---|
| TVA collectée (6 % / 12 % / 21 %) | 12 442 € |
| TVA déductible sur achats | 3 195 € |
| **TVA nette payée** | **9 247 €, soit 771 €/mois** |

Les 900 € de `finances_charges` sont donc justes. **Une tentative de les porter à
1 619 € a été faite puis annulée** : ce chiffre ne comptait que la TVA *collectée*, en
oubliant la déductible. Ne pas refaire l'erreur.

⚠️ **Le semestre 2026 donne un résultat aberrant** (crédit de TVA de 265 €/mois) parce
que les frais généraux y explosent : **7 120 €/mois contre 620 €/mois en 2025, soit
11,5×**. Ne pas calculer la TVA sur cette base tant que ce pic n'est pas expliqué.

⚠️ **Ne jamais utiliser les déclarations TVA Skytax comme source du CA.** Elles
mélangent des périmètres différents et intègrent la TVA d'events. La référence CA
reste la table `ventes` + les 150 €/jour hors bornes.

### Le hors-bornes vaut 150 €/jour, pas 250 €

Confirmé par le gérant (juillet 2026). C'est le CA caisse + Uber qui ne passe pas par
les bornes de commande. `saisonnalite.hors_bornes` et `parametres.ca_hors_bornes`
sont tous deux alignés sur 150. **Ne pas réintroduire 250.**

⚠️ **L'exception d'août à 270 €/jour a été annulée** (gérant, 31/08/2026). Après
vérification sur le mois complet, août revient à **150 €/jour comme tous les autres**.
Août 2026 se lit donc **1 036 € bornes + 150 = 1 186 €/jour tout compris**.
Ne pas réintroduire les 270 : la question a été tranchée deux fois.

### Les events se vendent plus cher qu'à Rue Neuve

Ticket moyen d'un corndog en event : **8,80 €** (confirmé par le gérant), contre
~7,55 € réellement encaissés Rue Neuve et 6,50 € de prix affiché. C'est la valeur
utilisée pour convertir un objectif de CA d'event en nombre de corndogs
(`PRIX_CORNDOG_EVENT` dans `App.tsx`). La TVA de 6 % est déduite des calculs d'event.

`events_rentabilite.qte_saucisse` et `qte_fromage` (optionnels) enregistrent la
marchandise emportée, **en cartons**.

Conditionnement et consommation (confirmés par le gérant) :

| | Contenu d'un carton | Consommation |
|---|---|---|
| Saucisse | 8 paquets × 12 = **96 saucisses** | full saucisse : 1 · moitié-moitié : 0,5 |
| Fromage | 10 packs × 32 = **320 morceaux** | full mozza : 2 · moitié-moitié : 1 |

Au mix de Rue Neuve (55 % moitié-moitié, 28 % mozza, 17 % saucisse), un corndog
consomme 0,445 saucisse et 1,11 morceau. Le fromage est presque toujours le facteur
limitant. Un carton de saucisse vaut 40,32 € de matière, un carton de fromage 105,60 €.

**Food cost théorique d'un event : ~10 %** (0,85 € de matière pour un ticket moyen de
8,80 €), contre 18 % pris par défaut dans le formulaire. En réel, compter 12 à 15 %
avec les pertes de transport et l'huile. **Le taux par défaut est donc trop pessimiste
et sous-estime le bénéfice d'un event.**

## 🧮 Méthode de chiffrage — À APPLIQUER À TOUT CALCUL DE GAIN

Ces cinq règles ont été établies le 31/08/2026 en chiffrant l'effet des menus. Elles ont
chacune corrigé une erreur réelle. **Les appliquer à toute estimation future**, quel que
soit le sujet — prix, horaires, fidélité, events.

1. **Comparer le même mois d'une année sur l'autre**, jamais deux mois voisins. Le ticket
   varie de 11,92 € (juin) à 13,57 € (août) **sans qu'aucun changement ait eu lieu** :
   comparer juin à août mesure la saison, pas l'action. Si le mois témoin n'existe pas,
   le dire explicitement au lieu de comparer au mois précédent en silence.
2. **Retirer la tendance de fond avant d'attribuer un gain.** Le taux de menu montait déjà
   de +1,7 point/mois pendant les 8 mois précédant tout changement. Sur les +15,6 points
   d'août, seuls **+12** sont imputables. Toujours projeter la tendance d'abord.
3. **Vérifier les articles par commande** pour distinguer montée en gamme et substitution.
   S'ils montent pendant que les menus montent, c'est de la vente en plus. S'ils baissent,
   une partie des menus remplace des articles déjà vendus et le gain est plus faible.
4. **Compter les suppléments** — le ticket réel moins la valeur des produits. Ils
   pèsent 1,81 à 2,41 €/commande, à 85 % de marge, et ils bougent en sens inverse des
   menus : **le menu absorbe les suppléments** (side et boisson compris à prix fixe).
   Les oublier fausse toute estimation, dans un sens comme dans l'autre.
5. **Raisonner par commande ou pour 100 commandes, jamais par jour.** Le nombre par jour
   suit la fréquentation, qui varie de 40 % selon la saison, et masque tout le reste.

**Et séparer toujours l'effet fréquentation de l'effet ticket.** Contre août 2025,
85 % du gain vient de plus de clients (+2 430 €) et 15 % du ticket (+416 €). Un
changement de carte agit sur le ticket, pas sur le flux : ne jamais lui attribuer
la fréquentation. L'app fait cette décomposition automatiquement dans l'onglet
Stats → Le mois (« D'où vient l'écart »).

🔴 **Un raisonnement ne remplace jamais un témoin.** L'effet des menus a été chiffré
successivement à 1 700 €, 300 €, 2 280 €, puis **350 €/mois** — la bonne valeur, obtenue
seulement quand les exports détaillés d'août 2025 ont donné le même mois de l'année
précédente avec son détail produits. Les trois premières estimations comparaient des mois
voisins ou raisonnaient. **Devant une comparaison de mois voisins, dire qu'on ne sait pas
et demander l'export du même mois de l'année passée** — c'est le seul chemin qui a marché.

⚠️ **Les exports détaillés se parsent.** Le « Rapport de vente » EasyOrder commande par
commande est un PDF en colonnes (Commande / Produit / Nombre / Prix unitaire / Sous-total)
dont les positions x **changent d'un export à l'autre** : détecter les colonnes depuis la
ligne d'en-tête de chaque page, ne pas coder les x en dur. Le sous-total par commande moins
la somme des lignes produit donne les suppléments, invisibles autrement. Le point de
contrôle : la somme des effets doit retomber sur l'écart de ticket calculé depuis `ventes`.
Un export « sale » (events, périodes mélangées) reste exploitable : filtrer sur les
`reference` présentes dans `ventes`.

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
| `stock` | Inventaire par point de vente. Colonnes ajoutées : `ingredient_id`, `conso_jour`, `unites_par_lot` |
| `ventes` | **27 758 commandes bornes, historique complet sans trou** (01/08/2025 → 31/08/2026, 395 jours). Source de référence pour toute analyse par jour, par jour de semaine ou par heure. La commande erronée #ZHATPX (01/08/2026, 1 903,80 €) a été volontairement exclue à la demande du gérant |
| `courses_remplacements` | Remplacement ponctuel de courses, une ligne par semaine (lundi) |
| `parametres` | Clé/valeur partagé : `ca_hors_bornes`, `courses_ordre`, `courses_ancrage` |
| `journal` | **Journal de bord append-only.** Idées, projets évoqués, décisions, questions ouvertes. **À lire au démarrage de chaque session.** Ne jamais supprimer une ligne |
| `ca_jour_declare` | **CA quotidien annoncé par le gérant en fin de journée, tout compris.** Créée le 01/09/2026. `ca_total` − CA bornes de `ventes` = **hors-bornes réel du jour** |

⚠️ Les horodatages de `ventes` sont des **heures locales stockées avec un fuseau UTC**.
Ne pas convertir les fuseaux, lire l'heure telle quelle. Seules 2 commandes sur 23 444
dépassent 22h, donc l'attribution des dates est fiable.

⚠️ `ventes_produits` sous-estimait le CA d'environ 11 à 15 % sur les périodes anciennes.
Les deux périodes de juillet 2026 ont été recalées sur les exports EasyOrder réels via
une ligne `SUPPLEMENTS/EXTRAS` (suppléments, sauces, chapelures, quantités > 1, non
rattachables à un produit). **Les totaux de période sont justes, les CA par produit
restent des estimations.** Pour toute analyse de CA global, préférer `saisonnalite`.

Anomalie non résolue : sur le 01-18/07, l'ancien jeu de données donnait 911 corndogs
Saucisse/Mozza contre 848 dans l'export bornes — plus d'articles mais moins de CA. Les
quantités d'origine ont été conservées faute de pouvoir vérifier leur provenance
(possiblement caisse + Uber inclus). Ne pas les écraser sans avoir tranché.

## Carte actuelle

| Catégorie | Prix | Food cost |
|---|---|---|
| Corndog seul (Saucisse / Mozza / S+M) | 6,00–6,50 € | 12–15 % |
| Signatures (Saitama / Ace / Suisse / Sekai) | 6,00–7,50 € | 12–16 % |
| Sides (Gyoza / Karaage / Tempura x4) | 4,30 / 4,60 / 4,90 € | 22–28 % |
| Menu Bubble Dogs | 10,00 € | 12–15 % |
| Menu Good Deal | 10,00 € | 15–17 % |
| Bubble Dog XL | 12,90 € | 17–19 % |
| Good Deal XL | 12,90 € | 19–21 % |

Les XL ont été lancés à 12,30 € les 30-31/07/2026 puis passés à **12,90 €**. Les ventes
déjà enregistrées dans `ventes_produits` pour ces deux jours restent à 12,30 € : c'est le
prix réellement pratiqué à l'époque, ne pas le réécrire.

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
2. **Les accompagnements — constat corrigé le 11/08/2026.** L'ancienne version de cette
   ligne (« ~2 ventes/jour, 6 €/jour de marge ») était **fausse** : elle ne comptait que
   les sides vendus seuls et ignorait ceux pris **en option sur un corndog**, qui font
   l'essentiel du volume et n'apparaissent **pas** dans le « Rapport de vente » — il faut
   la « Liste de commande » détaillée pour les voir (`° SIDE: …`).

   Taux de prise réel, mesuré sur le détail ligne à ligne :

   | Side pris en option | 09-11/07 | 09-11/08 |
   |---|---|---|
   | Frites | 11,0 /100 cmd | 4,5 |
   | Tempura crevette | — | 3,0 |
   | Poulet karaage | — | 2,0 |
   | **Total side payant** | **11,0** | **9,5** |

   Rapporté aux seuls corndogs seuls (les seuls à avoir le choix), le taux est de
   **10,6 % en juillet et 10,9 % en août : identique**.

   **Karaage et tempura n'ont créé aucune vente additionnelle — ils ont remplacé des
   frites**, mais à 4,60/4,90 € contre 3,50 €, la substitution rapporte ~1,20 € de plus
   par side. Les sides pèsent **~30 €/jour de marge (~900 €/mois)**, pas 6 €/jour.
   Poste stable qu'on ne fait pas grandir : ne pas bâtir de plan de croissance dessus,
   mais ne plus le traiter comme négligeable.

   ⚠️ Chiffre extrapolé depuis 3 jours (dim-lun-mar, les plus faibles) : c'est la mesure
   la moins solide du dossier. À reconfirmer sur une semaine complète.
3. **Les menus XL démarrent au-dessus des prévisions.** Lancés le 30/07/2026, ils font
   déjà 30 % des menus sur leurs deux premiers jours (24 unités sur 80). Attention à ne
   pas leur attribuer la hausse du taux de menu : celle-ci a commencé le 25/07, cinq
   jours avant leur mise en ligne.
   À 12,90 €, un XL rapporte **+1,94 €** de marge par rapport à un menu à 10 € — contre
   +1,34 € au prix de lancement de 12,30 €.

### Estimation du gain (au 31/07/2026) — À MANIER AVEC PRUDENCE

**Toujours raisonner par commande, jamais par jour.** Le nombre de menus par jour est
trompeur : il suit la fréquentation, qui varie de 40 % selon la saison. Ramené aux
commandes, l'effet est net :

**Le renommage Menu Étudiant → Menu Goodeal a eu lieu le 21/07/2026** (confirmé par le
gérant ; cohérent avec les horodatages, les lignes importées le 19/07 à 17h37 portant
encore `MENU ETUDIANT`). Coupure à cette date :

| Période | Commandes | Menus | **Menus / 100 cmd** |
|---|---|---|---|
| 1–20/07 *(avant)* | 1 702 | 584 | **34,3** |
| 21–31/07 *(après)* | 644 | 311 | **48,3** |

**+41 %.** Mais l'effet n'est pas immédiat : 21-24/07 reste à 36,0, la bascule se produit
au 25/07 (54,9 sur 25-31). Soit un effet différé — les clients qui reviennent découvrent
le nouveau nom — soit un second changement le 24-25 qui reste à identifier.

**Estimation du gain : ~950 €/mois de marge** (+14,0 menus/100 cmd × 2,75 €, plus la
prime XL). Fourchette réaliste **950 à 1 380 €/mois** selon que le taux se stabilise
vers 48 ou vers 55. Ne pas retenir le chiffre haut : il vient d'une coupure au 25/07
choisie après avoir vu les données, ce qui gonfle l'écart.

⚠️ **EasyOrder réécrit les noms de produits rétroactivement dans ses exports** : le
libellé affiché est le nom actuel du produit, pas celui en vigueur lors de la vente. Ne
jamais dater un changement de carte à partir des libellés d'un export — utiliser les
`created_at` des lignes en base, qui figent le nom au moment de l'import.

Les XL (lancés le 30/07) ne peuvent pas expliquer une rupture au 25/07.

**Confirmé sur août 2026 (1-11/08, 796 commandes, chargées dans `ventes`) :**

| | Commandes | CA bornes | Ticket | Menus / 100 cmd |
|---|---|---|---|---|
| 1–20/07 *(avant renommage)* | 1 702 | — | 12,68 € | 34,3 |
| 21–31/07 | 644 | — | 13,25 € | 48,4 |
| **1–11/08** | **796** | **10 949 €** | **13,76 €** | **~53** |

Hors-bornes à 150 €/j → **~1 145 €/jour tout compris** sur cette première quinzaine.
Le mois complet est finalement sorti à 1 036 €/j bornes, soit 1 186 € tout compris. **C'est le meilleur mois de tout
l'historique**, devant décembre (1 159 €/j) et avril (1 156 €/j), et 25 % au-dessus de la
moyenne annuelle de 1 035 €/j. Contre août 2025 : +50 €/j aux bornes, mais surtout un
ticket qui passe de ~12,50 € à 13,76 € — la hausse ne vient donc pas que de la saison.

**995 €/jour aux bornes**, contre 945 € en août 2025 et 751 € sur la fin juillet 2026.
L'objection « c'est juste la saison » tombe : le ticket monte *en même temps* que la
fréquentation, ce qu'un effet de saison seul ne produit pas. Les XL pèsent 13,7 pour
100 commandes, soit **25,5 % des menus** — ils prennent une vraie part sans avoir
déclenché la bascule du 25/07 (ils n'existaient pas encore).

Le gérant a tranché : **on garde les deux menus XL**, ils sont rentables et se vendent.

Réserve restante : le renommage et les changements de borne ont été lancés ensemble,
impossible d'isoler lequel porte l'effet.

### Août 2026, mois complet — meilleur mois de l'historique

Chargé le 31/08/2026 : **2 336 commandes, 32 127 €, 1 036 €/jour aux bornes**, ticket
**13,75 €**. Avec 150 € de hors-bornes : **1 186 €/jour**, soit **~36 800 €** sur le mois.

Contre août 2025 (945 €/j) : **+91 €/jour**, soit **+2 846 € sur le mois**.

⚠️ **CORRECTION DU 31/08/2026 — le ticket d'août 2025 était de 13,57 €, pas ~12,50 €.**
Le chiffre de 12,50 € était faux et traînait dans ce fichier. Conséquence : l'écart de
ticket sur un an n'est que de **+0,18 €**, et la décomposition du gain annuel est :

| | Effet | Part |
|---|---|---|
| **Plus de clients** (69,6 → 75,4 cmd/jour) | **+2 430 €** | 85 % |
| **Ticket plus élevé** (13,57 → 13,75 €) | **+416 €** | 15 % |
| **Total** | **+2 846 €** | |

**L'écart d'une année sur l'autre vient à 85 % de la fréquentation, pas de la carte.**
Ne pas attribuer les +2 800 € aux menus : la comparaison juillet → août 2026 le laissait
croire, mais août est structurellement un mois à fort ticket (13,57 € dès 2025, contre
12,68 € en septembre). La saison explique l'essentiel de la hausse du ticket de juillet
à août.

### Ce que valent vraiment les changements — TRANCHÉ le 31/08/2026

**Sujet clos.** Les exports détaillés d'août 2025 et septembre 2025 (« Rapport de vente »
commande par commande, avec sous-totaux) ont été chargés. Ils donnent le témoin qui
manquait : **le même mois, l'année précédente, avec le détail produits.**

Le parsing est validé : la somme des deux effets donne +417 €, contre +416 € calculés
indépendamment depuis `ventes`. Les chiffres sont bons à l'euro près.

| | Août 2025 | Août 2026 | Écart |
|---|---|---|---|
| Menus / 100 cmd | 32,5 | **53,7** | **+21,2** |
| Corndogs seuls / 100 | 111,2 | 84,9 | −26,3 |
| Signatures / 100 | 5,7 | 5,7 | 0,0 |
| **Articles par commande** | **1,59** | **1,53** | **−0,06** |
| Valeur des produits | 11,16 € | 11,94 € | **+0,78 €** |
| **Suppléments** | **2,41 €** | **1,81 €** | **−0,60 €** |
| **Ticket** | 13,57 € | 13,75 € | **+0,18 €** |

**RÉSULTAT RETENU : +417 €/mois de CA, soit ~350 €/mois de marge.**

🔴 **Le menu ABSORBE les suppléments, il ne les tire pas.** C'est l'inverse de ce qui
avait été conclu le 31/08 au matin. Avant, le client prenait un corndog à 6,50 € et
ajoutait 2,41 € d'extras. Maintenant il prend un menu à 10 € où le side et la boisson
sont compris à prix fixe. Les +1 824 € gagnés sur la valeur produits sont annulés par
−1 407 € de suppléments perdus.

🔴 **Les articles par commande BAISSENT sur la vraie comparaison** (1,59 → 1,53). Il y a
donc bien substitution. Le « pas de substitution » conclu depuis juin→août était faux :
**juin 2026 était le point bas de l'année sur tous les indicateurs à la fois** (ticket
11,92 €, articles 1,46, suppléments 1,32 €). Ce n'était pas un témoin, c'était un creux.

⚠️ **Estimations successives, à ne pas refaire :** 1 700 € → 300 € → 2 280 € → **350 €**.
Les trois premières reposaient sur des comparaisons de mois voisins ou sur des
raisonnements. Seule la dernière s'appuie sur le même mois d'une année sur l'autre avec
le détail produits des deux côtés. **Un raisonnement ne remplace jamais un témoin.**

⚠️ La tendance de « +1,7 point de menu par mois » calculée sur `ventes_produits` est
douteuse : août et septembre 2025 sont tous deux à ~32,4 menus/100, alors que oct-nov 25
donne 25,8 par la méthode des rapports de synthèse. Les deux méthodes ne concordent pas.
Ne pas réutiliser cette tendance sans l'avoir revérifiée sur des exports détaillés.

### Le vrai levier : le menu à 10 € est trop bon marché

C'est la conséquence directe de ce qui précède. Convertir 21 commandes sur 100 en menu
ne rapporte que 0,18 € parce que le menu rend plus qu'il ne prend : le client qui payait
6,50 + 2,41 = 8,91 € paie 10 € et reçoit en plus un side et une boisson.

**Passer Menu Good Deal et Menu Bubble Dogs de 10 € à 10,50 € : ~490 €/mois**
(979 menus non-XL × 0,50 €), coût nul, applicable immédiatement. Ça double le gain de
toute l'opération. Le menu reste 2 € sous le prix à la carte.

### Août 2026, mois complet — meilleur mois de l'historique

Chargé le 31/08/2026 : **2 336 commandes, 32 127 €, 1 036 €/jour aux bornes**, ticket
**13,75 €**. Avec 150 € de hors-bornes : **1 186 €/jour**, soit **~36 800 €** sur le mois.

Contre août 2025 (945 €/j) : **+2 846 € sur le mois**, dont :

| | Effet | Part |
|---|---|---|
| **Plus de clients** (69,6 → 75,4 cmd/jour) | **+2 430 €** | 85 % |
| **Ticket plus élevé** (13,57 → 13,75 €) | **+416 €** | 15 % |

**L'écart d'une année sur l'autre vient à 85 % de la fréquentation, pas de la carte.**
L'argent est bien là — l'intuition du gérant (« au moins 3 000 €/mois en plus ») est
juste sur le CA — mais la carte n'en porte que 15 %.

⚠️ **Le 26/08 est une fuite d'eau** : fermeture vers 16h, 663 € au lieu des ~950 €
attendus un mercredi. Enregistré dans `jours_speciaux` (type `incident`). Sans lui, la
moyenne d'août serait d'environ 1 045 €/jour aux bornes. Ne pas traiter ce mercredi
comme un jour normal dans une analyse par jour de semaine.

### Ouvrir une heure plus tôt le week-end — test des 29-30/08, concluant

Le gérant a avancé l'ouverture d'une heure sur ces deux jours. Résultat mesuré :

| | Ouverture | CA de l'heure gagnée | Reste de la journée | Total |
|---|---|---|---|---|
| **Sam 29/08** | 12h08 *(au lieu de ~13h05)* | **116 €** · 8 cmd | 1 533 € | **1 649 €** |
| **Dim 30/08** | 13h07 *(au lieu de ~14h05)* | **179 €** · 10 cmd | 636 € | **815 €** |

**Ce n'est pas un report de demande, c'est du CA en plus.** Le reste de la journée n'a
pas baissé : le dimanche 30 fait 636 € après 14h, contre 639 € de moyenne sur les quatre
autres dimanches d'août. Le samedi 29 fait même mieux que la moyenne des autres samedis
(1 533 € contre 1 318 €).

Les deux journées sont les **meilleures de l'été** dans leur catégorie.

**Économie de l'opération :** ~295 € de CA pour deux heures de travail supplémentaires,
soit ~60 € de main-d'œuvre à deux. Marge nette de l'ordre de **150 à 190 € sur deux jours**.
Généralisé à tous les week-ends : ~15 000 €/an de CA, **~650 €/mois de marge**.

⚠️ Deux jours seulement, et une fin août portée par la rentrée. À reconfirmer sur
septembre avant d'en faire une règle. Mais c'est le premier test à coût quasi nul qui
donne un résultat franchement positif.

### Les XL ne cannibalisent PAS les menus normaux — vérifié le 11/08/2026

Décomposition par 100 commandes, depuis les rapports produits EasyOrder :

| Pour 100 commandes | 01-18/07 | 18-31/07 | **01-11/08** |
|---|---|---|---|
| Menus normaux (Goodeal + Bubble Dogs) | 34,8 | 39,5 | **39,8** |
| Menus XL | 0 | 2,9 | **13,6** |
| **Total menus** | **34,8** | **42,4** | **53,4** |
| Corndogs seuls | 96,8 | 88,4 | **83,1** |
| Signatures | 8,9 | 11,7 | **6,4** |

La ligne des menus normaux **ne bouge pas** (39,5 → 39,8) pendant que les XL passent de
2,9 à 13,6. Les XL se servent donc sur les **corndogs seuls** (96,8 → 83,1) et les
**signatures** (8,9 → 6,4), pas sur les menus existants. C'est la montée en gamme visée.

Confirmation : le nombre d'articles par commande reste à **1,50 puis 1,54**. Les clients
n'achètent pas plus d'articles, ils achètent plus cher — effet durable, pas un effet de
panier gonflé.

**Menu Bubble Dogs a doublé** : 7,0 → 14,3 pour 100 commandes (XL compris). C'est la
gamme qui progresse le plus vite en proportion.

**Gain réestimé : 1 400 à 1 700 €/mois de marge** (au lieu de 950-1 380 €). Sur 2 180
commandes/mois : +5,0 menus normaux × 2,75 € et +13,6 XL × 4,69 € ≈ 1 690 €/mois.
Contre-vérifié par le ticket (+1,08 €/cmd × 2 180 = +2 350 € de CA, ~72 % de marge).
Retenir le bas de fourchette : l'échantillon d'août ne fait que 11 jours.

À surveiller : si le recul des signatures (8,9 → 6,4) se poursuit, quatre références
perdront leur raison d'être en carte. Pas d'action pour l'instant.

⚠️ Le « Rapport de vente » EasyOrder ne liste **pas** les options (sides, panures,
suppléments) — seulement les produits. Pour tout ce qui est pris en option, il faut la
« Liste de commande » détaillée. Ne pas conclure à l'absence de ventes depuis un rapport.
**✅ Ne vaut plus que pour les exports PDF : depuis le 19/09/2026 le WEBHOOK fournit les
options avec leur prix (table `commandes_live_options`).**
4. **`top_produits` régénéré le 12/08/2026** sur le rapport produits du 01-11/08
   (800 commandes, commande erronée exclue), prix de `menu_produits`, coûts de
   `menu_recettes`. Total : **996 €/jour de CA, 844 €/jour de marge**, cohérent avec
   les 995 €/jour mesurés aux bornes.

   **Le Menu est devenu la première famille de marge, devant le Corndog :**

   | Famille | Marge/jour | Part | *Ancienne table* |
   |---|---|---|---|
   | **Menu** | **347 €** | **41,1 %** | *29 %* |
   | Corndog | 337 € | 39,9 % | *63 %* |
   | Suppléments (panures, sauces) | 85 € | 10,1 % | *absent* |
   | Side | 29 € | 3,4 % | *1 %* |
   | Signature | 28 € | 3,3 % | *5 %* |
   | Bubble tea | 15 € | 1,7 % | *2 %* |
   | Boisson | 3 € | 0,4 % | *1 %* |

   ⚠️ La ligne **SUPPLEMENTS** réconcilie le total avec le CA mesuré : ce sont les
   panures et sauces payantes, qui n'apparaissent **pas** comme produits dans les
   exports EasyOrder. 100 €/jour de CA, soit 10 % de la marge — un poste invisible
   jusqu'ici et loin d'être négligeable.

   ⚠️ Les sides incluent ceux pris **en option** sur un corndog, extrapolés depuis
   les 200 commandes détaillées du 09-11/08. Le prix des softs (2,50 €) est estimé,
   il n'est pas en base.

## Module Horaires

### Deux tables, deux rôles — ne pas les confondre

| Table | Contenu | Qui saisit |
|---|---|---|
| `horaires` | Postes encodés à l'avance | un admin |
| `heures_jours` | Heures réellement travaillées | la personne elle-même |

⚠️ **« A travaillé » vient de `heures_jours`.** Un calcul d'effectif qui ne lit que
`horaires` rate tout le monde : c'est le bug corrigé le 12/08/2026, où une journée
avec un renfort déclaré s'affichait quand même « complet ».

`CYCLE` dans `App.tsx` porte la rotation fixe sur trois semaines. **Wassim en a été
retiré** (gérant, 12/08/2026) : il n'apparaît que les jours où il encode ses heures.
Il reste Abdel, Nabil et Mohammed.

### Effectif attendu et remplacements

- **2 personnes tous les jours, 3 le samedi** — voir « Capacité de service » plus haut.
- `equipeDuJour()` = prévus + déclarants − remplacés. Tant qu'un remplacement n'est
  pas attribué, la journée compte une personne de trop : c'est ce qui déclenche la
  demande à l'écran.
- **La personne qui déclare ses heures EST le remplaçant.** Abdel n'indique que
  *qui* elle remplace — jamais qui est venu, l'app le sait déjà.
- La colonne `heures_jours.remplace_nom` (ajoutée le 12/08/2026) stocke cette
  attribution. `horaires.remplace_nom` existe aussi pour les postes encodés :
  **toute lecture doit couvrir les deux sources**.
- **Seul le superadmin attribue** — Abdel est le seul à porter ce rôle ; Moha et
  Nabil sont `admin`. En sous-effectif, lui seul peut aussi inscrire la personne
  manquante.
- La personne remplacée le voit dans son calendrier (pastille orange), dans la liste
  du mois, et dans la fiche du jour.

### Remplacements d'août 2026

| Date | Remplacé | Par |
|---|---|---|
| mer 19/08 · jeu 20/08 · mer 26/08 | **Nabil** | Zakaria |
| jeu 27/08 | **Nabil** | Momo |
| sam 29/08 | **Mohammed** | Wassim |

**Nabil 4 fois, Mohammed 1, Abdel 0.** Zakaria couvre Nabil les mercredis et jeudis
de façon répétée : si ça continue, l'acter dans le `CYCLE` plutôt que de le rattraper
chaque semaine.

⚠️ Wassim a déclaré **210 h sur juillet-août**, le plus gros volume après les gérants.
Son quota étudiant est de 650 h/an : à ce rythme il le dépasse vers février, et les
cotisations passent au taux plein.

## Module Stock

### Trois statuts, pas deux

`stockStatut()` dans `App.tsx` classe chaque article :

| Statut | Cas | Affichage |
|---|---|---|
| `alerte` | quantité chiffrée sous le seuil | rouge, compté dans les alertes |
| `verifier` | quantité en toutes lettres (« OK », « assez », « plein ») | orange, badge `n ?` |
| `non_compte` | quantité vide | gris, **hors alertes** |

Avant cette correction, une quantité non numérique était traitée comme suffisante :
**11 articles Rue Neuve, dont la Saucisse, ne pouvaient jamais alerter.** Et les
quantités vides comptaient comme alertes, ce qui noyait le compteur sous les 126
articles vides des kits event.

### Consommation théorique et quantités à commander

`stock.ingredient_id` relie un article à `menu_ingredients` (11 correspondances sûres
sur Rue Neuve). `stock.conso_jour` porte la consommation théorique quotidienne,
calculée depuis les recettes × les ventes de juillet 2026 majorées de 17 % pour le
hors-bornes. La liste à commander en déduit une quantité, pondérée par le coefficient
de saisonnalité du mois en cours, sur 7 jours de couverture.

### Le vrai problème de stock : la rupture, pas la perte

**Posé par le gérant le 12/08/2026 — à ne jamais réécrire dans l'autre sens.**

*« Au Sekai on perd très peu de marchandises car nos marchandises durent longtemps,
le fromage et la saucisse peuvent durer des mois. Le souci c'est qu'on gère mal
car on n'a pas de stock dispo. »*

Conséquences, toutes importantes :

- **Ne pas chercher du gaspillage matière** : il n'y en a quasiment pas. L'écart de
  ~1 500 €/mois entre food cost réel (19 %) et théorique (14 %) vient d'ailleurs
  (achats hors recettes, à-coups d'achat, portionnement), pas de la poubelle.
- **Sur-stocker ne coûte presque rien** : la marchandise se garde des mois, donc le
  seul coût est l'immobilisation de trésorerie, et elle est temporaire.
- **Une rupture coûte une journée de vente** — jusqu'à 1 400 € un samedi. L'asymétrie
  est écrasante : une semaine de stock en plus sur le fromage coûte ~317 € de cash
  récupérable, une rupture de samedi coûte ~500 € de marge définitivement perdue.
- **`JOURS_COUVERTURE` est donc passé de 7 à 14 jours** dans `App.tsx`. Ne pas le
  redescendre au nom de la trésorerie : c'est un faux calcul d'économie.
- L'inventaire garde son intérêt, mais **pour un autre motif** : séparer les achats
  de la consommation réelle (les achats sont irréguliers alors que la conso est
  régulière) et fiabiliser les seuils — pas pour traquer des pertes.

### Unités de comptage : **tout se compte en PAQUETS** (gérant, 12/08/2026)

Saucisse, fromage, barquettes, frites, panko — le comptage se fait en paquets, jamais
en cartons ni en pièces. `stock.unites_par_lot` = nombre d'unités de recette par paquet :

| Article | 1 paquet = | `conso_jour` est en | `unites_par_lot` | Conso réelle |
|---|---|---|---|---|
| **Fromage** | 32 morceaux = **16 pièces Mozza** | pièces Mozza (1 pièce = 2 morceaux) | **16** | 4,33 paquets/jour |
| **Saucisse** | **12 saucisses** | saucisses entières | **12** | 4,71 paquets/jour |
| Barquettes, Frites, Panko | à renseigner | — | 1 | — |

⚠️ Le fromage se compte en **pièces Mozza dans les recettes** (`quantite` = 1 pour un
full mozza, 0,5 pour un moitié-moitié), donc 2 morceaux par pièce. Ne pas confondre les
deux unités : c'est un facteur 2 sur toute la couverture de stock.

Seuils recalés sur **10 jours** de consommation (fromage 44 paquets, saucisse 48).
L'ancien seuil de la saucisse était de 10 paquets, soit **2 jours** — c'est très
probablement la cause des ruptures répétées.

Trois articles restent sans `conso_jour` — Céréales, Nouilles, Baguette — parce que ce
sont des chapelures alternatives absentes des recettes de base : leur consommation
dépend du choix du client, que les données ne tracent pas.

### Onglet « ⚡ Manquants »

Recherche par nom sur tous les magasins, tolérante aux accents et à la casse. Un appui
passe la quantité à 0, ce qui bascule l'article dans les alertes existantes — pas de
nouveau modèle de données. Un article absent du catalogue se crée depuis la recherche
en choisissant son magasin. Les signalements de la session s'affichent dans un encadré
« Ma liste », retirables ; retirer un article créé depuis cet écran le supprime.

Une recherche par nom existe aussi dans l'onglet « Par magasin ».

### Rotation des courses

Bandeau en tête de l'onglet Stock, **sur l'écran d'accueil uniquement** (le gérant a
demandé qu'il n'apparaisse pas deux fois). Ordre et semaine de départ dans
`parametres` : `courses_ordre` = `Moha,Nabil,Abdel`, `courses_ancrage` = `2026-08-10`.

Un remplacement ponctuel s'enregistre dans `courses_remplacements` et **n'écrase que
la semaine concernée** : le cycle sous-jacent n'est pas décalé, chacun garde son tour
les semaines suivantes.

## 📆 Relevé quotidien de septembre 2026 — en cours

Le gérant envoie chaque soir le CA total de la journée (tout compris). Enregistrer dans
`ca_jour_declare`, une ligne par date. **Ne pas confondre avec `ventes`**, qui ne porte que
les bornes : la différence entre les deux EST le hors-bornes réel.

### 🔴 CORRECTION DU 15/09/2026 — la référence à utiliser

Les écarts annoncés du 01 au 14/09 (+19 % à +24 %) étaient **faux**. Ils comparaient
chaque journée à la **moyenne du jour de semaine sur tout septembre 2025**. Or septembre
2025 s'effondre en deuxième quinzaine : cette moyenne est tirée vers le bas, et tout
début de mois paraît excellent en face.

**Règle : comparer les MÊMES DATES d'une année sur l'autre, jamais une journée à une
moyenne mensuelle par jour de semaine.** Vérifier que les deux périodes contiennent le
même nombre de samedis et de dimanches.

| 1er au 15 septembre, tout compris | 2025 | 2026 | Écart |
|---|---|---|---|
| Total 15 jours | 16 060 € | **17 124 €** | **+6,6 %** |

### Le creux de la mi-septembre est structurel

Hypothèse du gérant le 15/09/2026 — la rentrée des hautes écoles — **confirmée par les
données de 2025**. CA bornes par semaine en septembre 2025 :

| Semaine | 2025 |
|---|---|
| 01-07 | **1 060 €/jour** |
| 08-14 | 810 € |
| **15-21** | **674 €** ← le creux |
| 22-28 | 844 € |

Le dimanche 14/09/2025 est tombé à **335 €**. Le dimanche 13/09/2026 à 500 € est donc
**meilleur** que son équivalent. Ne pas traiter les journées faibles de la mi-septembre
comme un décrochage : c'est le calendrier. La reprise intervient dans la semaine du 22.

### Comparaison semaine par semaine, tout compris

| Semaine | 2025 | 2026 | Écart |
|---|---|---|---|
| 01-07 | 1 210 € | 1 225 € | +1 % |
| 08-14 | 960 € | 1 090 € | **+13 %** |
| 15 (1 jour) | 824 € | 921 € | +12 % |

**La progression se fait surtout pendant le creux**, pas sur les pics. Moins spectaculaire
que ce qui avait été annoncé, mais plus solide.

### Hors-bornes : deux points de mesure, très écartés

| Jour | Annoncé | Bornes | **Hors-bornes réel** |
|---|---|---|---|
| lun 31/08 | 1 430 € | 1 200 € | **230 €** |
| **ven 18/09** | **1 203 €** | **1 104,80 €** | **98 €** |
| **01–17/09 (17 jours)** | **19 280 €** | **16 995 €** | **2 285 €, soit 134 €/jour** |

**La mesure sur 17 jours est la seule qui compte** — les jours isolés vont du simple au
double. Elle donne **134 €/jour**, soit un peu moins que les 150 € du paramètre.
Ne pas corriger `parametres.ca_hors_bornes` avant le mois complet le 30/09.

### 🟢 Première journée complète mesurée automatiquement — ven 18/09/2026

Le webhook a capté la journée entière : **références 001 à 094 sans aucun trou**,
11h40 → 20h02, les 94 commandes présentes dans `commandes_live` **et** dans `ventes`,
zéro rejet. **La continuité du compteur de la borne est la preuve de complétude** —
c'est le contrôle à refaire chaque jour.

| Contre un vendredi moyen | Moyenne annuelle | 18/09 |
|---|---|---|
| CA bornes | 912 € | **1 105 €** (+21 %) |
| Commandes | 75 | **94** (+25 %) |
| Ticket | 12,14 € | **11,75 €** (−0,39 €) |

Très bon vendredi, **mais tout vient de la fréquentation** : le ticket est sous la normale.

Mix du jour : **42,6 menus / 100 commandes** (dont 9,6 XL), 80,9 corndogs seuls,
**1,36 article par commande**. Contre août 2026 : 53,7 menus, 13,7 XL, 1,53 article.

⚠️ **Ne rien conclure de cet écart.** C'est **un seul jour**, et le comparer à août
viole la règle 1 de la méthode de chiffrage — août est structurellement un mois à fort
ticket. À resuivre sur plusieurs semaines, ce qui est désormais automatique.

### 🔴 SEPTEMBRE TRANCHE LE SUJET DU TICKET — 19/09/2026

Le témoin attendu depuis le 31/08 est arrivé : export CSV + « Rapport de vente » détaillé
du **01 au 17/09/2026**, comparés au **même export de septembre 2025**, mêmes dates,
même code de parsing. `ventes` porte désormais septembre 2026 en entier
(1 414 commandes du 01-17 par l'export, puis le webhook à partir du 18).

**Composition vérifiée** : 2 samedis et 2 dimanches de chaque côté. 2025 a un lundi de
plus, 2026 un jeudi de plus — donc **2026 est légèrement désavantagé**, le jeudi étant
le jour creux. L'écart mesuré est réel, voire sous-estimé.

| 1–17 septembre, aux bornes | 2025 | 2026 | Écart |
|---|---|---|---|
| CA | 14 944 € | **16 995 €** | **+13,7 %** |
| Commandes | 1 166 | **1 414** | **+21,3 %** |
| Menus / 100 cmd | 32,4 | **50,6** | **+18,2** |
| dont XL / 100 | 0 | 8,2 | +8,2 |
| Corndogs seuls / 100 | 105,3 | 76,0 | −29,3 |
| Signatures / 100 | 5,6 | 6,0 | +0,4 |
| **Articles par commande** | **1,51** | **1,39** | **−0,12** |
| Valeur des produits | 10,68 € | 10,82 € | **+0,14 €** |
| **Suppléments** | **2,14 €** | **1,18 €** | **−0,97 €** |
| **Ticket** | **12,82 €** | **12,00 €** | **−0,82 €** |

Parsing validé : l'écart de ticket du détail produits (−0,82 €) retombe sur celui calculé
indépendamment depuis `ventes` (12,82 → 12,02, soit −0,80 €).

### 🔴 CORRECTION DU 19/09/2026 — « le menu absorbe les suppléments » est FAUX

**Le gérant a objecté, pour la deuxième fois, que les suppléments s'additionnent aussi
sur les menus. Il avait raison, et la vérification lui donne raison.** En séparant les
commandes avec et sans menu :

| 1–17 septembre | 2025 | 2026 | Écart |
|---|---|---|---|
| **Part des commandes AVEC menu** | 24,2 % | **39,9 %** | +15,7 pts |
| — ticket | 15,87 € | 14,64 € | −1,23 € |
| — suppléments | 1,13 € | 0,63 € | −0,50 € |
| **Commandes SANS menu** | 75,8 % | 60,1 % | |
| — ticket | 11,84 € | 10,24 € | −1,60 € |
| — suppléments | **2,46 €** | **1,54 €** | **−0,92 €** |

**Une commande avec menu vaut 4,40 € de plus qu'une commande sans menu.** La conversion
au menu **rapporte**. Décomposition propre de l'écart de ticket de −0,82 € :

| | Effet |
|---|---|
| **Passage aux menus (effet de mix)** | **+0,64 €** |
| **Autre chose (effet intra-groupe)** | **−1,46 €** |
| Total | **−0,82 €** |

L'estimation du gérant (+3,50 € par conversion × 18 conversions/100 = +0,63 €) tombe à
un centime du calcul. **Ne plus écrire que le menu absorbe les suppléments.**

⚠️ **Les −1,46 € « intra-groupe » étaient largement un ARTEFACT** (corrigé le même jour).
Le gérant a précisé qu'en juillet **« on a mis les menus en avant »** sur la borne, sans
rien rendre gratuit. Conséquence : le groupe « sans menu » de 2026 n'est pas comparable à
celui de 2025 — les clients qui chargeaient leur commande d'extras sont justement passés
au menu, ne laissant que les plus économes. **Toute comparaison par sous-groupe est
contaminée par cette sélection.**

**Le test propre : comparer un contenu de commande IDENTIQUE d'une année sur l'autre.**

| Commande identique, 1–17 septembre | Extras 2025 | Extras 2026 | Écart |
|---|---|---|---|
| 1 corndog Saucisse/Mozza seul (285 → 299 cmd) | 1,42 € | 1,12 € | **−0,30 €** |
| 1 corndog Mozza seul (133 → 164 cmd) | 1,44 € | 1,14 € | **−0,30 €** |
| 1 Menu Goodeal seul (123 → 282 cmd) | 0,61 € | 0,41 € | −0,20 € |

La vraie perte à contenu identique est donc de **0,25 à 0,30 €**, pas 1,46 €.
**Utiliser ce test à contenu identique pour toute question de ce type ; une comparaison
par sous-groupe est trompeuse dès que la carte oriente le choix des clients.**

⚠️ **La piste « un prix d'option a baissé » est ÉCARTÉE** (testée le 19/09, ne pas la
rouvrir). En séparant *combien de clients prennent un extra* de *combien ils paient* :

| Commandes « un seul corndog » | 2025 | 2026 |
|---|---|---|
| Ne prennent **aucun** extra | 31,8 % | **45,2 %** |
| Montant moyen **quand ils en prennent** | 2,22 € | 2,05 € |

Les montants les plus fréquents sont **identiques des deux côtés** (0,50 · 1,00 · 1,50 ·
2,00 · 2,50 · 3,00 · 3,50 €) : **aucun tarif n'a bougé.** Le « −0,30 € exactement » était
une coïncidence de moyenne. Il y a simplement 13 points de clients en moins qui prennent
un extra — ils sont passés au menu.

### Le client type n'achète PAS de side — ce qui change tout

| Ce que le client ajoute à un corndog seul | 2025 | 2026 |
|---|---|---|
| Rien | 31,8 % | 45,2 % |
| 0,01 à 1,50 € — sauces, panures | 36,3 % | 26,9 % |
| 1,51 à 3,00 € | 17,9 % | 19,6 % |
| 3,01 à 4,99 € — **un side** | 5,7 % | **4,1 %** |
| 5,00 € et plus | 8,3 % | 4,1 % |

**Seulement ~8 % des commandes « un corndog seul » contiennent quelque chose de la taille
d'un side.** Le client type ajoute une sauce ou une panure, autour d'un euro.

🔴 **Conséquence : chaque conversion au menu RAPPORTE.** Ce client payait 6,50 + 1,00 =
**7,50 €** ; il prend maintenant un menu à **10 €**, soit **+2,50 €**. Le side qu'on lui
offre, il ne l'aurait jamais acheté — il ne coûte que sa matière. **L'objection du gérant
était fondée et le raisonnement initial de Claude était faux.**

### D'où vient alors la baisse du ticket : du HAUT de la distribution

| 1–17 septembre | 2025 | 2026 |
|---|---|---|
| Ticket médian | 10,50 € | 10,00 € |
| Commandes à **8 € ou moins** | 33,4 % | **31,7 %** |
| Commandes à **20 € ou plus** | 16,9 % | **13,8 %** |

**Il n'y a pas plus de petites commandes — il y en a un peu moins. Ce sont les GROSSES qui
ont reculé**, de 3,1 points. Mécanisme : deux personnes qui prenaient 2 corndogs +
2 sides + 2 boissons (20-25 €) prennent aujourd'hui **2 menus = 20 €**, sides et boissons
compris. **Le menu ne comprime pas les petits paniers, il comprime les gros** — il agit
comme une remise de volume que personne n'a décidée.

### L'économie du menu, en clair

| Commande d'un seul article | Total encaissé |
|---|---|
| 1 corndog Saucisse/Mozza seul | 7,62 € |
| 1 Menu Goodeal seul | 10,41 € |
| **Écart** | **2,79 €** |

**Le menu ajoute un side et une boisson pour 2,79 € net**, alors qu'un side vaut 3,50 à
4,90 € et un soft 2,50 € — soit ~6 € de marchandise donnés pour 2,79 €.

🔴 **CONCLUSION STABILISÉE (19/09/2026), après deux erreurs successives de Claude :**
le menu n'absorbe pas les suppléments et **chaque conversion individuelle rapporte**.
La baisse du ticket vient des **paniers de groupe**, où le menu joue une remise de volume
non décidée. Le menu est simplement **vendu trop peu cher**, surtout à plusieurs.

⚠️ **La conclusion d'août (+417 €/mois, « le menu absorbe les suppléments ») repose sur
le même raisonnement et n'a PAS été retestée avec cette séparation avec/sans menu.
À refaire avant de la réutiliser.**

**ACTION PRIORITAIRE : passer Menu Good Deal et Menu Bubble Dogs de 10 € à 10,50 €.**
~1 048 menus non-XL/mois au rythme de septembre × 0,50 € = **~525 €/mois**, coût nul.
Elle frappe exactement là où ça fuit : le client seul paie 0,50 € de plus sur un achat
déjà très avantageux pour lui, **et le groupe de deux paie 1 € de plus**. La valeur à la
carte reste de 12,90 €, soit encore 19 % de remise.

⚠️ **Question ouverte posée au gérant, non tranchée :** est-ce le **prix rond de 10 €**
qui produit l'effet, ou le **fait que le menu soit mis en avant sur la borne** ? Si c'est
le prix rond, la hausse casse quelque chose. Si c'est la mise en avant, elle ne change
rien à la perception. Le gérant est au comptoir, c'est lui qui peut le dire.

⚠️ `ventes_produits` porte la période `2026-09-01 → 2026-09-17` (24 produits + la ligne
`SUPPLEMENTS/EXTRAS` à 1 648 €). Son total est de 16 820 € contre 16 995 € dans `ventes` :
l'écart de 175 € vient de **12 commandes dont le PDF ne donne pas les prix unitaires**,
volontairement exclues. Pour un CA global, préférer `ventes`.

**À produire fin septembre :**
1. Le hors-bornes réel du mois, mesuré au lieu d'estimé.
2. **Septembre 2026 contre septembre 2025, aux mêmes dates** — le témoin propre attendu
   depuis le 31/08 (sept 2025 : 1 978 commandes, 836 €/j, ticket 12,68 €, ni XL ni menu
   renommé, détail produits en base depuis le 01/09/2026).
3. Le creux de la mi-septembre s'est-il comporté comme en 2025 ? La reprise de la semaine
   du 22 a-t-elle eu lieu ?

## ⚠️ Décisions déjà prises — À LIRE AVANT TOUTE ANALYSE

Le travail des sessions précédentes est stocké en base, **pas dans la conversation**.
Toujours consulter ces deux tables avant de proposer quoi que ce soit, sous peine de
refaire du travail déjà fait :

- **`actions_conversion`** : 5 actions pour augmenter le taux de prise de menu, avec
  impact chiffré, effort et priorité. Colonne `fait` pour le suivi.
- **`propositions_menu`** : 5 menus étudiés, avec verdict, hypothèses de conversion,
  cannibalisation et impact/mois. Colonnes `recommande` et `verdict`.

**Décision du gérant (11/08/2026) : la carte reste sur les deux gammes existantes**,
Good Deal et Bubble Dogs, avec leurs versions XL. Le **Duo Menu** et le **Menu Famille**
sont **écartés** — ils se vendent bien, ils sont rentables, et allonger la carte ferait
courir un risque de lenteur au comptoir pour un gain marginal. **Ne pas les reproposer.**

Seule réserve à garder en tête si le sujet revient un jour : le segment groupe et
famille reste non couvert.

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

- ~~Septembre 2025 absent~~ — **comblé le 11/08/2026.** L'export a été chargé : 30 jours
  pleins, 1 978 commandes, 836 €/jour (et non 714 € comme estimé). Il n'y a plus de trou.
  ⚠️ Règle à conserver : ne jamais traiter un jour sans vente comme une fermeture. Diviser
  le CA par les jours du calendrier au lieu des jours mesurés sous-estime le CA mensuel.
- Le dimanche 15/03/2026 est désormais **le seul jour sans vente de tout l'historique**.
  À confirmer : vraie fermeture exceptionnelle, ou trou de données ?
- Écart matière : ~19 % réel (ligne « Courses ») contre ~14 % théorique en recettes,
  soit ~1 500 €/mois. ⚠️ **Ce n'est PAS du gaspillage** — voir « Le vrai problème de
  stock » ci-dessous. Les causes probables sont les achats hors recettes (entretien,
  huile, emballages), les à-coups d'achat, et le sur-portionnement.
- ~~Le jeudi sans explication~~ — **élucidé le 12/08/2026, voir la section dédiée.**
  Ce n'est pas une anomalie à réparer mais un creux de flux piéton, structurel et permanent.
- **8 articles Rue Neuve** portent encore une quantité en toutes lettres et sont donc
  aveugles aux alertes : Sel, Sucre, Élastique, Essuie-tout, Gobelet bubble tea,
  Barquette frites, Oignon frit, Rouleau banque contact. **La Saucisse n'en fait plus
  partie** (chiffrée à 3 le 11/08). Aucun des huit n'est un produit critique.
- **Comptages en retard au 12/08/2026** : MATÉRIEL 48 jours, FOOD EX et MAGASIN CHINOIS
  34 jours, SAUCE MAISON 31 jours. Les quatre magasins actifs (TADAL, OZ FOOD, SILGRO,
  COLRUYT) sont à jour.
- `stock.unites_par_lot` à renseigner (voir Module Stock).
- Balance des comptes de charges Skytax à obtenir — c'est ce qui fermera le trou de
  ~3 100 €/mois.

## 🔴 CONTRAINTE PERMANENTE : trésorerie zéro

**Point de départ de toute recommandation, posé par le gérant le 11/08/2026 :
la trésorerie est à zéro.** Fonctionnement au mois le mois, 23 839 € de dettes,
aucune réserve.

Cause assumée : *« on a fait des erreurs en augmentant nos salaires »*. Trois gérants
qui se sont payés sur une seule unité, plus des events ratés, pendant trois ans.

**Ce que ça impose à toute proposition future :**

- **Aucun investissement.** Rien qui demande d'avancer de l'argent. Pas de matériel,
  pas de cuisine, pas de local, pas de recrutement.
- **Priorité au cash rapide.** Une action qui rapporte 300 € le mois prochain vaut
  mieux qu'une action qui rapporte 1 000 € dans six mois.
- **Ne jamais proposer d'augmenter la rémunération des gérants** tant qu'il n'y a pas
  trois mois de charges en réserve. C'est l'erreur qui a créé la situation.
- **Rien qui ponctionne la trésorerie de Rue Neuve** pour financer autre chose.
- Un event ne se signe qu'après passage dans le simulateur de rentabilité.

Les projets personnels des gérants, financés hors exploitation, ne relèvent pas de ce
fichier et ne doivent pas y être documentés.

## Plan d'action recommandé (audit du 11/08/2026)

Par ordre de valeur, avec les montants estimés :

| # | Action | Gain/mois | État |
|---|---|---|---|
| 1 | Inventaire matière sur 2 semaines | 1 200 € | à faire |
| 2 | Corriger cotisations + TVA avec le comptable | visibilité | TVA faite |
| 3 | Passer le corndog de 6,50 à 7,00 € **en septembre** | 1 090 € | à faire |
| 4 | Baisser le food cost event de 18 % à 13 % dans le formulaire | 500 €/event | à faire |
| 5 | Carte de fidélité | non chiffré | à faire |
| 7 | Négocier les 7 fournisseurs (jamais fait) | 180 € | à faire |
| 8 | Retirer une personne le jeudi 14h-17h (voir « Le jeudi ») | ~150 € | à faire |

⚠️ **Ne pas investir dans la cuisine** : elle tourne à 40 % de sa capacité.

Séquence recommandée pour Rue Neuve : appliquer le court terme (1 mois) → solder les
23 839 € de dettes (5-7 mois) → constituer 3 mois de charges en réserve (12-15 mois).

## Module EasyOrder (API) — en place depuis le 18/09/2026

EasyOrder POST chaque commande sur un webhook et **attend un HTTP 201** ; sans ce 201
il rejoue l'appel. Leur doc ne prévoit **ni signature ni jeton** : la seule protection
est un secret long placé en dernier segment de l'URL du webhook. Ne jamais publier
cette URL, et ne jamais écrire le secret dans le dépôt Git.

| Table | Contenu |
|---|---|
| `commandes_live` | En-tête de commande + `payload` JSON brut. `imprime` et `accuse_easyorder` pilotent l'impression et l'accusé de réception |
| `commandes_live_lignes` | Détail par produit : catégorie, quantité, prix, TVA, commentaire, ingrédients |

Edge Function **`easyorder-webhook`**. Elle est idempotente (contrainte unique
`source, source_id`, lignes réécrites à chaque rejeu) et miroite dans `ventes`
avec `canal = 'easyorder:<compte>'`.

🔴 **La `reference` EasyOrder n'est PAS unique** — les commandes arrivent numérotées
`001`, `002`… et le compteur repart. Deux contraintes d'unicité sur `ventes.reference`
ont donc été supprimées : celle posée par erreur le matin du 18/09, **et
`ventes_reference_key`, la contrainte d'ORIGINE de la table**, qui aurait fait refuser
la commande `001` de demain parce que celle d'aujourd'hui existe déjà.
**Ne jamais remettre d'unicité sur `reference`.**

L'unicité est portée par **`ventes.source_id`** (l'identifiant de commande EasyOrder,
un UUID), et c'est sur elle que le miroir dédoublonne.

🔴 **L'index de `source_id` doit être SIMPLE, pas partiel.** Il avait d'abord été créé
avec `WHERE source_id IS NOT NULL` : PostgreSQL refuse d'utiliser un index partiel pour
un `ON CONFLICT`, donc **chaque écriture dans `ventes` échouait**, silencieusement pour
l'utilisateur. Un index unique simple convient — Postgres autorise plusieurs `NULL`,
ce dont a besoin l'historique importé. Symptôme vu à l'écran le 18/09 : 18 commandes
dans l'onglet Direct mais « Aujourd'hui · bornes » bloqué à 1 commande.

⚠️ **Rien n'avait été perdu** : les 19 commandes étaient intactes dans `commandes_live`
avec leur détail, seul le miroir échouait. Elles ont été réinjectées dans `ventes` par
un `insert … select … on conflict (source_id) do nothing`. **C'est la raison d'être des
deux tables** — `commandes_live` est la source brute, `ventes` la table d'analyse.

**Une URL par compte EasyOrder** : `/easyorder-webhook/<secret>/<compte>`. Le compte est
stocké dans `commandes_live.compte` et dans `ventes.canal` sous la forme
`easyorder:<compte>`. Segments en service : `rueneuve` et `enseignement`.

⚠️ Ce n'est **pas** un choix de confort. Chaque compte a ses propres identifiants donc
son propre jeton : sans savoir de quel compte vient une commande, impossible de
l'acquitter sur le bon via `/pos/orders-processed`. La décision inverse prise le matin
du 18/09 (une seule URL) a été renversée le soir même pour cette raison.

**Base URL de production : `https://api.easyorderapp.com`** (Matijs, 18/09/2026).

🔴 **Les identifiants des deux comptes sont dans la table `integrations_comptes`**, avec
RLS activée et aucune policy — la clé anon ne peut pas les lire. **Ne jamais les écrire
ici ni ailleurs dans le dépôt Git.**

**EasyOrder ne signe pas ses appels** (confirmé par Matijs). Les deux seuls garde-fous
sont le secret dans l'URL et le contrôle de forme de la requête : `data.id` chaîne d'au
moins 8 caractères, `data.reference` non vide, `data.total_price` numérique,
`data.order_details` tableau — sinon 400.

### 🔴 Aucune commande ne doit être perdue — règles de la v5 (18/09/2026)

Deux trous ont été trouvés en auditant la v4 et bouchés le jour même.

**Un 201 signifie « tout est écrit », jamais moins.** EasyOrder rejoue tant qu'il n'a pas
son 201 ; dès qu'il l'a, il ne renverra **plus jamais** cette commande. La fonction renvoie
donc **500** si les lignes produit ou le miroir `ventes` échouent, alors que la v4
renvoyait 201 et perdait le détail en silence. Le rejeu est sans risque : tout est
idempotent, l'en-tête déjà écrit est simplement mis à jour.
**Ne jamais transformer un de ces 500 en 201 « parce que l'en-tête est passé ».**

**Table `commandes_live_rejets`** : tout appel refusé y est archivé avec son motif, son
JSON et, si le corps est illisible, son texte brut. Un 400 est définitif — EasyOrder ne
rejoue pas — donc sans cette table un changement de format de leur côté nous ferait jeter
de vraies commandes sans laisser de trace. **À consulter si un jour un total ne tombe pas
juste.**

**Polling de rattrapage** : la consigne de Matijs est de marquer chaque commande comme
traitée dès réception. Un polling de fin de journée ne remonte alors que ce qui n'a
jamais été livré. Il ne fera aucun test manuel : le premier appel viendra d'une vraie
commande.

⚠️ Une Edge Function est déployée avec `verify_jwt = true` par défaut : dans cet état
**tout appel externe est rejeté en 401 avant d'atteindre le code**. La fonction est
déployée avec `verify_jwt = false` depuis la v2. Ne pas le remettre à `true`.

⚠️ Le webhook n'est **pas testable depuis l'environnement Claude** : le proxy sortant
bloque l'appel. La vérification passe par un test envoyé par EasyOrder, puis une lecture
de `commandes_live`.

### Premier appel réel — 18/09/2026, concluant

Commande `001` : à emporter, cash, non payée, 2,00 €, client « Kiosk » (donc une borne),
une ligne `COCA` / catégorie `SOFTS` / 1 × 2,00 € / unité « Pièces ». En-tête, ligne
produit et miroir dans `ventes` tous corrects au centime.

Deux constats issus de ce test :

1. La référence `001` n'est pas unique → correction ci-dessus (`source_id`).
2. ⚠️ **La ligne COCA porte une TVA de 0 %.** Le gérant a précisé que seules les
   factures partent au comptable et que la borne n'entre pas dans la comptabilité :
   **aucune conséquence comptable, sujet clos, ne pas le relancer.** La conséquence qui
   demeure est analytique — le champ `vat_percentage` d'EasyOrder n'est pas fiable et ne
   doit servir à **aucun** calcul, ni ventilation du CA par taux, ni estimation de TVA.
   La référence reste Skytax et les 900 €/mois.

### 🟢 LES OPTIONS SONT DANS LE WEBHOOK — 19/09/2026, l'angle mort est comblé

🔴 **Corrige une affirmation qui traînait partout dans ce fichier :** « les options
(sides, panures, suppléments) n'apparaissent pas dans les exports EasyOrder, il faut
demander la Liste de commande détaillée ». **C'est vrai des exports PDF, c'est FAUX du
webhook.** Chaque ligne de commande porte un tableau `product_options` avec, pour chaque
groupe, le choix retenu **et son prix**.

Table **`commandes_live_options`** (créée le 19/09) : `commande_id`, `ligne_id`, `groupe`,
`choix`, `prix`. Remplie automatiquement par la fonction v6, et **rétroactivement depuis
les `payload` déjà reçus** — rien n'avait été perdu.

🔴 **Le prix d'une option s'applique PAR UNITÉ** : il faut le multiplier par
`commandes_live_lignes.quantite`. Sans ça, 4 commandes sur 105 ne se réconciliaient pas.
Avec, **105 sur 105 tombent au centime** :
`total = Σ(lignes.prix × quantite) + Σ(options.prix × quantite de la ligne)`.

**Premier relevé (105 commandes, 18-19/09 — une journée et demie, indicatif) :**

| Option payante | Prix | Fois | CA |
|---|---|---|---|
| **Panure POTATOE** | 1,00 € | 32 | **32,00 €** |
| **Panure BLUE** | 1,00 € | 15 | 16,00 € |
| Panure SPICY (+ supplément panure) | 0,50 € | 19 | 12,00 € |
| Panure BLUE en supplément | 1,00 € | 3 | 3,00 € |
| Softs en supplément | 2,00 € | 11 | 22,00 € |
| Side Tempura crevette | 4,90 € | 2 | 14,70 € |
| Side Poulet karaage | 4,60 € | 1 | 9,20 € |
| Side Frites | 3,50 € | 2 | 7,00 € |
| **Oignons frits** | 0,50 € | 16 | 10,00 € |
| **Total** | | | **131,90 €** |

🔴 **Ce sont les PANURES qui font les suppléments, pas les sides** : 63 € sur 132, près
de la moitié. La Potatoe à 1 € est prise sur ~3 commandes sur 10.

✅ **Contrôle croisé réussi** : 131,90 € / 105 commandes = **1,26 €/commande**, contre
**1,18 €** calculé indépendamment sur septembre par soustraction (ticket − valeur
produits). Les deux méthodes concordent — la mesure des suppléments est fiable.

⚠️ Échantillon d'une journée et demie : les proportions sont indicatives, pas encore
solides. À reprendre après une semaine pleine.

### Onglet « Direct » dans l'app

Nouvel onglet de la barre du bas (icône radio), **visible par tout le monde**, pas
réservé aux admins : c'est un écran d'exploitation, pas de gestion.

Il affiche les **60 dernières commandes** de `commandes_live` avec leur détail produit.

**Affichage en temps réel** (18/09/2026). L'app ouvre un websocket avec
**`@supabase/realtime-js`** — la seule dépendance réseau du projet, `@supabase/supabase-js`
complet n'étant pas nécessaire (+17 Ko gzip au lieu de bien plus). Supabase pousse
l'insertion dès qu'elle est écrite : la commande s'affiche sans délai perceptible.

🔴 **Deux choses en base sont indispensables, sinon Realtime n'émet rien :**
`alter table commandes_live replica identity full;` et l'ajout de la table à la
publication `supabase_realtime`. Les deux sont posées. Si un jour l'écran cesse de
réagir en direct, c'est la première chose à vérifier.

**La sonde de secours est conservée**, à 25 secondes : un websocket peut tomber sans
prévenir (réseau du magasin, veille du téléphone) et l'écran ne doit jamais rester muet.
Elle ne demande que `recu_le` de la dernière ligne et ne recharge que si ça a changé.
Elle est suspendue écran éteint (`document.hidden`) et relancée au retour
(`visibilitychange`). **Ne pas la supprimer au motif que le temps réel marche.**

Un point vert « En direct » s'affiche quand le websocket est connecté, gris « Secours »
sinon. Une vibration de 120 ms signale chaque nouvelle commande.

Quatre chiffres fixés au-dessus de la barre de navigation :
- **Aujourd'hui · reçues** — la somme des commandes **de la journée en cours** parmi
  celles affichées, avec leur nombre. ⚠️ **Ne compte PAS les 60 commandes affichées** :
  la liste déborde sur la veille dès le matin, et le gérant a demandé le 19/09 que ce
  total ne porte que sur le jour en cours. Le jour d'une commande se lit **à l'heure de
  Bruxelles**, sinon une commande de 20h02 bascule sur la veille.
- **Aujourd'hui · bornes** — lu depuis **`ventes`**, la table de référence, filtré sur
  la date du jour. Pas depuis `commandes_live`, qui ne porte que ce que le webhook a reçu.

💡 Les deux premiers chiffres sont volontairement **redondants** : l'un vient du webhook,
l'autre de `ventes`. **S'ils divergent, le miroir est cassé** — c'est exactement le bug
du 18/09. C'est un contrôle gratuit, ne pas les fusionner.

Un **séparateur de date** s'affiche dans la liste au changement de jour, pour qu'on voie
où s'arrête la journée en cours.
- **Ticket moyen** du jour, **hors passages rapides** (19/09/2026). Une commande qui ne
  contient ni corndog, ni menu, ni signature — une canette, des frites — est un passage
  rapide, pas un client représentatif. Le gérant a demandé de les exclure du ticket.
  Elles **restent comptées** dans le CA et dans le nombre de commandes.
  Effet mesuré sur le vendredi 18/09 : 3 commandes sur 94, ticket 11,75 € → **12,05 €**.
- **Menus vendus** du jour, avec le taux **pour 100 commandes** — rapporté aux seules
  commandes **avec plat**, pour rester cohérent avec le ticket. C'est l'indicateur de
  pilotage retenu dans tout ce fichier (règle 5 de la méthode de chiffrage : jamais par
  jour, toujours par commande).

⚠️ Sur l'ensemble de septembre, ces passages rapides pèsent **2,1 % des commandes** pour
un ticket de ~5,20 €, contre 1,8 % en 2025 : **ils n'expliquent AUCUNE part de la baisse
du ticket** (−0,82 € avec ou sans eux). Le filtre est une question de justesse, pas une
explication. Ne pas refaire ce test.

⚠️ Les menus sont comptés sur **toutes** les lignes de la journée, via une jointure
`commandes_live_lignes → commandes_live` filtrée sur `recu_le`, **pas** sur les 60
commandes affichées — la liste serait trop courte dès un samedi chargé.

La reconnaissance d'un menu est volontairement large (`MENU`, `GOOD DEAL`, `GOODEAL`,
`BUBBLE DOG`, `ETUDIANT`) parce que les libellés changent : l'historique porte encore
`MENU ETUDIANT`. Vérifié le 18/09/2026 sur les vraies commandes — `MENU GOODEAL`,
`MENU GOODEAL XL` et `MENU BUBBLE DOGS` sont comptés, `CORNDOG …` et `SUISSE` non.

🔴 **CORRECTION DU 18/09/2026 — les deux sources n'ont pas la même convention d'heure.**
J'avais d'abord affiché les heures sans conversion, en appliquant au webhook la règle
valable pour `ventes`. C'était faux, et l'écran décalait de deux heures.

| Source | Convention | Affichage |
|---|---|---|
| `ventes` (historique importé) | heure **locale** stockée avec un fuseau UTC | lire l'heure telle quelle, **ne pas convertir** |
| Webhook EasyOrder (`commandes_live`) | **UTC réel** | **convertir** vers `Europe/Brussels` |

Preuve : une commande reçue à 12h08 à Bruxelles porte `cree_le` **et** `recu_le` à
10h08 UTC — les deux concordent, donc c'est bien de l'UTC réel. L'onglet Direct utilise
désormais `toLocaleTimeString` avec `timeZone: "Europe/Brussels"`.

Reste à obtenir d'EasyOrder : **comment échanger les identifiants contre un
`access_token`** — la doc montre `Authorization: Bearer {{access_token}}` mais pas
l'appel d'authentification. Sans lui, pas d'accusé de réception ni de statuts.
