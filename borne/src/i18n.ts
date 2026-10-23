// Les quatre langues de la borne : français, anglais, néerlandais, espagnol.
//
// Ce sont celles de la borne EasyOrder, que le gérant a demandé de reprendre
// le 22/10/2026. Bruxelles est bilingue, la Rue Neuve est très touristique.
//
// 🔴 UN BOUTON DE LANGUE DOIT TENIR SA PROMESSE. Afficher « English » puis
// servir un écran en français est pire que ne pas proposer le choix : le
// client croit s'être trompé. Donc tout texte visible de l'application passe
// par ce fichier, et tout texte venu de la BASE a ses colonnes traduites
// (`borne_groupes.nom_en/nl/es`, `borne_produits.description_en/nl/es`).
//
// ⚠️ CE QUI N'EST VOLONTAIREMENT PAS TRADUIT :
// - les NOMS DE PRODUITS (« MENU GOODEAL », « SAITAMA », « CORNDOG MOZZA ») ;
// - les NOMS D'OPTIONS (« POTATOE », « BLUE », « KETCHUP », « SEKAI ») ;
// - les CATÉGORIES (« Sides », « Bubble Tea », « Softs », « Corndogs »).
// Ce sont des noms commerciaux. Un client qui commande un « SAITAMA » doit
// lire le même mot que celui que la cuisine verra sur son écran.
// Les non-choix (« PAS DE SUPPLEMENT ») font exception : ce sont des phrases,
// pas des noms, et ils sont traduits en base.

export const LANGUES = ["fr", "en", "nl", "es"] as const;
export type Langue = (typeof LANGUES)[number];

/** Le nom de chaque langue, écrit DANS cette langue : c'est auto-explicatif. */
export const NOM_LANGUE: Record<Langue, string> = {
  fr: "Français",
  en: "English",
  nl: "Nederlands",
  es: "Español",
};

type Cle =
  | "paiementComptoir"
  | "borneIndispo"
  | "commandezComptoir"
  | "chargement"
  | "modeTitre"
  | "surPlace"
  | "aEmporter"
  | "annuler"
  | "notreCarte"
  | "voirCommande"
  | "article"
  | "articles"
  | "retour"
  | "ajouter"
  | "aucuneOption"
  | "inclus"
  | "votreCommande"
  | "panierVide"
  | "total"
  | "envoyer"
  | "envoiEnCours"
  | "votreNumero"
  | "totalMaj"
  | "reglerComptoir"
  | "gardezNumero"
  | "terminer"
  | "nonEnregistree"
  | "rienEnvoye"
  | "compris"
  | "proposerTitre"
  | "proposerTitreXL"
  | "sansMerci"
  | "economise"
  | "valeurCarte"
  | "retirer"
  | "toutAnnuler"
  | "changerLangue";

// ⚠️ `inclus` et `compris` sont DEUX clés, pas une. En français les deux se
// disent « Compris » — l'option comprise dans le prix, et le bouton « j'ai
// compris » de l'écran d'erreur. Dans les trois autres langues ce sont deux
// mots différents. Les fusionner produirait un contresens.
const TEXTES: Record<Langue, Record<Cle, string>> = {
  fr: {
    paiementComptoir: "Paiement au comptoir",
    borneIndispo: "Borne indisponible",
    commandezComptoir: "Commandez au comptoir",
    chargement: "Chargement…",
    modeTitre: "Sur place ou à emporter ?",
    surPlace: "Sur place",
    aEmporter: "À emporter",
    annuler: "Annuler",
    notreCarte: "NOTRE CARTE",
    voirCommande: "Voir ma commande",
    article: "article",
    articles: "articles",
    retour: "Retour",
    ajouter: "Ajouter",
    aucuneOption: "Aucune option.",
    inclus: "Compris",
    votreCommande: "Votre commande",
    panierVide: "Votre panier est vide.",
    total: "Total",
    envoyer: "Envoyer la commande",
    envoiEnCours: "Envoi…",
    votreNumero: "VOTRE NUMÉRO",
    totalMaj: "TOTAL",
    reglerComptoir: "À RÉGLER AU COMPTOIR",
    gardezNumero: "Gardez votre numéro, on vous appelle",
    terminer: "TERMINER",
    nonEnregistree: "Commande non enregistrée",
    rienEnvoye: "Rien n'a été envoyé. Commandez au comptoir.",
    compris: "Compris",
    proposerTitre: "Vous voulez le menu ?",
    proposerTitreXL: "Passer en XL ?",
    sansMerci: "Non merci",
    economise: "vous économisez",
    valeurCarte: "vaut % à la carte",
    retirer: "Retirer",
    toutAnnuler: "Tout annuler",
    changerLangue: "Langue",
  },
  en: {
    paiementComptoir: "Pay at the counter",
    borneIndispo: "Kiosk unavailable",
    commandezComptoir: "Please order at the counter",
    chargement: "Loading…",
    modeTitre: "Eat in or take away?",
    surPlace: "Eat in",
    aEmporter: "Take away",
    annuler: "Cancel",
    notreCarte: "OUR MENU",
    voirCommande: "View my order",
    article: "item",
    articles: "items",
    retour: "Back",
    ajouter: "Add",
    aucuneOption: "No options.",
    inclus: "Included",
    votreCommande: "Your order",
    panierVide: "Your basket is empty.",
    total: "Total",
    envoyer: "Send my order",
    envoiEnCours: "Sending…",
    votreNumero: "YOUR NUMBER",
    totalMaj: "TOTAL",
    reglerComptoir: "PAY AT THE COUNTER",
    gardezNumero: "Keep your number, we'll call you",
    terminer: "DONE",
    nonEnregistree: "Order not registered",
    rienEnvoye: "Nothing was sent. Please order at the counter.",
    compris: "Got it",
    proposerTitre: "Make it a menu?",
    proposerTitreXL: "Upgrade to XL?",
    sansMerci: "No thanks",
    economise: "you save",
    valeurCarte: "worth % bought separately",
    retirer: "Remove",
    toutAnnuler: "Cancel all",
    changerLangue: "Language",
  },
  nl: {
    paiementComptoir: "Betalen aan de toonbank",
    borneIndispo: "Kiosk niet beschikbaar",
    commandezComptoir: "Bestel aan de toonbank",
    chargement: "Laden…",
    modeTitre: "Hier eten of meenemen?",
    surPlace: "Hier eten",
    aEmporter: "Meenemen",
    annuler: "Annuleren",
    notreCarte: "ONZE KAART",
    voirCommande: "Mijn bestelling",
    article: "artikel",
    articles: "artikelen",
    retour: "Terug",
    ajouter: "Toevoegen",
    aucuneOption: "Geen opties.",
    inclus: "Inbegrepen",
    votreCommande: "Uw bestelling",
    panierVide: "Uw mandje is leeg.",
    total: "Totaal",
    envoyer: "Bestelling versturen",
    envoiEnCours: "Versturen…",
    votreNumero: "UW NUMMER",
    totalMaj: "TOTAAL",
    reglerComptoir: "BETALEN AAN DE TOONBANK",
    gardezNumero: "Houd uw nummer bij, we roepen u",
    terminer: "KLAAR",
    nonEnregistree: "Bestelling niet geregistreerd",
    rienEnvoye: "Er is niets verzonden. Bestel aan de toonbank.",
    compris: "Begrepen",
    proposerTitre: "Er een menu van maken?",
    proposerTitreXL: "Naar XL?",
    sansMerci: "Nee bedankt",
    economise: "u bespaart",
    valeurCarte: "los % waard",
    retirer: "Verwijderen",
    toutAnnuler: "Alles annuleren",
    changerLangue: "Taal",
  },
  es: {
    paiementComptoir: "Pago en el mostrador",
    borneIndispo: "Quiosco no disponible",
    commandezComptoir: "Pida en el mostrador",
    chargement: "Cargando…",
    modeTitre: "¿Para comer aquí o para llevar?",
    surPlace: "Para comer aquí",
    aEmporter: "Para llevar",
    annuler: "Cancelar",
    notreCarte: "NUESTRA CARTA",
    voirCommande: "Ver mi pedido",
    article: "artículo",
    articles: "artículos",
    retour: "Volver",
    ajouter: "Añadir",
    aucuneOption: "Sin opciones.",
    inclus: "Incluido",
    votreCommande: "Su pedido",
    panierVide: "Su cesta está vacía.",
    total: "Total",
    envoyer: "Enviar el pedido",
    envoiEnCours: "Enviando…",
    votreNumero: "SU NÚMERO",
    totalMaj: "TOTAL",
    reglerComptoir: "PAGAR EN EL MOSTRADOR",
    gardezNumero: "Guarde su número, le llamaremos",
    terminer: "TERMINAR",
    nonEnregistree: "Pedido no registrado",
    rienEnvoye: "No se ha enviado nada. Pida en el mostrador.",
    compris: "Entendido",
    proposerTitre: "¿Lo convertimos en menú?",
    proposerTitreXL: "¿Pasar a XL?",
    sansMerci: "No, gracias",
    economise: "ahorra",
    valeurCarte: "vale % por separado",
    retirer: "Quitar",
    toutAnnuler: "Cancelar todo",
    changerLangue: "Idioma",
  },
};

/** Le traducteur d'une langue donnée. */
export const traducteur = (l: Langue) => (c: Cle) => TEXTES[l][c];
export type T = ReturnType<typeof traducteur>;

/**
 * Le champ traduit d'une ligne de base, avec repli sur le français.
 *
 * 🔴 Le repli est VOLONTAIRE et silencieux : une description ajoutée en base
 * sans ses traductions doit s'afficher en français, pas disparaître. Un texte
 * manquant vaut mieux qu'un écran vide.
 */
export function champ<O extends Record<string, unknown>>(
  o: O | null | undefined,
  base: string,
  l: Langue
): string {
  if (!o) return "";
  const fr = (o[base] as string) ?? "";
  if (l === "fr") return fr;
  const trad = o[`${base}_${l}`] as string | null | undefined;
  return trad || fr;
}
