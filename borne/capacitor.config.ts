import type { CapacitorConfig } from "@capacitor/cli";

/**
 * La borne en application Android.
 *
 * 🔴 CE N'EST PAS UN CONFORT, C'EST UNE NÉCESSITÉ. Une page web ne peut pas
 * atteindre l'imprimante de cuisine : pas de socket TCP en JavaScript de
 * navigateur, et une page servie en https ne peut pas appeler une adresse
 * locale en http (mixed content). L'application native ouvre la socket
 * elle-même — voir `android/.../ImprimanteReseau.java`.
 *
 * ⚠️ `appId` DIFFÉRENT de l'app de gestion (`com.sekaicorndogs.app`) : deux
 * applications distinctes sur la même tablette, et Android refuse deux paquets
 * de même identifiant.
 */
const config: CapacitorConfig = {
  appId: "com.sekaicorndogs.borne",
  appName: "Sekai Borne",
  webDir: "dist",
  backgroundColor: "#ffebdb", // le crème de la charte
  android: {
    // 🔴 Le webview ne parle QU'À SUPABASE, en https. L'imprimante passe par
    // le plugin natif, pas par le webview : pas besoin d'ouvrir le mixed
    // content, et l'ouvrir affaiblirait l'application pour rien.
    allowMixedContent: false,
  },
};

export default config;
