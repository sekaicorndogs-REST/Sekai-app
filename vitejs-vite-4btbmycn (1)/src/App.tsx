import { useState, useEffect, useRef } from "react";
import { Package, Calendar, CreditCard, Users, UserCircle, ArrowLeft, RefreshCw, AlertTriangle, AlertCircle, CheckCircle, Pencil, Save, Eye, EyeOff, Check, Lock, User, ArrowRight, Trash2, Plus, ChevronRight, Settings, LogOut, Shield, Star, ListChecks } from "lucide-react";

const SUPABASE_URL = "https://ldpxgfgcnlzktaymtnwd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkcHhnZmdjbmx6a3RheW10bndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTgyMTAsImV4cCI6MjA5MTc3NDIxMH0.N_yUwjRvBM9rfxu0Xj-FCCGJ9eJ3UomPZdcUYAb8B8s";
const HEADERS = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
  "Prefer": "return=representation"
};

const RESTAURANTS = [
  { id: "rue-neuve", name: "Sekai Corndogs", subtitle: "Rue Neuve", emoji: "🏪" },
  { id: "event-1", name: "Sekai Event 1", subtitle: "Point de vente", emoji: "🎪" },
  { id: "event-2", name: "Sekai Event 2", subtitle: "Point de vente", emoji: "🎪" },
];

const RUE_NEUVE_STOCK = [
  { store: "🧃 OZ FOOD", name: "Saucisse", qty: "23", unit: "", threshold: 10, threshold_label: "< 10" },
  { store: "🧃 OZ FOOD", name: "Frites", qty: "6", unit: "", threshold: 6, threshold_label: "< 6" },
  { store: "🧃 OZ FOOD", name: "Huile", qty: "2", unit: "", threshold: 4, threshold_label: "< 4" },
  { store: "🧃 OZ FOOD", name: "Ketchup", qty: "3", unit: "bidons", threshold: 2, threshold_label: "< 2 bidons" },
  { store: "🧃 OZ FOOD", name: "Mayonnaise", qty: "1", unit: "", threshold: 1, threshold_label: "< 1" },
  { store: "🧃 OZ FOOD", name: "Spicy Mayo", qty: "1", unit: "", threshold: 10, threshold_label: "< 10" },
  { store: "🧃 OZ FOOD", name: "Sriracha", qty: "3", unit: "", threshold: 6, threshold_label: "< 6" },
  { store: "🧃 OZ FOOD", name: "BBQ", qty: "2", unit: "", threshold: 6, threshold_label: "< 6" },
  { store: "🧃 OZ FOOD", name: "Aigre douce", qty: "2", unit: "", threshold: 6, threshold_label: "< 6" },
  { store: "🧃 OZ FOOD", name: "Samouraï", qty: "1 haut/1 bas", unit: "pots", threshold: 1, threshold_label: "< 1 pot" },
  { store: "🧃 OZ FOOD", name: "Andalouse", qty: "1 haut/1 bas", unit: "pots", threshold: 1, threshold_label: "< 1 pot" },
  { store: "🧃 OZ FOOD", name: "Ice tea pêche", qty: "", unit: "paquets", threshold: 3, threshold_label: "< 3 paquets" },
  { store: "🧃 OZ FOOD", name: "Ice tea pétillant", qty: "", unit: "paquets", threshold: 2, threshold_label: "< 2 paquets" },
  { store: "🧃 OZ FOOD", name: "Coca Turca", qty: "", unit: "paquets", threshold: 3, threshold_label: "< 3 paquets" },
  { store: "🧃 OZ FOOD", name: "Eau Spa", qty: "", unit: "paquets", threshold: 3, threshold_label: "< 3 paquets" },
  { store: "🧃 OZ FOOD", name: "Oasis rouge", qty: "", unit: "paquets", threshold: 2, threshold_label: "< 2 paquets" },
  { store: "🧃 OZ FOOD", name: "Oasis mauve", qty: "", unit: "paquets", threshold: 2, threshold_label: "< 2 paquets" },
  { store: "🧃 OZ FOOD", name: "Oasis tropical", qty: "", unit: "paquets", threshold: 2, threshold_label: "< 2 paquets" },
  { store: "🥟 FOOD EX", name: "Gyoza", qty: "en haut", unit: "", threshold: 4, threshold_label: "< 4" },
  { store: "🥟 FOOD EX", name: "Croquette citrouille", qty: "en haut", unit: "", threshold: 4, threshold_label: "< 4" },
  { store: "🧀 TADAL", name: "Fromage", qty: "4", unit: "paquets", threshold: 20, threshold_label: "< 20 paquets" },
  { store: "🧀 TADAL", name: "Takis", qty: "0", unit: "cartons", threshold: 1, threshold_label: "< 1 carton" },
  { store: "🛒 COLRUYT", name: "Farine", qty: "1", unit: "paquets", threshold: 15, threshold_label: "< 15 paquets" },
  { store: "🛒 COLRUYT", name: "Levure", qty: "assez", unit: "", threshold: 3, threshold_label: "< 3" },
  { store: "🛒 COLRUYT", name: "Sucre", qty: "1", unit: "paquets", threshold: 8, threshold_label: "< 8 paquets" },
  { store: "🛒 COLRUYT", name: "Sel", qty: "1", unit: "paquets", threshold: 5, threshold_label: "< 5 paquets" },
  { store: "🛒 COLRUYT", name: "Céréales", qty: "0", unit: "cartons", threshold: 6, threshold_label: "< 6 cartons" },
  { store: "🛒 COLRUYT", name: "Doritos", qty: "1", unit: "cartons", threshold: 1, threshold_label: "< 1 carton" },
  { store: "🛒 COLRUYT", name: "Papier toilette", qty: "0", unit: "", threshold: 6, threshold_label: "< 6" },
  { store: "🛒 COLRUYT", name: "Papier pour les mains", qty: "", unit: "", threshold: 6, threshold_label: "< 6" },
  { store: "🛒 COLRUYT", name: "Sac poubelle 100L", qty: "2", unit: "", threshold: 1, threshold_label: "< 1" },
  { store: "🥔 SILGRO", name: "Patates", qty: "4", unit: "paquets", threshold: 6, threshold_label: "< 6 paquets" },
  { store: "🥔 SILGRO", name: "Oignon frié", qty: "1", unit: "paquets", threshold: 1, threshold_label: "< 1 paquet" },
  { store: "🥔 SILGRO", name: "Barquette frites", qty: "", unit: "paquets", threshold: 6, threshold_label: "< 6 paquets" },
  { store: "🥔 SILGRO", name: "Gants pour les mains", qty: "", unit: "cartons", threshold: 2, threshold_label: "< 2 cartons" },
  { store: "🍜 MAGASIN CHINOIS", name: "Nouilles", qty: "0", unit: "cartons", threshold: 1, threshold_label: "< 1 carton" },
  { store: "🍜 MAGASIN CHINOIS", name: "Baguette", qty: "1", unit: "cartons", threshold: 1, threshold_label: "< 1 carton" },
  { store: "🍶 SAUCE MAISON", name: "Sekai", qty: "0", unit: "", threshold: 3, threshold_label: "< 3" },
];

const EVENT_STOCK = [
  { store: "🧃 OZ FOOD", name: "Saucisse", qty: "", unit: "", threshold: 8, threshold_label: "< 8" },
  { store: "🧃 OZ FOOD", name: "Huile", qty: "", unit: "", threshold: 4, threshold_label: "< 4" },
  { store: "🧃 OZ FOOD", name: "Ketchup", qty: "", unit: "", threshold: 2, threshold_label: "< 2" },
  { store: "🧃 OZ FOOD", name: "Mayonnaise", qty: "", unit: "", threshold: 1, threshold_label: "< 1" },
  { store: "🧃 OZ FOOD", name: "Spicy Mayo", qty: "", unit: "", threshold: 12, threshold_label: "< 12" },
  { store: "🧃 OZ FOOD", name: "Sriracha", qty: "", unit: "", threshold: 8, threshold_label: "< 8" },
  { store: "🧃 OZ FOOD", name: "Aigre douce", qty: "", unit: "", threshold: 10, threshold_label: "< 10" },
  { store: "🧃 OZ FOOD", name: "Andalouse", qty: "", unit: "", threshold: 1, threshold_label: "< 1" },
  { store: "🧀 TADAL", name: "Fromage", qty: "", unit: "cartons", threshold: 10, threshold_label: "< 10 cartons" },
  { store: "🧀 TADAL", name: "Takis", qty: "", unit: "cartons", threshold: 1, threshold_label: "< 1 carton" },
  { store: "🛒 COLRUYT", name: "Farine", qty: "", unit: "kg", threshold: 100, threshold_label: "< 100 kg" },
  { store: "🛒 COLRUYT", name: "Levure", qty: "", unit: "paquets", threshold: 1, threshold_label: "< 1 paquet" },
  { store: "🛒 COLRUYT", name: "Sucre", qty: "", unit: "", threshold: 12, threshold_label: "< 12" },
  { store: "🛒 COLRUYT", name: "Sel", qty: "", unit: "", threshold: 6, threshold_label: "< 6" },
  { store: "🛒 COLRUYT", name: "Céréales", qty: "", unit: "paquets", threshold: 12, threshold_label: "< 12 paquets" },
  { store: "🛒 COLRUYT", name: "Doritos", qty: "", unit: "cartons", threshold: 1, threshold_label: "< 1 carton" },
  { store: "🛒 COLRUYT", name: "Papier pour les mains", qty: "", unit: "", threshold: 5, threshold_label: "< 5" },
  { store: "🛒 COLRUYT", name: "Sac poubelle 100L", qty: "", unit: "", threshold: 2, threshold_label: "< 2" },
  { store: "🥔 SILGRO", name: "Gants pour les mains", qty: "", unit: "paquets", threshold: 3, threshold_label: "< 3 paquets" },
  { store: "🍜 MAGASIN CHINOIS", name: "Baguette", qty: "", unit: "cartons", threshold: 1, threshold_label: "< 1 carton" },
  { store: "🍶 SAUCE MAISON", name: "Sekai", qty: "", unit: "", threshold: 3, threshold_label: "< 3" },
  { store: "🔧 MATÉRIEL", name: "Friteuses", qty: "", unit: "", threshold: 2, threshold_label: "< 2", note: "Prendre au restaurant" },
  { store: "🔧 MATÉRIEL", name: "Vitrine chauffante", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "Prendre au restaurant" },
  { store: "🔧 MATÉRIEL", name: "Grille + bac corndogs", qty: "", unit: "", threshold: 2, threshold_label: "< 2", note: "Prendre au restaurant" },
  { store: "🔧 MATÉRIEL", name: "Pinceaux pour sauces", qty: "", unit: "", threshold: 2, threshold_label: "< 2", note: "Prendre au restaurant" },
  { store: "🔧 MATÉRIEL", name: "Sceau nettoyer friteuse", qty: "", unit: "", threshold: 2, threshold_label: "< 2", note: "Au restaurant" },
  { store: "🔧 MATÉRIEL", name: "Pelle nettoyer friteuse", qty: "", unit: "", threshold: 2, threshold_label: "< 2", note: "Au restaurant" },
  { store: "🔧 MATÉRIEL", name: "Hotte portable", qty: "", unit: "", threshold: 0, threshold_label: "Pas obligatoire", note: "" },
  { store: "🔧 MATÉRIEL", name: "Couteaux", qty: "", unit: "", threshold: 2, threshold_label: "< 2", note: "Prendre au restaurant" },
  { store: "🔧 MATÉRIEL", name: "Tapis couper fromage", qty: "", unit: "", threshold: 2, threshold_label: "< 2", note: "Prendre au restaurant" },
  { store: "🔧 MATÉRIEL", name: "Frigo", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "Chez Moha" },
  { store: "🔧 MATÉRIEL", name: "Sceau poubelle", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "" },
  { store: "🔧 MATÉRIEL", name: "Extincteurs", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "Vérifier péremption !" },
  { store: "🔧 MATÉRIEL", name: "Couverture anti feu", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "" },
  { store: "🔧 MATÉRIEL", name: "Plastique protéger sol", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "" },
  { store: "🔧 MATÉRIEL", name: "Papier collant", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "" },
  { store: "🔧 MATÉRIEL", name: "Pot de sauce", qty: "", unit: "", threshold: 12, threshold_label: "< 12", note: "" },
  { store: "🔧 MATÉRIEL", name: "SumUp", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "" },
  { store: "🔧 MATÉRIEL", name: "Décoration (Sakura etc)", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "" },
  { store: "🔧 MATÉRIEL", name: "Structure trust", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "" },
  { store: "🔧 MATÉRIEL", name: "Diable vert", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "" },
  { store: "🔧 MATÉRIEL", name: "Comptoirs", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "" },
  { store: "🔧 MATÉRIEL", name: "Caisse", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "" },
  { store: "🔧 MATÉRIEL", name: "Monnaie (100€ min)", qty: "", unit: "€", threshold: 100, threshold_label: "< 100€", note: "" },
  { store: "🔧 MATÉRIEL", name: "T-Shirt employés", qty: "", unit: "", threshold: 4, threshold_label: "< 4", note: "" },
  { store: "🔧 MATÉRIEL", name: "Hôtel", qty: "", unit: "", threshold: 0, threshold_label: "", note: "Nom de l'hôtel" },
  { store: "🔧 MATÉRIEL", name: "Camionnettes", qty: "", unit: "", threshold: 0, threshold_label: "Obligatoire !", note: "Nom de la société" },
  { store: "🔧 MATÉRIEL", name: "Eau / Citerne", qty: "", unit: "litres", threshold: 10, threshold_label: "< 10 litres", note: "" },
  { store: "🔧 MATÉRIEL", name: "Machine à pâtes", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "" },
  { store: "🔧 MATÉRIEL", name: "Machine à chips", qty: "", unit: "", threshold: 1, threshold_label: "< 1", note: "" },
];

const STORE_ORDER_RUE_NEUVE = ["🧃 OZ FOOD","🥟 FOOD EX","🧀 TADAL","🛒 COLRUYT","🥔 SILGRO","🍜 MAGASIN CHINOIS","🍶 SAUCE MAISON"];
const STORE_ORDER_EVENT = ["🧃 OZ FOOD","🧀 TADAL","🛒 COLRUYT","🥔 SILGRO","🍜 MAGASIN CHINOIS","🍶 SAUCE MAISON","🔧 MATÉRIEL"];

function isLow(item) {
  if (item.threshold === 0) return false;
  const raw = (item.qty || "").trim().toLowerCase();
  if (raw === "" || raw === "—") return true;
  const num = parseFloat(raw);
  if (!isNaN(num)) return num < item.threshold;
  return false;
}

function groupByStore(items) {
  const map = {};
  items.forEach(item => {
    if (!map[item.store]) map[item.store] = [];
    map[item.store].push(item);
  });
  return map;
}

function getTodayStr() {
  return new Date().toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long" });
}
function getTimeStr() {
  return new Date().toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" });
}

async function fetchStock(restaurantId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/stock?select=*&restaurant_id=eq.${restaurantId}&order=id.asc`, { headers: HEADERS });
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

async function seedStock(restaurantId, seedData) {
  const data = seedData.map(item => ({ ...item, restaurant_id: restaurantId }));
  const res = await fetch(`${SUPABASE_URL}/rest/v1/stock`, {
    method: "POST", headers: HEADERS, body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Seed failed");
  return res.json();
}

async function updateItem(id, qty, updatedBy) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/stock?id=eq.${id}`, {
    method: "PATCH", headers: HEADERS,
    body: JSON.stringify({ qty, updated_by: updatedBy, updated_at: new Date().toISOString() })
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}

async function insertItem(item) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/stock`, {
    method: "POST", headers: HEADERS, body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error("Insert failed");
  return res.json();
}

// ── PAIEMENTS API ──────────────────────────────────────────
async function fetchPaiements() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/paiements?select=*&order=date_echeance.asc`, { headers: HEADERS });
  if (!res.ok) throw new Error("Fetch paiements failed");
  return res.json();
}

async function createPaiement(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/paiements`, {
    method: "POST", headers: HEADERS, body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Create paiement failed");
  return res.json();
}

async function updatePaiement(id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/paiements?id=eq.${id}`, {
    method: "PATCH", headers: HEADERS, body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Update paiement failed");
  return res.json();
}

async function deletePaiement(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/paiements?id=eq.${id}`, {
    method: "DELETE", headers: HEADERS
  });
  if (!res.ok) throw new Error("Delete paiement failed");
}

async function updateItemMeta(id, name, threshold, threshold_label) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/stock?id=eq.${id}`, {
    method: "PATCH", headers: HEADERS,
    body: JSON.stringify({ name, threshold: parseFloat(threshold), threshold_label })
  });
  if (!res.ok) throw new Error("Update meta failed");
  return res.json();
}

async function resetAllQty(restaurantId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/stock?restaurant_id=eq.${restaurantId}`, {
    method: "PATCH", headers: HEADERS,
    body: JSON.stringify({ qty: "" })
  });
  if (!res.ok) throw new Error("Reset failed");
  return res.json();
}

async function loginUser(prenom, password) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*&prenom=eq.${encodeURIComponent(prenom)}&password=eq.${encodeURIComponent(password)}`, { headers: HEADERS });
  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

async function fetchAllUsers() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*&order=id.asc`, { headers: HEADERS });
  if (!res.ok) throw new Error("Fetch users failed");
  return res.json();
}

async function createUser(prenom, password, role, restaurant_id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
    method: "POST", headers: HEADERS,
    body: JSON.stringify({ prenom, password, role, restaurant_id: restaurant_id || null })
  });
  if (!res.ok) throw new Error("Create user failed");
  return res.json();
}

async function updateUser(id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${id}`, {
    method: "PATCH", headers: HEADERS, body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Update user failed");
  return res.json();
}

async function deleteUser(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${id}`, {
    method: "DELETE", headers: HEADERS
  });
  if (!res.ok) throw new Error("Delete user failed");
}

function getCurrentMois() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return d.getFullYear() + "-" + month;
}

// ── EVENT WORKERS API ──────────────────────────────────────
async function fetchEventWorkers() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/event_workers?select=*&order=event_date.asc`, { headers: HEADERS });
  if (!res.ok) throw new Error("Fetch event_workers failed");
  return res.json();
}

async function createEventWorker(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/event_workers`, {
    method: "POST", headers: HEADERS, body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Create event_worker failed");
  return res.json();
}

async function deleteEventWorker(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/event_workers?id=eq.${id}`, {
    method: "DELETE", headers: HEADERS
  });
  if (!res.ok) throw new Error("Delete event_worker failed");
}

// ── FERMETURE API ──────────────────────────────────────────
async function fetchFermetureTaches() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/fermeture_taches?select=*&active=eq.true&order=ordre.asc`, { headers: HEADERS });
  if (!res.ok) throw new Error("Fetch fermeture_taches failed");
  return res.json();
}

async function createFermetureTache(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/fermeture_taches`, {
    method: "POST", headers: HEADERS, body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Create fermeture_tache failed");
  return res.json();
}

async function updateFermetureTache(id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/fermeture_taches?id=eq.${id}`, {
    method: "PATCH", headers: HEADERS, body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Update fermeture_tache failed");
  return res.json();
}

async function fetchFermetureToday(restaurantId) {
  const today = new Date();
  const dateStr = today.getFullYear() + "-" + String(today.getMonth()+1).padStart(2,"0") + "-" + String(today.getDate()).padStart(2,"0");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/fermetures?select=*&restaurant_id=eq.${restaurantId}&date=eq.${dateStr}`, { headers: HEADERS });
  if (!res.ok) throw new Error("Fetch fermeture today failed");
  const arr = await res.json();
  return arr.length > 0 ? arr[0] : null;
}

async function createFermeture(data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/fermetures`, {
    method: "POST", headers: HEADERS, body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Create fermeture failed");
  const arr = await res.json();
  return arr[0];
}

async function terminerFermeture(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/fermetures?id=eq.${id}`, {
    method: "PATCH", headers: HEADERS,
    body: JSON.stringify({ termine_at: new Date().toISOString() })
  });
  if (!res.ok) throw new Error("Terminer fermeture failed");
  return res.json();
}

async function fetchValidations(fermetureId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/fermeture_validations?select=*&fermeture_id=eq.${fermetureId}`, { headers: HEADERS });
  if (!res.ok) throw new Error("Fetch validations failed");
  return res.json();
}

async function validerTache(fermetureId, tache) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/fermeture_validations`, {
    method: "POST", headers: HEADERS,
    body: JSON.stringify({
      fermeture_id: fermetureId,
      tache_id: tache.id,
      tache_label: tache.label,
      tache_section: tache.section
    })
  });
  if (!res.ok) throw new Error("Valider tache failed");
  const arr = await res.json();
  return arr[0];
}

async function unvaliderTache(validationId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/fermeture_validations?id=eq.${validationId}`, {
    method: "DELETE", headers: HEADERS
  });
  if (!res.ok) throw new Error("Unvalider tache failed");
}

async function fetchFermeturesHistorique(restaurantId, days = 30) {
  const since = new Date(); since.setDate(since.getDate() - days);
  const sinceStr = since.getFullYear() + "-" + String(since.getMonth()+1).padStart(2,"0") + "-" + String(since.getDate()).padStart(2,"0");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/fermetures?select=*,fermeture_validations(*)&restaurant_id=eq.${restaurantId}&date=gte.${sinceStr}&order=date.desc`, { headers: HEADERS });
  if (!res.ok) throw new Error("Fetch historique failed");
  return res.json();
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginPrenom, setLoginPrenom] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [page, setPage] = useState("stock");
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStore, setActiveStore] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSave, setLastSave] = useState(null);
  const [toast, setToast] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newThreshold, setNewThreshold] = useState("");
  const [showAlerts, setShowAlerts] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  // Paiements
  const [paiements, setPaiements] = useState([]);
  const [paiementsLoading, setPaiementsLoading] = useState(false);
  const [showAddPaiement, setShowAddPaiement] = useState(false);
  const [paiementView, setPaiementView] = useState("avenir"); // avenir | historique
  const [paiementTitre, setPaiementTitre] = useState("");
  const [paiementMontant, setPaiementMontant] = useState("");
  const [paiementDate, setPaiementDate] = useState("");
  const [paiementType, setPaiementType] = useState("autre");
  const [paiementNote, setPaiementNote] = useState("");
  const [paiementRecurrent, setPaiementRecurrent] = useState(false);
  const [paiementFrequence, setPaiementFrequence] = useState("mensuel");
  const [editItemName, setEditItemName] = useState("");
  const [editItemThreshold, setEditItemThreshold] = useState("");
  const [editItemThresholdLabel, setEditItemThresholdLabel] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUserPrenom, setNewUserPrenom] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("employe");
  const [newUserRestaurant, setNewUserRestaurant] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [newPwd2, setNewPwd2] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showNewPwd2, setShowNewPwd2] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // Horaires
  const [horaires, setHoraires] = useState([]);
  const [horaireView, setHoraireView] = useState("week"); // week | remplacements | stats
  const [showAddHoraire, setShowAddHoraire] = useState(false);
  const [addHoraireDate, setAddHoraireDate] = useState("");
  const [addHoraireEmploye, setAddHoraireEmploye] = useState("");
  const [addHoraireDebut, setAddHoraireDebut] = useState("11:30");
  const [addHoraireFin, setAddHoraireFin] = useState("20:30");
  const [addHoraireExtra, setAddHoraireExtra] = useState(false);
  const [addHoraireExtranom, setAddHoraireExtranom] = useState("");
  const [addHoraireIsRemplacement, setAddHoraireIsRemplacement] = useState(false);
  const [addHoraireRemplaceNom, setAddHoraireRemplaceNom] = useState("");
  const [horaireRestaurant, setHoraireRestaurant] = useState("rue-neuve");
  const [horaireLoading, setHoraireLoading] = useState(false);
  const [remplacementMois, setRemplacementMois] = useState(getCurrentMois());
  // ── Events team ──
  const [eventWorkers, setEventWorkers] = useState([]);
  const [eventWorkersLoading, setEventWorkersLoading] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventLabel, setNewEventLabel] = useState("");
  const [newEventStand, setNewEventStand] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventEmployes, setNewEventEmployes] = useState([]);
  const [newEventNote, setNewEventNote] = useState("");
  const [eventMois, setEventMois] = useState(getCurrentMois());
  // ── Fermeture (closing checklist) ──
  const [fermetureTaches, setFermetureTaches] = useState([]);
  const [currentFermeture, setCurrentFermeture] = useState(null);
  const [validations, setValidations] = useState([]);
  const [fermetureLoading, setFermetureLoading] = useState(false);
  const [fermetureNomInput, setFermetureNomInput] = useState("");
  const [fermetureSubmitting, setFermetureSubmitting] = useState(false);
  const [fermeturesHistorique, setFermeturesHistorique] = useState([]);
  const [fermetureAdminView, setFermetureAdminView] = useState("historique");
  const [selectedFermetureId, setSelectedFermetureId] = useState(null);
  const [editingTache, setEditingTache] = useState(null);
  const [showAddTache, setShowAddTache] = useState(false);
  const [newTacheSection, setNewTacheSection] = useState("Équipement & Nettoyage");
  const [newTacheLabel, setNewTacheLabel] = useState("");
  const [newTacheDescription, setNewTacheDescription] = useState("");
  const [newTacheOptionnelle, setNewTacheOptionnelle] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingId && inputRef.current) inputRef.current.focus();
  }, [editingId]);
  // ⏰ Reset auto à minuit pour la tablette kiosque
  // Si la date change pendant que la tablette est allumée, on relâche
  // la session de la veille pour redemander un nouveau nom le matin.
  useEffect(() => {
    if (!currentUser || currentUser.role !== "tablette") return;
    const getDateStr = () => {
      const d = new Date();
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    };
    let lastDate = getDateStr();
    const interval = setInterval(() => {
      const now = getDateStr();
      if (now !== lastDate) {
        lastDate = now;
        setCurrentFermeture(null);
        setValidations([]);
        setFermetureNomInput("");
        loadFermetureData();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    const saved = localStorage.getItem("sekai_user");
    if (saved) {
      try {
        const user = JSON.parse(saved);
        setCurrentUser(user);
        if (user.role === "employe" && user.restaurant_id) {
          const resto = RESTAURANTS.find(r => r.id === user.restaurant_id);
          if (resto) { setRestaurant(resto); loadData(resto); }
        }
        // Précharger les horaires en arrière-plan
        fetchHoraires("rue-neuve");
        loadEventWorkers();
        loadFermetureData();
      } catch {}
    }
  }, []);

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "superadmin";
  const isSuperAdmin = currentUser?.role === "superadmin";

  const s = { fontFamily: "'Poppins', sans-serif", color: '#3d1a0a' };
  const inputStyle: React.CSSProperties = { background: "#fff8f0", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.9rem 1.2rem", borderRadius: "12px", fontSize: "1rem", width: "100%", fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box" };
  const btnPrimary: React.CSSProperties = { background: "#e8213a", color: "#ffffff", border: "none", padding: "0.9rem", borderRadius: "14px", fontSize: "1rem", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", cursor: "pointer", width: "100%" };

  async function handleLogin() {
    if (!loginPrenom.trim() || !loginPassword.trim()) return;
    setLoginLoading(true); setLoginError("");
    try {
      const user = await loginUser(loginPrenom.trim(), loginPassword.trim());
      if (!user) { setLoginError("Prénom ou mot de passe incorrect."); return; }
      setCurrentUser(user);
      if (rememberMe) {
        localStorage.setItem("sekai_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("sekai_user");
      }
      if (user.role === "employe" && user.restaurant_id) {
        const resto = RESTAURANTS.find(r => r.id === user.restaurant_id);
        if (resto) { setRestaurant(resto); loadData(resto); }
      }
      // Précharger les horaires en arrière-plan
      fetchHoraires("rue-neuve");
        loadEventWorkers();
        loadFermetureData();
    } catch { setLoginError("Erreur de connexion."); }
    finally { setLoginLoading(false); }
  }

  function handleLogout() {
    localStorage.removeItem("sekai_user");
    setCurrentUser(null); setRestaurant(null); setItems([]);
    setActiveStore(null); setPage("stock"); setLoginPrenom(""); setLoginPassword("");
  }

  async function loadData(resto) {
    setLoading(true);
    try {
      const data = await fetchStock(resto.id);
      if (data.length === 0) {
        const seedData = resto.id === "rue-neuve" ? RUE_NEUVE_STOCK : EVENT_STOCK;
        const seeded = await seedStock(resto.id, seedData);
        setItems(seeded);
      } else { setItems(data); }
      setError(null);
    } catch { setError("Impossible de se connecter."); }
    finally { setLoading(false); }
  }

  function flash(msg) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  async function saveQty(id) {
    setSaving(true);
    try {
      await updateItem(id, editVal, currentUser.prenom);
      setItems(prev => prev.map(i => i.id === id ? { ...i, qty: editVal } : i));
      setLastSave({ time: getTimeStr(), who: currentUser.prenom });
      setEditingId(null); flash("✅ Enregistré !");
    } catch { flash("❌ Erreur"); }
    finally { setSaving(false); }
  }

  async function addItem(store) {
    if (!newName.trim()) return;
    const newItem = { store, name: newName.trim(), qty: newQty, unit: "", threshold: parseFloat(newThreshold) || 1, threshold_label: `< ${newThreshold || 1}`, restaurant_id: restaurant.id, updated_by: currentUser.prenom };
    setSaving(true);
    try {
      const [created] = await insertItem(newItem);
      setItems(prev => [...prev, created]);
      setNewName(""); setNewQty(""); setNewThreshold(""); setAddMode(false);
      flash("➕ Article ajouté !");
    } catch { flash("❌ Erreur"); }
    finally { setSaving(false); }
  }

  // Paiements handlers
  async function loadPaiements() {
    setPaiementsLoading(true);
    try {
      const data = await fetchPaiements();
      setPaiements(data);
    } catch { flash("❌ Erreur chargement paiements"); }
    finally { setPaiementsLoading(false); }
  }

  async function handleAddPaiement() {
    if (!paiementTitre.trim() || !paiementDate) return;
    try {
      await createPaiement({
        titre: paiementTitre.trim(),
        montant: parseFloat(paiementMontant.replace(",", ".")) || null,
        date_echeance: paiementDate,
        type: paiementType,
        statut: "en_attente",
        recurrent: paiementRecurrent,
        frequence: paiementRecurrent ? paiementFrequence : null,
        note: paiementNote.trim() || null,
        created_by: currentUser?.prenom
      });
      flash("✅ Paiement ajouté !");
      setShowAddPaiement(false);
      setPaiementTitre(""); setPaiementMontant(""); setPaiementDate("");
      setPaiementNote(""); setPaiementRecurrent(false); setPaiementType("autre");
      loadPaiements();
    } catch { flash("❌ Erreur"); }
  }

  async function handlePayerPaiement(id, recurrent, frequence, dateEcheance) {
    try {
      await updatePaiement(id, { statut: "paye" });
      // Si récurrent, créer le prochain automatiquement
      if (recurrent && frequence) {
        const d = new Date(dateEcheance + "T12:00:00");
        if (frequence === "hebdo") d.setDate(d.getDate() + 7);
        else if (frequence === "mensuel") d.setMonth(d.getMonth() + 1);
        else if (frequence === "trimestriel") d.setMonth(d.getMonth() + 3);
        else if (frequence === "annuel") d.setFullYear(d.getFullYear() + 1);
        const nextDate = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
        const current = paiements.find(p => p.id === id);
        if (current) {
          await createPaiement({
            titre: current.titre, montant: current.montant, date_echeance: nextDate,
            type: current.type, statut: "en_attente", recurrent: true,
            frequence: current.frequence, note: current.note, created_by: current.created_by
          });
        }
      }
      flash("✅ Marqué comme payé !");
      loadPaiements();
    } catch { flash("❌ Erreur"); }
  }

  async function handleDeletePaiement(id) {
    if (!confirm("Supprimer ce paiement ?")) return;
    try { await deletePaiement(id); flash("🗑️ Supprimé !"); loadPaiements(); }
    catch { flash("❌ Erreur"); }
  }

  // Notifications paiements urgents
  function getPaiementsUrgents() {
    const today = new Date();
    const in3days = new Date(today); in3days.setDate(today.getDate() + 3);
    const todayStr = today.getFullYear() + "-" + String(today.getMonth()+1).padStart(2,"0") + "-" + String(today.getDate()).padStart(2,"0");
    const in3Str = in3days.getFullYear() + "-" + String(in3days.getMonth()+1).padStart(2,"0") + "-" + String(in3days.getDate()).padStart(2,"0");
    return paiements.filter(p => p.statut === "en_attente" && p.date_echeance <= in3Str);
  }

  async function handleResetAll() {
    try {
      await resetAllQty(restaurant.id);
      setItems(prev => prev.map(i => ({ ...i, qty: "" })));
      setShowResetConfirm(false);
      flash("🔄 Stock remis à zéro !");
    } catch { flash("❌ Erreur"); }
  }

  async function handleSaveItemMeta(id) {
    try {
      await updateItemMeta(id, editItemName, editItemThreshold, editItemThresholdLabel || "< " + editItemThreshold);
      setItems(prev => prev.map(i => i.id === id ? { ...i, name: editItemName, threshold: parseFloat(editItemThreshold), threshold_label: editItemThresholdLabel || "< " + editItemThreshold } : i));
      setEditItemId(null);
      flash("✅ Article modifié !");
    } catch { flash("❌ Erreur"); }
  }

  async function loadUsers() {
    try { const u = await fetchAllUsers(); setAllUsers(u); } catch { flash("❌ Erreur chargement comptes"); }
  }

  async function handleCreateUser() {
    if (!newUserPrenom.trim() || !newUserPassword.trim()) return;
    try {
      await createUser(newUserPrenom.trim(), newUserPassword.trim(), newUserRole, newUserRestaurant || null);
      flash("✅ Compte créé !"); setShowNewUser(false);
      setNewUserPrenom(""); setNewUserPassword(""); setNewUserRole("employe"); setNewUserRestaurant("");
      loadUsers();
    } catch { flash("❌ Erreur création"); }
  }

  async function handleDeleteUser(id) {
    if (!confirm("Supprimer ce compte ?")) return;
    try { await deleteUser(id); flash("🗑️ Supprimé !"); loadUsers(); } catch { flash("❌ Erreur"); }
  }

  async function handleUpdateUser() {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, { prenom: editingUser.prenom, role: editingUser.role, restaurant_id: editingUser.restaurant_id || null });
      flash("✅ Modifié !"); setEditingUser(null); loadUsers();
    } catch { flash("❌ Erreur"); }
  }

  async function handleChangePwd() {
    if (oldPwd !== currentUser.password) { setPwdMsg("❌ Ancien mot de passe incorrect."); return; }
    if (newPwd.length < 4) { setPwdMsg("❌ Mot de passe trop court (min 4 caractères)."); return; }
    if (newPwd !== newPwd2) { setPwdMsg("❌ Les mots de passe ne correspondent pas."); return; }
    try {
      await updateUser(currentUser.id, { password: newPwd });
      setCurrentUser(prev => ({ ...prev, password: newPwd }));
      setPwdMsg("✅ Mot de passe changé !"); setOldPwd(""); setNewPwd(""); setNewPwd2("");
      setTimeout(() => { setShowChangePwd(false); setPwdMsg(""); }, 1500);
    } catch { setPwdMsg("❌ Erreur."); }
  }

  // ── CYCLE PLANNING ─────────────────────────────────────────
  // Cycle start: Monday April 20, 2026 = Semaine 2, Jour 1 (index 1 in 0-based)
  // CYCLE_START_WEEK_INDEX = 1 (semaine 2 = index 1)
  const CYCLE_START_DATE = "2026-04-20";
  const CYCLE_START_WEEK_INDEX = 1; // semaine 2 = index 1

  // planDay: 0=lun, 1=mar, 2=mer, 3=jeu, 4=ven, 5=sam, 6=dim
  const CYCLE = [
    { // Semaine 1
      0: ["Wassim","Mohammed"], 1: ["Wassim","Mohammed"], 2: ["Mohammed","Nabil"],
      3: ["Mohammed","Nabil"], 4: ["Abdel","Nabil"], 5: ["Wassim","Abdel"], 6: ["Wassim","Abdel"]
    },
    { // Semaine 2
      0: ["Wassim","Nabil"], 1: ["Wassim","Nabil"], 2: ["Nabil","Abdel"],
      3: ["Nabil","Abdel"], 4: ["Mohammed","Abdel"], 5: ["Wassim","Mohammed"], 6: ["Wassim","Mohammed"]
    },
    { // Semaine 3
      0: ["Wassim","Abdel"], 1: ["Wassim","Abdel"], 2: ["Abdel","Mohammed"],
      3: ["Abdel","Mohammed"], 4: ["Nabil","Mohammed"], 5: ["Wassim","Nabil"], 6: ["Wassim","Nabil"]
    }
  ];

  // planDay: 0=lun,...,4=ven, 5=sam, 6=dim
  const HORAIRES_JOUR = {
    0: { debut: "11:30", fin: "20:30" },
    1: { debut: "11:30", fin: "20:30" },
    2: { debut: "11:30", fin: "20:30" },
    3: { debut: "11:30", fin: "20:30" },
    4: { debut: "11:30", fin: "20:30" },
    5: { debut: "12:30", fin: "21:30" },
    6: { debut: "13:30", fin: "20:30" }
  };

  function getPlanDay(dateStr) {
    // Returns 0=lun, 1=mar, ..., 5=sam, 6=dim
    const d = new Date(dateStr + "T12:00:00");
    const dow = d.getDay(); // 0=dim, 1=lun, ..., 6=sam
    return dow === 0 ? 6 : dow - 1;
  }

  function getWeekInCycle(dateStr) {
    const start = new Date(CYCLE_START_DATE + "T12:00:00");
    const d = new Date(dateStr + "T12:00:00");
    const diffDays = Math.round((d - start) / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    return ((CYCLE_START_WEEK_INDEX + diffWeeks) % 3 + 3) % 3;
  }

  function getAutoEmployes(dateStr) {
    if (!dateStr) return [];
    const weekInCycle = getWeekInCycle(dateStr);
    const planDay = getPlanDay(dateStr);
    return CYCLE[weekInCycle][planDay] || [];
  }

  function getAutoHoraire(dateStr) {
    if (!dateStr) return { debut: "11:30", fin: "20:30" };
    const planDay = getPlanDay(dateStr);
    return HORAIRES_JOUR[planDay] || { debut: "11:30", fin: "20:30" };
  }

  function getTodayDateStr() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function getWeekDates() {
    const today = new Date();
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    return Array.from({length: 7}, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return year + "-" + month + "-" + day;
    });
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long" });
  }

  function formatDateShort(dateStr) {
    return new Date(dateStr).toLocaleDateString("fr-BE", { weekday: "short", day: "numeric", month: "short" });
  }

  function normalizeDate(dateStr) {
    // Supabase peut retourner "2026-04-25" ou "2026-04-25T00:00:00"
    return dateStr ? dateStr.split("T")[0] : "";
  }

  function calcHeures(debut, fin) {
    const [dh, dm] = debut.split(":").map(Number);
    const [fh, fm] = fin.split(":").map(Number);
    const total = (fh * 60 + fm) - (dh * 60 + dm);
    return (total / 60).toFixed(1);
  }

  async function fetchHoraires(restoId) {
    setHoraireLoading(true);
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/horaires?select=*&restaurant_id=eq.${restoId}&order=date.asc,heure_debut.asc`,
        { headers: HEADERS }
      );
      if (!res.ok) throw new Error("Fetch horaires failed");
      const data = await res.json();
      setHoraires(data);
    } catch { flash("❌ Erreur chargement horaires"); }
    finally { setHoraireLoading(false); }
  }

  async function addHoraire(entry) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/horaires`, {
      method: "POST", headers: HEADERS, body: JSON.stringify(entry)
    });
    if (!res.ok) throw new Error("Add horaire failed");
    return res.json();
  }

  async function deleteHoraire(id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/horaires?id=eq.${id}`, {
      method: "DELETE", headers: HEADERS
    });
    if (!res.ok) throw new Error("Delete horaire failed");
  }

  async function handleAddHoraire() {
    if (!addHoraireDate) return;
    const employes = addHoraireExtra
      ? [{ nom: addHoraireExtranom, extra: true }]
      : [{ nom: addHoraireEmploye, extra: false }];

    try {
      for (const emp of employes) {
        await addHoraire({
          restaurant_id: horaireRestaurant,
          employe_nom: emp.nom,
          date: addHoraireDate,
          heure_debut: addHoraireDebut,
          heure_fin: addHoraireFin,
          est_remplacement: addHoraireIsRemplacement,
          remplace_nom: addHoraireIsRemplacement ? addHoraireRemplaceNom : null,
          extra: emp.extra,
          created_by: currentUser.prenom
        });
      }
      flash("✅ Horaire ajouté !");
      setShowAddHoraire(false);
      setAddHoraireEmploye(""); setAddHoraireExtra(false); setAddHoraireExtranom("");
      setAddHoraireIsRemplacement(false); setAddHoraireRemplaceNom("");
      fetchHoraires(horaireRestaurant);
    } catch { flash("❌ Erreur"); }
  }

  async function handleDeleteHoraire(id) {
    if (!confirm("Annuler cet horaire ?")) return;
    try {
      await deleteHoraire(id);
      flash("🗑️ Horaire annulé !");
      fetchHoraires(horaireRestaurant);
    } catch { flash("❌ Erreur"); }
  }

  // ── Events team handlers ──
  async function loadEventWorkers() {
    setEventWorkersLoading(true);
    try {
      const data = await fetchEventWorkers();
      setEventWorkers(data);
    } catch { flash("❌ Erreur chargement events"); }
    finally { setEventWorkersLoading(false); }
  }

  async function handleAddEvent() {
    if (!newEventLabel.trim() || !newEventDate || newEventEmployes.length === 0) {
      flash("❌ Nom, date et au moins 1 personne requis");
      return;
    }
    try {
      for (const nom of newEventEmployes) {
        await createEventWorker({
          employe_nom: nom,
          event_label: newEventLabel.trim(),
          event_stand: newEventStand || null,
          event_date: newEventDate,
          notes: newEventNote.trim() || null,
          assigned_by: currentUser.prenom
        });
      }
      flash(`✅ Event ajouté pour ${newEventEmployes.length} personne${newEventEmployes.length > 1 ? "s" : ""}`);
      setShowAddEvent(false);
      setNewEventLabel(""); setNewEventStand(""); setNewEventDate("");
      setNewEventEmployes([]); setNewEventNote("");
      loadEventWorkers();
    } catch { flash("❌ Erreur création event"); }
  }

  async function handleDeleteEventWorker(id) {
    if (!confirm("Retirer cette personne de l'event ?")) return;
    try {
      await deleteEventWorker(id);
      flash("🗑️ Retiré !");
      loadEventWorkers();
    } catch { flash("❌ Erreur"); }
  }

  function toggleEventEmploye(nom) {
    setNewEventEmployes(prev =>
      prev.includes(nom) ? prev.filter(n => n !== nom) : [...prev, nom]
    );
  }

  // ── Fermeture handlers ──
  async function loadFermetureData() {
    setFermetureLoading(true);
    try {
      const [taches, today] = await Promise.all([fetchFermetureTaches(), fetchFermetureToday("rue-neuve")]);
      setFermetureTaches(taches);
      setCurrentFermeture(today);
      if (today) {
        const vals = await fetchValidations(today.id);
        setValidations(vals);
      } else { setValidations([]); }
    } catch { flash("❌ Erreur chargement fermeture"); }
    finally { setFermetureLoading(false); }
  }

  async function loadFermetureHistorique() {
    try {
      const data = await fetchFermeturesHistorique("rue-neuve", 30);
      setFermeturesHistorique(data);
    } catch { flash("❌ Erreur historique"); }
  }

  async function handleStartFermeture() {
    const nom = fermetureNomInput.trim();
    if (!nom) { flash("❌ Entre ton prénom"); return; }
    setFermetureSubmitting(true);
    try {
      const today = new Date();
      const dateStr = today.getFullYear() + "-" + String(today.getMonth()+1).padStart(2,"0") + "-" + String(today.getDate()).padStart(2,"0");
      const created = await createFermeture({ restaurant_id: "rue-neuve", date: dateStr, nom_personne: nom });
      setCurrentFermeture(created);
      setValidations([]);
      setFermetureNomInput("");
      flash("✅ C'est parti !");
    } catch { flash("❌ Erreur démarrage"); }
    finally { setFermetureSubmitting(false); }
  }

  async function handleToggleTache(tache) {
    if (!currentFermeture || currentFermeture.termine_at) return;
    const existing = validations.find(v => v.tache_id === tache.id);
    try {
      if (existing) {
        await unvaliderTache(existing.id);
        setValidations(prev => prev.filter(v => v.id !== existing.id));
      } else {
        const v = await validerTache(currentFermeture.id, tache);
        setValidations(prev => [...prev, v]);
      }
    } catch { flash("❌ Erreur"); }
  }

  async function handleTerminerFermeture() {
    if (!currentFermeture) return;
    if (!confirm("Terminer la fermeture ?")) return;
    try {
      await terminerFermeture(currentFermeture.id);
      setCurrentFermeture(prev => ({ ...prev, termine_at: new Date().toISOString() }));
      flash("✅ Fermeture terminée !");
    } catch { flash("❌ Erreur"); }
  }

  async function handleCreateTache() {
    if (!newTacheLabel.trim()) { flash("❌ Label requis"); return; }
    try {
      const maxOrdre = fermetureTaches.length > 0 ? Math.max(...fermetureTaches.map(t => t.ordre || 0)) : 0;
      await createFermetureTache({
        section: newTacheSection,
        label: newTacheLabel.trim(),
        description: newTacheDescription.trim() || null,
        ordre: maxOrdre + 10,
        optionnelle: newTacheOptionnelle,
        active: true,
        restaurant_id: "rue-neuve"
      });
      flash("✅ Tâche ajoutée !");
      setShowAddTache(false);
      setNewTacheLabel(""); setNewTacheDescription(""); setNewTacheOptionnelle(false);
      const updated = await fetchFermetureTaches();
      setFermetureTaches(updated);
    } catch { flash("❌ Erreur"); }
  }

  async function handleUpdateTache() {
    if (!editingTache) return;
    try {
      await updateFermetureTache(editingTache.id, {
        section: editingTache.section,
        label: editingTache.label,
        description: editingTache.description || null,
        optionnelle: editingTache.optionnelle
      });
      flash("✅ Modifié !");
      setEditingTache(null);
      const updated = await fetchFermetureTaches();
      setFermetureTaches(updated);
    } catch { flash("❌ Erreur"); }
  }

  async function handleDeleteTache(id) {
    if (!confirm("Désactiver cette tâche ? (l'historique reste)")) return;
    try {
      await updateFermetureTache(id, { active: false });
      flash("🗑️ Désactivée");
      const updated = await fetchFermetureTaches();
      setFermetureTaches(updated);
    } catch { flash("❌ Erreur"); }
  }

  async function handleMoveTache(tache, direction) {
    const sorted = [...fermetureTaches].sort((a: any, b: any) => a.ordre - b.ordre);
    const idx = sorted.findIndex(t => t.id === tache.id);
    const otherIdx = direction === "up" ? idx - 1 : idx + 1;
    if (otherIdx < 0 || otherIdx >= sorted.length) return;
    const other = sorted[otherIdx];
    try {
      await updateFermetureTache(tache.id, { ordre: other.ordre });
      await updateFermetureTache(other.id, { ordre: tache.ordre });
      const updated = await fetchFermetureTaches();
      setFermetureTaches(updated);
    } catch { flash("❌ Erreur"); }
  }

  const BottomNav = () => (currentUser && currentUser.role !== "tablette") ? (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff8f0", borderTop: "1.5px solid #f0d8b8", display: "flex", zIndex: 40, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {[
        { id: "stock", label: "Stock", icon: "stock", adminOnly: false },
        { id: "horaires", label: "Horaires", icon: "horaires", adminOnly: false },
        { id: "paiements", label: "Tâches", icon: "taches", adminOnly: true },
        { id: "profil", label: "Profil", icon: "profil", adminOnly: false }
      ].filter(tab => !tab.adminOnly || isAdmin).map(tab => (
        <button key={tab.id} onClick={() => { setPage(tab.id); if (tab.id === "comptes") loadUsers(); if (tab.id === "horaires" && !horaires.length) fetchHoraires(horaireRestaurant); if (tab.id === "paiements") loadPaiements(); if (tab.id === "fermetures") { loadFermetureHistorique(); loadFermetureData(); } }} style={{ flex: 1, background: "none", border: "none", padding: "0.7rem 0", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.15rem" }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {tab.icon === "stock" && <Package size={20} color={page === tab.id ? "#e8213a" : "#c8a878"} />}
            {tab.icon === "horaires" && <Calendar size={20} color={page === tab.id ? "#e8213a" : "#c8a878"} />}
            {tab.icon === "taches" && <ListChecks size={20} color={page === tab.id ? "#e8213a" : "#c8a878"} />}
            {tab.icon === "profil" && <UserCircle size={20} color={page === tab.id ? "#e8213a" : "#c8a878"} />}
          </span>
          <span style={{ fontSize: "0.65rem", color: page === tab.id ? "#f5c842" : "#444", fontFamily: "'Poppins', sans-serif" }}>{tab.label}</span>
        </button>
      ))}
    </div>
  ) : null;

  // ── TABLETTE FERMETURE PAGE ──────────────────────────────
  if (currentUser && currentUser.role === "tablette") {
    return (
      <div style={{ ...s, minHeight: "100vh", background: "#faebd7", padding: "1rem", paddingBottom: "2rem" }}>
        {toast && <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", background: "#faebd7", color: "#e8213a", padding: "0.55rem 1.4rem", borderRadius: "20px", fontSize: "0.88rem", zIndex: 999, border: "1.5px solid #f0d8b8" }}>{toast}</div>}
        <div style={{ background: "#e8213a", borderRadius: "12px", padding: "1.2rem", marginBottom: "1rem", textAlign: "center" }}>
          <h1 style={{ color: "#fff", fontSize: "1.4rem", margin: 0 }}>🌙 Fermeture du soir</h1>
          <p style={{ color: "#ffffffcc", fontSize: "0.9rem", margin: "0.4rem 0 0", textTransform: "capitalize" }}>{getTodayStr()}</p>
        </div>
        {fermetureLoading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#e8213a" }}>
            <div style={{ fontSize: "2rem" }}>⏳</div>
            <p>Chargement...</p>
          </div>
        ) : (currentFermeture && currentFermeture.termine_at) ? (
          <div style={{ background: "#fff8f0", border: "1.5px solid #4caf5033", borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
            <h2 style={{ color: "#4caf50", fontSize: "1.3rem", margin: "0 0 0.5rem" }}>Fermeture déjà faite</h2>
            <p style={{ color: "#3d1a0a", fontSize: "1.1rem", margin: "0 0 0.5rem" }}>par <strong>{currentFermeture.nom_personne}</strong></p>
            <p style={{ color: "#a07848", fontSize: "0.9rem", margin: "0 0 1.5rem" }}>à {new Date(currentFermeture.termine_at).toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}</p>
            <p style={{ color: "#a07848", fontSize: "0.95rem", margin: "0 0 1.5rem" }}>Reviens demain 👋</p>
            <button onClick={handleLogout} style={{ background: "#e8213a", color: "#fff", border: "none", padding: "0.9rem 2rem", borderRadius: "10px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>🚪 Déconnexion</button>
          </div>
        ) : !currentFermeture ? (
          <div style={{ background: "#fff8f0", border: "1.5px solid #f0d8b8", borderRadius: "16px", padding: "2rem", textAlign: "center" }}>
            <h2 style={{ color: "#3d1a0a", fontSize: "1.2rem", margin: "0 0 1rem" }}>Qui fait la fermeture ce soir ?</h2>
            <input value={fermetureNomInput} onChange={e => setFermetureNomInput(e.target.value)} placeholder="Ton prénom..." autoFocus
              onKeyDown={e => e.key === "Enter" && handleStartFermeture()}
              style={{ background: "#faebd7", border: "2px solid #f5c842", color: "#3d1a0a", padding: "1rem 1.2rem", borderRadius: "12px", fontSize: "1.1rem", width: "100%", maxWidth: "300px", fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box", textAlign: "center" }} />
            <button onClick={handleStartFermeture} disabled={fermetureSubmitting || !fermetureNomInput.trim()}
              style={{ display: "block", margin: "1rem auto 0", background: "#e8213a", color: "#fff", border: "none", padding: "0.9rem 2rem", borderRadius: "10px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", opacity: (fermetureSubmitting || !fermetureNomInput.trim()) ? 0.5 : 1, fontFamily: "'Poppins', sans-serif", touchAction: "manipulation", WebkitTapHighlightColor: "rgba(255,255,255,0.2)" }}>
              {fermetureSubmitting ? "..." : "Commencer la checklist →"}
            </button>
            <button onClick={handleLogout} style={{ display: "block", margin: "1.5rem auto 0", background: "transparent", border: "none", color: "#a07848", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline" }}>Déconnexion</button>
          </div>
        ) : (() => {
          const sectionsOrder = ["Équipement & Nettoyage", "Terrasse & salle", "Fermeture générale"];
          const tachesParSection: any = {};
          fermetureTaches.forEach(t => {
            if (!tachesParSection[t.section]) tachesParSection[t.section] = [];
            tachesParSection[t.section].push(t);
          });
          const tachesObligatoires = fermetureTaches.filter(t => !t.optionnelle);
          const obligatoiresValidees = tachesObligatoires.filter(t => validations.find(v => v.tache_id === t.id));
          const peutTerminer = tachesObligatoires.length > 0 && obligatoiresValidees.length === tachesObligatoires.length;
          const restantes = tachesObligatoires.length - obligatoiresValidees.length;
          const SECTION_COLORS: any = {
            "Équipement & Nettoyage": { bg: "#fff5e6", border: "#f5a623", color: "#e8213a" },
            "Terrasse & salle": { bg: "#f0f8ff", border: "#6ab0ff", color: "#1e6abf" },
            "Fermeture générale": { bg: "#f5fff8", border: "#4caf50", color: "#2e7d32" }
          };
          return (
            <div>
              <div style={{ background: "#fff8f0", border: "1.5px solid #f0d8b8", borderRadius: "12px", padding: "1rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#3d1a0a", fontSize: "0.95rem", fontWeight: "bold" }}>👤 {currentFermeture.nom_personne}</div>
                  <div style={{ color: "#a07848", fontSize: "0.78rem" }}>Démarré à {new Date(currentFermeture.demarre_at).toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <div style={{ color: peutTerminer ? "#4caf50" : "#e8213a", fontSize: "1.2rem", fontWeight: "bold" }}>{obligatoiresValidees.length}/{tachesObligatoires.length}</div>
              </div>
              {sectionsOrder.map(section => {
                const taches = (tachesParSection[section] || []).slice().sort((a: any, b: any) => a.ordre - b.ordre);
                if (taches.length === 0) return null;
                const colors = SECTION_COLORS[section] || { bg: "#fff8f0", border: "#f0d8b8", color: "#3d1a0a" };
                return (
                  <div key={section} style={{ marginBottom: "1rem" }}>
                    <div style={{ background: colors.bg, color: colors.color, border: "1.5px solid " + colors.border + "55", borderRadius: "12px 12px 0 0", padding: "0.7rem 1rem", fontSize: "0.85rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>{section}</div>
                    {taches.map((t: any) => {
                      const v = validations.find(vv => vv.tache_id === t.id);
                      const checked = !!v;
                      return (
                        <button key={t.id} type="button" onClick={() => handleToggleTache(t)} style={{ background: checked ? "#f5fff8" : "#fff8f0", border: "1.5px solid " + (checked ? "#4caf5055" : "#f0d8b8"), borderTop: "none", padding: "1.2rem 1.2rem", display: "flex", alignItems: "flex-start", gap: "0.9rem", cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "inherit", touchAction: "manipulation", WebkitTapHighlightColor: "rgba(232,33,58,0.15)" }}>
                          <div style={{ width: "1.6rem", height: "1.6rem", borderRadius: "50%", border: "2.5px solid " + (checked ? "#4caf50" : "#c8a878"), background: checked ? "#4caf50" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "0.1rem" }}>
                            {checked && <span style={{ color: "#fff", fontSize: "1.1rem", fontWeight: "bold" }}>✓</span>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                              <span style={{ color: checked ? "#4caf50" : "#3d1a0a", fontSize: "1rem", fontWeight: "bold", textDecoration: checked ? "line-through" : "none" }}>{t.label}</span>
                              {t.optionnelle && <span style={{ background: "#e0e0e0", color: "#666", borderRadius: "8px", padding: "0.1rem 0.5rem", fontSize: "0.65rem", fontWeight: "bold" }}>OPTIONNELLE</span>}
                            </div>
                            {t.description && <div style={{ color: "#a07848", fontSize: "0.78rem", marginTop: "0.3rem" }}>{t.description}</div>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
              <button onClick={handleTerminerFermeture} disabled={!peutTerminer}
                style={{ background: peutTerminer ? "#4caf50" : "#c8a878", color: "#fff", border: "none", padding: "1.2rem", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "bold", cursor: peutTerminer ? "pointer" : "not-allowed", width: "100%", fontFamily: "'Poppins', sans-serif", marginTop: "1rem", opacity: peutTerminer ? 1 : 0.7, touchAction: "manipulation", WebkitTapHighlightColor: "rgba(255,255,255,0.2)" }}>
                {peutTerminer ? "✅ Terminer la fermeture" : "Encore " + restantes + " tâche" + (restantes > 1 ? "s" : "") + " obligatoire" + (restantes > 1 ? "s" : "")}
              </button>
              <button onClick={handleLogout} style={{ display: "block", margin: "1rem auto 0", background: "transparent", border: "none", color: "#a07848", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline" }}>Déconnexion</button>
            </div>
          );
        })()}
      </div>
    );
  }

  // ── HORAIRES PAGE ─────────────────────────────────────────
  if (page === "horaires" && currentUser) {
    const todayStr = getTodayDateStr();
    const weekDates = getWeekDates();

    const moisHoraires = horaires.filter(h => normalizeDate(h.date).startsWith(remplacementMois));
    const remplacementsParPersonne = {};
    moisHoraires.filter(h => h.est_remplacement).forEach(h => {
      const nom = h.remplace_nom;
      if (!remplacementsParPersonne[nom]) remplacementsParPersonne[nom] = { count: 0, heures: 0, details: [] };
      remplacementsParPersonne[nom].count++;
      remplacementsParPersonne[nom].heures += parseFloat(calcHeures(h.heure_debut.slice(0,5), h.heure_fin.slice(0,5)));
      remplacementsParPersonne[nom].details.push(h);
    });

    const AddModal = () => {
      if (!showAddHoraire) return null;
      const workersToday = getAutoEmployes(addHoraireDate);
      return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#fff8f0", borderRadius: "16px 16px 0 0", padding: "1.2rem", width: "100%", display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#e8213a", fontWeight: "bold", fontSize: "0.95rem" }}>
                ➕ {addHoraireDate ? formatDateShort(addHoraireDate) : "📅 Choisir une date future"}
              </div>
              <button onClick={() => { setShowAddHoraire(false); setAddHoraireIsRemplacement(false); setAddHoraireExtra(false); setAddHoraireEmploye(""); setAddHoraireExtranom(""); setAddHoraireRemplaceNom(""); }}
                style={{ background: "#2a2a2a", border: "none", color: "#c8a878", borderRadius: "50%", width: "2rem", height: "2rem", cursor: "pointer", fontSize: "1rem" }}>✕</button>
            </div>

            {/* Date picker - only future dates (after current week) */}
            {(() => {
              const today = new Date();
              const dow = today.getDay();
              const sunday = new Date(today);
              sunday.setDate(today.getDate() + (dow === 0 ? 0 : 7 - dow));
              const minDate = sunday.getFullYear() + "-" + String(sunday.getMonth()+1).padStart(2,"0") + "-" + String(sunday.getDate()).padStart(2,"0");
              return (
                <input type="date" value={addHoraireDate} min={minDate}
                  onChange={e => {
                    setAddHoraireDate(e.target.value);
                    if (e.target.value) {
                      const h = getAutoHoraire(e.target.value);
                      setAddHoraireDebut(h.debut);
                      setAddHoraireFin(h.fin);
                    }
                  }}
                  style={{ background: "#faebd7", border: `1px solid ${addHoraireDate ? "#2e2e2e" : "#f5c842"}`, color: "#3d1a0a", padding: "0.7rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box" as const, width: "100%" }} />
              );
            })()}

            {/* Type selection - only show after date selected */}
            {addHoraireDate && <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => { setAddHoraireIsRemplacement(false); setAddHoraireExtra(false); }}
                style={{ flex: 1, background: !addHoraireIsRemplacement && !addHoraireExtra ? "#f5c842" : "#1e1e1e", color: !addHoraireIsRemplacement && !addHoraireExtra ? "#111" : "#555", border: "none", borderRadius: "8px", padding: "0.6rem", fontSize: "0.8rem", fontFamily: "'Poppins', sans-serif", cursor: "pointer", fontWeight: "bold" }}>
                👤 Employé normal
              </button>
              <button onClick={() => { setAddHoraireExtra(true); setAddHoraireIsRemplacement(false); }}
                style={{ flex: 1, background: addHoraireExtra ? "#f5c842" : "#1e1e1e", color: addHoraireExtra ? "#111" : "#555", border: "none", borderRadius: "8px", padding: "0.6rem", fontSize: "0.8rem", fontFamily: "'Poppins', sans-serif", cursor: "pointer", fontWeight: "bold" }}>
                ⭐ Extra
              </button>
              <button onClick={() => { setAddHoraireIsRemplacement(true); setAddHoraireExtra(false); }}
                style={{ flex: 1, background: addHoraireIsRemplacement ? "#f5c842" : "#1e1e1e", color: addHoraireIsRemplacement ? "#111" : "#555", border: "none", borderRadius: "8px", padding: "0.6rem", fontSize: "0.8rem", fontFamily: "'Poppins', sans-serif", cursor: "pointer", fontWeight: "bold" }}>
                🔄 Remplacement
              </button>
            </div>}

            {/* Employé normal */}
            {!addHoraireIsRemplacement && !addHoraireExtra && (
              <>
                <select value={addHoraireEmploye} onChange={e => setAddHoraireEmploye(e.target.value)}
                  style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%" }}>
                  <option value="">Choisir un employé...</option>
                  {["Abdel","Nabil","Mohammed","Wassim","Rachid","Ali","Momo"].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#a07848", fontSize: "0.72rem", marginBottom: "0.25rem" }}>Début</div>
                    <input type="time" value={addHoraireDebut} onChange={e => setAddHoraireDebut(e.target.value)}
                      style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.7rem 0.8rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#a07848", fontSize: "0.72rem", marginBottom: "0.25rem" }}>Fin</div>
                    <input type="time" value={addHoraireFin} onChange={e => setAddHoraireFin(e.target.value)}
                      style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.7rem 0.8rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                  </div>
                </div>
              </>
            )}

            {/* Extra */}
            {addHoraireExtra && (
              <>
                <div style={{ color: "#c8a878", fontSize: "0.8rem" }}>Employé existant ou nom libre :</div>
                <select value={addHoraireEmploye} onChange={e => { setAddHoraireEmploye(e.target.value); setAddHoraireExtranom(""); }}
                  style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%" }}>
                  <option value="">-- Choisir un employé --</option>
                  {["Abdel","Nabil","Mohammed","Wassim","Rachid","Ali","Momo"].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <div style={{ color: "#a07848", fontSize: "0.78rem", textAlign: "center" }}>— ou —</div>
                <input value={addHoraireExtranom} onChange={e => { setAddHoraireExtranom(e.target.value); setAddHoraireEmploye(""); }} placeholder="Nom libre (sans compte)..."
                  style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#a07848", fontSize: "0.72rem", marginBottom: "0.25rem" }}>Début</div>
                    <input type="time" value={addHoraireDebut} onChange={e => setAddHoraireDebut(e.target.value)}
                      style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.7rem 0.8rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#a07848", fontSize: "0.72rem", marginBottom: "0.25rem" }}>Fin</div>
                    <input type="time" value={addHoraireFin} onChange={e => setAddHoraireFin(e.target.value)}
                      style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.7rem 0.8rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                  </div>
                </div>
              </>
            )}

            {/* Remplacement */}
            {addHoraireIsRemplacement && (
              <>
                {isAdmin ? (
                  <>
                    <div style={{ color: "#a07848", fontSize: "0.8rem" }}>Qui fait le remplacement ?</div>
                    <select value={addHoraireEmploye} onChange={e => setAddHoraireEmploye(e.target.value)}
                      style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%" }}>
                      <option value="">Qui remplace ?</option>
                      {["Abdel","Nabil","Mohammed","Wassim","Rachid","Ali","Momo"].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </>
                ) : (
                  <div style={{ background: "#f5fff8", border: "1.5px solid #4caf5033", borderRadius: "10px", padding: "0.75rem 1rem" }}>
                    <div style={{ color: "#4caf50", fontSize: "0.72rem", marginBottom: "0.2rem" }}>✅ Tu es le remplaçant</div>
                    <div style={{ color: "#3d1a0a", fontSize: "0.95rem", fontWeight: "600" }}>{currentUser?.prenom}</div>
                  </div>
                )}
                <div style={{ color: "#c8a878", fontSize: "0.8rem" }}>Qui est remplacé ? (prend ses heures automatiquement)</div>
                <select value={addHoraireRemplaceNom} onChange={e => {
                  setAddHoraireRemplaceNom(e.target.value);
                  const h = getAutoHoraire(addHoraireDate);
                  setAddHoraireDebut(h.debut);
                  setAddHoraireFin(h.fin);
                }}
                  style={{ background: "#faebd7", border: "1px solid #e57373", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%" }}>
                  <option value="">Qui est remplacé ?</option>
                  {getAutoEmployes(addHoraireDate).map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#a07848", fontSize: "0.72rem", marginBottom: "0.25rem" }}>Début (auto)</div>
                    <input type="time" value={addHoraireDebut} onChange={e => setAddHoraireDebut(e.target.value)}
                      style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.7rem 0.8rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#a07848", fontSize: "0.72rem", marginBottom: "0.25rem" }}>Fin (auto)</div>
                    <input type="time" value={addHoraireFin} onChange={e => setAddHoraireFin(e.target.value)}
                      style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.7rem 0.8rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                  </div>
                </div>
              </>
            )}

            {addHoraireDate && <button onClick={async () => {
              if (!addHoraireDate) return;
              const nom = addHoraireExtra ? (addHoraireExtranom || addHoraireEmploye) : (addHoraireIsRemplacement && !isAdmin ? currentUser?.prenom : addHoraireEmploye);
              if (!nom) return;
              try {
                await addHoraire({
                  restaurant_id: horaireRestaurant,
                  employe_nom: nom,
                  date: addHoraireDate,
                  heure_debut: addHoraireDebut,
                  heure_fin: addHoraireFin,
                  est_remplacement: addHoraireIsRemplacement,
                  remplace_nom: addHoraireIsRemplacement ? addHoraireRemplaceNom : null,
                  extra: addHoraireExtra,
                  created_by: currentUser.prenom
                });
                flash("✅ Ajouté !");
                setShowAddHoraire(false);
                setAddHoraireIsRemplacement(false); setAddHoraireExtra(false);
                setAddHoraireEmploye(""); setAddHoraireExtranom(""); setAddHoraireRemplaceNom("");
                fetchHoraires(horaireRestaurant);
              } catch { flash("❌ Erreur"); }
            }} style={{ background: "#e8213a", color: "#ffffff", border: "none", padding: "0.9rem", borderRadius: "10px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", width: "100%" }}>
              ✅ Confirmer
            </button>}
          </div>
        </div>
      );
    };

    return (
      <div style={{ ...s, minHeight: "100vh", background: "#faebd7", paddingBottom: "6rem" }}>
        {toast && <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", background: "#faebd7", color: "#e8213a", padding: "0.55rem 1.4rem", borderRadius: "20px", fontSize: "0.88rem", zIndex: 999, border: "1.5px solid #f0d8b8", whiteSpace: "nowrap" }}>{toast}</div>}
        <AddModal />

        {/* Header */}
        <div style={{ background: "#fff8f0", padding: "1rem 1.2rem", borderBottom: "1.5px solid #f0d8b8", position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h1 style={{ color: "#ffffff", fontSize: "1.1rem", margin: 0 }}>📅 Horaires</h1>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <select value={horaireRestaurant} onChange={e => { setHoraireRestaurant(e.target.value); setHoraires([]); fetchHoraires(e.target.value); }}
                style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#e8213a", borderRadius: "8px", padding: "0.3rem 0.5rem", fontSize: "0.75rem", fontFamily: "'Poppins', sans-serif" }}>
                {RESTAURANTS.map(r => <option key={r.id} value={r.id}>{r.emoji} {r.name}</option>)}
              </select>
              <button onClick={() => fetchHoraires(horaireRestaurant)}
                style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#a07848", borderRadius: "8px", padding: "0.3rem 0.6rem", fontSize: "0.8rem", cursor: "pointer" }}><RefreshCw size={16} /></button>
              <button onClick={() => {
                setAddHoraireDate("");
                setAddHoraireDebut("11:30");
                setAddHoraireFin("20:30");
                setAddHoraireIsRemplacement(false);
                setAddHoraireExtra(false);
                setAddHoraireEmploye("");
                setAddHoraireExtranom("");
                setAddHoraireRemplaceNom("");
                setShowAddHoraire(true);
              }} style={{ background: "#e8213a", border: "none", color: "#fff", borderRadius: "8px", padding: "0.3rem 0.7rem", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", fontSize: "0.78rem", cursor: "pointer" }}>📅 Autre date</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            {[{id:"week",label:"Semaine"},{id:"remplacements",label:"Remplacements"},{id:"events",label:"Events"},{id:"stats",label:"Stats"},...(isAdmin?[{id:"fermeture",label:"🔒 Fermeture"}]:[])].map(tab => (
              <button key={tab.id} onClick={() => { if (tab.id === "fermeture") { setPage("fermetures"); loadFermetureHistorique(); loadFermetureData(); } else { setHoraireView(tab.id); } }}
                style={{ background: horaireView === tab.id ? "#f5c842" : "#1e1e1e", color: horaireView === tab.id ? "#111" : "#555", border: "none", borderRadius: "8px", padding: "0.35rem 0.9rem", flexShrink: 0, whiteSpace: "nowrap", fontSize: "0.78rem", fontFamily: "'Poppins', sans-serif", fontWeight: horaireView === tab.id ? "bold" : "normal", cursor: "pointer" }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "0.8rem 1.1rem" }}>

          {horaireLoading && (
            <div style={{ textAlign: "center", padding: "3rem", color: "#e8213a" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⏳</div>
              <div style={{ fontSize: "0.85rem" }}>Chargement...</div>
            </div>
          )}

          {!horaireLoading && <>

          {/* WEEK VIEW */}
          {horaireView === "week" && (
            <div>
              {weekDates.map(dateStr => {
                const autoEmps = getAutoEmployes(dateStr);
                const autoH = getAutoHoraire(dateStr);
                const encoded = horaires.filter(h => normalizeDate(h.date) === dateStr);
                const isToday = dateStr === todayStr;
                return (
                  <div key={dateStr} style={{ background: isToday ? "#0f1a0f" : "#141414", border: `1px solid ${isToday ? "#1e3a1e" : "#1e1e1e"}`, borderRadius: "12px", padding: "0.85rem 1rem", marginBottom: "0.5rem" }}>
                    {/* Day header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <div>
                        <span style={{ color: isToday ? "#5cb85c" : "#f5c842", fontSize: "0.85rem", fontWeight: "bold", textTransform: "capitalize" }}>{formatDateShort(dateStr)}</span>
                        {isToday && <span style={{ color: "#4caf50", fontSize: "0.72rem", marginLeft: "0.4rem" }}>· Aujourd'hui</span>}
                        <span style={{ color: "#a07848", fontSize: "0.72rem", marginLeft: "0.5rem" }}>{autoH.debut}-{autoH.fin}</span>
                      </div>
                      {dateStr >= todayStr && (
                        <button onClick={() => {
                          const h = getAutoHoraire(dateStr);
                          setAddHoraireDate(dateStr);
                          setAddHoraireDebut(h.debut);
                          setAddHoraireFin(h.fin);
                          setAddHoraireIsRemplacement(false);
                          setAddHoraireExtra(false);
                          setAddHoraireEmploye("");
                          setShowAddHoraire(true);
                        }} style={{ background: "#e8213a", border: "none", color: "#fff", borderRadius: "50%", width: "1.8rem", height: "1.8rem", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                      )}
                    </div>
                    {/* Workers */}
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {autoEmps.map(emp => (
                        <span key={emp} style={{ background: "#1a2a1a", color: "#8bc08b", borderRadius: "6px", padding: "0.25rem 0.6rem", fontSize: "0.78rem" }}>👤 {emp}</span>
                      ))}
                      {encoded.filter(h => !h.extra && !h.est_remplacement).map(h => (
                        <span key={h.id} style={{ background: "#1e2a1e", color: "#7bc07b", borderRadius: "6px", padding: "0.25rem 0.6rem", fontSize: "0.78rem" }}>
                          👤 {h.employe_nom}
                          {isSuperAdmin && <button onClick={() => handleDeleteHoraire(h.id)} style={{ background: "none", border: "none", color: "#e57373", cursor: "pointer", fontSize: "0.7rem", marginLeft: "0.3rem" }}>✕</button>}
                        </span>
                      ))}
                      {encoded.filter(h => h.extra).map(h => (
                        <span key={h.id} style={{ background: "#2a3a1a", color: "#a8d060", borderRadius: "6px", padding: "0.25rem 0.6rem", fontSize: "0.78rem" }}>
                          ⭐ {h.employe_nom}
                          {isSuperAdmin && <button onClick={() => handleDeleteHoraire(h.id)} style={{ background: "none", border: "none", color: "#e57373", cursor: "pointer", fontSize: "0.7rem", marginLeft: "0.3rem" }}>✕</button>}
                        </span>
                      ))}
                      {encoded.filter(h => h.est_remplacement).map(h => (
                        <span key={h.id} style={{ background: "#2a1a1a", color: "#e57373", borderRadius: "6px", padding: "0.25rem 0.6rem", fontSize: "0.78rem" }}>
                          🔄 {h.employe_nom}→{h.remplace_nom}
                          {isSuperAdmin && <button onClick={() => handleDeleteHoraire(h.id)} style={{ background: "none", border: "none", color: "#e57373", cursor: "pointer", fontSize: "0.7rem", marginLeft: "0.3rem" }}>✕</button>}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* REMPLACEMENTS VIEW */}
          {horaireView === "remplacements" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div style={{ color: "#a07848", fontSize: "0.75rem", fontWeight: "bold" }}>Remplacements du mois</div>
                <input type="month" value={remplacementMois} onChange={e => setRemplacementMois(e.target.value)}
                  style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#e8213a", borderRadius: "8px", padding: "0.3rem 0.5rem", fontSize: "0.75rem", fontFamily: "'Poppins', sans-serif", outline: "none" }} />
              </div>
              {Object.keys(remplacementsParPersonne).length === 0 && (
                <div style={{ color: "#c8a878", fontSize: "0.82rem", textAlign: "center", padding: "2rem" }}>Aucun remplacement ce mois-ci</div>
              )}
              {(isAdmin
                ? Object.entries(remplacementsParPersonne)
                : Object.entries(remplacementsParPersonne).filter(([nom]) => nom === currentUser.prenom)
              ).map(([nom, stats]: [string, any]) => (
                <div key={nom} style={{ background: "#fff8f0", border: "1px solid #3a1a1a", borderRadius: "12px", padding: "1rem", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ color: "#e8213a", fontSize: "0.95rem", fontWeight: "bold" }}>👤 {nom}</div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <span style={{ background: "#fff0f0", color: "#e57373", borderRadius: "8px", padding: "0.2rem 0.6rem", fontSize: "0.78rem" }}>{stats.count} jour{stats.count > 1 ? "s" : ""}</span>
                      <span style={{ background: "#1a1a2a", color: "#8888ff", borderRadius: "8px", padding: "0.2rem 0.6rem", fontSize: "0.78rem" }}>{stats.heures.toFixed(1)}h</span>
                    </div>
                  </div>
                  {stats.details.map((h: any) => (
                    <div key={h.id} style={{ borderTop: "1px solid #2a1a1a", paddingTop: "0.4rem", marginTop: "0.4rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem" }}>
                      <span style={{ color: "#777", textTransform: "capitalize" }}>{formatDateShort(normalizeDate(h.date))}</span>
                      <span style={{ color: "#a07848" }}>remplacé par <span style={{ color: "#3d1a0a" }}>{h.employe_nom}</span></span>
                      <span style={{ color: "#a07848" }}>{h.heure_debut.slice(0,5)}-{h.heure_fin.slice(0,5)}</span>
                      {isSuperAdmin && (
                        <button onClick={() => handleDeleteHoraire(h.id)} style={{ background: "none", border: "none", color: "#e57373", cursor: "pointer", fontSize: "0.85rem", padding: "0 0.2rem" }}><Trash2 size={15} /></button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {/* EVENTS VIEW */}
          {horaireView === "events" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div style={{ color: "#a07848", fontSize: "0.75rem", fontWeight: "bold" }}>🎪 Events du mois</div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <input type="month" value={eventMois} onChange={e => setEventMois(e.target.value)}
                    style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#e8213a", borderRadius: "8px", padding: "0.3rem 0.5rem", fontSize: "0.75rem", fontFamily: "'Poppins', sans-serif", outline: "none" }} />
                  {isAdmin && (
                    <button onClick={() => {
                      setNewEventDate(getTodayDateStr());
                      setNewEventLabel(""); setNewEventStand(""); setNewEventEmployes([]); setNewEventNote("");
                      setShowAddEvent(true);
                    }} style={{ background: "#e8213a", border: "none", color: "#fff", borderRadius: "8px", padding: "0.3rem 0.7rem", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", fontSize: "0.78rem", cursor: "pointer" }}>+ Event</button>
                  )}
                </div>
              </div>

              {(() => {
                const moisEvents = eventWorkers.filter(e => normalizeDate(e.event_date).startsWith(eventMois));
                const visible = isAdmin ? moisEvents : moisEvents.filter(e => e.employe_nom === currentUser.prenom);

                const grouped = {};
                visible.forEach(e => {
                  const key = `${normalizeDate(e.event_date)}__${e.event_label}__${e.event_stand || ""}`;
                  if (!grouped[key]) grouped[key] = { date: normalizeDate(e.event_date), label: e.event_label, stand: e.event_stand, items: [], note: e.notes };
                  grouped[key].items.push(e);
                });
                const cards = Object.values(grouped).sort((a: any, b: any) => a.date.localeCompare(b.date));

                if (cards.length === 0) {
                  return <div style={{ color: "#c8a878", fontSize: "0.82rem", textAlign: "center", padding: "2rem" }}>Aucun event ce mois-ci</div>;
                }

                return cards.map((card: any, idx: number) => (
                  <div key={idx} style={{ background: "#fff8f0", border: "1.5px solid #f0d8b8", borderRadius: "12px", padding: "1rem", marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <div>
                        <div style={{ color: "#e8213a", fontSize: "0.95rem", fontWeight: "bold" }}>🎪 {card.label}</div>
                        <div style={{ color: "#a07848", fontSize: "0.78rem", marginTop: "0.2rem", textTransform: "capitalize" }}>
                          📅 {formatDateShort(card.date)}
                          {card.stand && <span style={{ marginLeft: "0.5rem" }}>· {card.stand === "event-1" ? "Event 1" : "Event 2"}</span>}
                        </div>
                      </div>
                      <span style={{ background: "#fff0f0", color: "#e8213a", borderRadius: "10px", padding: "0.2rem 0.6rem", fontSize: "0.78rem", fontWeight: "bold" }}>
                        {card.items.length} pers.
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
                      {card.items.map((it: any) => (
                        <span key={it.id} style={{ background: "#faebd7", color: "#3d1a0a", borderRadius: "8px", padding: "0.3rem 0.7rem", fontSize: "0.82rem", border: "1px solid #f0d8b8", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                          👤 {it.employe_nom}
                          {isAdmin && (
                            <button onClick={() => handleDeleteEventWorker(it.id)}
                              style={{ background: "none", border: "none", color: "#e57373", cursor: "pointer", fontSize: "0.85rem", padding: 0, lineHeight: 1 }}>✕</button>
                          )}
                        </span>
                      ))}
                    </div>
                    {card.note && (
                      <div style={{ color: "#a07848", fontSize: "0.72rem", marginTop: "0.5rem", borderTop: "1px solid #f0d8b8", paddingTop: "0.4rem" }}>
                        📌 {card.note}
                      </div>
                    )}
                  </div>
                ));
              })()}
            </div>
          )}

          {/* EVENT ADD MODAL */}
          {showAddEvent && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
              <div style={{ background: "#fff8f0", borderRadius: "16px 16px 0 0", padding: "1.2rem", width: "100%", display: "flex", flexDirection: "column", gap: "0.7rem", maxHeight: "90vh", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ color: "#e8213a", fontWeight: "bold", fontSize: "0.95rem" }}>🎪 Nouvel event</div>
                  <button onClick={() => setShowAddEvent(false)} style={{ background: "#2a2a2a", border: "none", color: "#c8a878", borderRadius: "50%", width: "2rem", height: "2rem", cursor: "pointer" }}>✕</button>
                </div>

                <input value={newEventLabel} onChange={e => setNewEventLabel(e.target.value)} placeholder="Nom de l'event (ex: Made in Asia 2026)..."
                  style={{ background: "#faebd7", border: "1px solid #f5c842", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" }} />

                <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)}
                  style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" }} />

                <select value={newEventStand} onChange={e => setNewEventStand(e.target.value)}
                  style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%" }}>
                  <option value="">Aucun stand spécifique (optionnel)</option>
                  <option value="event-1">🎪 Event 1</option>
                  <option value="event-2">🎪 Event 2</option>
                </select>

                <div style={{ color: "#a07848", fontSize: "0.78rem", marginTop: "0.3rem" }}>👥 Qui travaille cet event ?</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {["Abdel","Nabil","Mohammed","Wassim","Rachid","Ali","Momo"].map(nom => {
                    const sel = newEventEmployes.includes(nom);
                    return (
                      <button key={nom} onClick={() => toggleEventEmploye(nom)}
                        style={{ background: sel ? "#e8213a" : "#faebd7", color: sel ? "#fff" : "#3d1a0a", border: `1.5px solid ${sel ? "#e8213a" : "#f0d8b8"}`, borderRadius: "20px", padding: "0.4rem 0.9rem", fontSize: "0.85rem", fontFamily: "'Poppins', sans-serif", cursor: "pointer", fontWeight: sel ? "bold" : "normal" }}>
                        {sel ? "✓" : "+"} {nom}
                      </button>
                    );
                  })}
                </div>

                <textarea value={newEventNote} onChange={e => setNewEventNote(e.target.value)} placeholder="Note (optionnel)..." rows={2}
                  style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.9rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box", resize: "none" }} />

                <button onClick={handleAddEvent}
                  disabled={!newEventLabel.trim() || !newEventDate || newEventEmployes.length === 0}
                  style={{ background: "#e8213a", color: "#ffffff", border: "none", padding: "0.9rem", borderRadius: "10px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", width: "100%", opacity: (!newEventLabel.trim() || !newEventDate || newEventEmployes.length === 0) ? 0.5 : 1 }}>
                  ✅ Confirmer ({newEventEmployes.length} pers.)
                </button>
              </div>
            </div>
          )}

          {/* STATS VIEW */}
          {horaireView === "stats" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div style={{ color: "#a07848", fontSize: "0.75rem", fontWeight: "bold" }}>Heures du mois</div>
                <input type="month" value={remplacementMois} onChange={e => setRemplacementMois(e.target.value)}
                  style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#e8213a", borderRadius: "8px", padding: "0.3rem 0.5rem", fontSize: "0.75rem", fontFamily: "'Poppins', sans-serif", outline: "none" }} />
              </div>

              {(() => {
                const moisH = horaires.filter(h => normalizeDate(h.date).startsWith(remplacementMois));
                const daysInMonth = new Date(parseInt(remplacementMois.split("-")[0]), parseInt(remplacementMois.split("-")[1]), 0).getDate();
                const year = parseInt(remplacementMois.split("-")[0]);
                const month = parseInt(remplacementMois.split("-")[1]) - 1;
                const EMPLOYES = ["Wassim", "Rachid", "Ali", "Momo"];

                // Heures prestées cycle
                const heuresPrestees = {};
                for (let d = 1; d <= daysInMonth; d++) {
                  const dateStr = year + "-" + String(month+1).padStart(2,"0") + "-" + String(d).padStart(2,"0");
                  const emps = getAutoEmployes(dateStr);
                  const autoH = getAutoHoraire(dateStr);
                  const h = parseFloat(calcHeures(autoH.debut, autoH.fin));
                  emps.forEach(emp => {
                    if (!heuresPrestees[emp]) heuresPrestees[emp] = { travail: 0, remplace: 0, joursRemplace: 0 };
                    const estRemplace = moisH.find(r => normalizeDate(r.date) === dateStr && r.est_remplacement && r.remplace_nom === emp);
                    if (estRemplace) { heuresPrestees[emp].remplace += h; heuresPrestees[emp].joursRemplace += 1; }
                    else heuresPrestees[emp].travail += h;
                  });
                }

                // Heures faites en remplacement
                const heuresEnPlus = {};
                moisH.filter(r => r.est_remplacement).forEach(r => {
                  if (!heuresEnPlus[r.employe_nom]) heuresEnPlus[r.employe_nom] = { heures: 0, jours: 0, details: [] };
                  const h = parseFloat(calcHeures(r.heure_debut.slice(0,5), r.heure_fin.slice(0,5)));
                  heuresEnPlus[r.employe_nom].heures += h;
                  heuresEnPlus[r.employe_nom].jours += 1;
                  heuresEnPlus[r.employe_nom].details.push(r);
                });

                // Events par personne (compteur)
                const eventsParPersonne = {};
                eventWorkers.filter(e => normalizeDate(e.event_date).startsWith(remplacementMois)).forEach(e => {
                  if (!eventsParPersonne[e.employe_nom]) eventsParPersonne[e.employe_nom] = { count: 0, details: [] };
                  eventsParPersonne[e.employe_nom].count++;
                  eventsParPersonne[e.employe_nom].details.push(e);
                });

                // Heures remplacées
                const heuresRemplacees = {};
                moisH.filter(r => r.est_remplacement).forEach(r => {
                  if (!heuresRemplacees[r.remplace_nom]) heuresRemplacees[r.remplace_nom] = { heures: 0, jours: 0, details: [] };
                  const h = parseFloat(calcHeures(r.heure_debut.slice(0,5), r.heure_fin.slice(0,5)));
                  heuresRemplacees[r.remplace_nom].heures += h;
                  heuresRemplacees[r.remplace_nom].jours += 1;
                  heuresRemplacees[r.remplace_nom].details.push(r);
                });

                // VUE ADMIN/SUPERADMIN
                const ADMINS = ["Abdel", "Nabil", "Mohammed"];
                if (isAdmin) {
                  return (
                    <div>
                      {/* Résumé des 3 admins */}
                      <div style={{ color: "#e8213a", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "0.5rem" }}>👑 Admins</div>
                      {ADMINS.map(nom => {
                        const remplacees = heuresRemplacees[nom];
                        const enPlus = heuresEnPlus[nom];
                        return (
                          <div key={nom} style={{ background: "#fff8f0", border: `1px solid ${nom === currentUser.prenom ? "#f5c842" : "#1e1e1e"}`, borderRadius: "12px", padding: "1rem", marginBottom: "0.6rem" }}>
                            <div style={{ color: "#e8213a", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                              👑 {nom} {nom === currentUser.prenom ? "· Moi" : ""}
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <div style={{ flex: 1, background: "#fff5f5", border: "1px solid #3a1a1a", borderRadius: "8px", padding: "0.6rem 0.8rem" }}>
                                <div style={{ color: "#e57373", fontSize: "0.7rem", marginBottom: "0.2rem" }}>🔄 Remplacé</div>
                                <div style={{ color: "#e57373", fontSize: "1.2rem", fontWeight: "bold" }}>{remplacees ? "-" + remplacees.heures.toFixed(1) + "h" : "0h"}</div>
                                <div style={{ color: "#5a2a2a", fontSize: "0.7rem" }}>{remplacees ? remplacees.jours + " jour" + (remplacees.jours > 1 ? "s" : "") : "0 jour"}</div>
                                {remplacees && remplacees.details.map((r: any) => (
                                  <div key={r.id} style={{ borderTop: "1px solid #2a1a1a", marginTop: "0.3rem", paddingTop: "0.3rem", fontSize: "0.7rem", color: "#7a3a3a" }}>
                                    {formatDateShort(normalizeDate(r.date))} · par {r.employe_nom}
                                  </div>
                                ))}
                              </div>
                              <div style={{ flex: 1, background: "#0f1a2a", border: "1px solid #1e3a5a", borderRadius: "8px", padding: "0.6rem 0.8rem" }}>
                                <div style={{ color: "#6ab0ff", fontSize: "0.7rem", marginBottom: "0.2rem" }}>➕ Fait en plus</div>
                                <div style={{ color: "#6ab0ff", fontSize: "1.2rem", fontWeight: "bold" }}>{enPlus ? "+" + enPlus.heures.toFixed(1) + "h" : "0h"}</div>
                                <div style={{ color: "#2a4a6a", fontSize: "0.7rem" }}>{enPlus ? enPlus.jours + " jour" + (enPlus.jours > 1 ? "s" : "") : "0 jour"}</div>
                                {enPlus && enPlus.details.map((r: any) => (
                                  <div key={r.id} style={{ borderTop: "1px solid #1a2a3a", marginTop: "0.3rem", paddingTop: "0.3rem", fontSize: "0.7rem", color: "#4a7aaa" }}>
                                    {formatDateShort(normalizeDate(r.date))} · pour {r.remplace_nom}
                                  </div>
                                ))}
                              </div>
                              {/* Badge events admin */}
                              {eventsParPersonne[nom] && (
                                <div style={{ flex: 1, background: "#fff5e6", border: "1px solid #f5a62355", borderRadius: "8px", padding: "0.6rem 0.8rem" }}>
                                  <div style={{ color: "#e8213a", fontSize: "0.7rem", marginBottom: "0.2rem" }}>🎪 Events</div>
                                  <div style={{ color: "#e8213a", fontSize: "1.2rem", fontWeight: "bold" }}>+{eventsParPersonne[nom].count}</div>
                                  <div style={{ color: "#a07848", fontSize: "0.7rem" }}>
                                    {eventsParPersonne[nom].count} event{eventsParPersonne[nom].count > 1 ? "s" : ""}
                                  </div>
                                  {eventsParPersonne[nom].details.slice(0, 3).map((ev: any) => (
                                    <div key={ev.id} style={{ borderTop: "1px solid #f0d8b8", marginTop: "0.3rem", paddingTop: "0.3rem", fontSize: "0.7rem", color: "#a07848" }}>
                                      {formatDateShort(normalizeDate(ev.event_date))} · {ev.event_label}
                                      {ev.event_stand && ` (${ev.event_stand})`}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Employés */}
                      <div style={{ color: "#e8213a", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "0.5rem" }}>👤 Employés</div>
                      {EMPLOYES.map(nom => {
                        const st = heuresPrestees[nom];
                        if (!st) return null;
                        const enPlus = heuresEnPlus[nom];
                        return (
                          <div key={nom} style={{ background: "#fff8f0", border: "1.5px solid #f0d8b8", borderRadius: "12px", padding: "1rem", marginBottom: "0.6rem" }}>
                            <div style={{ color: "#3d1a0a", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "0.5rem" }}>👤 {nom}</div>
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                              <div style={{ background: "#f5fff8", border: "1.5px solid #4caf5033", borderRadius: "8px", padding: "0.5rem 0.8rem", flex: 1 }}>
                                <div style={{ color: "#4caf50", fontSize: "0.7rem", marginBottom: "0.2rem" }}>✅ Prestées</div>
                                <div style={{ color: "#3d1a0a", fontSize: "1.1rem", fontWeight: "bold" }}>{st.travail.toFixed(1)}h</div>
                              </div>
                              {st.joursRemplace > 0 && (
                                <div style={{ background: "#fff5f5", border: "1px solid #3a1a1a", borderRadius: "8px", padding: "0.5rem 0.8rem", flex: 1 }}>
                                  <div style={{ color: "#e57373", fontSize: "0.7rem", marginBottom: "0.2rem" }}>🔄 Remplacé</div>
                                  <div style={{ color: "#e57373", fontSize: "1.1rem", fontWeight: "bold" }}>-{st.remplace.toFixed(1)}h</div>
                                  <div style={{ color: "#5a2a2a", fontSize: "0.7rem" }}>{st.joursRemplace} jour{st.joursRemplace > 1 ? "s" : ""}</div>
                                </div>
                              )}
                              {enPlus && (
                                <div style={{ background: "#0f1a2a", border: "1px solid #1e3a5a", borderRadius: "8px", padding: "0.5rem 0.8rem", flex: 1 }}>
                                  <div style={{ color: "#6ab0ff", fontSize: "0.7rem", marginBottom: "0.2rem" }}>➕ En plus</div>
                                  <div style={{ color: "#6ab0ff", fontSize: "1.1rem", fontWeight: "bold" }}>+{enPlus.heures.toFixed(1)}h</div>
                                </div>
                              )}
                              {eventsParPersonne[nom] && (
                                <div style={{ background: "#fff5e6", border: "1px solid #f5a62355", borderRadius: "8px", padding: "0.5rem 0.8rem", flex: 1 }}>
                                  <div style={{ color: "#e8213a", fontSize: "0.7rem", marginBottom: "0.2rem" }}>🎪 Events</div>
                                  <div style={{ color: "#e8213a", fontSize: "1.1rem", fontWeight: "bold" }}>+{eventsParPersonne[nom].count}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // VUE EMPLOYÉ
                const nom = currentUser.prenom;
                const enPlus = heuresEnPlus[nom];
                const todayEmp = new Date();
                const todayEmpStr = todayEmp.getFullYear() + "-" + String(todayEmp.getMonth()+1).padStart(2,"0") + "-" + String(todayEmp.getDate()).padStart(2,"0");

                // Tous les jours du cycle pour cet employé ce mois
                const tousLesJours = [];
                for (let d = 1; d <= daysInMonth; d++) {
                  const dateStr = year + "-" + String(month+1).padStart(2,"0") + "-" + String(d).padStart(2,"0");
                  const emps = getAutoEmployes(dateStr);
                  if (emps.includes(nom)) {
                    const autoH = getAutoHoraire(dateStr);
                    const h = parseFloat(calcHeures(autoH.debut, autoH.fin));
                    const estRemplace = moisH.find(r => normalizeDate(r.date) === dateStr && r.est_remplacement && r.remplace_nom === nom);
                    tousLesJours.push({ dateStr, debut: autoH.debut, fin: autoH.fin, heures: h, estRemplace: !!estRemplace, type: "normal" });
                  }
                }

                // Jours supplémentaires encodés manuellement (hors cycle)
                const joursExtra = moisH.filter(h => {
                  const isInCycle = tousLesJours.find(j => j.dateStr === normalizeDate(h.date));
                  return h.employe_nom === nom && !h.est_remplacement && !isInCycle;
                }).map(h => ({
                  dateStr: normalizeDate(h.date),
                  debut: h.heure_debut.slice(0,5),
                  fin: h.heure_fin.slice(0,5),
                  heures: parseFloat(calcHeures(h.heure_debut.slice(0,5), h.heure_fin.slice(0,5))),
                  estRemplace: false,
                  type: "extra"
                }));

                // Remplacements qu'il fait pour quelqu'un d'autre
                const joursRemplacement = moisH.filter(h => h.employe_nom === nom && h.est_remplacement).map(h => ({
                  dateStr: normalizeDate(h.date),
                  debut: h.heure_debut.slice(0,5),
                  fin: h.heure_fin.slice(0,5),
                  heures: parseFloat(calcHeures(h.heure_debut.slice(0,5), h.heure_fin.slice(0,5))),
                  remplace_nom: h.remplace_nom,
                  type: "remplacement"
                }));

                const tousJours = [...tousLesJours, ...joursExtra, ...joursRemplacement]
                  .sort((a, b) => a.dateStr.localeCompare(b.dateStr));

                const heuresFaites = tousLesJours.filter(j => j.dateStr < todayEmpStr && !j.estRemplace).reduce((s, j) => s + j.heures, 0)
                  + joursExtra.filter(j => j.dateStr < todayEmpStr).reduce((s, j) => s + j.heures, 0)
                  + joursRemplacement.filter(j => j.dateStr < todayEmpStr).reduce((s, j) => s + j.heures, 0);

                const heuresAvenir = tousLesJours.filter(j => j.dateStr >= todayEmpStr && !j.estRemplace).reduce((s, j) => s + j.heures, 0)
                  + joursExtra.filter(j => j.dateStr >= todayEmpStr).reduce((s, j) => s + j.heures, 0)
                  + joursRemplacement.filter(j => j.dateStr >= todayEmpStr).reduce((s, j) => s + j.heures, 0);

                const heuresRemplaceesMoi = tousLesJours.filter(j => j.estRemplace).reduce((s, j) => s + j.heures, 0);
                const totalNet = heuresFaites + heuresAvenir;

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {/* Résumé */}
                    <div style={{ background: "#e8213a", borderRadius: "14px", padding: "1rem 1.2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ color: "#ffffff99", fontSize: "0.72rem", marginBottom: "0.2rem" }}>Total du mois</div>
                        <div style={{ color: "#ffffff", fontSize: "1.6rem", fontWeight: "700" }}>{totalNet.toFixed(1)}h</div>
                      </div>
                      <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                        <div style={{ color: "#ffffff99", fontSize: "0.7rem" }}>✅ {heuresFaites.toFixed(1)}h faites</div>
                        <div style={{ color: "#ffffff99", fontSize: "0.7rem" }}>📅 {heuresAvenir.toFixed(1)}h à venir</div>
                        {heuresRemplaceesMoi > 0 && <div style={{ color: "#ffffff99", fontSize: "0.7rem" }}>🔄 -{heuresRemplaceesMoi.toFixed(1)}h remplacé</div>}
                      </div>
                    </div>

                    {/* Badge events employé */}
                    {eventsParPersonne[nom] && (
                      <div style={{ background: "#fff5e6", border: "1.5px solid #f5a62355", borderRadius: "14px", padding: "0.85rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ color: "#e8213a", fontSize: "0.75rem", fontWeight: "bold" }}>🎪 Events ce mois</div>
                          <div style={{ color: "#a07848", fontSize: "0.7rem", marginTop: "0.2rem" }}>
                            {eventsParPersonne[nom].details.map((ev: any) =>
                              `${formatDateShort(normalizeDate(ev.event_date))} · ${ev.event_label}`
                            ).join(" · ")}
                          </div>
                        </div>
                        <div style={{ color: "#e8213a", fontSize: "1.6rem", fontWeight: "700" }}>+{eventsParPersonne[nom].count}</div>
                      </div>
                    )}
                    {/* Liste des jours */}
                    <div style={{ color: "#a07848", fontSize: "0.75rem", fontWeight: "600" }}>📋 Mes jours ce mois</div>
                    {tousJours.map((j, idx) => (
                      <div key={idx} style={{
                        background: j.estRemplace ? "#fff5f5" : j.type === "extra" ? "#f0fff4" : j.type === "remplacement" ? "#f0f8ff" : j.dateStr === todayEmpStr ? "#f5fff8" : "#ffffff",
                        border: `1.5px solid ${j.estRemplace ? "#e8213a33" : j.type === "extra" ? "#4caf5033" : j.type === "remplacement" ? "#6ab0ff33" : j.dateStr === todayEmpStr ? "#4caf5033" : "#f0d8b8"}`,
                        borderRadius: "10px", padding: "0.7rem 1rem",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        opacity: j.dateStr < todayEmpStr ? 0.65 : 1
                      }}>
                        <div>
                          <div style={{ color: "#3d1a0a", fontSize: "0.85rem", fontWeight: "600", textTransform: "capitalize" }}>
                            {j.dateStr === todayEmpStr ? "🟢 " : ""}{formatDateShort(j.dateStr)}
                          </div>
                          {j.estRemplace && <div style={{ color: "#e8213a", fontSize: "0.7rem" }}>🔄 Remplacé</div>}
                          {j.type === "extra" && <div style={{ color: "#4caf50", fontSize: "0.7rem" }}>➕ Heure extra</div>}
                          {j.type === "remplacement" && <div style={{ color: "#6ab0ff", fontSize: "0.7rem" }}>🔄 Remplace {j.remplace_nom}</div>}
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ color: j.estRemplace ? "#e8213a" : j.type === "extra" ? "#4caf50" : j.type === "remplacement" ? "#6ab0ff" : "#f5a623", fontSize: "0.95rem", fontWeight: "700" }}>
                            {j.estRemplace ? "-" : j.type !== "normal" ? "+" : ""}{j.heures.toFixed(1)}h
                          </div>
                          <div style={{ color: "#c8a878", fontSize: "0.7rem" }}>{j.debut}→{j.fin}</div>
                        </div>
                      </div>
                    ))}
                    {tousJours.length === 0 && <div style={{ color: "#c8a878", fontSize: "0.82rem", textAlign: "center", padding: "2rem" }}>Aucun jour ce mois-ci</div>}
                  </div>
                );
              })()}
            </div>
          )}

          </>}
        </div>
        <BottomNav />
      </div>
    );
  }

    // ── PAIEMENTS PAGE ────────────────────────────────────────
  if (page === "paiements" && isAdmin) {
    const today = new Date();
    const todayStr = today.getFullYear() + "-" + String(today.getMonth()+1).padStart(2,"0") + "-" + String(today.getDate()).padStart(2,"0");
    const in3days = new Date(today); in3days.setDate(today.getDate() + 3);
    const in3Str = in3days.getFullYear() + "-" + String(in3days.getMonth()+1).padStart(2,"0") + "-" + String(in3days.getDate()).padStart(2,"0");
    const in3months = new Date(today); in3months.setMonth(today.getMonth() + 3);
    const in3mStr = in3months.getFullYear() + "-" + String(in3months.getMonth()+1).padStart(2,"0") + "-" + String(in3months.getDate()).padStart(2,"0");

    const paiementsAvenir = paiements.filter(p => p.statut === "en_attente" && p.date_echeance >= todayStr && p.date_echeance <= in3mStr);
    const paiementsEnRetard = paiements.filter(p => p.statut === "en_attente" && p.date_echeance < todayStr);
    const paiementsHistorique = paiements.filter(p => p.statut === "paye" || (p.statut === "en_attente" && p.date_echeance < todayStr));
    const urgents = getPaiementsUrgents();

    const totalAvenir = paiementsAvenir.reduce((s, p) => s + (parseFloat(p.montant) || 0), 0);
    const totalRetard = paiementsEnRetard.reduce((s, p) => s + (parseFloat(p.montant) || 0), 0);

    const TYPE_ICONS = { fournisseur: "🏪", salaire: "👤", loyer: "🏠", autre: "📦" };
    const TYPE_LABELS = { fournisseur: "Fournisseur", salaire: "Salaire", loyer: "Loyer", autre: "Autre" };

    function getStatutStyle(p) {
      if (p.date_echeance < todayStr) return { border: "#e8213a55", bg: "#fff5f5", color: "#e57373", label: "⚠️ En retard" };
      if (p.date_echeance <= in3Str) return { border: "#f5a62355", bg: "#fff8f0", color: "#e8213a", label: "🔔 Urgent" };
      return { border: "#f0d8b8", bg: "#ffffff", color: "#3d1a0a", label: "" };
    }

    return (
      <div style={{ ...s, minHeight: "100vh", background: "#faebd7", paddingBottom: "6rem" }}>
        {toast && <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", background: "#faebd7", color: "#e8213a", padding: "0.55rem 1.4rem", borderRadius: "20px", fontSize: "0.88rem", zIndex: 999, border: "1.5px solid #f0d8b8", whiteSpace: "nowrap" }}>{toast}</div>}

        {/* Header */}
        <div style={{ background: "#fff8f0", padding: "1rem 1.2rem", borderBottom: "1.5px solid #f0d8b8", position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h1 style={{ color: "#ffffff", fontSize: "1.1rem", margin: 0 }}>📋 Tâches</h1>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button onClick={loadPaiements} style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#a07848", borderRadius: "8px", padding: "0.3rem 0.6rem", fontSize: "0.8rem", cursor: "pointer" }}><RefreshCw size={16} /></button>
              <button onClick={() => { setPaiementTitre(""); setPaiementMontant(""); setPaiementDate(""); setPaiementNote(""); setPaiementRecurrent(false); setPaiementType("autre"); setShowAddPaiement(true); }}
                style={{ background: "#e8213a", color: "#ffffff", border: "none", borderRadius: "8px", padding: "0.3rem 0.9rem", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", fontSize: "0.8rem", cursor: "pointer" }}><span style={{display:"flex",alignItems:"center",gap:"6px"}}><Plus size={14} /> Ajouter</span></button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {[{id:"avenir",label:"À venir"},{id:"historique",label:"Historique"}].map(tab => (
              <button key={tab.id} onClick={() => setPaiementView(tab.id)}
                style={{ background: paiementView === tab.id ? "#f5c842" : "#1e1e1e", color: paiementView === tab.id ? "#111" : "#555", border: "none", borderRadius: "8px", padding: "0.35rem 0.9rem", fontSize: "0.78rem", fontFamily: "'Poppins', sans-serif", fontWeight: paiementView === tab.id ? "bold" : "normal", cursor: "pointer" }}>
                {tab.label}
                {tab.id === "avenir" && urgents.length > 0 && <span style={{ background: "#e57373", color: "#3d1a0a", borderRadius: "10px", padding: "0.1rem 0.4rem", fontSize: "0.65rem", marginLeft: "0.4rem" }}>{urgents.length}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Add modal */}
        {showAddPaiement && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
            <div style={{ background: "#fff8f0", borderRadius: "16px 16px 0 0", padding: "1.2rem", width: "100%", display: "flex", flexDirection: "column", gap: "0.7rem", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ color: "#e8213a", fontWeight: "bold", fontSize: "0.95rem" }}>➕ Nouveau paiement</div>
                <button onClick={() => setShowAddPaiement(false)} style={{ background: "#2a2a2a", border: "none", color: "#c8a878", borderRadius: "50%", width: "2rem", height: "2rem", cursor: "pointer" }}>✕</button>
              </div>
              <input value={paiementTitre} onChange={e => setPaiementTitre(e.target.value)} placeholder="Titre (ex: Facture OZ Food)..."
                style={{ background: "#faebd7", border: "1px solid #f5c842", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input value={paiementMontant} onChange={e => setPaiementMontant(e.target.value.replace(",", "."))} placeholder="Montant ex: 374.55" inputMode="decimal" type="text"
                  style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", flex: 1, boxSizing: "border-box" as const }} />
                <input type="date" value={paiementDate} onChange={e => setPaiementDate(e.target.value)}
                  style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", flex: 1, boxSizing: "border-box" as const }} />
              </div>
              <select value={paiementType} onChange={e => setPaiementType(e.target.value)}
                style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%" }}>
                <option value="fournisseur">🏪 Fournisseur</option>
                <option value="salaire">👤 Salaire</option>
                <option value="loyer">🏠 Loyer</option>
                <option value="autre">📦 Autre</option>
              </select>
              <textarea value={paiementNote} onChange={e => setPaiementNote(e.target.value)} placeholder="Note (optionnel)..." rows={2}
                style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.9rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" as const, resize: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <input type="checkbox" id="recurrent" checked={paiementRecurrent} onChange={e => setPaiementRecurrent(e.target.checked)}
                  style={{ width: "1.1rem", height: "1.1rem", accentColor: "#f5c842", cursor: "pointer" }} />
                <label htmlFor="recurrent" style={{ color: "#c8a878", fontSize: "0.85rem", cursor: "pointer" }}>Paiement récurrent</label>
              </div>
              {paiementRecurrent && (
                <select value={paiementFrequence} onChange={e => setPaiementFrequence(e.target.value)}
                  style={{ background: "#faebd7", border: "1px solid #f5c842", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%" }}>
                  <option value="hebdo">📅 Hebdomadaire</option>
                  <option value="mensuel">📅 Mensuel</option>
                  <option value="trimestriel">📅 Trimestriel</option>
                  <option value="annuel">📅 Annuel</option>
                </select>
              )}
              <button onClick={handleAddPaiement} style={{ background: "#e8213a", color: "#ffffff", border: "none", padding: "0.9rem", borderRadius: "10px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", width: "100%" }}>
                ✅ Ajouter
              </button>
            </div>
          </div>
        )}

        <div style={{ padding: "0.8rem 1.1rem" }}>
          {paiementsLoading && <div style={{ textAlign: "center", padding: "3rem", color: "#e8213a" }}><div style={{ fontSize: "1.5rem" }}>⏳</div><div style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Chargement...</div></div>}

          {!paiementsLoading && paiementView === "avenir" && (
            <div>
              {/* Résumé */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                {totalRetard > 0 && (
                  <div style={{ flex: 1, background: "#fff5f5", border: "1px solid #3a1a1a", borderRadius: "10px", padding: "0.75rem" }}>
                    <div style={{ color: "#e57373", fontSize: "0.7rem" }}>⚠️ En retard</div>
                    <div style={{ color: "#e57373", fontSize: "1.1rem", fontWeight: "bold" }}>{totalRetard.toFixed(2)}€</div>
                  </div>
                )}
                <div style={{ flex: 1, background: "#f5fff8", border: "1.5px solid #4caf5033", borderRadius: "10px", padding: "0.75rem" }}>
                  <div style={{ color: "#4caf50", fontSize: "0.7rem" }}>📅 3 prochains mois</div>
                  <div style={{ color: "#4caf50", fontSize: "1.1rem", fontWeight: "bold" }}>{totalAvenir.toFixed(2)}€</div>
                </div>
              </div>

              {/* En retard */}
              {paiementsEnRetard.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ color: "#e57373", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "0.5rem" }}>⚠️ EN RETARD</div>
                  {paiementsEnRetard.map(p => {
                    const st = getStatutStyle(p);
                    return (
                      <div key={p.id} style={{ background: st.bg, border: `1px solid ${st.border}`, borderRadius: "12px", padding: "1rem", marginBottom: "0.5rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: st.color, fontSize: "0.95rem", fontWeight: "bold" }}>{TYPE_ICONS[p.type]} {p.titre}</div>
                            <div style={{ color: "#a07848", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                              📅 {new Date(p.date_echeance + "T12:00:00").toLocaleDateString("fr-BE", { day: "numeric", month: "long" })}
                              {p.recurrent && <span style={{ marginLeft: "0.5rem" }}>🔄 {p.frequence}</span>}
                            </div>
                            {p.note && <div style={{ color: "#a07848", fontSize: "0.72rem", marginTop: "0.2rem" }}>📌 {p.note}</div>}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                            {p.montant && <div style={{ color: "#3d1a0a", fontSize: "1rem", fontWeight: "700" }}>{parseFloat(p.montant).toFixed(2)}€</div>}
                            <div style={{ display: "flex", gap: "0.3rem" }}>
                              <button onClick={() => handlePayerPaiement(p.id, p.recurrent, p.frequence, p.date_echeance)}
                                style={{ background: "#5cb85c", color: "#3d1a0a", border: "none", borderRadius: "8px", padding: "0.4rem 0.7rem", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: "bold" }}>✅ Payé</button>
                              <button onClick={() => handleDeletePaiement(p.id)}
                                style={{ background: "#fff5f5", color: "#e57373", border: "none", borderRadius: "8px", padding: "0.4rem 0.6rem", fontSize: "0.78rem", cursor: "pointer" }}><Trash2 size={15} /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* À venir */}
              <div style={{ color: "#a07848", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "0.5rem" }}>📅 À VENIR — 3 MOIS</div>
              {paiementsAvenir.length === 0 && <div style={{ color: "#c8a878", fontSize: "0.82rem", textAlign: "center", padding: "2rem" }}>Aucun paiement à venir</div>}
              {paiementsAvenir.map(p => {
                const st = getStatutStyle(p);
                return (
                  <div key={p.id} style={{ background: st.bg, border: `1px solid ${st.border}`, borderRadius: "12px", padding: "1rem", marginBottom: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <span style={{ color: st.color, fontSize: "0.95rem", fontWeight: "bold" }}>{TYPE_ICONS[p.type]} {p.titre}</span>
                          {st.label && <span style={{ background: p.date_echeance < todayStr ? "#3a1a1a" : "#3a3a1a", color: st.color, fontSize: "0.65rem", borderRadius: "6px", padding: "0.1rem 0.4rem" }}>{st.label}</span>}
                        </div>
                        <div style={{ color: "#a07848", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                          📅 {new Date(p.date_echeance + "T12:00:00").toLocaleDateString("fr-BE", { weekday: "short", day: "numeric", month: "long" })}
                          {p.recurrent && <span style={{ marginLeft: "0.5rem", color: "#4a4a6a" }}>🔄 {p.frequence}</span>}
                        </div>
                        {p.note && <div style={{ color: "#a07848", fontSize: "0.72rem", marginTop: "0.2rem" }}>📌 {p.note}</div>}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                        {p.montant && <div style={{ color: "#3d1a0a", fontSize: "1rem", fontWeight: "700" }}>{parseFloat(p.montant).toFixed(2)}€</div>}
                        <div style={{ display: "flex", gap: "0.3rem" }}>
                          <button onClick={() => handlePayerPaiement(p.id, p.recurrent, p.frequence, p.date_echeance)}
                            style={{ background: "#1a2a1a", color: "#4caf50", border: "1px solid #2a4a2a", borderRadius: "8px", padding: "0.4rem 0.7rem", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: "bold" }}>✅ Payé</button>
                          <button onClick={() => handleDeletePaiement(p.id)}
                            style={{ background: "#fff5f5", color: "#e57373", border: "none", borderRadius: "8px", padding: "0.4rem 0.6rem", fontSize: "0.78rem", cursor: "pointer" }}><Trash2 size={15} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!paiementsLoading && paiementView === "historique" && (
            <div>
              <div style={{ color: "#a07848", fontSize: "0.75rem", fontWeight: "bold", marginBottom: "0.75rem" }}>📋 HISTORIQUE</div>
              {paiementsHistorique.length === 0 && <div style={{ color: "#c8a878", fontSize: "0.82rem", textAlign: "center", padding: "2rem" }}>Aucun historique</div>}
              {paiementsHistorique.sort((a,b) => b.date_echeance.localeCompare(a.date_echeance)).map(p => (
                <div key={p.id} style={{ background: "#fff8f0", border: "1.5px solid #f0d8b8", borderRadius: "12px", padding: "1rem", marginBottom: "0.5rem", opacity: p.statut === "paye" ? 0.7 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: p.statut === "paye" ? "#4caf50" : "#e8213a", fontSize: "0.9rem", fontWeight: "bold" }}>
                        {p.statut === "paye" ? "✅" : "⚠️"} {TYPE_ICONS[p.type]} {p.titre}
                      </div>
                      <div style={{ color: "#a07848", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                        {new Date(p.date_echeance + "T12:00:00").toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {p.montant && <div style={{ color: "#a07848", fontSize: "0.9rem" }}>{parseFloat(p.montant).toFixed(2)}€</div>}
                      <button onClick={() => handleDeletePaiement(p.id)}
                        style={{ background: "none", color: "#c8a878", border: "none", cursor: "pointer", fontSize: "0.85rem" }}><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notification badge dans l'app */}
        {isAdmin && urgents.length > 0 && page !== "paiements" && (
          <div onClick={() => { setPage("paiements"); loadPaiements(); }} style={{ position: "fixed", top: "1rem", right: "1rem", background: "#e57373", color: "#3d1a0a", borderRadius: "20px", padding: "0.4rem 0.8rem", fontSize: "0.78rem", fontWeight: "bold", cursor: "pointer", zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            🔔 {urgents.length} paiement{urgents.length > 1 ? "s" : ""} urgent{urgents.length > 1 ? "s" : ""}
          </div>
        )}

        <BottomNav />
      </div>
    );
  }

  // ── LOGIN ──────────────────────────────────────────────────
  if (!currentUser) return (
    <div style={{ ...s, minHeight: "100vh", background: "#faebd7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <img src="/Fichier-source-logo-Sekai-_1_.png" alt="Sekai Corndogs" style={{ width: "160px", marginBottom: "1rem", borderRadius: "20px", boxShadow: "0 8px 24px #e8213a22" }} />
      <h1 style={{ color: "#3d1a0a", fontSize: "1.4rem", fontWeight: "700", margin: "0 0 0.25rem", textAlign: "center" }}>SEKAI STOCK</h1>
      <p style={{ color: "#c8a878", fontSize: "0.82rem", margin: "0 0 1.5rem", textAlign: "center" }}>{getTodayStr()}</p>
      <div style={{ width: "100%", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input value={loginPrenom} onChange={e => setLoginPrenom(e.target.value)} placeholder="Ton prénom..." autoFocus
          onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...inputStyle, border: "2px solid #f5c842" }} />
        <div style={{ position: "relative", width: "100%" }}>
          <input value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Mot de passe..." type={showLoginPwd ? "text" : "password"}
            onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...inputStyle, border: "2px solid #f5c842", paddingRight: "3rem" }} />
          <button onClick={() => setShowLoginPwd(p => !p)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: 0 }}>
            {showLoginPwd ? <EyeOff size={18} color="#c8a878" /> : <Eye size={18} color="#c8a878" />}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
            style={{ width: "1.1rem", height: "1.1rem", accentColor: "#f5c842", cursor: "pointer" }} />
          <label htmlFor="rememberMe" style={{ color: "#c8a878", fontSize: "0.85rem", cursor: "pointer" }} style={{display:"flex",alignItems:"center",gap:"6px"}}>Se souvenir de moi</label>
        </div>
        {loginError && <p style={{ color: "#e57373", fontSize: "0.85rem", margin: 0, textAlign: "center" }}>{loginError}</p>}
        <button onClick={handleLogin} disabled={loginLoading} style={{ ...btnPrimary, opacity: loginLoading ? 0.7 : 1, marginTop: "0.5rem" }}>
          {loginLoading ? "Connexion en cours..." : "Se connecter →"}
        </button>
      </div>
    </div>
  );

  // ── PROFIL ─────────────────────────────────────────────────
  if (page === "profil") return (
    <div style={{ ...s, minHeight: "100vh", background: "#faebd7", paddingBottom: "5rem" }}>
      {toast && <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", background: "#faebd7", color: "#e8213a", padding: "0.55rem 1.4rem", borderRadius: "20px", fontSize: "0.88rem", zIndex: 999, border: "1.5px solid #f0d8b8", whiteSpace: "nowrap" }}>{toast}</div>}
      <div style={{ background: "#e8213a", padding: "1.2rem", borderBottom: "none" }}>
        <h1 style={{ color: "#ffffff", fontSize: "1.1rem", margin: 0 }}>👤 Mon profil</h1>
      </div>
      <div style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ background: "#fff8f0", border: "1.5px solid #f0d8b8", borderRadius: "12px", padding: "1.2rem" }}>
          <div style={{ color: "#e8213a", fontSize: "1.2rem", fontWeight: "bold" }}>{currentUser.prenom}</div>
          <div style={{ color: "#a07848", fontSize: "0.8rem", marginTop: "0.25rem" }}>
            {currentUser.role === "superadmin" ? "Super Admin" : currentUser.role === "admin" ? "Admin" : "Employé"}
          </div>
        </div>
        {!showChangePwd ? (
          <button onClick={() => setShowChangePwd(true)} style={{ background: "#fff8f0", border: "1.5px solid #f0d8b8", color: "#3d1a0a", borderRadius: "12px", padding: "1rem", fontFamily: "'Poppins', sans-serif", fontSize: "0.95rem", cursor: "pointer", textAlign: "left" }}>
            🔑 Changer mon mot de passe
          </button>
        ) : (
          <div style={{ background: "#fff8f0", border: "1.5px solid #f0d8b8", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ color: "#e8213a", fontSize: "0.9rem", fontWeight: "bold" }}>🔑 Changer le mot de passe</div>
            <div style={{ position: "relative" }}>
              <input value={oldPwd} onChange={e => setOldPwd(e.target.value)} placeholder="Ancien mot de passe" type={showOldPwd ? "text" : "password"} style={{ ...inputStyle, paddingRight: "3rem" }} />
              <button onClick={() => setShowOldPwd(p => !p)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: 0 }}>{showOldPwd ? <EyeOff size={18} color="#c8a878" /> : <Eye size={18} color="#c8a878" />}</button>
            </div>
            <div style={{ position: "relative" }}>
              <input value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Nouveau mot de passe" type={showNewPwd ? "text" : "password"} style={{ ...inputStyle, paddingRight: "3rem" }} />
              <button onClick={() => setShowNewPwd(p => !p)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: 0 }}>{showNewPwd ? <EyeOff size={18} color="#c8a878" /> : <Eye size={18} color="#c8a878" />}</button>
            </div>
            <div style={{ position: "relative" }}>
              <input value={newPwd2} onChange={e => setNewPwd2(e.target.value)} placeholder="Confirmer le nouveau mot de passe" type={showNewPwd2 ? "text" : "password"} style={{ ...inputStyle, paddingRight: "3rem" }} />
              <button onClick={() => setShowNewPwd2(p => !p)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: 0 }}>{showNewPwd2 ? <EyeOff size={18} color="#c8a878" /> : <Eye size={18} color="#c8a878" />}</button>
            </div>
            {pwdMsg && <p style={{ color: pwdMsg.startsWith("✅") ? "#5cb85c" : "#e57373", fontSize: "0.85rem", margin: 0 }}>{pwdMsg}</p>}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleChangePwd} style={{ ...btnPrimary, flex: 1 }}>Confirmer</button>
              <button onClick={() => { setShowChangePwd(false); setOldPwd(""); setNewPwd(""); setNewPwd2(""); setPwdMsg(""); }} style={{ background: "#faebd7", color: "#c8a878", border: "none", padding: "0.9rem 1rem", borderRadius: "10px", cursor: "pointer" }}>✕</button>
            </div>
          </div>
        )}
        {isAdmin && (
          <button onClick={() => { setPage("comptes"); loadUsers(); }} style={{ background: "#fff8f0", border: "1.5px solid #f0d8b8", color: "#3d1a0a", borderRadius: "12px", padding: "1rem", fontFamily: "'Poppins', sans-serif", fontSize: "0.95rem", cursor: "pointer", textAlign: "left" }}>
            🔑 Gestion des comptes
          </button>
        )}
        <button onClick={handleLogout} style={{ background: "#fff5f5", border: "1px solid #3a1a1a", color: "#e57373", borderRadius: "12px", padding: "1rem", fontFamily: "'Poppins', sans-serif", fontSize: "0.95rem", cursor: "pointer" }}>
          🚪 Se déconnecter
        </button>
      </div>
      <BottomNav />
    </div>
  );

  // ── COMPTES ────────────────────────────────────────────────
  if (page === "comptes" && isAdmin) return (
    <div style={{ ...s, minHeight: "100vh", background: "#faebd7", paddingBottom: "5rem" }}>
      {toast && <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", background: "#faebd7", color: "#e8213a", padding: "0.55rem 1.4rem", borderRadius: "20px", fontSize: "0.88rem", zIndex: 999, border: "1.5px solid #f0d8b8", whiteSpace: "nowrap" }}>{toast}</div>}
      <div style={{ background: "#e8213a", padding: "1.2rem", borderBottom: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#ffffff", fontSize: "1.1rem", margin: 0 }}>👥 Gestion des comptes</h1>
        <button onClick={() => setShowNewUser(true)} style={{ background: "#e8213a", color: "#ffffff", border: "none", borderRadius: "8px", padding: "0.5rem 0.9rem", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", fontSize: "0.85rem", cursor: "pointer" }}><span style={{display:"flex",alignItems:"center",gap:"6px"}}><Plus size={14} /> Nouveau</span></button>
      </div>
      {showNewUser && (
        <div style={{ margin: "1rem", background: "#fff8f0", border: "1.5px solid #f0d8b8", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ color: "#e8213a", fontWeight: "bold", fontSize: "0.9rem" }}>➕ Nouveau compte</div>
          <input value={newUserPrenom} onChange={e => setNewUserPrenom(e.target.value)} placeholder="Prénom..." style={inputStyle} />
          <input value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} placeholder="Mot de passe..." style={inputStyle} />
          <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} style={inputStyle}>
            <option value="employe">👤 Employé</option>
            <option value="admin">🔑 Admin</option>
            {isSuperAdmin && <option value="superadmin">👑 Super Admin</option>}
          </select>
          <select value={newUserRestaurant} onChange={e => setNewUserRestaurant(e.target.value)} style={inputStyle}>
            <option value="">Tous les restaurants</option>
            {RESTAURANTS.map(r => <option key={r.id} value={r.id}>{r.emoji} {r.name}</option>)}
          </select>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={handleCreateUser} style={{ ...btnPrimary, flex: 1 }}>Créer</button>
            <button onClick={() => setShowNewUser(false)} style={{ background: "#faebd7", color: "#c8a878", border: "none", padding: "0.9rem 1rem", borderRadius: "10px", cursor: "pointer" }}>✕</button>
          </div>
        </div>
      )}
      <div style={{ padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {allUsers.map(u => (
          <div key={u.id} style={{ background: "#fff8f0", border: "1.5px solid #f0d8b8", borderRadius: "12px", padding: "1rem" }}>
            {editingUser?.id === u.id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <input value={editingUser.prenom} onChange={e => setEditingUser(prev => ({ ...prev, prenom: e.target.value }))} style={inputStyle} />
                <select value={editingUser.role} onChange={e => setEditingUser(prev => ({ ...prev, role: e.target.value }))} style={inputStyle}>
                  <option value="employe">👤 Employé</option>
                  <option value="admin">🔑 Admin</option>
                  {isSuperAdmin && <option value="superadmin">👑 Super Admin</option>}
                </select>
                <select value={editingUser.restaurant_id || ""} onChange={e => setEditingUser(prev => ({ ...prev, restaurant_id: e.target.value }))} style={inputStyle}>
                  <option value="">Tous les restaurants</option>
                  {RESTAURANTS.map(r => <option key={r.id} value={r.id}>{r.emoji} {r.name}</option>)}
                </select>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={handleUpdateUser} style={{ ...btnPrimary, flex: 1 }}>💾 Sauvegarder</button>
                  <button onClick={() => setEditingUser(null)} style={{ background: "#faebd7", color: "#c8a878", border: "none", padding: "0.9rem 1rem", borderRadius: "10px", cursor: "pointer" }}>✕</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#3d1a0a", fontSize: "0.95rem", fontWeight: "bold" }}>{u.prenom}</div>
                  <div style={{ color: "#a07848", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                    {u.role === "superadmin" ? "Super Admin" : u.role === "admin" ? "Admin" : "Employé"}
                    {u.restaurant_id && ` · ${RESTAURANTS.find(r => r.id === u.restaurant_id)?.name || u.restaurant_id}`}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {isAdmin && (
                    <>
                      <button onClick={() => setEditingUser(u)} style={{ background: "#faebd7", border: "none", color: "#e8213a", borderRadius: "8px", padding: "0.4rem 0.7rem", cursor: "pointer", fontSize: "0.85rem" }}>✏️</button>
                      {isSuperAdmin && u.id !== currentUser.id && (
                        <button onClick={() => handleDeleteUser(u.id)} style={{ background: "#fff5f5", border: "none", color: "#e57373", borderRadius: "8px", padding: "0.4rem 0.7rem", cursor: "pointer", fontSize: "0.85rem" }}><Trash2 size={15} /></button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );

  // ── FERMETURES PAGE (admin) ──────────────────────────────
  if (page === "fermetures" && isAdmin) {
    const sectionsOrder = ["Équipement & Nettoyage", "Terrasse & salle", "Fermeture générale"];
    return (
      <div style={{ ...s, minHeight: "100vh", background: "#faebd7", paddingBottom: "6rem" }}>
        {toast && <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", background: "#faebd7", color: "#e8213a", padding: "0.55rem 1.4rem", borderRadius: "20px", fontSize: "0.88rem", zIndex: 999, border: "1.5px solid #f0d8b8" }}>{toast}</div>}
        <div style={{ background: "#fff8f0", padding: "1rem 1.2rem", borderBottom: "1.5px solid #f0d8b8", position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h1 style={{ color: "#e8213a", fontSize: "1.1rem", margin: 0 }}>🔒 Fermetures</h1>
            <button onClick={() => { loadFermetureHistorique(); loadFermetureData(); }}
              style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#a07848", borderRadius: "8px", padding: "0.3rem 0.6rem", fontSize: "0.8rem", cursor: "pointer" }}><RefreshCw size={16} /></button>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {[{id:"historique",label:"Historique"},{id:"gerer",label:"Gérer la checklist"}].map(tab => (
              <button key={tab.id} onClick={() => setFermetureAdminView(tab.id)}
                style={{ background: fermetureAdminView === tab.id ? "#f5c842" : "#1e1e1e", color: fermetureAdminView === tab.id ? "#111" : "#555", border: "none", borderRadius: "8px", padding: "0.35rem 0.9rem", fontSize: "0.78rem", fontFamily: "'Poppins', sans-serif", fontWeight: fermetureAdminView === tab.id ? "bold" : "normal", cursor: "pointer" }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: "0.8rem 1.1rem" }}>
          {fermetureAdminView === "historique" && (
            <div>
              {fermeturesHistorique.length === 0 && (
                <div style={{ color: "#c8a878", fontSize: "0.82rem", textAlign: "center", padding: "2rem" }}>Aucune fermeture sur les 30 derniers jours</div>
              )}
              {fermeturesHistorique.map((f: any) => {
                const totalTaches = fermetureTaches.filter(t => !t.optionnelle).length;
                const validees = (f.fermeture_validations || []).length;
                const isComplete = !!f.termine_at;
                return (
                  <div key={f.id} onClick={() => setSelectedFermetureId(selectedFermetureId === f.id ? null : f.id)}
                    style={{ background: "#fff8f0", border: "1.5px solid " + (isComplete ? "#4caf5033" : "#f5a62355"), borderRadius: "12px", padding: "1rem", marginBottom: "0.5rem", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ color: isComplete ? "#4caf50" : "#e8213a", fontSize: "0.95rem", fontWeight: "bold" }}>{isComplete ? "✅" : "⏳"} {new Date(f.date + "T12:00:00").toLocaleDateString("fr-BE", { weekday: "short", day: "numeric", month: "short" })}</div>
                        <div style={{ color: "#a07848", fontSize: "0.78rem", marginTop: "0.2rem" }}>👤 {f.nom_personne}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#3d1a0a", fontSize: "0.85rem", fontWeight: "bold" }}>{validees} validation{validees > 1 ? "s" : ""}</div>
                        {f.termine_at && <div style={{ color: "#a07848", fontSize: "0.72rem" }}>Fini à {new Date(f.termine_at).toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}</div>}
                      </div>
                    </div>
                    {selectedFermetureId === f.id && (
                      <div style={{ marginTop: "0.75rem", borderTop: "1px solid #f0d8b8", paddingTop: "0.75rem" }}>
                        {sectionsOrder.map(sec => {
                          const inSec = (f.fermeture_validations || []).filter((v: any) => v.tache_section === sec);
                          if (inSec.length === 0) return null;
                          return (
                            <div key={sec} style={{ marginBottom: "0.5rem" }}>
                              <div style={{ color: "#a07848", fontSize: "0.72rem", fontWeight: "bold", marginBottom: "0.25rem" }}>{sec}</div>
                              {inSec.map((v: any) => (
                                <div key={v.id} style={{ color: "#3d1a0a", fontSize: "0.8rem", padding: "0.15rem 0" }}>✅ {v.tache_label} <span style={{ color: "#c8a878", fontSize: "0.7rem" }}>· {new Date(v.valide_at).toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}</span></div>
                              ))}
                            </div>
                          );
                        })}
                        <div style={{ color: "#a07848", fontSize: "0.72rem", marginTop: "0.5rem" }}>Démarré à {new Date(f.demarre_at).toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {fermetureAdminView === "gerer" && (
            <div>
              <button onClick={() => { setNewTacheLabel(""); setNewTacheDescription(""); setNewTacheOptionnelle(false); setShowAddTache(true); }}
                style={{ background: "#e8213a", color: "#fff", border: "none", padding: "0.7rem 1.2rem", borderRadius: "10px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", fontSize: "0.85rem", cursor: "pointer", marginBottom: "1rem" }}><span style={{display:"flex",alignItems:"center",gap:"6px"}}><Plus size={14} /> Ajouter une tâche</span></button>
              {sectionsOrder.map(sec => {
                const taches = fermetureTaches.filter(t => t.section === sec).sort((a: any, b: any) => a.ordre - b.ordre);
                if (taches.length === 0) return null;
                return (
                  <div key={sec} style={{ marginBottom: "1rem" }}>
                    <div style={{ color: "#a07848", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", marginBottom: "0.4rem" }}>{sec}</div>
                    {taches.map((t: any, idx: number) => (
                      <div key={t.id} style={{ background: "#fff8f0", border: "1.5px solid #f0d8b8", borderRadius: "10px", padding: "0.8rem 1rem", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                          <button onClick={() => handleMoveTache(t, "up")} disabled={idx === 0}
                            style={{ background: idx === 0 ? "#faebd7" : "#fff8f0", border: "1px solid #f0d8b8", borderRadius: "4px", width: "1.5rem", height: "1rem", cursor: idx === 0 ? "default" : "pointer", color: idx === 0 ? "#c8a878" : "#3d1a0a", fontSize: "0.7rem", padding: 0, opacity: idx === 0 ? 0.4 : 1 }}>▲</button>
                          <button onClick={() => handleMoveTache(t, "down")} disabled={idx === taches.length - 1}
                            style={{ background: idx === taches.length - 1 ? "#faebd7" : "#fff8f0", border: "1px solid #f0d8b8", borderRadius: "4px", width: "1.5rem", height: "1rem", cursor: idx === taches.length - 1 ? "default" : "pointer", color: idx === taches.length - 1 ? "#c8a878" : "#3d1a0a", fontSize: "0.7rem", padding: 0, opacity: idx === taches.length - 1 ? 0.4 : 1 }}>▼</button>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                            <span style={{ color: "#3d1a0a", fontSize: "0.92rem", fontWeight: "bold" }}>{t.label}</span>
                            {t.optionnelle && <span style={{ background: "#e0e0e0", color: "#666", borderRadius: "8px", padding: "0.1rem 0.4rem", fontSize: "0.6rem", fontWeight: "bold" }}>OPTIONNELLE</span>}
                          </div>
                          {t.description && <div style={{ color: "#a07848", fontSize: "0.72rem", marginTop: "0.2rem" }}>{t.description}</div>}
                        </div>
                        <div style={{ display: "flex", gap: "0.3rem" }}>
                          <button onClick={() => setEditingTache({ ...t })}
                            style={{ background: "#faebd7", border: "1px solid #f0d8b8", color: "#e8213a", borderRadius: "8px", padding: "0.4rem 0.6rem", cursor: "pointer", fontSize: "0.85rem" }}><Pencil size={14} /></button>
                          <button onClick={() => handleDeleteTache(t.id)}
                            style={{ background: "#fff5f5", border: "1px solid #e8213a33", color: "#e57373", borderRadius: "8px", padding: "0.4rem 0.6rem", cursor: "pointer", fontSize: "0.85rem" }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {showAddTache && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
            <div style={{ background: "#fff8f0", borderRadius: "16px 16px 0 0", padding: "1.2rem", width: "100%", display: "flex", flexDirection: "column", gap: "0.7rem", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ color: "#e8213a", fontWeight: "bold", fontSize: "0.95rem" }}>➕ Nouvelle tâche</div>
                <button onClick={() => setShowAddTache(false)} style={{ background: "#2a2a2a", border: "none", color: "#c8a878", borderRadius: "50%", width: "2rem", height: "2rem", cursor: "pointer" }}>✕</button>
              </div>
              <select value={newTacheSection} onChange={e => setNewTacheSection(e.target.value)} style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%" }}>
                {sectionsOrder.map(sec => <option key={sec} value={sec}>{sec}</option>)}
              </select>
              <input value={newTacheLabel} onChange={e => setNewTacheLabel(e.target.value)} placeholder="Label de la tâche..."
                style={{ background: "#faebd7", border: "1px solid #f5c842", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" }} />
              <textarea value={newTacheDescription} onChange={e => setNewTacheDescription(e.target.value)} placeholder="Description (optionnel)..." rows={2}
                style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.9rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box", resize: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <input type="checkbox" id="newOpt" checked={newTacheOptionnelle} onChange={e => setNewTacheOptionnelle(e.target.checked)} style={{ width: "1.1rem", height: "1.1rem", accentColor: "#f5c842", cursor: "pointer" }} />
                <label htmlFor="newOpt" style={{ color: "#3d1a0a", fontSize: "0.85rem", cursor: "pointer" }}>Tâche optionnelle (ne bloque pas le bouton Terminer)</label>
              </div>
              <button onClick={handleCreateTache} style={{ background: "#e8213a", color: "#fff", border: "none", padding: "0.9rem", borderRadius: "10px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", width: "100%" }}>✅ Ajouter</button>
            </div>
          </div>
        )}
        {editingTache && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
            <div style={{ background: "#fff8f0", borderRadius: "16px 16px 0 0", padding: "1.2rem", width: "100%", display: "flex", flexDirection: "column", gap: "0.7rem", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ color: "#e8213a", fontWeight: "bold", fontSize: "0.95rem" }}>✏️ Modifier la tâche</div>
                <button onClick={() => setEditingTache(null)} style={{ background: "#2a2a2a", border: "none", color: "#c8a878", borderRadius: "50%", width: "2rem", height: "2rem", cursor: "pointer" }}>✕</button>
              </div>
              <select value={editingTache.section} onChange={e => setEditingTache((prev: any) => ({ ...prev, section: e.target.value }))}
                style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%" }}>
                {sectionsOrder.map(sec => <option key={sec} value={sec}>{sec}</option>)}
              </select>
              <input value={editingTache.label} onChange={e => setEditingTache((prev: any) => ({ ...prev, label: e.target.value }))}
                style={{ background: "#faebd7", border: "1px solid #f5c842", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box" }} />
              <textarea value={editingTache.description || ""} onChange={e => setEditingTache((prev: any) => ({ ...prev, description: e.target.value }))} rows={2}
                style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.9rem", fontFamily: "'Poppins', sans-serif", outline: "none", width: "100%", boxSizing: "border-box", resize: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <input type="checkbox" id="editOpt" checked={!!editingTache.optionnelle} onChange={e => setEditingTache((prev: any) => ({ ...prev, optionnelle: e.target.checked }))} style={{ width: "1.1rem", height: "1.1rem", accentColor: "#f5c842", cursor: "pointer" }} />
                <label htmlFor="editOpt" style={{ color: "#3d1a0a", fontSize: "0.85rem", cursor: "pointer" }}>Tâche optionnelle</label>
              </div>
              <button onClick={handleUpdateTache} style={{ background: "#e8213a", color: "#fff", border: "none", padding: "0.9rem", borderRadius: "10px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", width: "100%" }}>💾 Sauvegarder</button>
            </div>
          </div>
        )}
        <BottomNav />
      </div>
    );
  }

  // ── STOCK ──────────────────────────────────────────────────
  const storeOrder = restaurant?.id === "rue-neuve" ? STORE_ORDER_RUE_NEUVE : STORE_ORDER_EVENT;
  const stock = groupByStore(items);
  const stores = storeOrder.filter(s => stock[s] && stock[s].length > 0);
  const allAlerts = items.filter(i => isLow(i));
  const totalAlerts = allAlerts.length;

  if (loading) return (
    <div style={{ ...s, minHeight: "100vh", background: "#faebd7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
      <p style={{ color: "#e8213a", fontWeight: "600" }}>Chargement...</p>
    </div>
  );

  if (error) return (
    <div style={{ ...s, minHeight: "100vh", background: "#faebd7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <p style={{ color: "#e57373" }}>{error}</p>
      <button onClick={() => loadData(restaurant)} style={{ marginTop: "1rem", background: "#e8213a", color: "#ffffff", border: "none", padding: "0.8rem 2rem", borderRadius: "10px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", cursor: "pointer" }}>Réessayer</button>
    </div>
  );

  if (!restaurant) return (
    <div style={{ ...s, minHeight: "100vh", background: "#faebd7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", paddingBottom: isAdmin ? "5rem" : "2rem" }}>
      <p style={{ color: "#e8213a", fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>👋 Bonjour {currentUser.prenom} !</p>
      <h2 style={{ color: "#3d1a0a", fontSize: "1.2rem", margin: "0 0 0.5rem", textAlign: "center" }}>Quel point de vente ?</h2>
      <p style={{ color: "#a07848", fontSize: "0.8rem", margin: "0 0 2rem" }}>{getTodayStr()}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: "320px" }}>
        {RESTAURANTS.map(r => (
          <button key={r.id} onClick={() => { setRestaurant(r); loadData(r); }}
            style={{ background: "#fff8f0", border: "1.5px solid #f0d8b8", borderRadius: "12px", padding: "1.1rem 1.2rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", textAlign: "left", width: "100%" }}>
            <div style={{ fontSize: "2rem" }}>{r.emoji}</div>
            <div>
              <div style={{ color: "#3d1a0a", fontSize: "1rem", fontWeight: "700" }}>{r.name}</div>
              <div style={{ color: "#a07848", fontSize: "0.78rem" }}>{r.subtitle}</div>
            </div>
          </button>
        ))}
      </div>
      <BottomNav />
    </div>
  );

  if (showAlerts) {
    const byStore = {};
    allAlerts.forEach(i => { if (!byStore[i.store]) byStore[i.store] = []; byStore[i.store].push(i); });
    return (
      <div style={{ ...s, minHeight: "100vh", background: "#faebd7", paddingBottom: isAdmin ? "5rem" : "2rem" }}>
        <div style={{ background: "#e8213a", padding: "1.2rem", borderBottom: "none", position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button onClick={() => setShowAlerts(false)} style={{ background: "none", border: "none", color: "#ffffff", fontSize: "1.6rem", cursor: "pointer", padding: 0 }}><ArrowLeft size={20} /></button>
          <h2 style={{ color: "#ffffff", fontSize: "1.05rem", fontWeight: "bold", margin: 0 }}>⚠️ {totalAlerts} à commander</h2>
        </div>
        <div style={{ padding: "0.8rem 1.1rem" }}>
          {storeOrder.map(store => {
            const list = byStore[store];
            if (!list) return null;
            return (
              <div key={store} style={{ marginBottom: "0.75rem" }}>
                <div style={{ color: "#a07848", fontSize: "0.75rem", fontWeight: "bold", margin: "0.5rem 0 0.3rem" }}>{store}</div>
                {list.map(item => (
                  <div key={item.id} style={{ background: "#fff5f5", border: "1.5px solid #e8213a44", borderRadius: "10px", padding: "0.85rem 1rem", marginBottom: "0.4rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#e8213a", fontSize: "0.95rem" }}>{item.name}</div>
                      {item.note && <div style={{ color: "#a07848", fontSize: "0.7rem" }}>📌 {item.note}</div>}
                      <div style={{ color: "#a07848", fontSize: "0.72rem" }}>Seuil : {item.threshold_label}</div>
                    </div>
                    <span style={{ background: "#fff0f0", color: "#e57373", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.92rem", fontWeight: "bold" }}>{item.qty === "" ? "—" : item.qty}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!activeStore) return (
    <div style={{ ...s, minHeight: "100vh", background: "#faebd7", paddingBottom: isAdmin ? "5rem" : "2rem" }}>
      <div style={{ background: "#e8213a", padding: "1.2rem", borderBottom: "none", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button onClick={() => { setRestaurant(null); setItems([]); }} style={{ background: "none", border: "none", color: "#ffffff", fontSize: "1.4rem", cursor: "pointer", padding: 0 }}><ArrowLeft size={20} /></button>
            <div>
              <h1 style={{ color: "#ffffff", fontSize: "1.1rem", fontWeight: "bold", margin: 0 }}>{restaurant?.emoji} {restaurant?.name}</h1>
              <p style={{ color: "#ffffff99", fontSize: "0.72rem", margin: 0 }}>{getTodayStr()} · {currentUser.prenom}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => loadData(restaurant)} style={{ background: "none", border: "1.5px solid #f0d8b8", color: "#a07848", borderRadius: "8px", padding: "0.35rem 0.6rem", fontSize: "0.8rem", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}><RefreshCw size={16} /></button>
            {totalAlerts > 0 && <button onClick={() => setShowAlerts(true)} style={{ background: "#ffffff", color: "#e8213a", border: "none", borderRadius: "20px", padding: "0.4rem 0.85rem", fontSize: "0.78rem", fontWeight: "bold", cursor: "pointer", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: "4px" }}><AlertTriangle size={13} /> {totalAlerts}</button>}
            {isAdmin && <button onClick={() => setShowResetConfirm(true)} style={{ background: "#1a1a2a", color: "#8888ff", border: "1px solid #2a2a4a", borderRadius: "8px", padding: "0.35rem 0.6rem", fontSize: "0.78rem", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>🔄 RAZ</button>}
          </div>
        </div>
      </div>
      {/* Reset confirm modal */}
      {showResetConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ background: "#fff8f0", borderRadius: "16px", padding: "1.5rem", width: "100%", maxWidth: "320px", border: "1px solid #3a1a1a" }}>
            <div style={{ color: "#e57373", fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>⚠️ Remettre à zéro ?</div>
            <p style={{ color: "#c8a878", fontSize: "0.85rem", marginBottom: "1.2rem" }}>Toutes les quantités de {restaurant?.name} seront vidées. Cette action est irréversible.</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleResetAll} style={{ flex: 1, background: "#e57373", color: "#3d1a0a", border: "none", padding: "0.9rem", borderRadius: "10px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", cursor: "pointer" }}>Confirmer</button>
              <button onClick={() => setShowResetConfirm(false)} style={{ flex: 1, background: "#faebd7", color: "#c8a878", border: "none", padding: "0.9rem", borderRadius: "10px", fontFamily: "'Poppins', sans-serif", cursor: "pointer" }}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {lastSave && <div style={{ margin: "0.8rem 1.1rem 0", background: "#f5fff8", border: "1.5px solid #4caf5033", borderRadius: "8px", padding: "0.6rem 1rem", fontSize: "0.78rem", color: "#4caf50" }}>✅ {lastSave.time} · {lastSave.who}</div>}
      <div style={{ padding: "0.8rem 1.1rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {stores.map(store => {
          const alerts = stock[store].filter(i => isLow(i)).length;
          return (
            <button key={store} onClick={() => setActiveStore(store)} style={{ background: "#fff8f0", border: `1.5px solid ${alerts > 0 ? "#e8213a44" : "#f0d8b8"}`, borderRadius: "12px", padding: "1rem 1.1rem", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", width: "100%" }}>
              <div>
                <div style={{ color: "#3d1a0a", fontSize: "0.98rem", fontWeight: "bold" }}>{store}</div>
                <div style={{ color: "#a07848", fontSize: "0.73rem", marginTop: "0.15rem" }}>{stock[store].length} articles</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {alerts > 0 && <span style={{ background: "#e8213a22", color: "#e8213a", borderRadius: "10px", padding: "0.2rem 0.6rem", fontSize: "0.75rem", fontWeight: "bold" }}>{alerts} ⚠️</span>}
                <span style={{ color: "#c8a878", fontSize: "1.3rem" }}>›</span>
              </div>
            </button>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );

  const storeItems = stock[activeStore] || [];
  return (
    <div style={{ ...s, minHeight: "100vh", background: "#faebd7", paddingBottom: isAdmin ? "8rem" : "5rem" }}>
      {toast && <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", background: "#faebd7", color: "#e8213a", padding: "0.55rem 1.4rem", borderRadius: "20px", fontSize: "0.88rem", zIndex: 999, border: "1.5px solid #f0d8b8", whiteSpace: "nowrap", pointerEvents: "none" }}>{toast}</div>}
      <div style={{ background: "#e8213a", padding: "1rem 1.2rem", borderBottom: "none", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button onClick={() => { setActiveStore(null); setEditingId(null); setAddMode(false); }} style={{ background: "none", border: "none", color: "#ffffff", fontSize: "1.6rem", cursor: "pointer", padding: 0, lineHeight: 1 }}><ArrowLeft size={20} /></button>
          <div>
            <h2 style={{ color: "#3d1a0a", fontSize: "1rem", fontWeight: "bold", margin: 0 }}>{activeStore}</h2>
            <p style={{ color: "#c8a878", fontSize: "0.72rem", margin: "0.15rem 0 0" }}>{storeItems.length} articles · {currentUser.prenom}</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "0.75rem 1.1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {storeItems.map(item => {
          const low = isLow(item);
          return (
            <div key={item.id} style={{ background: "#fff8f0", border: `1.5px solid ${low ? "#e8213a44" : "#f0d8b8"}`, borderRadius: "12px", overflow: "hidden" }}>
              {editingId === item.id ? (
                <div style={{ padding: "0.9rem 1rem" }}>
                  <div style={{ color: "#e8213a", fontSize: "0.85rem", marginBottom: "0.2rem", fontWeight: "bold" }}>✏️ {item.name}</div>
                  {item.note && <div style={{ color: "#7a6a2a", fontSize: "0.72rem", marginBottom: "0.3rem" }}>📌 {item.note}</div>}
                  <div style={{ color: "#a07848", fontSize: "0.73rem", marginBottom: "0.6rem" }}>Seuil : {item.threshold_label} {item.unit}</div>
                  <input ref={inputRef} value={editVal} onChange={e => setEditVal(e.target.value)} onKeyDown={e => e.key === "Enter" && saveQty(item.id)} placeholder="Quantité..." inputMode="decimal"
                    style={{ background: "#faebd7", border: "2px solid #f5c842", color: "#3d1a0a", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "1.2rem", width: "100%", fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box" }} />
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
                    {["0","1","2","3","4","5","6","8","10","12","15","20","✅ OK","assez","plein"].map(v => (
                      <button key={v} onClick={() => setEditVal(v)} style={{ background: editVal === v ? "#f5c842" : "#1e1e1e", color: editVal === v ? "#111" : "#777", border: "none", borderRadius: "6px", padding: "0.4rem 0.6rem", fontSize: "0.82rem", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: editVal === v ? "bold" : "normal" }}>{v}</button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                    <button onClick={() => saveQty(item.id)} disabled={saving} style={{ flex: 1, background: saving ? "#c8a878" : "#e8213a", color: "#ffffff", border: "none", padding: "0.8rem", borderRadius: "8px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", fontSize: "0.95rem", cursor: "pointer" }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>{saving ? "⏳..." : <><Save size={15} /> Enregistrer</>}</button>
                    <button onClick={() => setEditingId(null)} style={{ background: "#faebd7", color: "#c8a878", border: "none", padding: "0.8rem 1rem", borderRadius: "8px", cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              ) : editItemId === item.id ? (
                  <div style={{ padding: "0.9rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <div style={{ color: "#e8213a", fontSize: "0.85rem", fontWeight: "bold" }}>⚙️ Modifier l'article</div>
                    <input value={editItemName} onChange={e => setEditItemName(e.target.value)} placeholder="Nom..."
                      style={{ background: "#faebd7", border: "1px solid #f5c842", color: "#3d1a0a", padding: "0.7rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box" as const, width: "100%" }} />
                    <input value={editItemThreshold} onChange={e => setEditItemThreshold(e.target.value)} placeholder="Seuil (ex: 5)..." inputMode="decimal"
                      style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.7rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box" as const, width: "100%" }} />
                    <input value={editItemThresholdLabel} onChange={e => setEditItemThresholdLabel(e.target.value)} placeholder="Label seuil (ex: < 5 paquets)..."
                      style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.7rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box" as const, width: "100%" }} />
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => handleSaveItemMeta(item.id)} style={{ flex: 1, background: "#e8213a", color: "#ffffff", border: "none", padding: "0.8rem", borderRadius: "8px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", cursor: "pointer" }}>💾 Sauvegarder</button>
                      <button onClick={() => setEditItemId(null)} style={{ background: "#faebd7", color: "#c8a878", border: "none", padding: "0.8rem 1rem", borderRadius: "8px", cursor: "pointer" }}>✕</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", padding: "0.9rem 1rem", gap: "0.75rem", cursor: "pointer" }} onClick={() => { setEditingId(item.id); setEditVal(item.qty); }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: low ? "#e8213a" : "#3d1a0a", fontSize: "0.95rem" }}>{item.name}</div>
                      <div style={{ color: "#c8a878", fontSize: "0.7rem", marginTop: "0.1rem" }}>
                        {item.note && <span style={{ color: "#a07848" }}>📌 {item.note} · </span>}
                        Seuil : {item.threshold_label} {item.unit}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {low && <span>⚠️</span>}
                      <span style={{ background: low ? "#fff0f0" : "#faebd7", color: low ? "#e8213a" : "#f5a623", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.92rem", fontWeight: "bold", minWidth: "2.2rem", textAlign: "center" }}>{item.qty === "" ? "—" : item.qty}</span>
                      {isAdmin && <button onClick={e => { e.stopPropagation(); setEditItemId(item.id); setEditItemName(item.name); setEditItemThreshold(String(item.threshold)); setEditItemThresholdLabel(item.threshold_label); }} style={{ background: "none", border: "none", color: "#a07848", cursor: "pointer", fontSize: "0.85rem", padding: 0 }}><Settings size={14} /></button>}
                    </div>
                  </div>
                )}
            </div>
          );
        })}
        {addMode ? (
          <div style={{ background: "#fff8f0", border: "1.5px solid #f0d8b8", borderRadius: "12px", padding: "1rem" }}>
            <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nom de l'article..."
              style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "1rem", width: "100%", fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box", marginBottom: "0.5rem" }} />
            <input value={newQty} onChange={e => setNewQty(e.target.value)} placeholder="Quantité actuelle..." inputMode="decimal"
              style={{ background: "#faebd7", border: "1.5px solid #f0d8b8", color: "#3d1a0a", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "1rem", width: "100%", fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box", marginBottom: "0.5rem" }} />
            <input value={newThreshold} onChange={e => setNewThreshold(e.target.value)} placeholder="Seuil d'alerte (ex: 3)..." inputMode="decimal"
              style={{ background: "#faebd7", border: "1px solid #f5c842", color: "#3d1a0a", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "1rem", width: "100%", fontFamily: "'Poppins', sans-serif", outline: "none", boxSizing: "border-box", marginBottom: "0.75rem" }} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => addItem(activeStore)} style={{ flex: 1, background: "#e8213a", color: "#ffffff", border: "none", padding: "0.8rem", borderRadius: "8px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", fontSize: "0.95rem", cursor: "pointer" }}>➕ Ajouter</button>
              <button onClick={() => setAddMode(false)} style={{ background: "#faebd7", color: "#c8a878", border: "none", padding: "0.8rem 1rem", borderRadius: "8px", cursor: "pointer" }}>✕</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddMode(true)} style={{ background: "none", border: "2px dashed #f0d8b8", color: "#c8a878", borderRadius: "14px", padding: "0.9rem", fontFamily: "'Poppins', sans-serif", fontSize: "0.9rem", cursor: "pointer", width: "100%" }}>+ Ajouter un article</button>
        )}
      </div>
      <div style={{ position: "fixed", bottom: isAdmin ? "3.5rem" : 0, left: 0, right: 0, background: "#fff8f0", borderTop: "1.5px solid #f0d8b8", padding: "0.75rem 1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#a07848", fontSize: "0.73rem" }}>{lastSave ? `💾 ${lastSave.time} · ${lastSave.who}` : "Pas encore sauvegardé"}</div>
        <div style={{ fontSize: "0.78rem", fontWeight: "bold", color: storeItems.filter(i => isLow(i)).length > 0 ? "#e57373" : "#5cb85c" }}>
          {storeItems.filter(i => isLow(i)).length > 0 ? `⚠️ ${storeItems.filter(i => isLow(i)).length} à commander` : "✅ Tout est OK"}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
