# Borne de commande maison — contexte du projet

Ce fichier porte **le projet borne uniquement**. Le contexte métier complet (CA,
finances, horaires, stock, EasyOrder) est dans le `CLAUDE.md` à la racine du
dépôt : le lire aussi, il contient les règles qui ne doivent jamais être
réécrites.

## Ce que c'est

Remplacer la borne EasyOrder par la nôtre. Décidé par le gérant le 03/10/2026.
App séparée dans `borne/`, même dépôt, même Supabase, **projet Vercel et URL à
part**.

🟢 **Le constat qui rend le projet faisable : la borne ne prend AUCUN paiement.**
Sur les 1 208 commandes de `commandes_live`, 100 % sont en « cash / non payé » —
le client commande à la borne puis paie au comptoir. **Bancontact, PSP et
certification sont HORS PÉRIMÈTRE.**

Périmètre réel : catalogue → panier → options → envoi → cuisine.

## Matériel

| | |
|---|---|
| Les bornes | **Elles sont au gérant** : deux en service, une de secours inutilisée |
| Comment on teste | **Sur la borne de secours**, sans jamais toucher à la production. Risque nul, zéro investissement |
| La borne EasyOrder | une **app téléchargeable**, pas une page web — on ne peut pas la repointer, il faut installer autre chose |
| Cible | tablette Samsung, app native via Capacitor (déjà installé pour l'app de gestion) |

## État au 21/10/2026 — ce qui est fait

Tout est sur la branche `claude/project-status-5xiop2`.

**En base** (migrations `borne_catalogue_options`, `borne_produits_table`,
`borne_creer_commande`) :

| Table / fonction | Rôle |
|---|---|
| `borne_groupes` | 13 groupes d'options. `portee` = `produit` ou `commande` |
| `borne_options` | Les choix et leur prix. `ordre` = **fréquence réelle observée**, le plus pris en premier |
| `borne_produit_groupes` | Quel groupe pour quel produit, **clé = le NOM du produit** |
| `borne_produits` | 16 produits avec leur prix et leur catégorie |
| `borne_creer_commande(p jsonb)` | **Le cœur.** Écrit l'en-tête, les lignes, les options et le miroir `ventes` dans UNE transaction, et attribue le numéro sous `pg_advisory_xact_lock` |

**Dans `borne/`** :

| Fichier | Rôle |
|---|---|
| `src/api.ts` | Lecture du catalogue, appel du RPC, écran cuisine |
| `src/App.tsx` | La borne client : accueil → mode → carte → options → panier → numéro |
| `src/Cuisine.tsx` | L'écran cuisine |
| `src/styles.css` | Écran tactile, rien de cliquable sous 64 px |
| `public/affiche.jpg` | L'affiche des menus, en accueil. Un seul fichier à remplacer pour la changer |

Deux écrans, un seul build : `/` = la borne, `/#cuisine` = la cuisine.

🔴 **Mais aucune commande n'a JAMAIS été créée** (vérifié le 21/10 :
`select count(*) from commandes_live where source='borne'` = **0**). Le chemin
complet app → RPC → `commandes_live` → `ventes` n'a pas tourné une seule fois.
Le code est relu et cohérent, **rien n'est prouvé**.

⚠️ **Un test de bout en bout n'est pas gratuit** : le RPC prend son numéro dans
le compteur du jour de `ventes`, **partagé avec EasyOrder**, et écrit dans
`ventes`. Une commande de test pollue donc le CA du jour **et casse la continuité
des références**, qui est le seul filet de complétude depuis la fin de l'échange
EasyOrder. Le test se fait donc **après la fermeture**, avec suppression
immédiate des lignes par `source_id`, et **avec l'accord du gérant**.

## 🔴 Les règles à ne pas casser

1. **Le numéro de commande vient de la base, jamais du client.** `reference`
   n'est PAS unique (les compteurs repartent à `001` chaque jour) et **ne doit
   jamais le redevenir** : l'unicité est portée par `ventes.source_id`, dont
   l'index doit rester **SIMPLE, pas partiel** (Postgres refuse un index partiel
   pour un `ON CONFLICT` — c'est le bug du 18/09 qui faisait échouer chaque
   écriture en silence).
2. **Une commande est atomique ou n'existe pas.** Tout passe par le RPC. Ne
   jamais écrire `commandes_live` depuis le client ligne par ligne.
3. **Le prix envoyé est celui du produit seul**, options à part : le RPC
   recalcule le total, **option facturée PAR UNITÉ** (× la quantité de la ligne).
   Sans ça les totaux ne se réconcilient pas.
4. **Heures** : `commandes_live.recu_le` est de l'**UTC réel** → convertir vers
   `Europe/Brussels`. Les lignes importées de `ventes` (≤ 17/09/2026) sont en
   heure locale stockée avec un fuseau UTC → **ne pas convertir**. Le
   discriminateur est `ventes.source_id`.
5. **CSS** : ne jamais mettre d'`overflow` sur `body` ni sur `#root`. Le rognage
   horizontal vit sur `html` seul, en `clip`. Un `position: fixed` à l'intérieur
   d'une boîte de défilement se fige — le bug est déjà revenu deux fois.
6. **L'accueil s'affiche avant tout contrôle réseau** : une borne coupée garde
   sa valeur publicitaire en vitrine.

## 🔴 Sécurité — le trou existe DÉJÀ, il ne vient pas de la borne

**Toutes les tables du projet ont RLS désactivée et zéro policy**, et la clé anon
est dans le bundle client.

🔴 **CORRECTION DU 21/10/2026.** Ce fichier disait « sur l'app de gestion ça
passe, sur une borne en libre-service non ». **C'est trompeur :** la **même** clé
anon est en dur dans `vitejs-vite-4btbmycn (1)/src/App.tsx` ligne 7, donc déjà
livrée dans le bundle de **`project-ynxry.vercel.app`, un site public sans mot de
passe**. N'importe qui sur Internet peut déjà lire et écrire `ventes`,
`finances_charges`, `finances_dettes`. La borne n'aggrave pas l'exposition, elle
la rend visible. Le chantier est donc nécessaire **indépendamment du projet
borne**.

⚠️ **Et il ne se règle PAS en activant RLS table par table** : l'app de gestion
lit tout avec cette clé anon, donc activer RLS sur `ventes` la casserait le jour
même. Il faut d'abord décider comment la gestion s'authentifie. Rien de tout ça
n'est bloquant pour tester sur la borne de secours.

À faire côté borne, le jour où on tranche : des policies qui n'ouvrent que
lire le catalogue et appeler `borne_creer_commande`, rien d'autre.

🔴 **Les identifiants EasyOrder sont dans `integrations_comptes` (RLS activée,
aucune policy). Ne jamais les écrire dans le dépôt.** Même règle pour le secret
du webhook.

## Questions ouvertes

1. 🔴 **Comment la cuisine voit-elle la commande aujourd'hui ?** Posé le 03/10,
   **toujours sans réponse**. J'ai construit un écran cuisine en supposant un
   écran ; si c'est un ticket imprimé, c'est une imprimante qu'il faut brancher.
2. **Le coût d'EasyOrder — une piste forte est apparue le 04/10/2026.**
   En cherchant les justificatifs 2025 pour Skytax, **`POWER ONLINE` (Liège)
   ressort à 681,50 €/mois fixe**, 6 304 € sur 2025, soit **~8 178 €/an** : pas
   des achats, un montant constant sans communication bancaire — une
   domiciliation ou un leasing. **Hypothèse : le leasing des bornes et/ou
   l'abonnement EasyOrder**, précisément le « inclus dans autre chose » du
   gérant. Si c'est confirmé, le projet a enfin une justification financière
   chiffrée, et bien au-delà des 121 €/mois que j'avais supposés à tort sur la
   ligne « Machine caisse ».
   🔴 **Ne pas conclure avant confirmation du gérant** : c'est déduit du rythme
   des paiements, pas lu sur une facture. Aucune trace de Power Online dans la
   boîte mail (corbeille et spam compris) → facture papier ou portail client.
   **C'est la question à lui poser en premier.**
   ⚠️ À mettre en face : la hausse des menus à 10,50 € vaut **525 €/mois pour
   zéro travail** et attend toujours une réponse.
3. **Les noms de produits ne concordent pas partout** :
   `CORNDOG SAUCISSE/MOZZA` côté ligne contre `CORNDOG SAUCISSE/MOZA` côté
   option. À réconcilier avec `menu_produits` avant la mise en service.
4. **`commandes_live.compte` est NULL sur toutes les lignes**, alors que la doc
   dit que le segment de compte y est stocké. Sans conséquence tant qu'un seul
   compte tourne, mais à corriger.
5. **Sauces en double** : `MAYONNAISE` (102) et `MAYO` (79) sont la même sauce ;
   `AIGRE DOUCE / SWEET CHILI` (108) et `AIGRE DOUCE` (33) aussi. **Fusionnées
   dans le nouveau catalogue — le gérant doit confirmer.**
6. **Menu Goodeal XL n'a pas le groupe `SUPPLEMENTS`** alors que le Goodeal
   normal l'a. Ressemble à un oubli.
7. ✅ **Bubble Dog XL n'a pas `OPTION FRITES` — c'est VOLONTAIRE**, le bubble tea
   porte la valeur perçue. Ne pas « corriger ».
8. **Gyoza x4 (4,30 €)** existe dans `menu_produits` mais est **absent** du
   catalogue borne. Volontaire ou oubli ?
9. Les **16 prix de `borne_produits`** n'ont pas été confirmés par le gérant.

## Ce qui reste à faire

- Déployer sur un **projet Vercel à part**, puis installer sur la borne de
  secours (Capacitor, ou un shell natif qui charge l'URL distante).
- Les policies RLS (voir Sécurité).
- Trancher les questions ouvertes ci-dessus avec le gérant.

## Conventions

- **Répondre en français.** Messages courts.
- Branche de développement : `claude/project-status-5xiop2`.
- Les modifications de données passent par `apply_migration`, idempotentes.
- Avant toute suppression en base, vérifier les dépendances (FK **et**
  références par texte dans `ventes_produits`, `top_produits`,
  `produits_marges`, qui ne sont pas liées par FK).
