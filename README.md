# MicroMarine Web

Smartphonefreundliche Web-Fernsteuerung für ultraleichte Modellboote, insbesondere im Maßstab 1:87.

## Stand: V0.1 – interaktiver UI-Prototyp

Die Datei [index.html](index.html) enthält eine eigenständige, responsive Oberfläche ohne externe Bibliotheken. Sie bietet:

- Zwei virtuelle Touch-Joysticks
- Profile für Segelboot, Motor mit Ruder und zwei Motoren mit Differenzialmischung
- Im Segelprofil bleibt die Segelstellung beim Loslassen erhalten, das Ruder zentriert sich
- Licht- und Sonderfunktionsschalter
- Simulierte Telemetrie
- Einen Demo-Stopp, der die Steuerwerte auf null setzt

**Wichtig:** Noch keine Verbindung zu einem ESP32, keine echte Telemetrie und kein sicherheitswirksamer Not-Stopp. Vor einem realen Betrieb ist ein unabhängiger hardwareseitiger Failsafe erforderlich.

## Testen

`index.html` in einem JavaScript-fähigen Browser öffnen, beispielsweise über einen lokalen Webserver. Die iPhone-Dateivorschau führt JavaScript nicht immer aus. GitHub selbst zeigt HTML-Dateien nur als Quelltext oder Vorschau an; das private Repository ist noch keine gehostete Webseite.

## Nächste Schritte

1. Touch-Bedienung auf iPhone testen.
2. Steuerprotokoll und WebSocket-Schnittstelle definieren.
3. ESP32-Firmware und hardwareseitigen Failsafe entwickeln.
4. Echte Akkutelemetrie anbinden.
5. Gewicht, Stromaufnahme und Reichweite im Modell messen.

Das Repository bleibt zunächst privat. Eine Veröffentlichung erfolgt erst nach ausdrücklicher Freigabe.
