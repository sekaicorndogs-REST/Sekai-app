import React, { useEffect, useMemo, useState } from "react";
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

// Les photos sont DÉCOUPÉES DANS L'AFFICHE du magasin (`public/photos/affiche.jpg`),
// faute de photos produit à ce jour. Elles sont donc fidèles pour les corndogs,
// les sides et les boissons, et seulement ÉVOCATRICES pour les menus — la photo
// d'un menu montre l'un de ses éléments, pas le menu complet.
// À remplacer dès qu'il y a de vraies photos : poser le fichier dans
// `public/photos/` et ajouter sa ligne ici, rien d'autre à toucher.
const PHOTOS: Record<string, string> = {
  // ✅ Les VRAIS visuels de menu, envoyés par le gérant le 22/10/2026 : le menu
  // complet sur son plateau, détouré sur fond transparent. Le titre « MENU GOOD
  // DEAL » a été recadré hors de l'image — il est déjà écrit sous la carte.
  "MENU GOODEAL": "menu-gooddeal.png",
  "MENU BUBBLE DOGS": "menu-bubbledog.png",
  "MENU GOODEAL XL": "menu-gooddeal-xl.png",
  "MENU BUBBLE DOGS XL": "menu-bubbledog-xl.png",
  "CORNDOG SAUCISSE": "saucisse.jpg",
  "CORNDOG MOZZA": "mozza.jpg",
  "CORNDOG SAUCISSE/MOZZA": "bubbledog.jpg",
  "FRITES": "frites.jpg",
  "Poulet karaage": "karaage.jpg",
  "Tempura crevette": "tempura.jpg",
  "BUBBLE TEA PECHE": "bubbletea.jpg",
  "BUBBLE TEA PASTEQUE": "bubbletea.jpg",
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
};

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
    setEcran({ nom: "accueil" });
  }

  // ── Accueil ───────────────────────────────────────────────────────────
  // 🔴 L'accueil s'affiche AVANT tout contrôle de réseau. Une borne coupée du
  // réseau continue de montrer l'affiche des menus en vitrine : elle garde sa
  // valeur publicitaire même quand elle ne prend plus de commandes.
  if (ecran.nom === "accueil")
    return (
      <div className="accueil" onClick={() => cat && setEcran({ nom: "mode" })}>
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
              <button className="btn gros">COMMANDER ICI</button>
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
        <h1>Borne indisponible</h1>
        <p className="gris">Commandez au comptoir.</p>
        <button className="btn" onClick={recommencer}>
          Retour
        </button>
      </div>
    );
  }

  // ── Sur place ou à emporter ───────────────────────────────────────────
  if (ecran.nom === "mode")
    return (
      <div className="plein">
        <h1>{cat.groupeCommande?.nom ?? "Sur place ou à emporter ?"}</h1>
        <div className="colonne">
          <button
            className="btn gros"
            onClick={() => {
              setMode("eatin");
              setEcran({ nom: "carte" });
            }}
          >
            Sur place
          </button>
          <button
            className="btn gros"
            onClick={() => {
              setMode("takeaway");
              setEcran({ nom: "carte" });
            }}
          >
            À emporter
          </button>
        </div>
        <button className="lien" onClick={recommencer}>
          Annuler
        </button>
      </div>
    );

  // ── La carte ──────────────────────────────────────────────────────────
  if (ecran.nom === "carte")
    return (
      <Carte
        cat={cat}
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
            ‹ Ajouter
          </button>
          <h1>Votre commande</h1>
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
                  Retirer
                </button>
              </div>
            </div>
          ))}
          {panier.length === 0 && <p className="gris">Votre panier est vide.</p>}
        </div>
        <footer>
          <div className="total">
            <span>Total</span>
            <strong>{eur(total)}</strong>
          </div>
          {/* 🔴 Aucun paiement sur la borne : 100 % des commandes EasyOrder
              sont en « cash / non payé », le client règle au comptoir. */}
          <p className="petit">Paiement au comptoir</p>
          <button
            className="btn gros"
            disabled={panier.length === 0}
            onClick={() => setEcran({ nom: "envoi" })}
          >
            Envoyer la commande
          </button>
          <button className="lien" onClick={recommencer}>
            Tout annuler
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
        onFini={(ref) => setEcran({ nom: "fini", reference: ref })}
        onEchec={() => setEcran({ nom: "panier" })}
      />
    );

  return <Fini reference={ecran.reference} total={total} onFermer={recommencer} />;
}

// ── La carte, par catégorie ─────────────────────────────────────────────
function Carte({
  cat,
  onProduit,
  nbArticles,
  total,
  onPanier,
  onAnnuler,
}: {
  cat: Catalogue;
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
        <h1>NOTRE CARTE</h1>
        <button className="lien" onClick={onAnnuler}>
          Annuler
        </button>
      </header>
      {/* 🔴 Les catégories sont une COLONNE VERTICALE qui tient à l'écran.
          Ne pas revenir à des onglets qui défilent à l'horizontale : c'est le
          défaut documenté des bornes McDonald's — une catégorie sortie de
          l'écran cesse d'exister pour le client, d'autant plus que la barre de
          défilement était masquée. */}
      <div className="carte-layout">
        <nav className="categories">
          {onglets.map((c) => (
            <button
              key={c}
              className={c === categorie ? "categorie actif" : "categorie"}
              onClick={() => setCategorie(c)}
            >
              {c}
            </button>
          ))}
        </nav>
        <div className="produits">
          {produits.map((p) => {
            const img = photo(p.nom);
            return (
              <button
                className={estMenu(p) ? "produit menu" : "produit"}
                key={p.nom}
                onClick={() => onProduit(p)}
              >
                <div className="photo">
                  {img && <img src={img} alt="" />}
                  <div className="prix">{eur(p.prix)}</div>
                </div>
                <div className="nom">{p.nom}</div>
              </button>
            );
          })}
        </div>
      </div>
      {nbArticles > 0 && (
        <footer>
          <button className="btn gros" onClick={onPanier}>
            Voir ma commande · {nbArticles} article{nbArticles > 1 ? "s" : ""} ·{" "}
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
  onRetour,
  onAjouter,
}: {
  produit: Produit;
  groupes: Groupe[];
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
          ‹ Retour
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
              <h2>{g.nom}</h2>
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
                      <span className="libelle">{o.nom}</span>
                      {o.prix > 0 ? (
                        <span className="sup">+ {eur(o.prix)}</span>
                      ) : (
                        groupePayant && <span className="compris">Compris</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
        {groupes.length === 0 && <p className="gris">Aucune option.</p>}
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
          Ajouter · {eur(prix)}
        </button>
      </footer>
    </div>
  );
}

function Envoi({
  mode,
  panier,
  onFini,
  onEchec,
}: {
  mode: string;
  panier: Article[];
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
        <h1>Commande non enregistrée</h1>
        <p className="gris">Rien n'a été envoyé. Commandez au comptoir.</p>
        <p className="petit">{erreur}</p>
        <button className="btn" onClick={onEchec}>
          Retour
        </button>
      </div>
    );

  return (
    <div className="plein">
      <h1>Envoi…</h1>
    </div>
  );
}

function Fini({
  reference,
  total,
  onFermer,
}: {
  reference: string;
  total: number;
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
        <div className="libelle">VOTRE NUMÉRO</div>
        <div className="numero">{reference}</div>
        <div className="montant">
          <span>TOTAL</span>
          <strong>{eur(total)}</strong>
        </div>
      </div>
      <div>
        <div className="consigne">À RÉGLER AU COMPTOIR</div>
        <div className="sous-consigne">Gardez votre numéro, on vous appelle</div>
      </div>
      <button className="btn">TERMINER</button>
    </div>
  );
}
