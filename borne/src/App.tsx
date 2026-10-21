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

  useEffect(() => {
    chargerCatalogue().then(setCat, (e) => setErreurCat(String(e.message || e)));
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

  if (erreurCat) {
    return (
      <div className="plein">
        <h1>Borne indisponible</h1>
        <p className="gris">Commandez au comptoir.</p>
        <p className="petit">{erreurCat}</p>
        <button className="btn" onClick={() => location.reload()}>
          Réessayer
        </button>
      </div>
    );
  }

  if (!cat) return <div className="plein"><h1>Chargement…</h1></div>;

  // ── Accueil ───────────────────────────────────────────────────────────
  if (ecran.nom === "accueil")
    return (
      <div className="plein accueil" onClick={() => setEcran({ nom: "mode" })}>
        <div className="logo">SEKAÏ</div>
        <div className="sous">CORNDOGS</div>
        <button className="btn gros">Commander</button>
        <div className="build">{__BUILD_ID__}</div>
      </div>
    );

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
                  .filter((o) => !/^(NO SIDE|PAS DE SUPPLEMENT)$/i.test(o.choix))
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
  const [categorie, setCategorie] = useState(cat.categories[0] ?? "");
  const produits = useMemo(
    () => cat.produits.filter((p) => p.categorie === categorie),
    [cat, categorie]
  );

  return (
    <div className="page">
      <header>
        <button className="lien" onClick={onAnnuler}>
          Annuler
        </button>
        <h1>Notre carte</h1>
      </header>
      <nav className="onglets">
        {cat.categories.map((c) => (
          <button
            key={c}
            className={c === categorie ? "onglet actif" : "onglet"}
            onClick={() => setCategorie(c)}
          >
            {c}
          </button>
        ))}
      </nav>
      <div className="grille">
        {produits.map((p) => (
          <button className="carte" key={p.nom} onClick={() => onProduit(p)}>
            <div className="nom">{p.nom}</div>
            <div className="prix">{eur(p.prix)}</div>
          </button>
        ))}
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
        {groupes.map((g) => (
          <section key={g.id}>
            <h2>{g.nom}</h2>
            <div className="choix">
              {g.options.map((o) => (
                <button
                  key={o.id}
                  className={choix[g.id] === o.id ? "pastille actif" : "pastille"}
                  onClick={() => setChoix((c) => ({ ...c, [g.id]: o.id }))}
                >
                  {o.nom}
                  {o.prix > 0 && <span className="sup"> +{eur(o.prix)}</span>}
                </button>
              ))}
            </div>
          </section>
        ))}
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
    <div className="plein" onClick={onFermer}>
      <p className="gris">Votre numéro</p>
      <div className="numero">{reference}</div>
      <h1>{eur(total)}</h1>
      <p className="gris">À régler au comptoir</p>
      <button className="btn">Terminer</button>
    </div>
  );
}
