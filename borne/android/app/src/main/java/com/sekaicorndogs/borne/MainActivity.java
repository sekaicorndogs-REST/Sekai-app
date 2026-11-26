package com.sekaicorndogs.borne;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    // 🔴 Le plugin d'impression doit être déclaré AVANT super.onCreate() :
    // c'est là que Capacitor construit le pont, et un plugin enregistré après
    // n'existe pas pour le code web.
    registerPlugin(ImprimanteReseau.class);
    super.onCreate(savedInstanceState);
  }
}
