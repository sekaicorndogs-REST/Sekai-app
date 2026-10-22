import React, { useEffect, useMemo, useState } from "react";
import { LANGUES, NOM_LANGUE, champ, traducteur, type Langue, type T } from "./i18n";
import {
  chargerCatalogue,
  envoyerCommande,
  type Catalogue,
  type Groupe,
  type Produit,
  type LigneEnvoi,
} from "./api";

declare const __BUILD_ID__: string;

const eur = (n: number) => n.toFixed(2).replace(".", ",") + " €";

// ✅ Depuis le 22/10/2026, PLUS AUCUNE photo produit n'est découpée dans
// l'affiche : le gérant a fourni de vrais visuels pour les douze. Les découpes
// portaient du texte, une main, des cadrages de travers, et surtout le même
// visuel pour deux produits différents — elles sont supprimées du dépôt.
// `affiche.jpg` ne sert plus qu'à l'écran d'accueil.
//
// Pour ajouter une photo : poser le fichier dans `public/photos/` et ajouter sa
// ligne ici, rien d'autre à toucher. ⚠️ La valeur porte le nom de fichier
// COMPLET, extension comprise — les formats sont mélangés (.png, .webp).
//
// ✅ Depuis le 22/10/2026 les SEIZE produits ont leur visuel. Une carte sans
// photo retombe sur un bandeau crème : c'est volontairement neutre, pour qu'un
// produit non photographié se voie tout de suite.
const PHOTOS: Record<string, string> = {
  // ✅ Les VRAIS visuels de menu, envoyés par le gérant le 22/10/2026 : le menu
  // complet sur son plateau, détouré sur fond transparent.
  //
  // 🔴 Ils gardent leur TITRE (« MENU GOOD DEAL » en gros au-dessus du
  // plateau). La première version le recadrait, parce que le nom était écrit
  // sous la carte ; le gérant a demandé l'inverse le 22/10/2026 — le titre
  // reste sur l'image et le libellé sous la carte disparaît. Le nom
  // n'apparaît qu'une fois, dans les deux cas.
  //
  // ⚠️ Le mot « MENU » est en lettres BLANCHES sur fond blanc, tenues par un
  // simple contour : au détourage, un remplissage trop gourmand passe au
  // travers et les mange. Seuil serré, et vérifier en capture.
  "MENU GOODEAL": "menu-gooddeal.webp",
  "MENU BUBBLE DOGS": "menu-bubbledog.webp",
  "MENU GOODEAL XL": "menu-gooddeal-xl.webp",
  "MENU BUBBLE DOGS XL": "menu-bubbledog-xl.webp",
  // ✅ Les trois bases sur bâtonnet, envoyées par le gérant le 22/10/2026.
  // Elles remplacent des découpes de l'affiche qui portaient du texte, une
  // main, et ne distinguaient PAS les trois produits — c'était le manque le
  // plus ancien du projet : les corndogs sont identiques vus de l'extérieur,
  // ils ne diffèrent que par l'intérieur.
  //
  // ⚠️ Ce sont les bases NUES, avant panure. C'est cohérent avec le parcours
  // de commande (on choisit la garniture, puis la panure à l'écran suivant),
  // mais ce n'est pas le produit fini. À confirmer avec le gérant.
  "CORNDOG SAUCISSE": "base-saucisse.webp",
  "CORNDOG MOZZA": "base-mozza.webp",
  "CORNDOG SAUCISSE/MOZZA": "base-saucisse-mozza.webp",
  // Les quatre signatures, envoyées sur UNE seule image le 22/10/2026 et
  // découpées par composantes connexes.
  //
  // 🔴 L'association photo → signature n'est PAS une supposition : elle vient
  // de `menu_recettes`, qui donne la panure de chacune — Saitama au panko
  // simple, Ace au spicy (Doritos), Sekai au bleu, Suisse à la patate. Chaque
  // panure a ensuite été recoupée avec sa propre photo du groupe
  // `CHOIX DE LA PANURE`, et les quatre concordent.
  // ⚠️ À faire confirmer quand même au comptoir : une photo attribuée au
  // mauvais produit fait commander autre chose que ce qui est montré.
  "SAITAMA": "signature-saitama.webp",
  "ACE": "signature-ace.webp",
  "SEKAI": "signature-sekai.webp",
  "SUISSE": "signature-suisse.webp",
  "FRITES": "side-frites.png",
  "Poulet karaage": "side-karaage.png",
  "Tempura crevette": "side-tempura.png",
  // Les gobelets photoréalistes, les mêmes que les sirops du menu. Ils
  // remplacent une découpe d'affiche unique, partagée par les deux parfums et
  // donc incapable de les distinguer.
  "BUBBLE TEA PECHE": "bubble-peche.png",
  "BUBBLE TEA PASTEQUE": "bubble-pasteque.png",
  // Les softs vendus SEULS, catégorie à part depuis le 22/10/2026 (demande du
  // gérant, comme sur la borne EasyOrder). Mêmes visuels que le groupe
  // `CHOIX DU SOFT` des menus — c'est la même canette.
  //
  // ⚠️ La liste vient de `commandes_live_lignes`, donc des vraies ventes, SAUF
  // le Pepsi Max : les lignes y portent « COCA », mais le gérant a tranché
  // qu'il n'y a pas de Coca et que c'est du Pepsi Max qui est servi — le
  // bouton de la borne EasyOrder garde un libellé périmé. Un libellé de vente
  // dit ce qu'affiche la borne, pas forcément ce qui est vendu.
  "EAU": "soft-eau.png",
  "PEPSI MAX": "soft-pepsi-max.png",
  "PEPSI": "soft-pepsi.png",
  "OASIS CASSIS": "soft-oasis-cassis.png",
  "OASIS TROPICAL": "soft-oasis-tropical.png",
  "ICE TEA PECHE": "soft-ice-tea-peche.png",
  "ICE TEA PET": "soft-ice-tea-pet.png",
};

// ⚠️ La valeur porte le NOM DE FICHIER COMPLET, extension comprise : les
// photos n'arrivent pas toutes au même format (le gérant envoie du .jpg, du
// .png détouré, du .webp).
const photo = (nom: string): string | null =>
  PHOTOS[nom] ? `photos/${PHOTOS[nom]}` : null;

// Photos des CHOIX D'OPTIONS — panures, sauces, sides pris en option.
// Même principe que `PHOTOS` : déposer le fichier dans `public/photos/` et
// ajouter sa ligne ici, rien d'autre à toucher.
//
// Les softs sont détourés sur fond transparent, d'où le `.png` : ils se posent
// sur le crème sans rectangle blanc derrière.
//
// 🔴 Les PANURES n'y sont pas encore. Voir `groupeIllustre` juste en dessous :
// tant qu'un groupe n'est pas complet, il reste entièrement en texte.
// Le jour où les six panures arrivent, ajouter ici
//   "CEREALE CRUNCHY", "SIMPLE PANKO", "NOUILLE", "POTATOE", "BLUE", "SPICY"
// et le groupe s'illustre seul.
const PHOTOS_OPTIONS: Record<string, string> = {
  "PEPSI": "soft-pepsi.png",
  "PEPSI MAX": "soft-pepsi-max.png",
  "EAU": "soft-eau.png",
  "OASIS CASSIS": "soft-oasis-cassis.png",
  "OASIS TROPICAL": "soft-oasis-tropical.png",
  "ICE TEA PECHE": "soft-ice-tea-peche.png",
  // ⚠️ « ICE TEA PET » veut dire PÉTILLANT, pas bouteille PET : c'est le Lipton
  // Citron / Citron Vert pétillant. Ce n'est donc PAS un doublon d'Ice Tea
  // Pêche — confirmé par le gérant le 22/10/2026. Ne pas fusionner les deux.
  "ICE TEA PET": "soft-ice-tea-pet.png",
  // Les six panures, envoyées par le gérant le 22/10/2026. ⚠️ La rouge et la
  // bleue arrivaient sur UNE SEULE image : elle a été coupée en deux.
  "CEREALE CRUNCHY": "panure-cereale.png",
  "SIMPLE PANKO": "panure-panko.png",
  "NOUILLE": "panure-nouille.png",
  "POTATOE": "panure-potatoe.png",
  "BLUE": "panure-blue.png",
  "SPICY": "panure-spicy.png",
  // Les sides, pris en option. ⚠️ Le groupe `SIDE 2` des menus XL nomme les
  // mêmes produits « … 3pcs » : deux libellés, une seule photo.
  "FRITES": "side-frites.png",
  "Poulet karaage": "side-karaage.png",
  "Tempura crevette": "side-tempura.png",
  "Poulet karaage 3pcs": "side-karaage.png",
  "Tempura crevette 3pcs": "side-tempura.png",
  // Les perles du bubble tea. Le gérant a fourni le dessin en blanc et en
  // orange et demandé une troisième couleur, le rouge.
  // ⚠️ L'ASSOCIATION COULEUR → PARFUM EST UNE SUPPOSITION : litchi blanc,
  // mangue orange, passion rouge. À faire confirmer par le gérant.
  "LITCHI": "perle-litchi.png",
  "MANGUE": "perle-mangue.png",
  "PASSION": "perle-passion.png",
  // Le sirop du menu Bubble Dogs. Visuels fournis par le gérant le 22/10/2026
  // — il a repris mon dessin et l'a refait en photoréaliste, bien mieux.
  // ⚠️ Il n'en a envoyé que DEUX : la pêche est l'orange glissé vers le rose,
  // en protégeant le rouge du logo, qui aurait viré avec la boisson.
  "MANGUE / MANGO": "bubble-mangue.png",
  "PECHE": "bubble-peche.png",
  "PASTHEQUE / WATERMELON": "bubble-pasteque.png",
  // Les neuf sauces. Le gérant a photographié le SAMOURAÏ dans son ramequin ;
  // les huit autres sont ce même pot recoloré, la texture et la lumière venant
  // de sa photo. C'est voulu qu'elles se ressemblent : même pot, même cadrage,
  // donc le client compare des couleurs et rien d'autre.
  // ⚠️ SEKAI est aussi le nom d'une signature à 7,50 € — aucun conflit, les
  // produits sont dans `PHOTOS`, pas ici.
  // 🟡 Les teintes sont approchées, pas mesurées : à faire valider au comptoir.
  // Le gérant a seulement tranché que la Sekai est « une spicy mayo un peu plus
  // foncée », ce qui est respecté ici.
  // Le seul choix payant du groupe SUPPLEMENTS, donc le groupe entier
  // dependait de cette image. Visuel fourni par le gérant le 22/10/2026.
  "OIGNONS FRITS": "supplement-oignons-frits.webp",
  // Les bases des menus, groupe CHOIX DE LA BASE.
  // 🔴 Ce groupe écrit « MOZA » avec un seul Z, la carte « MOZZA » avec deux.
  // Les deux orthographes sont donc câblées : c'est l'anomalie n° 3 des
  // questions ouvertes de `borne/CLAUDE.md`, qui attend d'être tranchée en
  // base. Tant qu'elle ne l'est pas, retirer une de ces lignes éteint le
  // groupe entier.
  "CORNDOG SAUCISSE": "base-saucisse.webp",
  "CORNDOG SAUCISSE/MOZA": "base-saucisse-mozza.webp",
  "CORNDOG MOZA": "base-mozza.webp",
  "CORNDOG SAUCISSE/MOZZA": "base-saucisse-mozza.webp",
  "CORNDOG MOZZA": "base-mozza.webp",
  "SAMOURAI": "sauce-samourai.webp",
  "SEKAI": "sauce-sekai.webp",
  "SPICY MAYO": "sauce-spicy-mayo.webp",
  "ANDALOUSE": "sauce-andalouse.webp",
  "KETCHUP": "sauce-ketchup.webp",
  "BBQ": "sauce-bbq.webp",
  "AIGRE DOUCE / SWEET CHILI": "sauce-aigre-douce.webp",
  "MAYONNAISE": "sauce-mayonnaise.webp",
  "SRIRACHA": "sauce-sriracha.webp",
};

/**
 * La vignette d'une catégorie dans la colonne de gauche.
 *
 * Reprise de la borne EasyOrder, que le gérant a demandé de suivre le
 * 22/10/2026 : chaque catégorie y porte une image au-dessus de son nom. Une
 * image se reconnaît plus vite qu'un mot, et la colonne est ce que le client
 * regarde en premier.
 *
 * ⚠️ La clé est le nom AFFICHÉ de la catégorie, donc celui d'après
 * `groupeCarte()` — « Menus », pas « Menus XL ». Une catégorie sans vignette
 * retombe sur son libellé seul, sans rien casser.
 */
const PHOTOS_CATEGORIES: Record<string, string> = {
  Menus: "menu-gooddeal.webp",
  Corndogs: "base-saucisse-mozza.webp",
  Signatures: "signature-sekai.webp",
  Sides: "side-frites.png",
  "Bubble Tea": "bubble-peche.png",
  Softs: "soft-pepsi.png",
};

const photoCategorie = (nom: string): string | null =>
  PHOTOS_CATEGORIES[nom] ? `photos/${PHOTOS_CATEGORIES[nom]}` : null;

const photoOption = (nom: string): string | null =>
  PHOTOS_OPTIONS[nom] ? `photos/${PHOTOS_OPTIONS[nom]}` : null;

/**
 * Un NON-CHOIX ne se photographie pas : « pas de supplément » n'est pas un
 * produit. Il est donc exempté de la règle du groupe complet ci-dessous, et
 * s'affiche en pastille de texte au milieu des vignettes.
 *
 * ⚠️ À ne pas confondre avec le filtre du panier et de la cuisine, qui garde
 * `NO SAUCE` parce que la cuisine doit le lire. Ici il ne s'agit que de photos.
 */
const estNonChoix = (nom: string) =>
  /^(NO SIDE|NO SAUCE|PAS DE SUPPLEMENT|PAS DE BOISSON\b.*)$/i.test(nom);

/**
 * Un groupe s'illustre ENTIÈREMENT ou PAS DU TOUT.
 *
 * 🔴 C'est une règle d'honnêteté, pas une préférence esthétique. Dans le groupe
 * des panures, les deux seuls choix qu'on saurait illustrer aujourd'hui sont
 * la Cereale Crunchy (gratuite) et la Potatoe (payante, 1 €). Les afficher
 * seules mettrait en avant l'option qui rapporte au seul motif qu'on en a la
 * photo : c'est de la fausse hiérarchie, le défaut que l'étude de mars 2026
 * reproche aux bornes McDonald's. Les panures pèsent près de la moitié des
 * suppléments du magasin — raison de plus pour ne pas y toucher de travers.
 *
 * Le jour où les six photos arrivent, le groupe s'illumine tout seul.
 */
const groupeIllustre = (g: Groupe) => {
  const aPhotographier = g.options.filter((o) => !estNonChoix(o.nom));
  return (
    aPhotographier.length > 0 &&
    aPhotographier.every((o) => PHOTOS_OPTIONS[o.nom])
  );
};

// Les menus portent 41 % de la marge : leur carte est plus grande et leur nom
// en rouge, pour qu'ils ne se confondent pas avec une canette.
const estMenu = (p: Produit) => /menu/i.test(p.categorie);

/**
 * Regroupement d'AFFICHAGE de la carte : les quatre menus tiennent sur un seul
 * écran, au lieu d'être coupés entre « Menus » et « Menus XL ».
 *
 * Le client voit ainsi le normal et le XL côte à côte, avec leurs deux
 * pastilles de prix — c'est la comparaison qui fait le passage en XL, et les XL
 * pèsent déjà un quart des menus vendus.
 *
 * 🔴 CE REGROUPEMENT NE TOUCHE PAS `produit.categorie`. La catégorie part telle
 * quelle dans la ligne de commande (`commandes_live_lignes.categorie_nom`) :
 * c'est elle qui permet de suivre la part des XL dans les analyses. Ne jamais
 * « simplifier » en renommant la catégorie en base.
 */
const GROUPES_CARTE: Record<string, string> = { "Menus XL": "Menus" };
const groupeCarte = (categorie: string) => GROUPES_CARTE[categorie] ?? categorie;

// Un article du panier : le produit, ses choix d'options et sa quantité.
type Choix = { groupe: string; choix: string; prix: number };
type Article = { produit: Produit; options: Choix[]; quantite: number };

const prixArticle = (a: Article) =>
  (a.produit.prix + a.options.reduce((s, o) => s + o.prix, 0)) * a.quantite;

type Ecran =
  | { nom: "accueil" }
  | { nom: "mode" }
  | { nom: "carte" }
  | { nom: "config"; produit: Produit }
  | { nom: "panier" }
  | { nom: "envoi" }
  | { nom: "fini"; reference: string };

export default function App() {
  const [cat, setCat] = useState<Catalogue | null>(null);
  const [erreurCat, setErreurCat] = useState<string | null>(null);
  const [ecran, setEcran] = useState<Ecran>({ nom: "accueil" });
  const [mode, setMode] = useState<string>("takeaway");
  // 🔴 La langue est choisie à l'accueil et remise à « fr » à chaque retour à
  // zéro : le client suivant ne doit pas hériter de l'espagnol du précédent.
  const [langue, setLangue] = useState<Langue>("fr");
  const t = traducteur(langue);
  const [panier, setPanier] = useState<Article[]>([]);

  // Le catalogue est rechargé tant qu'il n'est pas là : une borne allumée avant
  // le routeur du magasin doit se remettre en marche seule, sans que personne
  // n'aille la redémarrer.
  useEffect(() => {
    let vivant = true;
    let obtenu = false;
    const essai = () =>
      chargerCatalogue().then(
        (c) => {
          if (!vivant) return;
          obtenu = true;
          setCat(c);
          setErreurCat(null);
        },
        (e) => vivant && setErreurCat(String(e.message || e))
      );
    essai();
    const t = setInterval(() => !obtenu && essai(), 15000);
    return () => {
      vivant = false;
      clearInterval(t);
    };
  }, []);

  const total = panier.reduce((s, a) => s + prixArticle(a), 0);
  const nbArticles = panier.reduce((s, a) => s + a.quantite, 0);

  // Retour à zéro : après un envoi, ou si le client abandonne. La borne doit
  // toujours revenir d'elle-même à l'accueil, sinon le client suivant arrive
  // sur le panier du précédent.
  function recommencer() {
    setPanier([]);
    setLangue("fr");
    setEcran({ nom: "accueil" });
  }

  // ── Accueil ───────────────────────────────────────────────────────────
  // 🔴 L'accueil s'affiche AVANT tout contrôle de réseau. Une borne coupée du
  // réseau continue de montrer l'affiche des menus en vitrine : elle garde sa
  // valeur publicitaire même quand elle ne prend plus de commandes.
  if (ecran.nom === "accueil")
    return (
      <div className="accueil">
        {/* Pas de logo ajouté ici : l'affiche porte DÉJÀ la mascotte en haut,
            et l'empiler deux fois donnait deux chats à dix centimètres d'écart.
            La mascotte revient sur l'écran du numéro, là où elle manquait. */}
        {/* L'affiche des menus sert d'écran d'attente : c'est elle que le
            passant voit de la rue, et elle porte déjà les prix. `contain` et
            non `cover` — une affiche dont on coupe un prix ne sert à rien. */}
        <img className="affiche" src="photos/affiche.jpg" alt="Nos menus" />
        <div className="appel">
          {cat ? (
            <>
              {/* 🔴 Les quatre langues REMPLACENT le bouton « Commander ici »
                  (gérant, 22/10/2026, sur photo de sa borne). Choisir sa langue
                  EST l'entrée dans la commande : un deuxième écran pour dire
                  « commander » après l'avoir déjà dit serait un tap de plus
                  pour rien.
                  Chaque bouton porte le nom de sa langue DANS cette langue :
                  « Nederlands » se reconnaît sans savoir le français. */}
              <div className="langues">
                {LANGUES.map((l) => (
                  <button
                    key={l}
                    className="btn langue"
                    lang={l}
                    onClick={() => {
                      setLangue(l);
                      setEcran({ nom: "mode" });
                    }}
                  >
                    {NOM_LANGUE[l]}
                  </button>
                ))}
              </div>
              {/* En français seul : avant le choix, on ne sait pas encore quelle
                  langue parle le client, et la mention revient traduite sur
                  l'écran du numéro. */}
              <div className="mention">Paiement au comptoir</div>
            </>
          ) : (
            <div className="indispo">
              {erreurCat ? "Commandez au comptoir" : "Chargement…"}
            </div>
          )}
        </div>
        <div className="build">{__BUILD_ID__}</div>
      </div>
    );

  if (!cat) {
    // On ne peut arriver ici qu'en ayant perdu le réseau en cours de commande.
    return (
      <div className="plein">
        <h1>{t("borneIndispo")}</h1>
        <p className="gris">{t("commandezComptoir")}</p>
        <button className="btn" onClick={recommencer}>
          {t("retour")}
        </button>
      </div>
    );
  }

  // ── Sur place ou à emporter ───────────────────────────────────────────
  if (ecran.nom === "mode")
    return (
      <div className="plein">
        <h1>{champ(cat.groupeCommande, "nom", langue) || t("modeTitre")}</h1>
        <div className="colonne">
          <button
            className="btn gros"
            onClick={() => {
              setMode("eatin");
              setEcran({ nom: "carte" });
            }}
          >
            {t("surPlace")}
          </button>
          <button
            className="btn gros"
            onClick={() => {
              setMode("takeaway");
              setEcran({ nom: "carte" });
            }}
          >
            {t("aEmporter")}
          </button>
        </div>
        <button className="lien" onClick={recommencer}>
          {t("annuler")}
        </button>
      </div>
    );

  // ── La carte ──────────────────────────────────────────────────────────
  if (ecran.nom === "carte")
    return (
      <Carte
        cat={cat}
        langue={langue}
        t={t}
        onProduit={(p) => setEcran({ nom: "config", produit: p })}
        nbArticles={nbArticles}
        total={total}
        onPanier={() => setEcran({ nom: "panier" })}
        onAnnuler={recommencer}
      />
    );

  // ── Configuration d'un produit ────────────────────────────────────────
  if (ecran.nom === "config")
    return (
      <Config
        produit={ecran.produit}
        groupes={cat.groupesParProduit[ecran.produit.nom] ?? []}
        langue={langue}
        t={t}
        onRetour={() => setEcran({ nom: "carte" })}
        onAjouter={(a) => {
          setPanier((p) => [...p, a]);
          setEcran({ nom: "carte" });
        }}
      />
    );

  // ── Panier ────────────────────────────────────────────────────────────
  if (ecran.nom === "panier")
    return (
      <div className="page">
        <header>
          <button className="lien" onClick={() => setEcran({ nom: "carte" })}>
            ‹ {t("ajouter")}
          </button>
          <h1>{t("votreCommande")}</h1>
        </header>
        <div className="liste">
          {panier.map((a, i) => (
            <div className="ligne" key={i}>
              <div>
                <div className="nom">
                  {a.quantite > 1 ? `${a.quantite} × ` : ""}
                  {a.produit.nom}
                </div>
                {a.options
                  // Les NON-choix ne se listent pas : « pas de supplément »
                  // n'est pas une ligne de commande. ⚠️ `NO SAUCE` en est un
                  // vrai, lui — la cuisine doit le voir. Même filtre dans
                  // `Cuisine.tsx` : garder les deux identiques.
                  .filter(
                    (o) =>
                      !/^(NO SIDE|PAS DE SUPPLEMENT|PAS DE BOISSON\b.*)$/i.test(o.choix)
                  )
                  .map((o, j) => (
                    <div className="opt" key={j}>
                      {o.choix}
                      {o.prix > 0 ? ` +${eur(o.prix)}` : ""}
                    </div>
                  ))}
              </div>
              <div className="droite">
                <div>{eur(prixArticle(a))}</div>
                <button
                  className="lien rouge"
                  onClick={() => setPanier((p) => p.filter((_, k) => k !== i))}
                >
                  {t("retirer")}
                </button>
              </div>
            </div>
          ))}
          {panier.length === 0 && <p className="gris">{t("panierVide")}</p>}
        </div>
        <footer>
          <div className="total">
            <span>{t("total")}</span>
            <strong>{eur(total)}</strong>
          </div>
          {/* 🔴 Aucun paiement sur la borne : 100 % des commandes EasyOrder
              sont en « cash / non payé », le client règle au comptoir. */}
          <p className="petit">{t("paiementComptoir")}</p>
          <button
            className="btn gros"
            disabled={panier.length === 0}
            onClick={() => setEcran({ nom: "envoi" })}
          >
            {t("envoyer")}
          </button>
          <button className="lien" onClick={recommencer}>
            {t("toutAnnuler")}
          </button>
        </footer>
      </div>
    );

  // ── Envoi puis numéro ─────────────────────────────────────────────────
  if (ecran.nom === "envoi")
    return (
      <Envoi
        mode={mode}
        panier={panier}
        t={t}
        onFini={(ref) => setEcran({ nom: "fini", reference: ref })}
        onEchec={() => setEcran({ nom: "panier" })}
      />
    );

  return (
    <Fini reference={ecran.reference} total={total} t={t} onFermer={recommencer} />
  );
}

// ── La carte, par catégorie ─────────────────────────────────────────────
function Carte({
  cat,
  langue,
  t,
  onProduit,
  nbArticles,
  total,
  onPanier,
  onAnnuler,
}: {
  cat: Catalogue;
  langue: Langue;
  t: T;
  onProduit: (p: Produit) => void;
  nbArticles: number;
  total: number;
  onPanier: () => void;
  onAnnuler: () => void;
}) {
  // Les onglets sont les catégories REGROUPÉES (voir `groupeCarte`), dans
  // l'ordre des produits : « Menus XL » se fond dans « Menus ».
  const onglets = useMemo(() => {
    const vus: string[] = [];
    for (const c of cat.categories) {
      const g = groupeCarte(c);
      if (!vus.includes(g)) vus.push(g);
    }
    return vus;
  }, [cat]);

  const [categorie, setCategorie] = useState(onglets[0] ?? "");
  const produits = useMemo(
    () => cat.produits.filter((p) => groupeCarte(p.categorie) === categorie),
    [cat, categorie]
  );

  return (
    <div className="page">
      <header>
        <img className="logo" src="photos/logo-sekai.webp" alt="Sekai Corndogs" />
        <h1>{t("notreCarte")}</h1>
        <button className="lien" onClick={onAnnuler}>
          {t("annuler")}
        </button>
      </header>
      {/* 🔴 Les catégories sont une COLONNE VERTICALE qui tient à l'écran.
          Ne pas revenir à des onglets qui défilent à l'horizontale : c'est le
          défaut documenté des bornes McDonald's — une catégorie sortie de
          l'écran cesse d'exister pour le client, d'autant plus que la barre de
          défilement était masquée. */}
      <div className="carte-layout">
        <nav className="categories">
          {onglets.map((c) => {
            const vign = photoCategorie(c);
            return (
              <button
                key={c}
                className={c === categorie ? "categorie actif" : "categorie"}
                onClick={() => setCategorie(c)}
              >
                {vign && <img className="vign" src={vign} alt="" />}
                <span className="libelle">{c}</span>
              </button>
            );
          })}
        </nav>
        <div className="produits">
          {produits.map((p) => {
            const img = photo(p.nom);
            return (
              <button
                className={estMenu(p) ? "produit menu" : "produit"}
                key={p.nom}
                aria-label={`${p.nom}, ${eur(p.prix)}`}
                onClick={() => onProduit(p)}
              >
                <div className="photo">{img && <img src={img} alt="" />}</div>
                {/* 🔴 Le nom des MENUS est écrit DANS leur visuel (« MENU GOOD
                    DEAL » en gros sur la photo), donc il n'est pas répété
                    dessous : demande du gérant, 22/10/2026. Il reste dans le
                    `aria-label` du bouton, sinon la carte n'aurait aucun nom
                    pour qui ne voit pas l'image.
                    ⚠️ Si un jour un visuel de menu arrive SANS son titre, la
                    carte devient muette : remettre le libellé. */}
                {!estMenu(p) && <div className="nom">{p.nom}</div>}
                <div className="prix">{eur(p.prix)}</div>
                {/* La description ne s'affiche que si elle existe. Les
                    signatures en ont besoin — leur nom ne dit rien de ce
                    qu'elles contiennent — là où « CORNDOG MOZZA » se suffit.
                    Textes relevés sur la borne EasyOrder. */}
                {champ(p, "description", langue) && (
                  <div className="detail">{champ(p, "description", langue)}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {nbArticles > 0 && (
        <footer>
          <button className="btn gros" onClick={onPanier}>
            {t("voirCommande")} · {nbArticles}{" "}
            {nbArticles > 1 ? t("articles") : t("article")} ·{" "}
            {eur(total)}
          </button>
        </footer>
      )}
    </div>
  );
}

// ── Les options, un groupe après l'autre ────────────────────────────────
function Config({
  produit,
  groupes,
  langue,
  t,
  onRetour,
  onAjouter,
}: {
  produit: Produit;
  groupes: Groupe[];
  langue: Langue;
  t: T;
  onRetour: () => void;
  onAjouter: (a: Article) => void;
}) {
  // Chaque groupe est un choix unique. L'option présélectionnée est la
  // PREMIÈRE, et `borne_options.ordre` porte la fréquence réelle observée :
  // le client tombe donc par défaut sur ce que les clients prennent le plus,
  // et une commande n'est jamais bloquée par un choix oublié.
  const [choix, setChoix] = useState<Record<number, number>>(() => {
    const d: Record<number, number> = {};
    for (const g of groupes) if (g.options[0]) d[g.id] = g.options[0].id;
    return d;
  });
  const [quantite, setQuantite] = useState(1);

  const retenus: Choix[] = groupes.flatMap((g) => {
    const o = g.options.find((x) => x.id === choix[g.id]);
    return o ? [{ groupe: g.nom, choix: o.nom, prix: o.prix }] : [];
  });
  const prix = (produit.prix + retenus.reduce((s, o) => s + o.prix, 0)) * quantite;

  return (
    <div className="page">
      <header>
        <button className="lien" onClick={onRetour}>
          ‹ {t("retour")}
        </button>
        <h1>{produit.nom}</h1>
      </header>
      <div className="liste">
        {groupes.map((g) => {
          // Un groupe où quelque chose se paie affiche « Compris » sur ses
          // choix gratuits : sans ça le client croit que tout coûte un
          // supplément, et il n'ose plus toucher au groupe.
          const groupePayant = g.options.some((o) => o.prix > 0);
          const illustre = groupeIllustre(g);
          return (
            <section key={g.id}>
              <h2>{champ(g, "nom", langue)}</h2>
              <div className={illustre ? "choix illustre" : "choix"}>
                {g.options.map((o) => {
                  const classes = ["pastille"];
                  if (o.prix > 0) classes.push("payante");
                  if (choix[g.id] === o.id) classes.push("actif");
                  return (
                    <button
                      key={o.id}
                      className={classes.join(" ")}
                      onClick={() => setChoix((c) => ({ ...c, [g.id]: o.id }))}
                    >
                      {illustre &&
                        (photoOption(o.nom) ? (
                          <img className="vignette" src={photoOption(o.nom)!} alt="" />
                        ) : (
                          // Un non-choix garde la hauteur de ses voisins, sinon
                          // la rangée se décale et il passe pour un bouton à part.
                          <span className="vignette vide" aria-hidden="true" />
                        ))}
                      {/* ⚠️ `champ()` retombe sur le français quand il n'y a
                          pas de traduction : les non-choix sont traduits en
                          base, les vrais noms d'options ne le sont pas et
                          passent donc tels quels. Un seul appel couvre les
                          deux cas. */}
                      <span className="libelle">{champ(o, "nom", langue)}</span>
                      {o.prix > 0 ? (
                        <span className="sup">+ {eur(o.prix)}</span>
                      ) : (
                        groupePayant && (
                          <span className="compris">{t("inclus")}</span>
                        )
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
        {groupes.length === 0 && <p className="gris">{t("aucuneOption")}</p>}
      </div>
      <footer>
        <div className="qte">
          <button className="btn rond" onClick={() => setQuantite((q) => Math.max(1, q - 1))}>
            −
          </button>
          <strong>{quantite}</strong>
          <button className="btn rond" onClick={() => setQuantite((q) => q + 1)}>
            +
          </button>
        </div>
        <button
          className="btn gros"
          onClick={() => onAjouter({ produit, options: retenus, quantite })}
        >
          {t("ajouter")} · {eur(prix)}
        </button>
      </footer>
    </div>
  );
}

function Envoi({
  mode,
  panier,
  t,
  onFini,
  onEchec,
}: {
  mode: string;
  panier: Article[];
  t: T;
  onFini: (ref: string) => void;
  onEchec: () => void;
}) {
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const lignes: LigneEnvoi[] = panier.map((a) => ({
      produit_nom: a.produit.nom,
      categorie: a.produit.categorie,
      quantite: a.quantite,
      // 🔴 Le prix envoyé est celui du PRODUIT seul, et celui de chaque option
      // à part : la fonction Postgres recalcule le total elle-même, option
      // facturée par unité. Ne pas lui envoyer un prix déjà additionné.
      prix: a.produit.prix,
      options: a.options,
    }));
    envoyerCommande(mode, lignes).then(onFini, (e) => setErreur(String(e.message || e)));
  }, []);

  if (erreur)
    return (
      <div className="plein">
        <h1>{t("nonEnregistree")}</h1>
        <p className="gris">{t("rienEnvoye")}</p>
        <p className="petit">{erreur}</p>
        <button className="btn" onClick={onEchec}>
          {t("retour")}
        </button>
      </div>
    );

  return (
    <div className="plein">
      <h1>{t("envoiEnCours")}</h1>
    </div>
  );
}

function Fini({
  reference,
  total,
  t,
  onFermer,
}: {
  reference: string;
  total: number;
  t: T;
  onFermer: () => void;
}) {
  // La borne se remet seule à l'accueil : personne n'appuie sur « Fermer »
  // après avoir eu son numéro.
  useEffect(() => {
    const t = setTimeout(onFermer, 12000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fini" onClick={onFermer}>
      {/* La mascotte sert ici : c'est le moment où le client attend. */}
      <div className="carte-numero">
        <img src="photos/logo-sekai.webp" alt="Sekai Corndogs" />
        <div className="libelle">{t("votreNumero")}</div>
        <div className="numero">{reference}</div>
        <div className="montant">
          <span>{t("totalMaj")}</span>
          <strong>{eur(total)}</strong>
        </div>
      </div>
      <div>
        <div className="consigne">{t("reglerComptoir")}</div>
        <div className="sous-consigne">{t("gardezNumero")}</div>
      </div>
      <button className="btn">{t("terminer")}</button>
    </div>
  );
}
