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
- **Un seul point de vente**, plus des events ponctuels. Les entrées « Event 1 » et
  « Event 2 » de `RESTAURANTS` sont des **kits de stock pour charger la camionnette**,
  pas des boutiques : leurs quantités vides sont normales, ce ne sont pas des alertes.
- CA moyen **1 035 €/jour** — **875 € bornes** + 150 € caisse/Uber (270 en août),
  mesuré sur les **364 journées** d'août 2025 à juillet 2026 enregistrées dans `ventes`.
  Soit **~31 400 €/mois** et **~377 000 €/an**.
  ✅ **L'année est complète depuis le 11/08/2026** : septembre 2025 a été chargé
  (1 978 commandes, 25 073 €, 836 €/jour). Il n'y a plus aucun mois estimé dans
  `saisonnalite`, et les douze valeurs concordent avec `ventes` à l'euro près.
  Elles portent sur les seuls jours d'ouverture (mars est sur 30 jours, le 15/03/2026
  étant le dernier et unique jour sans vente de l'historique).
- Objectif fixé : 922 €/jour

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
- Marge nette ~17 %, soit ~5 100 €/mois
- Forte saisonnalité : creux en mars (832 €/j), pic en juillet (1 278 €/j)
- Masse salariale à 30,3 % du CA, plafond fixé à 35 %

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
  Résultat : **2 personnes en semaine tous les mois de l'année, 3 le samedi** (sauf juin,
  1 309 €). Aucune moyenne hebdomadaire ne dépasse 1 350 € — seul le samedi le fait.
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
- **Dettes** : 26 500 € sur 6 plans, 2 793 €/mois. Aucune trésorerie d'avance,
  fonctionnement au mois le mois depuis trois ans.

### L'écart passé — sujet clos, ne pas rouvrir

Le compte modélisé dégage ~6 200 €/mois de résultat, soit ~3 400 €/mois après dettes.
Or la trésorerie est restée à zéro pendant trois ans.

**Le gérant a tranché : cet argent a été consommé par de mauvais choix passés** —
rémunérations trop élevées et events ratés. Ce n'est donc **pas une fuite en cours**,
et il ne faut pas y consacrer d'analyse supplémentaire.

Conséquence pour les projections : le résultat modélisé est atteignable, et il
s'accumulera dès lors qu'il cesse d'être consommé. La seule condition est comportementale.

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

**Exception : août est à 270 €/jour de hors-bornes** (gérant, 11/08/2026). Caisse et
Uber montent l'été. Seul le mois d'août est concerné dans `saisonnalite` ; tous les
autres mois restent à 150, et `parametres.ca_hors_bornes` (valeur annuelle par défaut)
reste à 150. Août 2026 se lit donc **995 € bornes + 270 = ~1 265 €/jour tout compris**.

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
| `ventes` | **26 218 commandes bornes, historique complet sans trou** (01/08/2025 → 11/08/2026, 375 jours). Source de référence pour toute analyse par jour, par jour de semaine ou par heure. La commande erronée #ZHATPX (01/08/2026, 1 903,80 €) a été volontairement exclue à la demande du gérant |
| `courses_remplacements` | Remplacement ponctuel de courses, une ligne par semaine (lundi) |
| `parametres` | Clé/valeur partagé : `ca_hors_bornes`, `courses_ordre`, `courses_ancrage` |

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

Hors-bornes d'août à 270 €/j (voir plus haut) → **~1 265 €/jour tout compris**, soit
**~39 200 €** si le rythme tient sur le mois entier. **C'est le meilleur mois de tout
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
4. Répartition de la marge : Corndog 63 %, Menu 29 %, Signature 5 %, Bubble tea 2 %, Side 1 %.

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
  aveugles aux alertes, dont la Saucisse. À chiffrer.
- **FOOD EX n'a pas été compté depuis 33 jours** (constaté le 11/08/2026).
- `stock.unites_par_lot` à renseigner (voir Module Stock).
- Balance des comptes de charges Skytax à obtenir — c'est ce qui fermera le trou de
  ~3 100 €/mois.

## 🔴 CONTRAINTE PERMANENTE : trésorerie zéro

**Point de départ de toute recommandation, posé par le gérant le 11/08/2026 :
la trésorerie est à zéro.** Fonctionnement au mois le mois, 26 500 € de dettes,
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
26 500 € de dettes (5-7 mois) → constituer 3 mois de charges en réserve (12-15 mois).
