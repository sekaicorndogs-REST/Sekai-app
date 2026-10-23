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
| `borne_produits` | 16 produits avec leur prix, leur catégorie et leur `description` |
| `borne_creer_commande(p jsonb)` | **Le cœur.** Écrit l'en-tête, les lignes, les options et le miroir `ventes` dans UNE transaction, et attribue le numéro sous `pg_advisory_xact_lock` |

**Dans `borne/`** :

| Fichier | Rôle |
|---|---|
| `src/api.ts` | Lecture du catalogue, appel du RPC, écran cuisine |
| `src/App.tsx` | La borne client : accueil → mode → carte → options → panier → numéro |
| `src/Cuisine.tsx` | L'écran cuisine |
| `src/styles.css` | Écran tactile, rien de cliquable sous 64 px |
| `public/photos/` | **Toutes les images du projet, sans exception** : l'affiche, le logo, les photos produit. Rien ne traîne à côté |

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

## 🎨 LA CHARTE — officielle depuis le 22/10/2026

Le gérant a fourni la **charte Moupress**, archivée dans
`photos-recues/charte-branding-guideline.pdf`. **Elle remplace les couleurs
relevées à l'œil sur l'affiche.** Devant un doute sur une couleur, une police
ou le fond, ouvrir ce PDF — plus l'affiche.

| | |
|---|---|
| `#ff0000` | le rouge |
| `#ffc069` | l'or |
| `#650000` | le bordeaux |
| `#ffebdb` | le crème |

**Polices : Keepsmile** (titres) et **Comfortaa** (texte).

### 🔴 Keepsmile n'est PAS dans le dépôt, et c'est volontaire

**Elle n'est pas libre pour un usage commercial** (Almarkhatype, licence à
acheter), et une borne de commande en restaurant en est un. **Fredoka** la
remplace — même famille de formes, capitales arrondies et grasses — sous
licence SIL OFL. Comfortaa, elle, est bien celle de la charte (SIL OFL aussi).

Le jour où le gérant achète la licence : poser le woff2 dans `public/fonts/`,
ajouter son `@font-face` et changer **la seule ligne `--titre`** de
`styles.css`.

⚠️ **Les polices sont AUTO-HÉBERGÉES**, plus chargées depuis Google Fonts : une
borne qui perd le wifi du magasin doit garder son texte. Ce sont des polices
**variables**, donc un seul woff2 par famille couvre toutes les graisses —
53 Ko pour les deux.
⚠️ **Et les titres se posent en 600, pas en 400.** Anton n'avait qu'une graisse,
donc tout le fichier portait `font-weight: 400` ; sur une variable, 400 est
maigre et les titres sortaient sans présence.

### Le motif de fond

Les quinze formes de la section PATTERNS de la charte, recomposées en une tuile
qui **se répète sans couture** (chaque forme est collée aux neuf translations de
la tuile, donc ce qui sort à droite revient à gauche). Deux fichiers :
`photos/motif-rouge.webp` pour le fond crème, `photos/motif-blanc.webp` pour les
aplats rouges. 15 Ko chacun, WebP sans perte.

🔴 **Il est volontairement très discret** (9 % et 12 % d'opacité). C'est un fond
de borne, pas un emballage : le client lit des prix dessus. Le monter le rendrait
joli en capture et illisible en service.

⚠️ Les chemins sont **absolus** (`/photos/…`) : le CSS est servi depuis
`/assets/`, donc un chemin relatif chercherait `/assets/photos/…`.
⚠️ Et le raccourci `background:` **efface** un `background-image` posé plus haut :
les aplats rouges utilisent `background-color:`. C'est le piège qui a fait
disparaître le motif du premier coup.

### 🔴 Contraste — recalculé sur la charte, ne pas intervertir

Sur crème : **bordeaux 11,69** ✅ (tout le texte courant) · doux 4,85 ✅ ·
**rouge 3,46** ❌ (grands titres et prix seulement) · **or 1,40** ❌ (invisible,
jamais sur crème — uniquement sur bordeaux).

Sur rouge : **blanc 4,00** ⚠️ sous 4,5, donc **tout texte sur aplat rouge doit
être grand et gras (≥ 19 px / 700)** ; crème 3,46 ❌, ne jamais l'utiliser pour
du texte.

Sur bordeaux : blanc 13,52 ✅ · **or 8,37** ✅ — c'est le couple des pastilles de
prix payantes.

⚠️ Le motif éclaircit localement les aplats rouges à `#ff1f1f`, ce qui fait
tomber le blanc de 4,00 à 3,84. La règle « grand et gras sur rouge » couvre déjà
ce cas.

## 📸 Les visuels — deux dossiers, un seul chemin

| Dossier | Rôle |
|---|---|
| **`borne/photos-recues/`** | **Les originaux TELS QUE LE GÉRANT LES ENVOIE**, suffixés `-original`. On n'y touche jamais : c'est la source si un recadrage est à refaire |
| **`borne/public/photos/`** | **Les fichiers servis à l'écran**, détourés et recadrés. C'est la SEULE place des images de l'app — rien à côté |

**La chaîne, à refaire à l'identique quand de nouvelles photos arrivent :**

1. Copier l'original dans `photos-recues/` sous `<nom>-original.<ext>`.
2. Retirer les bandes noires s'il s'agit d'une capture de téléphone.
3. **Détourer** : `ImageDraw.floodfill` depuis les BORDS seulement (implémenté
   en C, donc rapide) — les blancs intérieurs des logos sont préservés.
4. Pour un visuel de menu, **GARDER le titre** : il tient lieu de nom sur la carte, qui n'affiche plus de libellé dessous. ⚠️ Le mot « MENU » est en lettres **blanches sur fond blanc**, tenues par un simple contour — un remplissage trop gourmand passe au travers et les mange. Seuil serré, puis vérifier en capture. Supprimer ensuite les fragments isolés (restes du trait de pinceau).
   est déjà écrit sous la carte, l'y laisser le doublerait et rapetisserait le
   plat. Puis supprimer les fragments isolés (restes du trait de pinceau).
5. Enregistrer en **PNG transparent** dans `public/photos/`, puis ajouter la
   ligne dans `PHOTOS` (produits) ou `PHOTOS_OPTIONS` (options) de `App.tsx`.
   ⚠️ La valeur porte le **nom de fichier complet, extension comprise**.

### État au 22/10/2026

| | |
|---|---|
| **Logo détouré** | ✅ repris de l'app de gestion, `public/photos/logo-sekai.webp`, 630×640, transparent |
| **Affiche** | ✅ `public/photos/affiche.jpg`, 1400×1979 |
| **Les 4 menus** | ✅ **envoyés par le gérant**, détourés sur leur plateau, **avec leur titre**. 🔴 Leur carte n'a **pas de libellé sous la photo** : le nom est écrit dans le visuel, il ne doit apparaître qu'une fois (gérant, 22/10/2026). La pastille de prix y est **plus petite** que sur les autres cartes, pour ne pas disputer la place au titre. Le nom reste dans l'`aria-label` du bouton — **si un visuel arrive un jour sans son titre, la carte devient muette : remettre le libellé** |
| **Softs** | ✅ **les 7** : Pepsi, Pepsi Max, SPA (eau), Oasis Cassis, Oasis Tropical, Ice Tea Pêche, Ice Tea Pétillant. Le groupe **`CHOIX DU SOFT` d'un menu est donc illustré**. ⚠️ `CHOIX DU SOFT SUPP` attend encore **Oasis Fraise** |
| **Panures** | ✅ **les 6**, visuels professionnels sur fond blanc fournis par le gérant le 22/10/2026, détourés. ⚠️ **La rouge et la bleue arrivaient sur UNE SEULE image** : coupée en deux. Les groupes `CHOIX DE LA PANURE` et `SUPPLEMENT PANURE` sont donc illustrés |
| **Sides** | ✅ frites, karaage, tempura, détourés. Servent **à deux endroits** : les produits de la carte ET le groupe `SIDE` des options. ⚠️ Le groupe `SIDE 2` des menus XL nomme les mêmes produits « … 3pcs » : deux libellés, une seule photo |
| **Sauces** | ✅ **les 9**, donc `CHOIX DE LA SAUCE` est illustré. Le gérant a photographié **le SAMOURAÏ** dans son ramequin, vu de dessus sur fond blanc ; les huit autres sont **ce même pot recoloré**. En `.webp`, ~24 Ko pièce au lieu de ~330 Ko en PNG |
| **Corndogs seuls** | ✅ **les 3 bases sur bâtonnet**, envoyées par le gérant le 22/10/2026. Elles remplacent des découpes d'affiche qui portaient du texte, une main, et ne distinguaient PAS les trois produits. Servent **à deux endroits** : la carte ET le groupe `CHOIX DE LA BASE` des menus. ⚠️ Ce sont les bases **NUES, avant panure** — cohérent avec le parcours (garniture puis panure) mais ce n'est pas le produit fini, à confirmer |
| **Bubble teas** | ✅ les gobelets photoréalistes, les mêmes que les sirops du menu. Ils remplacent **une** découpe d'affiche partagée par les deux parfums, donc incapable de les distinguer |
| **Signatures** | ✅ **les 4**, envoyées sur UNE seule image le 22/10/2026 et découpées par composantes connexes. 🔴 **L'association photo → signature n'est pas une supposition** : elle vient de `menu_recettes`, qui donne la panure de chacune (Saitama panko simple · Ace spicy Doritos · Sekai bleu · Suisse patate), puis chaque panure a été recoupée avec sa propre photo du groupe `CHOIX DE LA PANURE` — les quatre concordent. ⚠️ À faire confirmer au comptoir quand même |
| **Oignons frits** | ✅ visuel du gérant (22/10/2026), pot transparent et morceaux qui tombent. Seul choix payant de `SUPPLEMENTS` : **le groupe est donc illustré**. ⚠️ Format vertical (440×648), donc la vignette est plus étroite que les sides voisins — **ne pas la recadrer**, le nuage de morceaux occupe toute la largeur et toute coupe trancherait en plein milieu d'un morceau |

### 🎨 Décliner une couleur depuis une seule photo — la méthode du 22/10/2026

Faite pour les sauces, réutilisable pour tout groupe où les choix ne diffèrent
que par la teinte. **Une photo réelle suffit pour tout le groupe** : on garde sa
texture, ses reflets et son cadrage, on ne change que la couleur. Les pastilles
se ressemblent, et **c'est le but** — même pot, même lumière, donc le client
compare des couleurs et rien d'autre.

Le script est dans le scratchpad (`sauces/recolore.py`), la recette ici :

1. Travailler en **HSV**, pas en RGB : `H ← teinte cible`, `S` et `V` recalés
   sur la médiane du cœur. La texture vit dans `V`, elle survit intacte.
2. Garder une part de l'écart de teinte (`eclats`) pour que les éclats d'herbe
   et de piment restent visibles. À 0 pour le ketchup, le BBQ, la mayo et la
   sriracha, qui sont **lisses** (gérant, 22/10/2026 : *« rends-les lisses par
   exemple ketchup mayo bbq »*, et *« andalouse c'est parfait »* — l'andalouse,
   les deux mayos et le Samouraï gardent donc leurs éclats).
   🔴 **Un `MedianFilter(9)` ne suffit PAS** : les éclats d'herbe font 15 à
   20 px sur cette photo, ils passent au travers et le ketchup reste grumeleux.
   Réduire l'image d'un facteur 3 avant le médian — rayon bien plus large, et
   assez rapide. Le médian efface le grain mais **garde les grands plis et les
   reflets** : une sauce parfaitement plate serait fausse.
3. 🔴 **Le masque ne s'arrête PAS au bord de la sauce.** De r=0,80 à r=0,92 la
   paroi du ramequin renvoie un **reflet** de la sauce. Masque coupé trop tôt,
   ce reflet reste orange et chaque sauce porte un liseré Samouraï.
4. 🔴 **Au cœur, ignorer la saturation.** Les reflets brillants y sont peu
   saturés : un masque conditionné à `S` les laisse jaunes, en fin liseré doré
   sur le ketchup et le BBQ. Poids = 1 sous r=0,78, quoi qu'il arrive.
5. **Exporter en WebP** (q=86) dès qu'un groupe compte plus de trois visuels :
   9 PNG faisaient 3 Mo, les 9 WebP font 210 Ko. `PHOTOS_OPTIONS` portant
   l'extension complète, aucun code ne change.

6. 🔴 **Une sauce TRANSLUCIDE se reconstruit, elle ne se recolore pas.**
   L'aigre douce (*« c'est un peu transparent »*) est le seul cas à part des
   neuf. Baisser l'opacité la rendrait délavée sur le fond crème, pas
   transparente ; et la recolorer ne suffit pas, parce que les plis crémeux du
   Samouraï disent « sauce épaisse » quelle que soit la couleur. Il faut les
   quatre : surface presque plane (le `V` passé au flou gaussien, 45 %
   d'amplitude), **absorption** (le creux plus saturé et plus rouge, la crête
   plus claire — c'est ce gradient qui dit « on voit à travers »), reflets
   spéculaires réinjectés et désaturés, flocons de piment repris sur la photo
   d'origine *après* le lissage.
   ⚠️ Ça reste une imitation : **une photo de la vraie aigre douce ferait mieux
   que tout ce bloc.** C'est la seule des neuf dont on fabrique la matière.

⚠️ **Les teintes sont approchées, pas mesurées.** Le gérant n'a tranché que la
Sekai (« une spicy mayo un peu plus foncée ») et validé l'andalouse. À lui faire
valider le reste au comptoir.

🔴 **Le Samouraï reste la PHOTO BRUTE**, jamais sa version recolorée : c'est la
seule des neuf dont on a le vrai cliché, et elle sert de témoin aux huit autres.
Le script la restaure après la boucle — ne pas supprimer cette ligne.

✅ **Au 22/10/2026 TOUT est illustré** : les treize groupes d'options et les
vingt-trois produits, softs compris. Plus aucun trou côté visuels.

### 🧾 Le ticket de cuisine — `src/ticket.ts`

Format relevé **au caractère près** sur le ticket EasyOrder #029 du 22/10/2026,
et reproduit tel quel : la cuisine lit ces tickets depuis des mois, changer leur
mise en page lui coûterait plus que ça ne lui rapporterait. 32 colonnes, soit du
papier 58 mm.

`ticketTexte()` donne le texte (aperçu, tests) ; **`ticketEscPos()` donne les
octets** que l'imprimante attend vraiment — init, table de caractères, gras et
double taille pour le numéro, coupe du papier. Vérifié : 320 octets pour un
ticket d'une ligne, entête `1b 40 1b 74 13…`, fin `1d 56 42 00`.

🔴 **L'imprimante est en RÉSEAU** (gérant, 22/10/2026). Elle a donc une IP sur
le réseau du magasin, et c'est là que se trouve le vrai obstacle :

**Une page web servie en HTTPS ne peut PAS atteindre une imprimante locale.**
Deux raisons, l'une et l'autre bloquantes :
1. **Pas de socket TCP en JavaScript de navigateur.** Le port 9100 (RAW /
   JetDirect), qui est la voie normale d'une imprimante réseau, est hors
   d'atteinte d'une page web.
2. **Mixed content.** Même si l'imprimante parlait HTTP (c'est le cas des Epson
   avec ePOS-Print), une page servie en `https://` sur Vercel ne peut pas
   appeler `http://192.168.x.x` : le navigateur refuse.

➡️ **La voie à prendre est donc l'app native Capacitor**, qui était déjà la
cible du projet : elle ouvre la socket TCP vers l'IP locale sans contrainte de
mixed content. Le port 9100 en RAW convient à la quasi-totalité des imprimantes
thermiques réseau.

⚠️ **Ce qui manque pour écrire l'envoi : la MARQUE et le MODÈLE.** C'est ce qui
décide entre 9100 RAW et une API maison (Epson ePOS, Star WebPRNT), et c'est ce
qui dit si la table de caractères CP858 est la bonne. Ne pas écrire l'envoi à
l'aveugle : une imprimante qui reçoit une commande qu'elle ne comprend pas peut
cracher des mètres de papier.

⚠️ **Les accents** : le ticket actuel n'en contient aucun (noms en capitales,
mentions sans accent — c'est aussi le cas du ticket EasyOrder, qui imprime
« Imprime »). `ticketEscPos()` sélectionne CP858 et garde une option
`sansAccents` : si le premier vrai ticket sort avec des caractères bizarres,
c'est le premier levier à tirer.

🔴 **LES NON-CHOIX SONT IMPRIMÉS**, contrairement au panier et à l'écran
cuisine qui masquent « PAS DE SUPPLEMENT ». C'est délibéré : sur le ticket, une
ligne absente peut vouloir dire « on a oublié de demander », une ligne « PAS DE
SUPPLEMENT » veut dire « la question a été posée, la réponse est non ». Ne pas
« nettoyer » le ticket sans l'avoir demandé au gérant.

🔴 **L'heure du ticket est celle de BRUXELLES**, pas l'UTC du serveur : c'est
l'heure que la cuisine compare à sa pendule.

⚠️ La mention « Ceci n'est pas un ticket TVA » est **conservée**. Le gérant l'a
posé le 18/09/2026 : la borne n'entre pas dans la comptabilité, seules les
factures partent au comptable. Le ticket ne doit jamais passer pour un
justificatif.

### 🌍 Les quatre langues (22/10/2026)

**Français · English · Nederlands · Español**, reprises de la borne EasyOrder.
Elles **remplacent le bouton « COMMANDER ICI »** sur l'accueil : choisir sa
langue EST l'entrée dans la commande, un second écran pour redire « commander »
serait un tap de plus pour rien. Chaque bouton porte le nom de sa langue **dans
cette langue** — « Nederlands » se reconnaît sans savoir le français.

🔴 **Un bouton de langue doit tenir sa promesse.** Afficher « English » puis
servir un écran en français est pire que ne pas proposer le choix : le client
croit s'être trompé. Donc **tout** est traduit.

| Où | Comment |
|---|---|
| Textes de l'app | `src/i18n.ts`, un dictionnaire par langue |
| Noms de groupes d'options | `borne_groupes.nom_en` / `nom_nl` / `nom_es` |
| Non-choix (« Pas de supplément ») | `borne_options.nom_en` / `nom_nl` / `nom_es` |
| Compositions de produits | `borne_produits.description_en` / `_nl` / `_es` |

**Les noms d'options SONT traduits** depuis le 22/10/2026 — panures, bases,
sauces, sides, perles, sirops, « eau » (gérant : *« pour les chapelures, les
bases, les sauces, tu peux tout traduire »*).

🔴 **CE QUI N'EST PAS TRADUIT, ET NE DOIT PAS L'ÊTRE** : les **noms de
produits** (« SAITAMA », « MENU GOODEAL »), les **catégories** (« Sides »,
« Bubble Tea »), et les **noms propres et marques** parmi les options —
`SEKAI` (le nom de la maison), `ANDALOUSE` et `SAMOURAI` (des sauces belges
qui n'ont pas d'autre nom), `KETCHUP`, `BBQ`, `SRIRACHA`, et les marques de
softs. Les traduire inventerait des mots que personne ne reconnaît.

🔴 **ET LA CUISINE LIT TOUJOURS LE FRANÇAIS.** `Choix.groupe` et `Choix.choix`
portent le nom français, c'est lui qui part en base et ressort sur le ticket ;
`Choix.libelles` ne sert qu'à l'affichage du panier et **n'est jamais envoyé**
(`Envoi` ne remonte que `groupe`, `choix`, `prix`). Sans cette séparation, un
client espagnol ferait sortir un ticket de cuisine en espagnol.

⚠️ `champ(objet, "nom", langue)` **retombe silencieusement sur le français**
quand la colonne traduite est vide. C'est voulu : une description ajoutée sans
ses traductions s'affiche en français au lieu de disparaître. C'est aussi ce
qui fait qu'un seul appel couvre les non-choix (traduits) et les vrais noms
d'options (non traduits).

⚠️ `inclus` et `compris` sont **deux clés**, pas une. En français les deux se
disent « Compris » — l'option comprise dans le prix, et le bouton « j'ai
compris » de l'écran d'erreur. Dans les trois autres langues ce sont deux mots
différents : les fusionner produirait un contresens.

🔴 **La langue retombe sur le français à chaque retour à l'accueil.** Le client
suivant ne doit pas hériter de l'espagnol du précédent.

⚠️ Les traductions sont les miennes, pas celles d'un traducteur. Elles sont
simples et courtes, mais **à faire relire** — surtout le néerlandais.

### 🎯 « Ça ne fait pas très pro » — la refonte du 23/10/2026

Reproche du gérant, et il avait raison. Documenté pour ne pas refaire les
mêmes erreurs : trois causes, toutes visuelles, aucune fonctionnelle.

| Ce qui clochait | Ce que font les bornes de chaîne |
|---|---|
| Photo de **90 px** dans une carte de 190 | de **grandes images** : sur une borne, c'est la photo qui vend |
| Motif de fond **derrière les produits** | un **aplat neutre** : un fond chargé fait reculer les photos |
| Cartes de **hauteurs inégales**, sans ombre | une **grille régulière**, des cartes détachées du fond |

**Ce qui a changé :**

1. 🔴 **Deux colonnes, plus trois.** La borne EasyOrder en a trois et c'était
   ce qui avait été repris ; mais sur 800 px, moins la colonne de catégories,
   trois colonnes laissent 190 px par produit. Deux colonnes doublent la photo.
   **Ne pas revenir à trois sans visuels cadrés serré.**
2. 🔴 **Le motif de fond quitte les écrans de commande.** Il reste sur
   l'accueil (écran d'attente, vu de la rue) et sur l'écran du numéro, qui ne
   portent aucune photo de produit.
3. **Photo 232 px** (300 pour les menus), **nom 24 px**, **prix 27 px**.
4. **Ombre douce** sur les cartes. Sans elle, la carte et la page étant deux
   crèmes voisins, tout paraissait plat — le défaut qui faisait le plus
   « maquette ».
5. **Grille régulière** (`align-items: stretch`) et **description limitée à
   trois lignes**. Au-delà, un produit bavard repoussait ses voisins hors de
   l'écran.

**Repères retenus de la documentation** (sources en majorité éditeurs, à
prendre comme pratique courante, pas comme étude) : corps de texte 20–24 px,
titres 48 pt et plus, cibles tactiles d'environ 20 mm sur borne — plus que les
44 px du web —, 5 à 7 catégories, éléments interactifs plutôt dans le tiers
médian, et l'action principale qui ressort nettement des secondaires.

⚠️ **Ce qui reste perfectible, et qui ne se règle pas en CSS** : les trois
visuels de **bases** sont des bâtonnets verticaux, qui laissent du vide de
chaque côté dans une carte large. Les **signatures**, photographiées en
diagonale, remplissent beaucoup mieux. Si l'occasion se présente, refaire les
trois bases en diagonale.

### 🖥️ La mise en page de la carte — calquée sur la borne EasyOrder

Demandée par le gérant le 22/10/2026, sur photo de sa borne actuelle :

| | |
|---|---|
| **Colonne de catégories** | chacune porte une **vignette** au-dessus de son nom (`PHOTOS_CATEGORIES` dans `App.tsx`). Une image se reconnaît plus vite qu'un mot, et la colonne est ce que le client regarde en premier |
| **Trois colonnes** de produits | ~180 px par fiche. **Ne pas descendre sous 170** : en dessous, les noms longs cassent en quatre lignes |
| **Fiche produit** | image, nom, prix, composition — **centrés**, et **plus de pastille de prix posée sur la photo** |

⚠️ **La clé de `PHOTOS_CATEGORIES` est le nom AFFICHÉ**, donc celui d'après
`groupeCarte()` : « Menus », pas « Menus XL ». Sans vignette, la catégorie
retombe sur son libellé seul, sans rien casser.

⚠️ **La vignette de la catégorie active garde un fond CLAIR.** Posée directement
sur le rouge, un visuel détouré rouge-orangé — les corndogs — disparaissait.

🔴 **Deux choses de la borne EasyOrder n'ont PAS été reprises, exprès :**
1. Ses produits sont posés **à nu sur du blanc**, sans carte. La nôtre garde un
   fond et une bordure : c'est une cible tactile, elle doit se voir comme telle.
2. Ses vignettes ont un **fond orange dégradé**, qui est son thème à elle. Le
   nôtre reste le crème de la charte.

🔴 **Et la colonne de catégories reste VERTICALE et entière à l'écran** — voir
la règle plus bas, c'est le défaut documenté des bornes McDonald's.

### Softs et Bubble Tea, deux catégories (22/10/2026)

Demande du gérant, comme sur la borne EasyOrder. Les sept softs sont désormais
**vendus seuls** dans `borne_produits`, catégorie `Softs`, à **2,00 €** ; les
bubble teas gardent la leur, à 5,00 €.

🔴 **La liste et les prix viennent de `commandes_live_lignes`**, donc des
vraies ventes — même méthode que pour les signatures : chercher en base plutôt
que deviner.

#### 🔴 Sauf une fois, et c'est la leçon à retenir

Les lignes de vente portent **COCA** (5 fois, jusqu'au 21/10/2026). J'en avais
créé un produit, puis conclu que la carte et les options de menu ne proposaient
pas les mêmes softs — Coca d'un côté, Pepsi Max de l'autre.

**C'était faux.** Le gérant a tranché le jour même : *« y a pas de coca, mets le
pepsi max »*. Le bouton de la borne EasyOrder garde un **libellé périmé**, et
les lignes de vente en héritent.

⚠️ **Un libellé dans `commandes_live_lignes` dit ce qu'AFFICHE la borne, pas
forcément ce qui est VENDU.** Devant un produit qui détonne, demander au gérant
avant d'en tirer une règle. C'est la même famille d'erreur que les noms de
produits réécrits rétroactivement par EasyOrder dans ses exports.

### 🆙 La montée en gamme (22/10/2026)

Demandée par le gérant : proposer le menu après un corndog seul, et le XL après
un menu. Table `borne_propositions`, logique dans `src/montee.ts`.

🔴 **LA DIFFÉRENCE EST CALCULÉE, JAMAIS ANNONCÉE EN DUR**, et c'est le cœur du
sujet. Un corndog à 6,50 € sur lequel le client a pris un tempura (4,90 €) et
un Pepsi (2,00 €) coûte **13,40 €** — le Menu Good Deal, qui comprend les deux,
coûte **10,00 €**. Il **économise 3,40 €**, et l'écran le lui dit. Écrire
« +3,50 € » dans ce cas serait faux ; le laisser payer sans rien dire serait
pire. Mesuré en capture dans les deux sens : +3,50 € sur un corndog nu,
−3,40 € sur un corndog chargé.

**Ce n'est pas un « mauvais défaut ».** La borne ne coche rien à la place du
client, le refus est un bouton de **même taille** et au même endroit que les
offres, et rien n'est présélectionné. On propose, on ne pousse pas — c'est la
limite posée depuis l'étude de mars 2026 sur les bornes McDonald's.

⚠️ **La montée RÉOUVRE la configuration de la cible**, elle n'ajoute pas
directement au panier : un menu demande un choix de soft que le corndog n'avait
pas, et le choisir à la place du client serait exactement le défaut qu'on
s'interdit. Les choix compatibles sont reportés **par identifiant de groupe**.

⚠️ **Pas de proposition sur une montée** (`depart` posé) : sans ce garde-fou,
passer en menu rouvrirait aussitôt une proposition de XL et le client
enchaînerait les écrans. Vérifié en capture.

⚠️ **`base_option_nom` existe à cause d'une anomalie de la carte** : le produit
s'appelle « CORNDOG MOZZA » (deux Z) et l'option du groupe CHOIX DE LA BASE
« CORNDOG MOZA » (un seul). Impossible de les rapprocher par le nom. Le jour où
l'anomalie est corrigée (question ouverte n° 3), la colonne peut disparaître.

🔴 **Les signatures n'ont volontairement PAS de proposition** : le groupe CHOIX
DE LA BASE ne contient que les trois corndogs. Un Saitama ne peut pas devenir
un menu, et le proposer ferait une impasse.

⚠️ **Deux titres, pas un** : « Vous voulez le menu ? » devant un corndog,
« Passer en XL ? » devant un menu. Le premier n'a aucun sens quand le client
tient déjà un menu.

⚠️ **Contraste** : quand la cible revient moins cher, l'offre passe en
**bordeaux avec le montant en or** (8,37). L'or sur le rouge ne vaut que 2,47 —
le montant y était illisible, constaté en capture.

**L'offre montre CE QU'ELLE AJOUTE** (`borne_propositions.visuels`) : un paquet
de frites et une canette pour le Good Deal, un bubble tea pour le Bubble Dogs,
les karaage et tempura pour les XL. Demande du gérant — « rends ça plus
attirant ».
🔴 Ce sont les visuels de la DIFFÉRENCE, pas le plateau entier du menu : le
client a déjà vu le menu sur la carte, ce qu'il n'a pas encore vu c'est ce
qu'il gagne.
⚠️ **Fond clair obligatoire derrière chaque vignette** : les visuels sont
détourés sur transparent et plusieurs sont rouges — le pot de frites
disparaîtrait purement et simplement sur l'aplat rouge de l'offre.

### Les descriptions de produit

`borne_produits.description` porte la phrase affichée sous le nom. **Elle ne
s'affiche que si elle existe** : les quatre signatures en ont une, parce que
leur nom ne dit rien de ce qu'elles contiennent, là où « CORNDOG MOZZA » se
suffit. Textes relevés sur la borne EasyOrder le 22/10/2026.

🔴 **Les noms commerciaux des panures ne sont PAS les noms internes.** La borne
dit au client « panure **Cheetos** épicée » (Ace) et « panure **Takis** épicée »
(Sekai), là où `menu_recettes` écrit *Spicy (Doritos)* et *Bleu*, et où le
catalogue borne écrit `SPICY` et `BLUE`. Ne pas « harmoniser » : ce sont deux
vocabulaires, l'un pour le client, l'autre pour la cuisine et les coûts.
💡 C'est aussi ce qui explique le corndog **bleu** de Sekai : les Takis Blue
Heat sont bleus.

⚠️ **Et Suisse contient des oignons frits d'office**, pas en supplément — à ne
pas confondre avec l'option payante à 0,50 € du groupe `SUPPLEMENTS`.

💡 **La méthode qui a servi aux signatures est réutilisable** : quand une photo
doit être attribuée à un produit et que le doute est possible, **chercher la
réponse en base plutôt que deviner**. `menu_recettes` donne la panure et la
garniture de chaque produit, et les photos de panures déjà en place servent de
témoin visuel. Deux sources indépendantes qui concordent valent mieux qu'une
intuition — une photo attribuée au mauvais produit fait commander autre chose
que ce qui est montré.

⚠️ **Plus aucune photo produit n'est découpée dans l'affiche.** Les huit
découpes (`saucisse.jpg`, `mozza.jpg`, `bubbledog.jpg`, `bubbletea.jpg`,
`frites.jpg`, `karaage.jpg`, `tempura.jpg`, `soft.jpg`) sont **supprimées du
dépôt** : elles portaient du texte, une main, des cadrages de travers, et
donnaient le même visuel à deux produits différents. `affiche.jpg` ne sert plus
qu'à l'écran d'accueil.

🔴 **Les six panures, ou aucune.** `groupeIllustre()` l'impose : un groupe à
moitié illustré mettrait en avant l'option payante au seul motif qu'on en a la
photo. Ne pas contourner la règle en stylant une pastille au cas par cas.
Les **non-choix** (« pas de boisson ») en sont exemptés, eux ne se
photographient pas.

⚠️ **Et REGARDER le résultat en captures**, pas seulement compiler : le script
de la session du 21/10 pilote Chromium en 800×1280 et intercepte les appels
Supabase ainsi que le RPC d'envoi, donc rien n'est écrit dans `ventes`. Deux
bugs n'avaient été trouvés que comme ça.

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

1. ✅ **RÉPONDU LE 22/10/2026 : la cuisine travaille sur un TICKET IMPRIMÉ.**
   Le gérant a envoyé la photo du ticket #029. C'était la question bloquante
   depuis le 03/10, et la réponse change la hiérarchie : **l'écran
   `Cuisine.tsx` n'est pas le premier, le ticket l'est.** L'écran garde son
   utilité (vue d'ensemble, rattrapage d'un ticket perdu ou d'une panne de
   papier), mais le service tient au papier.
   **Ce qui reste à savoir** : quelle imprimante, et comment elle est reliée —
   USB sur la borne, réseau, ou pilotée par EasyOrder. Tant qu'on l'ignore,
   l'impression ne peut pas être branchée.
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

## 🟢 EN LIGNE depuis le 22/10/2026

**https://sekai-app-seven.vercel.app** — projet Vercel `sekai-app`
(`prj_qQjT2Mryj8z9AXI1xBlz6ZLPvytF`), Root Directory `borne`, branche `main`.
L'écran cuisine est sur **`/#cuisine`**.

⚠️ **NE PAS CONFONDRE** : `project-ynxry` reste l'app de GESTION. Le projet
Vercel de la borne s'appelle `sekai-app`, ce qui prête à confusion avec le nom
du dépôt.

### 🔴 La protection Vercel doit être coupée avant la mise en service

Le projet est créé avec **Vercel Authentication activée**
(`ssoProtection.enabled`, `all_except_custom_domains`). Conséquence : l'URL
`.vercel.app` demande une connexion Vercel.

**Ça marche pour le gérant**, qui est connecté dans son navigateur. **Ça ne
marchera PAS sur la borne du magasin**, qui tombera sur un écran de login
Vercel au lieu de la carte.

➡️ **Settings → Deployment Protection → Vercel Authentication → Disabled.**
Ou brancher un vrai domaine : la protection épargne les domaines personnalisés.

⚠️ Je ne peux pas le vérifier moi-même : le proxy sortant de l'environnement
Claude refuse `*.vercel.app` (403 au tunnel CONNECT). Le constat vient de la
configuration lue par l'API, pas d'un test. **À confirmer depuis une fenêtre
de navigation privée.**

## 🚀 Comment le projet a été créé (22/10/2026)

🔴 **Je ne peux pas créer le projet Vercel moi-même.** La connexion Vercel de
mes outils n'a pas accès à l'équipe (`403 forbidden` sur
`sekaicorndogs-6747s-projects`), et le CLI n'est pas connecté — le proxy sortant
bloque la connexion. C'est donc au gérant de le faire, une fois.

**Les quatre étapes, sur vercel.com :**

1. **Add New → Project**, choisir le dépôt `sekai-app`.
2. 🔴 **Root Directory = `borne`.** C'est LE réglage à ne pas manquer : sans
   lui, Vercel construit l'app de gestion et ne trouve rien.
3. ✅ **Rien à changer côté branche** : `borne/` est sur `main` depuis le
   22/10/2026, à la demande du gérant. La branche de production reste `main`.
   ⚠️ **Seul `borne/` a été apporté**, volontairement. La branche de travail
   portait aussi des commits plus anciens, hérités d'avant la séparation par
   session — une modification de l'app de **gestion** (les remplaçants dans le
   récap du mois), des ajouts `.gitignore` pour la compta, et le `CLAUDE.md`
   racine. **Ces travaux ne sont toujours pas déployés** : les pousser en
   production reviendrait à déployer l'app de gestion à l'insu du gérant.
   À lui de décider, c'est signalé.
4. Déployer. Rien d'autre à régler : Vite est détecté tout seul, et aucune
   variable d'environnement n'est nécessaire — `api.ts` porte les valeurs
   Supabase par défaut.

⚠️ **Ne pas confondre avec `project-ynxry`**, qui est l'app de gestion. La
borne est un projet et une URL à part.

`.vercelignore` écarte `android/` (7,5 Mo) et `photos-recues/` (14 Mo) : ni
l'un ni l'autre ne sert au web.

### L'application Android

⚠️ **L'APK ne peut pas être construit ici** : pas de SDK Android dans
l'environnement. Il faut Android Studio sur une machine, puis
`npm run build && npx cap sync android`, et ouvrir `borne/android/`.

⚠️ **Et le Play Store n'est probablement PAS le bon canal.** Pour trois
tablettes que le gérant possède, l'APK installé directement suffit : pas de
compte développeur (25 $), pas de fiche à écrire, pas de revue Google, pas de
délai, et surtout **pas de mise à jour automatique qui tombe en plein
service**. Si une distribution gérée devient nécessaire, la **diffusion
interne** de la Play Console s'y prête mieux qu'une publication publique.
À trancher avec le gérant.

## Ce qui reste à faire

- Installer sur la borne de secours.
- Les policies RLS (voir Sécurité).
- Trancher les questions ouvertes ci-dessus avec le gérant.

## Conventions

- **Répondre en français.** Messages courts.
- 🔴 **Branche de développement : `claude/borne-5xiop2`** (depuis le 22/10/2026).
  Chaque session a désormais la sienne — avant, les cinq partageaient
  `claude/project-status-5xiop2`, qui appartient maintenant à la **session
  principale**. **Ne jamais y pousser depuis ici**, ni sur la branche d'une
  autre session.
- ⚠️ **Le `CLAUDE.md` DE LA RACINE appartient à la session principale.** Depuis
  cette session on n'écrit que dans `borne/CLAUDE.md`. S'il faut inscrire
  quelque chose de durable à la racine, le signaler au gérant — sinon deux
  versions du fichier divergent et la mémoire du projet se coupe en deux.
- Les modifications de données passent par `apply_migration`, idempotentes.
- Avant toute suppression en base, vérifier les dépendances (FK **et**
  références par texte dans `ventes_produits`, `top_produits`,
  `produits_marges`, qui ne sont pas liées par FK).
