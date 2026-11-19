# Videoflix – Frontend

Angular-Frontend für **Videoflix**, eine Video-Streaming-Plattform nach dem Vorbild von Netflix.
Entstanden 2023 während meiner Ausbildung zum Entwickler bei der Developer Akademie.

Das zugehörige Backend (Django REST API) liegt hier:
[SilvioSchriefl/backend_videoflix](https://github.com/SilvioSchriefl/backend_videoflix)

## Stand

Das Frontend ist ein früher Stand und deckt den Einstieg in die App ab:

- Startseite
- Registrierung, angebunden an die Backend-API
- Login-Ansicht
- Seite „E-Mail bestätigt“ nach Klick auf den Bestätigungslink
- HTTP-Interceptor: hängt das Login-Token an jede Anfrage und leitet bei abgelaufener
  Anmeldung (401) zum Login weiter

Die übrigen Funktionen – Videos, Watchlist, Passwort-Reset, Kontoverwaltung – sind im
[Backend](https://github.com/SilvioSchriefl/backend_videoflix) umgesetzt, aber hier noch nicht angebunden.

## Technik

- Angular 16, TypeScript
- RxJS, Angular Router, HttpClient mit Interceptor
- SASS

## Lokal starten

Voraussetzungen: Node.js und die Angular CLI (`npm install -g @angular/cli`).

```bash
git clone https://github.com/SilvioSchriefl/Videoflix.git
cd Videoflix
npm install
ng serve
```

Danach im Browser `http://localhost:4200/` öffnen.
Das Backend muss lokal unter `http://127.0.0.1:8000/` laufen
(einstellbar in `src/app/enviroments/enviroments.ts`).
