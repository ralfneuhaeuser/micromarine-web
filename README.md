# MicroMarine Web

**Experimental / Work in Progress – V0.1**

Smartphonefreundliche Web-Fernsteuerung für ultraleichte Modellboote, insbesondere im Maßstab 1:87.

## Interaktive Demo

Sobald GitHub Pages unter **Settings → Pages** mit **Deploy from a branch → main → /(root)** aktiviert ist:

https://ralfneuhaeuser.github.io/micromarine-web/

Die Demo läuft ausschließlich im Browser und verbindet sich nicht mit realer Hardware.

## Funktionen

- Zwei virtuelle Touch-Joysticks
- Profile für Segelboot, Motor mit Ruder und zwei Motoren mit Differenzialmischung
- Im Segelprofil bleibt die Segelstellung beim Loslassen erhalten; das Ruder zentriert sich
- Licht- und Sonderfunktionsschalter (nur Bedienoberfläche)
- Simulierte Telemetrie
- Demo-Stopp zum Zurücksetzen der Steuerwerte

## Sicherheit und Einschränkungen

**Keine Verbindung zu einem ESP32, keine echte Telemetrie und kein sicherheitswirksamer Not-Stopp.** Diese Version darf nicht zur Steuerung eines realen Boots eingesetzt werden. Vor einem realen Betrieb sind ein unabhängiger Failsafe, Verbindungsüberwachung und Praxistests erforderlich.

## Nächste Schritte

1. Touch-Bedienung auf dem iPhone testen.
2. Steuerprotokoll und WebSocket-Schnittstelle definieren.
3. ESP32-Firmware und hardwareseitigen Failsafe entwickeln.
4. Echte Akkutelemetrie anbinden.
5. Gewicht, Stromaufnahme und Reichweite im Modell messen.

## Lizenz

Der Quellcode ist öffentlich einsehbar. Es wurde noch keine Open-Source-Lizenz festgelegt.
