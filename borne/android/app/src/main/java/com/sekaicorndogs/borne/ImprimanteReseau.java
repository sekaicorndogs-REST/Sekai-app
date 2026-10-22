package com.sekaicorndogs.borne;

import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;

/**
 * Envoie un ticket à l'imprimante de cuisine, en réseau.
 *
 * 🔴 C'EST LA RAISON D'ÊTRE DE L'APPLICATION NATIVE. Une page web ne peut pas
 * faire ça : pas de socket TCP en JavaScript de navigateur, et une page servie
 * en https ne peut pas appeler une adresse locale en http. Tout le reste de la
 * borne tournerait dans un navigateur ; l'impression, non.
 *
 * Le protocole est le RAW / JetDirect sur le port 9100 : on ouvre une socket,
 * on écrit les octets ESC/POS, on ferme. C'est ce que comprend la quasi-totalité
 * des imprimantes thermiques réseau.
 *
 * ⚠️ LES OCTETS SONT DÉJÀ FORMÉS côté web (`src/ticket.ts`, `ticketEscPos`) et
 * passent ici en base64. Ce plugin ne met rien en forme : il transporte. Si un
 * jour le ticket change, il n'y a rien à toucher ici.
 */
@CapacitorPlugin(name = "ImprimanteReseau")
public class ImprimanteReseau extends Plugin {

  /** Au-delà, on considère l'imprimante absente. Une borne ne doit pas figer. */
  private static final int DELAI_MS = 4000;

  @PluginMethod
  public void imprimer(PluginCall call) {
    String hote = call.getString("hote");
    int port = call.getInt("port", 9100);
    String donneesB64 = call.getString("donnees");

    if (hote == null || hote.isEmpty() || donneesB64 == null) {
      call.reject("hote et donnees sont obligatoires");
      return;
    }

    // 🔴 Sur un thread à part : une socket qui met quatre secondes à échouer
    // gèlerait l'écran du client en plein service.
    new Thread(() -> {
      Socket s = null;
      try {
        byte[] donnees = Base64.decode(donneesB64, Base64.DEFAULT);
        s = new Socket();
        s.connect(new InetSocketAddress(hote, port), DELAI_MS);
        s.setSoTimeout(DELAI_MS);
        OutputStream o = s.getOutputStream();
        o.write(donnees);
        o.flush();

        JSObject r = new JSObject();
        r.put("octets", donnees.length);
        call.resolve(r);
      } catch (Exception e) {
        // ⚠️ On REJETTE, on n'avale pas l'erreur. Côté web, un ticket qui n'a
        // pas pu partir doit se voir : la commande est en base, mais la
        // cuisine ne la verra jamais si personne ne le sait.
        call.reject("Impression impossible : " + e.getMessage(), e);
      } finally {
        if (s != null) {
          try {
            s.close();
          } catch (Exception ignore) {
            // Fermeture au mieux : l'essentiel est déjà écrit.
          }
        }
      }
    }).start();
  }
}
