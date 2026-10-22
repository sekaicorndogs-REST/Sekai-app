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

// ── ESC/POS ───────────────────────────────────────────────────────────────
//
// Le texte ci-dessus sert à l'aperçu et aux tests ; une imprimante thermique,
// elle, attend des octets ESC/POS. Cette partie est commune à TOUTES les
// manières de l'atteindre — c'est pour ça qu'elle est écrite maintenant, alors
// que le transport n'est pas encore tranché.

const ESC = 0x1b;
const GS = 0x1d;

/**
 * 🔴 Les accents ne passent PAS tout seuls sur une imprimante thermique : elle
 * n'est pas en UTF-8 mais sur une table de caractères à sélectionner.
 *
 * Indice relevé sur le ticket EasyOrder #029 : il imprime « Imprime par
 * EasyOrder », sans accent. Soit ils ont retiré les accents, soit leur table
 * ne les porte pas. On sélectionne donc CP858 (qui couvre le français) ET on
 * garde ce repli : si le gérant voit des caractères bizarres sur le premier
 * vrai ticket, passer `sansAccents` à `true` règle le problème sans toucher au
 * reste.
 */
export function sansAccents(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** CP858 : latin occidental + le symbole €. Suffisant pour le français. */
const CP858: Record<string, number> = {
  "é": 0x82, "è": 0x8a, "ê": 0x88, "ë": 0x89,
  "à": 0x85, "â": 0x83, "ä": 0x84,
  "î": 0x8c, "ï": 0x8b, "ô": 0x93, "ö": 0x94,
  "ù": 0x97, "û": 0x96, "ü": 0x81, "ç": 0x87,
  "É": 0x90, "È": 0xd4, "À": 0xb7, "Ç": 0x80,
  "€": 0xd5, "°": 0xf8,
};

function octets(s: string): number[] {
  const out: number[] = [];
  for (const c of s) {
    const cp = CP858[c];
    if (cp !== undefined) out.push(cp);
    else {
      const n = c.charCodeAt(0);
      // Au-delà de la table : un point d'interrogation plutôt qu'un octet
      // hasardeux, qui ferait imprimer n'importe quoi.
      out.push(n < 0x80 ? n : 0x3f);
    }
  }
  return out;
}

/**
 * Le ticket en octets ESC/POS, prêt à envoyer à l'imprimante.
 *
 * ⚠️ Mise en forme volontairement minimale : init, table de caractères,
 * centrage, gras et double taille pour le numéro, puis la coupe. Une
 * imprimante inconnue refuse plus facilement une commande exotique qu'une
 * commande de base, et le ticket EasyOrder n'en fait pas plus.
 */
export function ticketEscPos(
  reference: string,
  lignes: LigneTicket[],
  date: Date,
  opts: { sansAccents?: boolean } = {}
): Uint8Array {
  const texte = ticketTexte(reference, lignes, date);
  const [entete, ...reste] = texte.split("\n");
  const corps = opts.sansAccents ? sansAccents(reste.join("\n")) : reste.join("\n");
  const titre = opts.sansAccents ? sansAccents(entete.trim()) : entete.trim();

  const b: number[] = [];
  b.push(ESC, 0x40); //          ESC @  — réinitialise
  b.push(ESC, 0x74, 19); //      ESC t  — table CP858
  b.push(ESC, 0x61, 1); //       ESC a  — centré
  b.push(GS, 0x21, 0x11); //     GS !   — double largeur et hauteur
  b.push(ESC, 0x45, 1); //       ESC E  — gras
  b.push(...octets(titre), 0x0a);
  b.push(ESC, 0x45, 0); //       fin du gras
  b.push(GS, 0x21, 0x00); //     retour à la taille normale
  b.push(ESC, 0x61, 0); //       aligné à gauche : le corps est DÉJÀ centré à
  //                             la main par `centrer()`, le recentrer le
  //                             décalerait une seconde fois.
  b.push(...octets(corps), 0x0a, 0x0a, 0x0a, 0x0a);
  b.push(GS, 0x56, 0x42, 0x00); // GS V B — coupe le papier
  return new Uint8Array(b);
}
