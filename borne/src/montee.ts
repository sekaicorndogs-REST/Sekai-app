// Proposer au client de passer d'un corndog seul à un menu, ou d'un menu à sa
// version XL. Demandé par le gérant le 22/10/2026.
//
// 🔴 CE N'EST PAS UN « MAUVAIS DÉFAUT ». La borne ne coche rien à la place du
// client, ne masque pas le refus et n'arrondit rien en sa défaveur. Elle
// montre un prix exact et laisse décider. C'est la limite que le dossier pose
// depuis l'étude de mars 2026 sur les bornes McDonald's, et elle tient ici :
// vendre plus, oui ; décider à la place du client, non.
//
// 🔴 ET LA DIFFÉRENCE EST CALCULÉE, JAMAIS ANNONCÉE EN DUR. Un corndog à
// 6,50 € avec un side (3,50 €) et un soft (2,00 €) coûte 12,00 € ; le même
// contenu en Menu Good Deal coûte 10,00 €. Le client ÉCONOMISE 2,00 €.
// Annoncer « +3,50 € » dans ce cas serait faux, et le lui faire payer sans
// rien dire serait pire.

import type { Catalogue, Groupe, Produit, Proposition } from "./api";

export type Choix = {
  groupe: string;
  choix: string;
  prix: number;
  libelles?: { en: string | null; nl: string | null; es: string | null };
};

export type Montee = {
  proposition: Proposition;
  cible: Produit;
  /** Les choix repris de la configuration d'origine, prêts pour l'écran de la cible. */
  reportes: Record<number, number>;
  /** Prix de la cible une fois configurée au mieux, pour une unité. */
  prixCible: number;
  /** `prixCible - prixActuel`. Négatif quand la cible revient MOINS cher. */
  difference: number;
};

/** Prix d'une unité : le produit plus ses options payantes. */
export const prixUnite = (prix: number, choix: Choix[]) =>
  prix + choix.reduce((s, o) => s + o.prix, 0);

/**
 * Les montées en gamme possibles pour un produit qui vient d'être configuré.
 *
 * Le report des choix se fait **par identifiant de groupe** : un groupe commun
 * aux deux produits (la panure, la sauce) garde le choix du client. Les groupes
 * que la cible ajoute (le soft d'un menu, le second side d'un XL) prennent
 * leur premier choix — celui que `borne_options.ordre` désigne comme le plus
 * pris — et le client les reverra sur l'écran de la cible.
 *
 * ⚠️ On ne reporte PAS les groupes que la cible n'a pas : le side payant et le
 * soft payant d'un corndog seul disparaissent, puisque le menu les comprend.
 * C'est exactement ce qui peut rendre la cible moins chère.
 */
export function monteesPossibles(
  cat: Catalogue,
  produit: Produit,
  choixActuels: Choix[],
  choixParGroupe: Record<number, number>
): Montee[] {
  const props = cat.propositions[produit.nom] ?? [];
  if (props.length === 0) return [];

  const prixActuel = prixUnite(produit.prix, choixActuels);
  const parNom = new Map(cat.produits.map((p) => [p.nom, p]));
  const out: Montee[] = [];

  for (const prop of props) {
    const cible = parNom.get(prop.cibleNom);
    if (!cible) continue;
    const groupesCible: Groupe[] = cat.groupesParProduit[cible.nom] ?? [];

    const reportes: Record<number, number> = {};
    for (const g of groupesCible) {
      // 1. Le groupe existe déjà sur le produit d'origine : on garde le choix.
      const dejaChoisi = choixParGroupe[g.id];
      if (dejaChoisi && g.options.some((o) => o.id === dejaChoisi)) {
        reportes[g.id] = dejaChoisi;
        continue;
      }
      // 2. CHOIX DE LA BASE : le corndog que le client vient de configurer.
      //    ⚠️ Passe par `baseOption` et non par le nom du produit — « CORNDOG
      //    MOZZA » côté produit, « CORNDOG MOZA » côté option.
      if (prop.baseOption) {
        const base = g.options.find((o) => o.nom === prop.baseOption);
        if (base) {
          reportes[g.id] = base.id;
          continue;
        }
      }
      // 3. Sinon le premier choix, qui est celui que les clients prennent le
      //    plus et qui est toujours à 0 €.
      if (g.options[0]) reportes[g.id] = g.options[0].id;
    }

    const choixCible: Choix[] = groupesCible.flatMap((g) => {
      const o = g.options.find((x) => x.id === reportes[g.id]);
      return o ? [{ groupe: g.nom, choix: o.nom, prix: o.prix }] : [];
    });

    const prixCible = prixUnite(cible.prix, choixCible);
    out.push({
      proposition: prop,
      cible,
      reportes,
      prixCible,
      difference: Math.round((prixCible - prixActuel) * 100) / 100,
    });
  }

  return out;
}
