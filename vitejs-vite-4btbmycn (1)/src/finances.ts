// ─────────────────────────────────────────────────────────────
//  Calculs financiers (logique pure, sans affichage)
//  Regroupe les seuils métier et le calcul des indicateurs du
//  Résumé finances, pour que cette logique soit lisible et testable
//  indépendamment du JSX.
// ─────────────────────────────────────────────────────────────

/** Seuils métier utilisés pour juger la santé financière. */
export const SEUILS = {
  /** Masse salariale : plafond sain en % du CA. */
  masseSalarialeMax: 35,
  /** Masse salariale : seuil de vigilance en % du CA. */
  masseSalarialeVigilance: 30,
  /** Loyer : plafond idéal en % du CA. */
  loyerMax: 10,
  /** Prime cost (matières + personnel) : plafond sain en % du CA. */
  primeCostMax: 65,
  /** Marge nette : plancher conseillé en % du CA. */
  margeNetteMin: 10,
} as const;

const num = (v: unknown): number => parseFloat(String(v)) || 0;
const somme = (arr: any[], sel: (c: any) => number): number =>
  arr.reduce((s, c) => s + sel(c), 0);

export interface EntreesFinances {
  ca: number;
  charges: any[];
  dettes: any[];
  totalChargesFixes: number;
  totalMensualites: number;
  totalDettes: number;
}

export interface IndicateursFinances {
  ca: number;
  caJour: number;
  totalCharges: number;
  gerant: number;
  masseSalariale: number;
  employesReels: number;
  reste: number;
  pctMasse: number;
  budgetEmployeMax: number;
  margeEmbauche: number;
  objJour: number;
  ecartJour: number;
  loyer: number;
  matieres: number;
  pctLoyer: number;
  pctMatieres: number;
  pctMarge: number;
  primeCost: number;
  pctPrime: number;
  dettesSansPlan: number;
  moisDettes: number | null;
}

/**
 * Calcule tous les indicateurs financiers du Résumé à partir du CA,
 * des charges fixes et des dettes. Fonction pure : mêmes entrées →
 * mêmes sorties, aucun effet de bord.
 */
export function computeIndicateurs(e: EntreesFinances): IndicateursFinances {
  const { ca, charges, dettes, totalChargesFixes, totalMensualites, totalDettes } = e;

  const totalCharges = somme(charges, c => num(c.montant));
  const gerant = somme(charges.filter(c => c.categorie === "salaire"), c => num(c.montant));
  const masseSalariale = somme(
    charges.filter(c => c.categorie === "salaire" || c.categorie === "personnel"),
    c => num(c.montant),
  );
  const employesReels = masseSalariale - gerant;
  const reste = ca - totalCharges;
  const pctMasse = ca > 0 ? (masseSalariale / ca) * 100 : 0;
  const budgetEmployeMax = Math.max(0, ca * (SEUILS.masseSalarialeMax / 100) - gerant);
  const margeEmbauche = budgetEmployeMax - employesReels;

  const caJour = ca / 30;
  const objJour = (totalChargesFixes + totalMensualites) / 30;
  const ecartJour = caJour - objJour;
  const loyer = somme(charges.filter(c => c.categorie === "loyer"), c => num(c.montant));
  const matieres = somme(
    charges.filter(c => /course|mati|marchandise|achat/i.test(c.nom)),
    c => num(c.montant),
  );
  const pctLoyer = ca > 0 ? (loyer / ca) * 100 : 0;
  const pctMatieres = ca > 0 ? (matieres / ca) * 100 : 0;
  const pctMarge = ca > 0 ? (reste / ca) * 100 : 0;
  const primeCost = matieres + masseSalariale;
  const pctPrime = ca > 0 ? (primeCost / ca) * 100 : 0;
  const dettesSansPlan = dettes.filter(d => !d.avec_plan).length;
  const moisDettes = reste > 0 ? Math.ceil(totalDettes / reste) : null;

  return {
    ca, caJour, totalCharges, gerant, masseSalariale, employesReels, reste,
    pctMasse, budgetEmployeMax, margeEmbauche, objJour, ecartJour, loyer,
    matieres, pctLoyer, pctMatieres, pctMarge, primeCost, pctPrime,
    dettesSansPlan, moisDettes,
  };
}

/** Couleur d'alerte pour la masse salariale selon son % du CA. */
export function masseColor(pctMasse: number): string {
  return pctMasse < SEUILS.masseSalarialeVigilance ? "#4caf50"
    : pctMasse < SEUILS.masseSalarialeMax ? "#f5a623"
    : "#e8213a";
}

/** Libellé d'état pour la masse salariale selon son % du CA. */
export function masseLabel(pctMasse: number): string {
  return pctMasse < SEUILS.masseSalarialeVigilance ? "Sain"
    : pctMasse < SEUILS.masseSalarialeMax ? "Limite"
    : "Trop élevé";
}
