// Le ticket de cuisine, au format du ticket EasyOrder.
//
// 🔴 C'EST LE TICKET QUI FAIT MARCHER LA CUISINE. Question posée le 03/10/2026
// et restée ouverte trois semaines — « comment la cuisine voit-elle la
// commande ? » : la réponse est arrivée le 22/10 avec la photo d'un ticket
// imprimé. Ce n'est donc PAS l'écran `Cuisine.tsx` qui porte le service, c'est
// une imprimante thermique. L'écran reste utile (vue d'ensemble, rattrapage
// d'un ticket perdu) mais il est le second, pas le premier.
//
// Le format ci-dessous est relevé au caractère près sur le ticket #029 du
// 22/10/2026 14:33. On le reproduit tel quel : la cuisine lit ces tickets
// depuis des mois, changer leur mise en page lui coûterait plus que ça ne lui
// rapporterait.

/** Largeur d'impression, en caractères. 32 = papier 58 mm en police A. */
export const COLONNES = 32;

export type LigneTicket = {
  produit_nom: string;
  quantite: number;
  options: { choix: string }[];
};

const centrer = (s: string) =>
  s.length >= COLONNES
    ? s.slice(0, COLONNES)
    : " ".repeat(Math.floor((COLONNES - s.length) / 2)) + s;

/** Coupe une ligne trop longue en gardant l'indentation de la suivante. */
function plier(texte: string, retrait: number): string[] {
  const large = COLONNES - retrait;
  const mots = texte.split(" ");
  const out: string[] = [];
  let ligne = "";
  for (const m of mots) {
    if (ligne && (ligne + " " + m).length > large) {
      out.push(ligne);
      ligne = m;
    } else {
      ligne = ligne ? ligne + " " + m : m;
    }
  }
  if (ligne) out.push(ligne);
  return out.map((l, i) => " ".repeat(retrait + (i > 0 ? 2 : 0)) + l);
}

/**
 * Le texte du ticket, prêt à imprimer.
 *
 * ⚠️ LES NON-CHOIX SONT IMPRIMÉS, eux aussi. C'est l'inverse de ce que font le
 * panier et l'écran cuisine, qui masquent « PAS DE SUPPLEMENT » parce que c'est
 * du bruit à l'écran. Sur le ticket EasyOrder ils figurent, et la cuisine s'en
 * sert : une ligne absente peut vouloir dire « on a oublié de demander », une
 * ligne « PAS DE SUPPLEMENT » veut dire « la question a été posée, la réponse
 * est non ». Ne pas « nettoyer » le ticket sans l'avoir demandé.
 */
export function ticketTexte(
  reference: string,
  lignes: LigneTicket[],
  date: Date
): string {
  const out: string[] = [];
  out.push(centrer(`Commande #${reference}`));
  out.push("");
  out.push("*".repeat(COLONNES));
  out.push(centrer("Sekai Corndogs"));
  out.push("*".repeat(COLONNES));
  out.push("");

  for (const l of lignes) {
    out.push(...plier(`${l.quantite}x ${l.produit_nom}`, 0));
    for (const o of l.options) out.push(...plier(`1x ${o.choix}`, 2));
    out.push("");
  }

  // ⚠️ L'heure est celle de BRUXELLES, pas l'UTC du serveur : c'est l'heure que
  // la cuisine compare à sa pendule.
  const d = new Intl.DateTimeFormat("fr-BE", {
    timeZone: "Europe/Brussels",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
  const h = new Intl.DateTimeFormat("fr-BE", {
    timeZone: "Europe/Brussels",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
  out.push(centrer(`${d} ${h}`));
  // 🔴 Mention CONSERVÉE du ticket EasyOrder. Le gérant l'a dit le 18/09/2026 :
  // la borne n'entre pas dans la comptabilité, seules les factures partent au
  // comptable. Ce ticket ne doit donc jamais passer pour un justificatif.
  out.push(centrer("Ceci n'est pas un ticket TVA"));
  out.push("");
  out.push(centrer("Sekai Corndogs"));

  return out.join("\n");
}
