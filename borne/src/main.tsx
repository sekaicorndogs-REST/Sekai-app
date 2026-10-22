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

createRoot(document.getElementById("root")!).render(cuisine ? <Cuisine /> : <App />);
