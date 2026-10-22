// Accès Supabase de la borne.
//
// La borne ne fait que deux choses côté réseau : lire le catalogue au
// démarrage, et envoyer une commande. Tout le reste est local, pour qu'une
// coupure réseau en plein service ne bloque pas l'écran.

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://ldpxgfgcnlzktaymtnwd.supabase.co";
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcHhnZmdjbmx6a3RheW10bndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTgyMTAsImV4cCI6MjA5MTc3NDIxMH0.N_yUwjRvBM9rfxu0Xj-FCCGJ9eJ3UomPZdcUYAb8B8s";

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} sur ${path}`);
  return res.json();
}

// ── Types du catalogue ───────────────────────────────────────────────────
export type Produit = {
  nom: string;
  categorie: string;
  prix: number;
  ordre: number;
  /** Phrase affichée sous le nom. `null` sur la plupart des produits — voir
   *  le commentaire de `borne_produits.description`. */
  description: string | null;
};

export type Option = {
  id: number;
  nom: string;
  prix: number;
  ordre: number;
};

export type Groupe = {
  id: number;
  nom: string;
  portee: "produit" | "commande";
  options: Option[];
};

export type Catalogue = {
  produits: Produit[];
  categories: string[];
  groupesParProduit: Record<string, Groupe[]>;
  groupeCommande: Groupe | null;
};

/**
 * Charge tout le catalogue en trois requêtes, puis assemble en mémoire.
 *
 * ⚠️ La clé de jointure entre un produit et ses groupes est le NOM, pas un id :
 * c'est la convention posée quand le catalogue a été reconstitué depuis les
 * vraies commandes EasyOrder. Un produit dont le nom ne correspond à rien dans
 * `borne_produit_groupes` se retrouve simplement sans options.
 */
export async function chargerCatalogue(): Promise<Catalogue> {
  const [produits, groupes, options, liens] = await Promise.all([
    get<any[]>(
      "borne_produits?select=nom,categorie,prix,ordre,description&actif=is.true&order=ordre.asc"
    ),
    get<any[]>("borne_groupes?select=id,nom,portee"),
    // 🔴 `actif=is.true` : un choix retiré de la carte se désactive en base et
    // disparaît de la borne sans toucher au code. Sans ce filtre, la colonne
    // `actif` ne servait à rien — Oasis Fraise est restée affichée après avoir
    // été retirée de la carte (22/10/2026).
    get<any[]>("borne_options?select=id,groupe_id,nom,prix,ordre&actif=is.true&order=ordre.asc"),
    get<any[]>("borne_produit_groupes?select=produit_nom,groupe_id,ordre&order=ordre.asc"),
  ]);

  const optionsParGroupe = new Map<number, Option[]>();
  for (const o of options) {
    const liste = optionsParGroupe.get(o.groupe_id) ?? [];
    liste.push({ id: o.id, nom: o.nom, prix: Number(o.prix) || 0, ordre: o.ordre });
    optionsParGroupe.set(o.groupe_id, liste);
  }

  const groupeParId = new Map<number, Groupe>();
  for (const g of groupes) {
    groupeParId.set(g.id, {
      id: g.id,
      nom: g.nom,
      portee: g.portee,
      options: optionsParGroupe.get(g.id) ?? [],
    });
  }

  const groupesParProduit: Record<string, Groupe[]> = {};
  for (const l of liens) {
    const g = groupeParId.get(l.groupe_id);
    if (!g || g.portee !== "produit") continue;
    (groupesParProduit[l.produit_nom] ??= []).push(g);
  }

  const prods: Produit[] = produits.map((p) => ({
    nom: p.nom,
    categorie: p.categorie,
    prix: Number(p.prix),
    ordre: p.ordre,
    description: p.description || null,
  }));

  // L'ordre des catégories suit l'ordre des produits : les menus d'abord,
  // les boissons en dernier, comme sur la carte.
  const categories: string[] = [];
  for (const p of prods) if (!categories.includes(p.categorie)) categories.push(p.categorie);

  const groupeCommande =
    [...groupeParId.values()].find((g) => g.portee === "commande") ?? null;

  return { produits: prods, categories, groupesParProduit, groupeCommande };
}

// ── Écran cuisine ────────────────────────────────────────────────────────
export type LigneCuisine = {
  id: number;
  produit_nom: string;
  quantite: number;
  commentaire: string | null;
  options: { groupe: string; choix: string; prix: number }[];
};

export type CommandeCuisine = {
  id: number;
  reference: string;
  source: string;
  mode_livraison: string | null;
  total: number;
  recu_le: string;
  lignes: LigneCuisine[];
};

/** Décalage de Bruxelles sur UTC, en minutes, à l'instant donné (+120 l'été). */
function decalageMinutes(d: Date): number {
  const lu = new Date(d.toLocaleString("sv-SE", { timeZone: "Europe/Brussels" }) + "Z");
  return (lu.getTime() - d.getTime()) / 60000;
}

/**
 * Minuit à Bruxelles, en ISO UTC — le début du jour de service.
 *
 * 🔴 `commandes_live.recu_le` est de l'UTC RÉEL (contrairement aux lignes
 * importées de `ventes`, qui portent de l'heure locale avec un fuseau UTC).
 * Comparer `recu_le` à un minuit naïf décalerait la journée de deux heures :
 * une commande de 20h02 basculerait sur la veille.
 */
function debutDuJour(): string {
  const jour = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Brussels" });
  const naif = new Date(`${jour}T00:00:00Z`);
  return new Date(naif.getTime() - decalageMinutes(naif) * 60000).toISOString();
}

/**
 * Les commandes du jour qui ne sont pas encore servies, du plus ancien au plus
 * récent : la cuisine travaille dans l'ordre d'arrivée.
 *
 * ⚠️ Volontairement SANS filtre sur `source` : l'écran montre aussi bien les
 * commandes de la borne maison que celles qui arrivent encore du webhook
 * EasyOrder. Pendant la bascule les deux tournent en parallèle, et la cuisine
 * ne doit pas avoir deux écrans à surveiller.
 */
export async function chargerCuisine(): Promise<CommandeCuisine[]> {
  const depuis = debutDuJour();
  const cmds = await get<any[]>(
    "commandes_live?select=id,reference,source,mode_livraison,total,recu_le" +
      `&recu_le=gte.${depuis}&statut=neq.servie&order=recu_le.asc`
  );
  if (cmds.length === 0) return [];

  const ids = `(${cmds.map((c) => c.id).join(",")})`;
  const [lignes, options] = await Promise.all([
    get<any[]>(
      `commandes_live_lignes?select=id,commande_id,produit_nom,quantite,commentaire&commande_id=in.${ids}&order=id.asc`
    ),
    get<any[]>(
      `commandes_live_options?select=ligne_id,groupe,choix,prix&ligne_id=not.is.null&commande_id=in.${ids}`
    ),
  ]);

  const optionsParLigne = new Map<number, LigneCuisine["options"]>();
  for (const o of options) {
    const l = optionsParLigne.get(o.ligne_id) ?? [];
    l.push({ groupe: o.groupe, choix: o.choix, prix: Number(o.prix) || 0 });
    optionsParLigne.set(o.ligne_id, l);
  }

  const lignesParCommande = new Map<number, LigneCuisine[]>();
  for (const l of lignes) {
    const liste = lignesParCommande.get(l.commande_id) ?? [];
    liste.push({
      id: l.id,
      produit_nom: l.produit_nom,
      quantite: Number(l.quantite) || 1,
      commentaire: l.commentaire,
      options: optionsParLigne.get(l.id) ?? [],
    });
    lignesParCommande.set(l.commande_id, liste);
  }

  return cmds.map((c) => ({
    id: c.id,
    reference: c.reference,
    source: c.source,
    mode_livraison: c.mode_livraison,
    total: Number(c.total) || 0,
    recu_le: c.recu_le,
    lignes: lignesParCommande.get(c.id) ?? [],
  }));
}

/**
 * Marque une commande servie : elle disparaît de l'écran cuisine.
 *
 * ⚠️ On ne touche QUE `statut`. `ventes` n'est pas modifié — le CA du jour ne
 * dépend pas de ce que la cuisine fait de la commande.
 */
export async function marquerServie(id: number): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/commandes_live?id=eq.${id}`, {
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({ statut: "servie" }),
  });
  if (!res.ok) throw new Error(`Mise à jour refusée (${res.status})`);
}

// ── Envoi de la commande ─────────────────────────────────────────────────
export type LigneEnvoi = {
  produit_nom: string;
  categorie: string;
  quantite: number;
  prix: number;
  options: { groupe: string; choix: string; prix: number }[];
};

/**
 * Envoie la commande et renvoie le numéro affiché au client.
 *
 * 🔴 Tout passe par UNE fonction Postgres (`borne_creer_commande`) :
 * l'en-tête, les lignes, les options et le miroir dans `ventes` sont écrits
 * dans la même transaction. Si quoi que ce soit échoue, rien n'est écrit —
 * on ne peut pas se retrouver avec une commande à moitié enregistrée.
 * C'est aussi elle qui attribue le numéro, sous verrou, pour que les deux
 * bornes ne puissent jamais tirer le même.
 */
export async function envoyerCommande(
  modeLivraison: string,
  lignes: LigneEnvoi[]
): Promise<string> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/borne_creer_commande`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ p: { mode_livraison: modeLivraison, lignes } }),
  });
  if (!res.ok) throw new Error(`Envoi refusé (${res.status}) : ${await res.text()}`);
  return res.json();
}
