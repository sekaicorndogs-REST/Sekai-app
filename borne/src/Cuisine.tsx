import React, { useEffect, useRef, useState } from "react";
import {
  chargerCuisine,
  marquerServie,
  masqueAuService,
  type CommandeCuisine,
} from "./api";

declare const __BUILD_ID__: string;

const eur = (n: number) => n.toFixed(2).replace(".", ",") + " €";

/** Heure d'arrivée. `recu_le` est de l'UTC réel, donc on convertit. */
const heure = (iso: string) =>
  new Date(iso).toLocaleTimeString("fr-BE", {
    timeZone: "Europe/Brussels",
    hour: "2-digit",
    minute: "2-digit",
  });

const minutesDepuis = (iso: string) =>
  Math.floor((Date.now() - new Date(iso).getTime()) / 60000);

/**
 * Écran cuisine. Une commande = une carte, la plus ancienne en premier.
 *
 * Il tourne en permanence sur un écran du magasin : aucune interaction n'est
 * nécessaire pour qu'il reste à jour, et le seul geste possible est « Servie ».
 */
export default function Cuisine() {
  const [cmds, setCmds] = useState<CommandeCuisine[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  // Sert uniquement à rafraîchir l'âge affiché des commandes.
  const [, setHorloge] = useState(0);
  const connues = useRef<Set<number>>(new Set());
  const premierTour = useRef(true);

  // Sonde toutes les 5 secondes. Pas de websocket ici, volontairement : un
  // écran de cuisine doit se relever seul après une coupure réseau, et une
  // requête toutes les 5 s sur une dizaine de commandes ne coûte rien.
  useEffect(() => {
    let vivant = true;
    async function tour() {
      try {
        const liste = await chargerCuisine();
        if (!vivant) return;
        // Une nouvelle commande fait sonner l'écran, sinon personne ne la voit
        // arriver. Au premier chargement on ne sonne pas : tout est « nouveau ».
        const nouvelles = liste.filter((c) => !connues.current.has(c.id));
        connues.current = new Set(liste.map((c) => c.id));
        if (!premierTour.current && nouvelles.length > 0) navigator.vibrate?.(200);
        premierTour.current = false;
        setCmds(liste);
        setErreur(null);
      } catch (e: any) {
        if (vivant) setErreur(String(e.message || e));
      }
    }
    tour();
    const t = setInterval(tour, 5000);
    const h = setInterval(() => setHorloge((n) => n + 1), 20000);
    return () => {
      vivant = false;
      clearInterval(t);
      clearInterval(h);
    };
  }, []);

  async function servir(c: CommandeCuisine) {
    // Retiré de l'écran tout de suite, sans attendre le réseau : la cuisine ne
    // doit jamais rester bloquée sur un bouton. Si l'écriture échoue, la sonde
    // la fait réapparaître au tour suivant.
    setCmds((l) => (l ?? []).filter((x) => x.id !== c.id));
    connues.current.delete(c.id);
    try {
      await marquerServie(c.id);
    } catch (e: any) {
      setErreur(`${c.reference} n'a pas pu être marquée servie : ${e.message || e}`);
    }
  }

  if (cmds === null)
    return (
      <div className="plein">
        <h1>{erreur ? "Écran cuisine indisponible" : "Chargement…"}</h1>
        {erreur && <p className="petit">{erreur}</p>}
      </div>
    );

  return (
    <div className="cuisine">
      <header>
        <h1>Cuisine</h1>
        <div className="gris">
          {cmds.length === 0
            ? "Rien en attente"
            : `${cmds.length} commande${cmds.length > 1 ? "s" : ""} en attente`}
        </div>
      </header>

      {erreur && <div className="bandeau">{erreur}</div>}

      <div className="colonnes">
        {cmds.map((c) => {
          const age = minutesDepuis(c.recu_le);
          return (
            <article key={c.id} className={age >= 10 ? "fiche tard" : "fiche"}>
              <div className="entete">
                <span className="ref">{c.reference}</span>
                <span className="age">{age < 1 ? "à l'instant" : `${age} min`}</span>
              </div>
              <div className="meta">
                {c.mode_livraison === "eatin" ? "SUR PLACE" : "À EMPORTER"}
                {c.source !== "borne" && <span className="tag">{c.source}</span>}
                <span className="gris"> · {heure(c.recu_le)}</span>
              </div>

              {c.lignes.map((l) => (
                <div className="art" key={l.id}>
                  <div className="nom">
                    <span className="q">{l.quantite}×</span> {l.produit_nom}
                  </div>
                  {l.options
                    // Exactement le même filtre que le panier client : il vit
                    // dans `api.ts`, les deux écrans ne peuvent plus diverger.
                    .filter((o) => !masqueAuService(o.choix))
                    .map((o, j) => (
                      <div className="opt" key={j}>
                        {o.choix}
                      </div>
                    ))}
                  {l.commentaire && <div className="note">« {l.commentaire} »</div>}
                </div>
              ))}

              <div className="pied">
                <strong>{eur(c.total)}</strong>
                <button className="btn" onClick={() => servir(c)}>
                  Servie
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {cmds.length === 0 && (
        <p className="gris vide">Les nouvelles commandes apparaissent ici.</p>
      )}
      <div className="build">{__BUILD_ID__}</div>
    </div>
  );
}
