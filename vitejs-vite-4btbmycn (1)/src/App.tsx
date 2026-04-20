import { useState, useEffect, useRef } from "react";

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
  const [horaireView, setHoraireView] = useState("today"); // today | week | remplacements
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
  const inputRef = useRef(null);

  useEffect(() => {
    if (editingId && inputRef.current) inputRef.current.focus();
  }, [editingId]);

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
      } catch {}
    }
  }, []);

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "superadmin";
  const isSuperAdmin = currentUser?.role === "superadmin";

  const s = { fontFamily: "'Georgia', serif" };
  const inputStyle: React.CSSProperties = { background: "#1a1a1a", border: "2px solid #333", color: "#fff", padding: "0.9rem 1.2rem", borderRadius: "10px", fontSize: "1rem", width: "100%", fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
  const btnPrimary: React.CSSProperties = { background: "#f5c842", color: "#111", border: "none", padding: "0.9rem", borderRadius: "10px", fontSize: "1rem", fontFamily: "inherit", fontWeight: "bold", cursor: "pointer", width: "100%" };

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
      0: ["Wassim","Moha"], 1: ["Wassim","Moha"], 2: ["Moha","Nabil"],
      3: ["Moha","Nabil"], 4: ["Abdel","Nabil"], 5: ["Wassim","Abdel"], 6: ["Wassim","Abdel"]
    },
    { // Semaine 2
      0: ["Wassim","Nabil"], 1: ["Wassim","Nabil"], 2: ["Nabil","Abdel"],
      3: ["Nabil","Abdel"], 4: ["Moha","Abdel"], 5: ["Wassim","Moha"], 6: ["Wassim","Moha"]
    },
    { // Semaine 3
      0: ["Wassim","Abdel"], 1: ["Wassim","Abdel"], 2: ["Abdel","Moha"],
      3: ["Abdel","Moha"], 4: ["Nabil","Moha"], 5: ["Wassim","Nabil"], 6: ["Wassim","Nabil"]
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
    const weekInCycle = getWeekInCycle(dateStr);
    const planDay = getPlanDay(dateStr);
    return CYCLE[weekInCycle][planDay] || [];
  }

  function getAutoHoraire(dateStr) {
    const planDay = getPlanDay(dateStr);
    return HORAIRES_JOUR[planDay];
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

  const BottomNav = () => currentUser ? (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#141414", borderTop: "1px solid #1e1e1e", display: "flex", zIndex: 40 }}>
      {[
        { id: "stock", label: "Stock", icon: "📦", adminOnly: false },
        { id: "horaires", label: "Horaires", icon: "📅", adminOnly: false },
        { id: "comptes", label: "Comptes", icon: "👥", adminOnly: true },
        { id: "profil", label: "Profil", icon: "👤", adminOnly: false }
      ].filter(tab => !tab.adminOnly || isAdmin).map(tab => (
        <button key={tab.id} onClick={() => { setPage(tab.id); if (tab.id === "comptes") loadUsers(); if (tab.id === "horaires" && !horaires.length) fetchHoraires(horaireRestaurant); }} style={{ flex: 1, background: "none", border: "none", padding: "0.7rem 0", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.15rem" }}>
          <span style={{ fontSize: "1.2rem" }}>{tab.icon}</span>
          <span style={{ fontSize: "0.65rem", color: page === tab.id ? "#f5c842" : "#444", fontFamily: "inherit" }}>{tab.label}</span>
        </button>
      ))}
    </div>
  ) : null;

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
          <div style={{ background: "#141414", borderRadius: "16px 16px 0 0", padding: "1.2rem", width: "100%", display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#f5c842", fontWeight: "bold", fontSize: "0.95rem" }}>
                ➕ {addHoraireDate ? formatDateShort(addHoraireDate) : "📅 Choisir une date future"}
              </div>
              <button onClick={() => { setShowAddHoraire(false); setAddHoraireIsRemplacement(false); setAddHoraireExtra(false); setAddHoraireEmploye(""); setAddHoraireExtranom(""); setAddHoraireRemplaceNom(""); }}
                style={{ background: "#2a2a2a", border: "none", color: "#888", borderRadius: "50%", width: "2rem", height: "2rem", cursor: "pointer", fontSize: "1rem" }}>✕</button>
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
                  style={{ background: "#0d0d0d", border: `1px solid ${addHoraireDate ? "#2e2e2e" : "#f5c842"}`, color: "#fff", padding: "0.7rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", boxSizing: "border-box" as const, width: "100%" }} />
              );
            })()}

            {/* Type selection - only show after date selected */}
            {addHoraireDate && <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => { setAddHoraireIsRemplacement(false); setAddHoraireExtra(false); }}
                style={{ flex: 1, background: !addHoraireIsRemplacement && !addHoraireExtra ? "#f5c842" : "#1e1e1e", color: !addHoraireIsRemplacement && !addHoraireExtra ? "#111" : "#555", border: "none", borderRadius: "8px", padding: "0.6rem", fontSize: "0.8rem", fontFamily: "inherit", cursor: "pointer", fontWeight: "bold" }}>
                👤 Employé normal
              </button>
              <button onClick={() => { setAddHoraireExtra(true); setAddHoraireIsRemplacement(false); }}
                style={{ flex: 1, background: addHoraireExtra ? "#f5c842" : "#1e1e1e", color: addHoraireExtra ? "#111" : "#555", border: "none", borderRadius: "8px", padding: "0.6rem", fontSize: "0.8rem", fontFamily: "inherit", cursor: "pointer", fontWeight: "bold" }}>
                ⭐ Extra
              </button>
              <button onClick={() => { setAddHoraireIsRemplacement(true); setAddHoraireExtra(false); }}
                style={{ flex: 1, background: addHoraireIsRemplacement ? "#f5c842" : "#1e1e1e", color: addHoraireIsRemplacement ? "#111" : "#555", border: "none", borderRadius: "8px", padding: "0.6rem", fontSize: "0.8rem", fontFamily: "inherit", cursor: "pointer", fontWeight: "bold" }}>
                🔄 Remplacement
              </button>
            </div>}

            {/* Employé normal */}
            {!addHoraireIsRemplacement && !addHoraireExtra && (
              <>
                <select value={addHoraireEmploye} onChange={e => setAddHoraireEmploye(e.target.value)}
                  style={{ background: "#0d0d0d", border: "1px solid #2e2e2e", color: "#fff", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", width: "100%" }}>
                  <option value="">Choisir un employé...</option>
                  {["Abdel","Nabil","Mohammed","Wassim","Rachid","Ali","Momo"].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#555", fontSize: "0.72rem", marginBottom: "0.25rem" }}>Début</div>
                    <input type="time" value={addHoraireDebut} onChange={e => setAddHoraireDebut(e.target.value)}
                      style={{ background: "#0d0d0d", border: "1px solid #2e2e2e", color: "#fff", padding: "0.7rem 0.8rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#555", fontSize: "0.72rem", marginBottom: "0.25rem" }}>Fin</div>
                    <input type="time" value={addHoraireFin} onChange={e => setAddHoraireFin(e.target.value)}
                      style={{ background: "#0d0d0d", border: "1px solid #2e2e2e", color: "#fff", padding: "0.7rem 0.8rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                  </div>
                </div>
              </>
            )}

            {/* Extra */}
            {addHoraireExtra && (
              <>
                <div style={{ color: "#888", fontSize: "0.8rem" }}>Employé existant ou nom libre :</div>
                <select value={addHoraireEmploye} onChange={e => { setAddHoraireEmploye(e.target.value); setAddHoraireExtranom(""); }}
                  style={{ background: "#0d0d0d", border: "1px solid #2e2e2e", color: "#fff", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", width: "100%" }}>
                  <option value="">-- Choisir un employé --</option>
                  {["Abdel","Nabil","Mohammed","Wassim","Rachid","Ali","Momo"].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <div style={{ color: "#555", fontSize: "0.78rem", textAlign: "center" }}>— ou —</div>
                <input value={addHoraireExtranom} onChange={e => { setAddHoraireExtranom(e.target.value); setAddHoraireEmploye(""); }} placeholder="Nom libre (sans compte)..."
                  style={{ background: "#0d0d0d", border: "1px solid #2e2e2e", color: "#fff", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#555", fontSize: "0.72rem", marginBottom: "0.25rem" }}>Début</div>
                    <input type="time" value={addHoraireDebut} onChange={e => setAddHoraireDebut(e.target.value)}
                      style={{ background: "#0d0d0d", border: "1px solid #2e2e2e", color: "#fff", padding: "0.7rem 0.8rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#555", fontSize: "0.72rem", marginBottom: "0.25rem" }}>Fin</div>
                    <input type="time" value={addHoraireFin} onChange={e => setAddHoraireFin(e.target.value)}
                      style={{ background: "#0d0d0d", border: "1px solid #2e2e2e", color: "#fff", padding: "0.7rem 0.8rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                  </div>
                </div>
              </>
            )}

            {/* Remplacement */}
            {addHoraireIsRemplacement && (
              <>
                <div style={{ color: "#888", fontSize: "0.8rem" }}>Qui fait le remplacement ?</div>
                <select value={addHoraireEmploye} onChange={e => setAddHoraireEmploye(e.target.value)}
                  style={{ background: "#0d0d0d", border: "1px solid #2e2e2e", color: "#fff", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", width: "100%" }}>
                  <option value="">Qui remplace ?</option>
                  {["Abdel","Nabil","Mohammed","Wassim","Rachid","Ali","Momo"].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <div style={{ color: "#888", fontSize: "0.8rem" }}>Qui est remplacé ? (prend ses heures automatiquement)</div>
                <select value={addHoraireRemplaceNom} onChange={e => {
                  setAddHoraireRemplaceNom(e.target.value);
                  const h = getAutoHoraire(addHoraireDate);
                  setAddHoraireDebut(h.debut);
                  setAddHoraireFin(h.fin);
                }}
                  style={{ background: "#0d0d0d", border: "1px solid #e57373", color: "#fff", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", width: "100%" }}>
                  <option value="">Qui est remplacé ?</option>
                  {getAutoEmployes(addHoraireDate).map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#555", fontSize: "0.72rem", marginBottom: "0.25rem" }}>Début (auto)</div>
                    <input type="time" value={addHoraireDebut} onChange={e => setAddHoraireDebut(e.target.value)}
                      style={{ background: "#0d0d0d", border: "1px solid #2e2e2e", color: "#fff", padding: "0.7rem 0.8rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#555", fontSize: "0.72rem", marginBottom: "0.25rem" }}>Fin (auto)</div>
                    <input type="time" value={addHoraireFin} onChange={e => setAddHoraireFin(e.target.value)}
                      style={{ background: "#0d0d0d", border: "1px solid #2e2e2e", color: "#fff", padding: "0.7rem 0.8rem", borderRadius: "8px", fontSize: "0.95rem", fontFamily: "inherit", outline: "none", width: "100%", boxSizing: "border-box" as const }} />
                  </div>
                </div>
              </>
            )}

            {addHoraireDate && <button onClick={async () => {
              if (!addHoraireDate) return;
              const nom = addHoraireExtra ? (addHoraireExtranom || addHoraireEmploye) : addHoraireEmploye;
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
            }} style={{ background: "#f5c842", color: "#111", border: "none", padding: "0.9rem", borderRadius: "10px", fontFamily: "inherit", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", width: "100%" }}>
              ✅ Confirmer
            </button>}
          </div>
        </div>
      );
    };

    return (
      <div style={{ ...s, minHeight: "100vh", background: "#0d0d0d", paddingBottom: "6rem" }}>
        {toast && <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", background: "#1e1e1e", color: "#f5c842", padding: "0.55rem 1.4rem", borderRadius: "20px", fontSize: "0.88rem", zIndex: 999, border: "1px solid #2e2e2e", whiteSpace: "nowrap" }}>{toast}</div>}
        <AddModal />

        {/* Header */}
        <div style={{ background: "#141414", padding: "1rem 1.2rem", borderBottom: "1px solid #1e1e1e", position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h1 style={{ color: "#f5c842", fontSize: "1.1rem", margin: 0 }}>📅 Horaires</h1>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <select value={horaireRestaurant} onChange={e => { setHoraireRestaurant(e.target.value); setHoraires([]); fetchHoraires(e.target.value); }}
                style={{ background: "#1e1e1e", border: "1px solid #2e2e2e", color: "#f5c842", borderRadius: "8px", padding: "0.3rem 0.5rem", fontSize: "0.75rem", fontFamily: "inherit" }}>
                {RESTAURANTS.map(r => <option key={r.id} value={r.id}>{r.emoji} {r.name}</option>)}
              </select>
              <button onClick={() => fetchHoraires(horaireRestaurant)}
                style={{ background: "#1e1e1e", border: "1px solid #2e2e2e", color: "#555", borderRadius: "8px", padding: "0.3rem 0.6rem", fontSize: "0.8rem", cursor: "pointer" }}>🔄</button>
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
              }} style={{ background: "#f5c842", border: "none", color: "#111", borderRadius: "8px", padding: "0.3rem 0.7rem", fontFamily: "inherit", fontWeight: "bold", fontSize: "0.78rem", cursor: "pointer" }}>📅 Autre date</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {[{id:"week",label:"Semaine"},{id:"remplacements",label:"Remplacements"}].map(tab => (
              <button key={tab.id} onClick={() => setHoraireView(tab.id)}
                style={{ background: horaireView === tab.id ? "#f5c842" : "#1e1e1e", color: horaireView === tab.id ? "#111" : "#555", border: "none", borderRadius: "8px", padding: "0.35rem 0.9rem", fontSize: "0.78rem", fontFamily: "inherit", fontWeight: horaireView === tab.id ? "bold" : "normal", cursor: "pointer" }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "0.8rem 1.1rem" }}>

          {horaireLoading && (
            <div style={{ textAlign: "center", padding: "3rem", color: "#f5c842" }}>
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
                        {isToday && <span style={{ color: "#5cb85c", fontSize: "0.72rem", marginLeft: "0.4rem" }}>· Aujourd'hui</span>}
                        <span style={{ color: "#444", fontSize: "0.72rem", marginLeft: "0.5rem" }}>{autoH.debut}-{autoH.fin}</span>
                      </div>
                      <button onClick={() => {
                        const h = getAutoHoraire(dateStr);
                        setAddHoraireDate(dateStr);
                        setAddHoraireDebut(h.debut);
                        setAddHoraireFin(h.fin);
                        setAddHoraireIsRemplacement(false);
                        setAddHoraireExtra(false);
                        setAddHoraireEmploye("");
                        setShowAddHoraire(true);
                      }} style={{ background: "#f5c842", border: "none", color: "#111", borderRadius: "50%", width: "1.8rem", height: "1.8rem", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
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
                <div style={{ color: "#555", fontSize: "0.75rem", fontWeight: "bold" }}>Remplacements du mois</div>
                <input type="month" value={remplacementMois} onChange={e => setRemplacementMois(e.target.value)}
                  style={{ background: "#1e1e1e", border: "1px solid #2e2e2e", color: "#f5c842", borderRadius: "8px", padding: "0.3rem 0.5rem", fontSize: "0.75rem", fontFamily: "inherit", outline: "none" }} />
              </div>
              {Object.keys(remplacementsParPersonne).length === 0 && (
                <div style={{ color: "#333", fontSize: "0.82rem", textAlign: "center", padding: "2rem" }}>Aucun remplacement ce mois-ci</div>
              )}
              {(isAdmin
                ? Object.entries(remplacementsParPersonne)
                : Object.entries(remplacementsParPersonne).filter(([nom]) => nom === currentUser.prenom)
              ).map(([nom, stats]: [string, any]) => (
                <div key={nom} style={{ background: "#141414", border: "1px solid #3a1a1a", borderRadius: "12px", padding: "1rem", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <div style={{ color: "#e57373", fontSize: "0.95rem", fontWeight: "bold" }}>👤 {nom}</div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <span style={{ background: "#2a0f0f", color: "#e57373", borderRadius: "8px", padding: "0.2rem 0.6rem", fontSize: "0.78rem" }}>{stats.count} jour{stats.count > 1 ? "s" : ""}</span>
                      <span style={{ background: "#1a1a2a", color: "#8888ff", borderRadius: "8px", padding: "0.2rem 0.6rem", fontSize: "0.78rem" }}>{stats.heures.toFixed(1)}h</span>
                    </div>
                  </div>
                  {stats.details.map((h: any) => (
                    <div key={h.id} style={{ borderTop: "1px solid #2a1a1a", paddingTop: "0.4rem", marginTop: "0.4rem", display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
                      <span style={{ color: "#777", textTransform: "capitalize" }}>{formatDateShort(normalizeDate(h.date))}</span>
                      <span style={{ color: "#555" }}>remplacé par <span style={{ color: "#f0ede6" }}>{h.employe_nom}</span></span>
                      <span style={{ color: "#555" }}>{h.heure_debut.slice(0,5)}-{h.heure_fin.slice(0,5)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          </>}
        </div>
        <BottomNav />
      </div>
    );
  }

    // ── LOGIN ──────────────────────────────────────────────────
  if (!currentUser) return (
    <div style={{ ...s, minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <img src="/Fichier-source-logo-Sekai-_1_.png" alt="Sekai Corndogs" style={{ width: "180px", marginBottom: "1.5rem", borderRadius: "12px" }} />
      <h1 style={{ color: "#f5c842", fontSize: "1.3rem", margin: "0 0 0.25rem", textAlign: "center" }}>SEKAI STOCK</h1>
      <p style={{ color: "#444", fontSize: "0.82rem", margin: "0 0 2rem", textAlign: "center" }}>{getTodayStr()}</p>
      <div style={{ width: "100%", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input value={loginPrenom} onChange={e => setLoginPrenom(e.target.value)} placeholder="Ton prénom..." autoFocus
          onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...inputStyle, border: "2px solid #f5c842" }} />
        <div style={{ position: "relative", width: "100%" }}>
          <input value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="Mot de passe..." type={showLoginPwd ? "text" : "password"}
            onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ ...inputStyle, border: "2px solid #f5c842", paddingRight: "3rem" }} />
          <button onClick={() => setShowLoginPwd(p => !p)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: 0 }}>
            {showLoginPwd ? "🙈" : "👁️"}
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
            style={{ width: "1.1rem", height: "1.1rem", accentColor: "#f5c842", cursor: "pointer" }} />
          <label htmlFor="rememberMe" style={{ color: "#888", fontSize: "0.85rem", cursor: "pointer" }}>Se souvenir de moi</label>
        </div>
        {loginError && <p style={{ color: "#e57373", fontSize: "0.85rem", margin: 0, textAlign: "center" }}>{loginError}</p>}
        <button onClick={handleLogin} disabled={loginLoading} style={{ ...btnPrimary, opacity: loginLoading ? 0.7 : 1 }}>
          {loginLoading ? "⏳ Connexion..." : "Se connecter →"}
        </button>
      </div>
    </div>
  );

  // ── PROFIL ─────────────────────────────────────────────────
  if (page === "profil") return (
    <div style={{ ...s, minHeight: "100vh", background: "#0d0d0d", paddingBottom: "5rem" }}>
      {toast && <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", background: "#1e1e1e", color: "#f5c842", padding: "0.55rem 1.4rem", borderRadius: "20px", fontSize: "0.88rem", zIndex: 999, border: "1px solid #2e2e2e", whiteSpace: "nowrap" }}>{toast}</div>}
      <div style={{ background: "#141414", padding: "1.2rem", borderBottom: "1px solid #1e1e1e" }}>
        <h1 style={{ color: "#f5c842", fontSize: "1.1rem", margin: 0 }}>👤 Mon profil</h1>
      </div>
      <div style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1.2rem" }}>
          <div style={{ color: "#f5c842", fontSize: "1.2rem", fontWeight: "bold" }}>{currentUser.prenom}</div>
          <div style={{ color: "#555", fontSize: "0.8rem", marginTop: "0.25rem" }}>
            {currentUser.role === "superadmin" ? "👑 Super Admin" : currentUser.role === "admin" ? "🔑 Admin" : "👤 Employé"}
          </div>
        </div>
        {!showChangePwd ? (
          <button onClick={() => setShowChangePwd(true)} style={{ background: "#1a1a1a", border: "1px solid #2e2e2e", color: "#f0ede6", borderRadius: "12px", padding: "1rem", fontFamily: "inherit", fontSize: "0.95rem", cursor: "pointer", textAlign: "left" }}>
            🔑 Changer mon mot de passe
          </button>
        ) : (
          <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ color: "#f5c842", fontSize: "0.9rem", fontWeight: "bold" }}>🔑 Changer le mot de passe</div>
            <div style={{ position: "relative" }}>
              <input value={oldPwd} onChange={e => setOldPwd(e.target.value)} placeholder="Ancien mot de passe" type={showOldPwd ? "text" : "password"} style={{ ...inputStyle, paddingRight: "3rem" }} />
              <button onClick={() => setShowOldPwd(p => !p)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: 0 }}>{showOldPwd ? "🙈" : "👁️"}</button>
            </div>
            <div style={{ position: "relative" }}>
              <input value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Nouveau mot de passe" type={showNewPwd ? "text" : "password"} style={{ ...inputStyle, paddingRight: "3rem" }} />
              <button onClick={() => setShowNewPwd(p => !p)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: 0 }}>{showNewPwd ? "🙈" : "👁️"}</button>
            </div>
            <div style={{ position: "relative" }}>
              <input value={newPwd2} onChange={e => setNewPwd2(e.target.value)} placeholder="Confirmer le nouveau mot de passe" type={showNewPwd2 ? "text" : "password"} style={{ ...inputStyle, paddingRight: "3rem" }} />
              <button onClick={() => setShowNewPwd2(p => !p)} style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", padding: 0 }}>{showNewPwd2 ? "🙈" : "👁️"}</button>
            </div>
            {pwdMsg && <p style={{ color: pwdMsg.startsWith("✅") ? "#5cb85c" : "#e57373", fontSize: "0.85rem", margin: 0 }}>{pwdMsg}</p>}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleChangePwd} style={{ ...btnPrimary, flex: 1 }}>Confirmer</button>
              <button onClick={() => { setShowChangePwd(false); setOldPwd(""); setNewPwd(""); setNewPwd2(""); setPwdMsg(""); }} style={{ background: "#1e1e1e", color: "#666", border: "none", padding: "0.9rem 1rem", borderRadius: "10px", cursor: "pointer" }}>✕</button>
            </div>
          </div>
        )}
        <button onClick={handleLogout} style={{ background: "#1a0f0f", border: "1px solid #3a1a1a", color: "#e57373", borderRadius: "12px", padding: "1rem", fontFamily: "inherit", fontSize: "0.95rem", cursor: "pointer" }}>
          🚪 Se déconnecter
        </button>
      </div>
      <BottomNav />
    </div>
  );

  // ── COMPTES ────────────────────────────────────────────────
  if (page === "comptes" && isAdmin) return (
    <div style={{ ...s, minHeight: "100vh", background: "#0d0d0d", paddingBottom: "5rem" }}>
      {toast && <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", background: "#1e1e1e", color: "#f5c842", padding: "0.55rem 1.4rem", borderRadius: "20px", fontSize: "0.88rem", zIndex: 999, border: "1px solid #2e2e2e", whiteSpace: "nowrap" }}>{toast}</div>}
      <div style={{ background: "#141414", padding: "1.2rem", borderBottom: "1px solid #1e1e1e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#f5c842", fontSize: "1.1rem", margin: 0 }}>👥 Gestion des comptes</h1>
        <button onClick={() => setShowNewUser(true)} style={{ background: "#f5c842", color: "#111", border: "none", borderRadius: "8px", padding: "0.5rem 0.9rem", fontFamily: "inherit", fontWeight: "bold", fontSize: "0.85rem", cursor: "pointer" }}>+ Nouveau</button>
      </div>
      {showNewUser && (
        <div style={{ margin: "1rem", background: "#141414", border: "1px solid #2e2e2e", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ color: "#f5c842", fontWeight: "bold", fontSize: "0.9rem" }}>➕ Nouveau compte</div>
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
            <button onClick={() => setShowNewUser(false)} style={{ background: "#1e1e1e", color: "#666", border: "none", padding: "0.9rem 1rem", borderRadius: "10px", cursor: "pointer" }}>✕</button>
          </div>
        </div>
      )}
      <div style={{ padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {allUsers.map(u => (
          <div key={u.id} style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1rem" }}>
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
                  <button onClick={() => setEditingUser(null)} style={{ background: "#1e1e1e", color: "#666", border: "none", padding: "0.9rem 1rem", borderRadius: "10px", cursor: "pointer" }}>✕</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#f0ede6", fontSize: "0.95rem", fontWeight: "bold" }}>{u.prenom}</div>
                  <div style={{ color: "#555", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                    {u.role === "superadmin" ? "👑 Super Admin" : u.role === "admin" ? "🔑 Admin" : "👤 Employé"}
                    {u.restaurant_id && ` · ${RESTAURANTS.find(r => r.id === u.restaurant_id)?.name || u.restaurant_id}`}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {isAdmin && (
                    <>
                      <button onClick={() => setEditingUser(u)} style={{ background: "#1e1e1e", border: "none", color: "#f5c842", borderRadius: "8px", padding: "0.4rem 0.7rem", cursor: "pointer", fontSize: "0.85rem" }}>✏️</button>
                      {isSuperAdmin && u.id !== currentUser.id && (
                        <button onClick={() => handleDeleteUser(u.id)} style={{ background: "#1a0f0f", border: "none", color: "#e57373", borderRadius: "8px", padding: "0.4rem 0.7rem", cursor: "pointer", fontSize: "0.85rem" }}>🗑️</button>
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

  // ── STOCK ──────────────────────────────────────────────────
  const storeOrder = restaurant?.id === "rue-neuve" ? STORE_ORDER_RUE_NEUVE : STORE_ORDER_EVENT;
  const stock = groupByStore(items);
  const stores = storeOrder.filter(s => stock[s] && stock[s].length > 0);
  const allAlerts = items.filter(i => isLow(i));
  const totalAlerts = allAlerts.length;

  if (loading) return (
    <div style={{ ...s, minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
      <p style={{ color: "#f5c842" }}>Chargement du stock...</p>
    </div>
  );

  if (error) return (
    <div style={{ ...s, minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <p style={{ color: "#e57373" }}>{error}</p>
      <button onClick={() => loadData(restaurant)} style={{ marginTop: "1rem", background: "#f5c842", color: "#111", border: "none", padding: "0.8rem 2rem", borderRadius: "10px", fontFamily: "inherit", fontWeight: "bold", cursor: "pointer" }}>Réessayer</button>
    </div>
  );

  if (!restaurant) return (
    <div style={{ ...s, minHeight: "100vh", background: "#0d0d0d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", paddingBottom: isAdmin ? "5rem" : "2rem" }}>
      <p style={{ color: "#f5c842", fontSize: "1rem", marginBottom: "0.5rem" }}>👋 Bonjour {currentUser.prenom} !</p>
      <h2 style={{ color: "#f0ede6", fontSize: "1.2rem", margin: "0 0 0.5rem", textAlign: "center" }}>Quel point de vente ?</h2>
      <p style={{ color: "#444", fontSize: "0.8rem", margin: "0 0 2rem" }}>{getTodayStr()}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: "320px" }}>
        {RESTAURANTS.map(r => (
          <button key={r.id} onClick={() => { setRestaurant(r); loadData(r); }}
            style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "12px", padding: "1.1rem 1.2rem", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", textAlign: "left", width: "100%" }}>
            <div style={{ fontSize: "2rem" }}>{r.emoji}</div>
            <div>
              <div style={{ color: "#f5c842", fontSize: "1rem", fontWeight: "bold" }}>{r.name}</div>
              <div style={{ color: "#555", fontSize: "0.78rem" }}>{r.subtitle}</div>
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
      <div style={{ ...s, minHeight: "100vh", background: "#0d0d0d", paddingBottom: isAdmin ? "5rem" : "2rem" }}>
        <div style={{ background: "#1a0f0f", padding: "1.2rem", borderBottom: "1px solid #3a1a1a", position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button onClick={() => setShowAlerts(false)} style={{ background: "none", border: "none", color: "#f5c842", fontSize: "1.6rem", cursor: "pointer", padding: 0 }}>‹</button>
          <h2 style={{ color: "#ff6b6b", fontSize: "1.05rem", fontWeight: "bold", margin: 0 }}>⚠️ {totalAlerts} à commander</h2>
        </div>
        <div style={{ padding: "0.8rem 1.1rem" }}>
          {storeOrder.map(store => {
            const list = byStore[store];
            if (!list) return null;
            return (
              <div key={store} style={{ marginBottom: "0.75rem" }}>
                <div style={{ color: "#555", fontSize: "0.75rem", fontWeight: "bold", margin: "0.5rem 0 0.3rem" }}>{store}</div>
                {list.map(item => (
                  <div key={item.id} style={{ background: "#1a0f0f", border: "1px solid #5a1a1a", borderRadius: "10px", padding: "0.85rem 1rem", marginBottom: "0.4rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#e57373", fontSize: "0.95rem" }}>{item.name}</div>
                      {item.note && <div style={{ color: "#7a3a3a", fontSize: "0.7rem" }}>📌 {item.note}</div>}
                      <div style={{ color: "#5a2a2a", fontSize: "0.72rem" }}>Seuil : {item.threshold_label}</div>
                    </div>
                    <span style={{ background: "#2a0f0f", color: "#e57373", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.92rem", fontWeight: "bold" }}>{item.qty === "" ? "—" : item.qty}</span>
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
    <div style={{ ...s, minHeight: "100vh", background: "#0d0d0d", paddingBottom: isAdmin ? "5rem" : "2rem" }}>
      <div style={{ background: "#141414", padding: "1.2rem", borderBottom: "1px solid #1e1e1e", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button onClick={() => { setRestaurant(null); setItems([]); }} style={{ background: "none", border: "none", color: "#f5c842", fontSize: "1.4rem", cursor: "pointer", padding: 0 }}>‹</button>
            <div>
              <h1 style={{ color: "#f5c842", fontSize: "1.1rem", fontWeight: "bold", margin: 0 }}>{restaurant?.emoji} {restaurant?.name}</h1>
              <p style={{ color: "#444", fontSize: "0.72rem", margin: 0 }}>{getTodayStr()} · {currentUser.prenom}</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => loadData(restaurant)} style={{ background: "none", border: "1px solid #2a2a2a", color: "#555", borderRadius: "8px", padding: "0.35rem 0.6rem", fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit" }}>🔄</button>
            {totalAlerts > 0 && <button onClick={() => setShowAlerts(true)} style={{ background: "#5a1a1a", color: "#ff8a80", border: "none", borderRadius: "20px", padding: "0.4rem 0.85rem", fontSize: "0.78rem", fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" }}>⚠️ {totalAlerts}</button>}
          </div>
        </div>
      </div>
      {lastSave && <div style={{ margin: "0.8rem 1.1rem 0", background: "#0f1f0f", border: "1px solid #1e3a1e", borderRadius: "8px", padding: "0.6rem 1rem", fontSize: "0.78rem", color: "#5cb85c" }}>✅ {lastSave.time} · {lastSave.who}</div>}
      <div style={{ padding: "0.8rem 1.1rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {stores.map(store => {
          const alerts = stock[store].filter(i => isLow(i)).length;
          return (
            <button key={store} onClick={() => setActiveStore(store)} style={{ background: "#141414", border: `1px solid ${alerts > 0 ? "#5a1a1a" : "#1e1e1e"}`, borderRadius: "12px", padding: "1rem 1.1rem", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", width: "100%" }}>
              <div>
                <div style={{ color: "#f0ede6", fontSize: "0.98rem", fontWeight: "bold" }}>{store}</div>
                <div style={{ color: "#3a3a3a", fontSize: "0.73rem", marginTop: "0.15rem" }}>{stock[store].length} articles</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {alerts > 0 && <span style={{ background: "#5a1a1a", color: "#ff6b6b", borderRadius: "10px", padding: "0.2rem 0.6rem", fontSize: "0.75rem", fontWeight: "bold" }}>{alerts} ⚠️</span>}
                <span style={{ color: "#333", fontSize: "1.3rem" }}>›</span>
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
    <div style={{ ...s, minHeight: "100vh", background: "#0d0d0d", paddingBottom: isAdmin ? "8rem" : "5rem" }}>
      {toast && <div style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", background: "#1e1e1e", color: "#f5c842", padding: "0.55rem 1.4rem", borderRadius: "20px", fontSize: "0.88rem", zIndex: 999, border: "1px solid #2e2e2e", whiteSpace: "nowrap", pointerEvents: "none" }}>{toast}</div>}
      <div style={{ background: "#141414", padding: "1rem 1.2rem", borderBottom: "1px solid #1e1e1e", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button onClick={() => { setActiveStore(null); setEditingId(null); setAddMode(false); }} style={{ background: "none", border: "none", color: "#f5c842", fontSize: "1.6rem", cursor: "pointer", padding: 0, lineHeight: 1 }}>‹</button>
          <div>
            <h2 style={{ color: "#f0ede6", fontSize: "1rem", fontWeight: "bold", margin: 0 }}>{activeStore}</h2>
            <p style={{ color: "#3a3a3a", fontSize: "0.72rem", margin: "0.15rem 0 0" }}>{storeItems.length} articles · {currentUser.prenom}</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "0.75rem 1.1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {storeItems.map(item => {
          const low = isLow(item);
          return (
            <div key={item.id} style={{ background: "#141414", border: `1px solid ${low ? "#5a1a1a" : "#1e1e1e"}`, borderRadius: "12px", overflow: "hidden" }}>
              {editingId === item.id ? (
                <div style={{ padding: "0.9rem 1rem" }}>
                  <div style={{ color: "#f5c842", fontSize: "0.85rem", marginBottom: "0.2rem", fontWeight: "bold" }}>✏️ {item.name}</div>
                  {item.note && <div style={{ color: "#7a6a2a", fontSize: "0.72rem", marginBottom: "0.3rem" }}>📌 {item.note}</div>}
                  <div style={{ color: "#444", fontSize: "0.73rem", marginBottom: "0.6rem" }}>Seuil : {item.threshold_label} {item.unit}</div>
                  <input ref={inputRef} value={editVal} onChange={e => setEditVal(e.target.value)} onKeyDown={e => e.key === "Enter" && saveQty(item.id)} placeholder="Quantité..." inputMode="decimal"
                    style={{ background: "#0d0d0d", border: "2px solid #f5c842", color: "#fff", padding: "0.8rem 1rem", borderRadius: "8px", fontSize: "1.2rem", width: "100%", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
                    {["0","1","2","3","4","5","6","8","10","12","15","20","✅ OK","assez","plein"].map(v => (
                      <button key={v} onClick={() => setEditVal(v)} style={{ background: editVal === v ? "#f5c842" : "#1e1e1e", color: editVal === v ? "#111" : "#777", border: "none", borderRadius: "6px", padding: "0.4rem 0.6rem", fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit", fontWeight: editVal === v ? "bold" : "normal" }}>{v}</button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                    <button onClick={() => saveQty(item.id)} disabled={saving} style={{ flex: 1, background: saving ? "#888" : "#f5c842", color: "#111", border: "none", padding: "0.8rem", borderRadius: "8px", fontFamily: "inherit", fontWeight: "bold", fontSize: "0.95rem", cursor: "pointer" }}>{saving ? "⏳..." : "💾 Enregistrer"}</button>
                    <button onClick={() => setEditingId(null)} style={{ background: "#1e1e1e", color: "#666", border: "none", padding: "0.8rem 1rem", borderRadius: "8px", cursor: "pointer" }}>✕</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", padding: "0.9rem 1rem", gap: "0.75rem", cursor: "pointer" }} onClick={() => { setEditingId(item.id); setEditVal(item.qty); }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: low ? "#e57373" : "#f0ede6", fontSize: "0.95rem" }}>{item.name}</div>
                    <div style={{ color: "#3a3a3a", fontSize: "0.7rem", marginTop: "0.1rem" }}>
                      {item.note && <span style={{ color: "#5a4a2a" }}>📌 {item.note} · </span>}
                      Seuil : {item.threshold_label} {item.unit}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {low && <span>⚠️</span>}
                    <span style={{ background: low ? "#2a0f0f" : "#1e1e1e", color: low ? "#e57373" : "#f5c842", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.92rem", fontWeight: "bold", minWidth: "2.2rem", textAlign: "center" }}>{item.qty === "" ? "—" : item.qty}</span>
                    <span style={{ color: "#2a2a2a" }}>✏️</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {addMode ? (
          <div style={{ background: "#141414", border: "1px solid #1e1e1e", borderRadius: "12px", padding: "1rem" }}>
            <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nom de l'article..."
              style={{ background: "#0d0d0d", border: "1px solid #2e2e2e", color: "#fff", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "1rem", width: "100%", fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: "0.5rem" }} />
            <input value={newQty} onChange={e => setNewQty(e.target.value)} placeholder="Quantité actuelle..." inputMode="decimal"
              style={{ background: "#0d0d0d", border: "1px solid #2e2e2e", color: "#fff", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "1rem", width: "100%", fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: "0.5rem" }} />
            <input value={newThreshold} onChange={e => setNewThreshold(e.target.value)} placeholder="Seuil d'alerte (ex: 3)..." inputMode="decimal"
              style={{ background: "#0d0d0d", border: "1px solid #f5c842", color: "#fff", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "1rem", width: "100%", fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: "0.75rem" }} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => addItem(activeStore)} style={{ flex: 1, background: "#f5c842", color: "#111", border: "none", padding: "0.8rem", borderRadius: "8px", fontFamily: "inherit", fontWeight: "bold", fontSize: "0.95rem", cursor: "pointer" }}>➕ Ajouter</button>
              <button onClick={() => setAddMode(false)} style={{ background: "#1e1e1e", color: "#666", border: "none", padding: "0.8rem 1rem", borderRadius: "8px", cursor: "pointer" }}>✕</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddMode(true)} style={{ background: "none", border: "1px dashed #252525", color: "#3a3a3a", borderRadius: "12px", padding: "0.9rem", fontFamily: "inherit", fontSize: "0.9rem", cursor: "pointer", width: "100%" }}>+ Ajouter un article</button>
        )}
      </div>
      <div style={{ position: "fixed", bottom: isAdmin ? "3.5rem" : 0, left: 0, right: 0, background: "#141414", borderTop: "1px solid #1e1e1e", padding: "0.75rem 1.2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#3a3a3a", fontSize: "0.73rem" }}>{lastSave ? `💾 ${lastSave.time} · ${lastSave.who}` : "Pas encore sauvegardé"}</div>
        <div style={{ fontSize: "0.78rem", fontWeight: "bold", color: storeItems.filter(i => isLow(i)).length > 0 ? "#e57373" : "#5cb85c" }}>
          {storeItems.filter(i => isLow(i)).length > 0 ? `⚠️ ${storeItems.filter(i => isLow(i)).length} à commander` : "✅ Tout est OK"}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
