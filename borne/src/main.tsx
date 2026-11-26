import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Cuisine from "./Cuisine";
import "./styles.css";

// Deux écrans, un seul build, un seul déploiement :
//   /          → la borne de commande (tablette face client)
//   /#cuisine  → l'écran cuisine
// Le choix se fait à l'adresse, donc chaque appareil est réglé une fois pour
// toutes et aucun client ne peut tomber sur l'écran cuisine par erreur.
const cuisine = location.hash.replace("#", "") === "cuisine";

// 🔴 UNE BORNE N'EST PAS UN SITE. Sur un écran tactile public, un appui long
// ouvre le menu « enregistrer l'image », et un glisser attrape une photo comme
// un fantôme qui suit le doigt. Les deux sortent le client de la commande, et
// le menu contextuel donne accès au navigateur. On les coupe à la racine.
// (Le zoom au double-tap et le rebond de page sont coupés en CSS.)
window.addEventListener("contextmenu", (e) => e.preventDefault());
window.addEventListener("dragstart", (e) => e.preventDefault());

// Une image qui ne charge pas s'EFFACE, elle n'affiche pas l'icône cassée du
// navigateur. Vu le 13/11 : `borne_propositions.visuels` nommait encore des
// `.png` après leur passage en `.webp`, et l'offre de menu montrait deux
// cadres vides à bord gris — sur une borne, ça se lit « en panne ».
// ⚠️ En phase de capture (`true`) : l'événement `error` d'une image ne remonte pas.
window.addEventListener(
  "error",
  (e) => {
    if (e.target instanceof HTMLImageElement) e.target.style.visibility = "hidden";
  },
  true
);

createRoot(document.getElementById("root")!).render(cuisine ? <Cuisine /> : <App />);
