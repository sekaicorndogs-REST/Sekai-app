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
    get<any[]>("borne_produits?select=nom,categorie,prix,ordre&actif=is.true&order=ordre.asc"),
    get<any[]>("borne_groupes?select=id,nom,portee"),
    get<any[]>("borne_options?select=id,groupe_id,nom,prix,ordre&order=ordre.asc"),
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
  }));

  // L'ordre des catégories suit l'ordre des produits : les menus d'abord,
  // les boissons en dernier, comme sur la carte.
  const categories: string[] = [];
  for (const p of prods) if (!categories.includes(p.categorie)) categories.push(p.categorie);

  const groupeCommande =
    [...groupeParId.values()].find((g) => g.portee === "commande") ?? null;

  return { produits: prods, categories, groupesParProduit, groupeCommande };
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
