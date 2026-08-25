# Weinbummel Thurgau – Das Weinquiz

Ein verspieltes Wissensquiz über die Weinregion Thurgau, mit ewiger Rangliste.
18 Fragen, ca. 5–7 Minuten, komplett statisch hostbar auf GitHub Pages.

## Inhalt dieses Ordners

```
index.html          Die Quiz-Seite (Start, Fragen, Ergebnis, Rangliste)
style.css            Design
script.js            App-Logik
questions.js         Der Fragenpool (18 Fragen)
config.js            Hier trägst du die Rangliste-Backend-URL ein
assets/
  weinbummel-logo.png
apps-script/
  Code.gs            Google-Apps-Script-Code für das Rangliste-Backend
```

Das Quiz funktioniert auch **ohne** das Google-Sheet-Backend – dann läuft die
Rangliste einfach lokal im Browser jeder spielenden Person (kein Vergleich
zwischen verschiedenen Personen). Für eine echte **ewige Rangliste über alle
Spieler:innen hinweg** brauchst du die rund 10 Minuten für das Backend-Setup
unten.

---

## 1. Google-Sheet-Backend einrichten (für die echte, geteilte Rangliste)

**Schritt 1 – Google Sheet erstellen**
1. Gehe zu [sheets.google.com](https://sheets.google.com) und erstelle eine neue, leere Tabelle.
2. Nenne sie z. B. "Weinbummel Thurgau – Rangliste".
   (Das Tabellenblatt selbst richtet sich beim ersten Aufruf automatisch ein – du musst keine Spalten von Hand anlegen.)

**Schritt 2 – Apps Script einfügen**
1. Im Sheet: Menü **Erweiterungen → Apps Script**.
2. Den kompletten Standardcode im Editor löschen und den Inhalt der Datei
   [`apps-script/Code.gs`](apps-script/Code.gs) aus diesem Projekt einfügen.
3. Oben das Projekt speichern (Diskettensymbol), z. B. als "Weinquiz Backend".

**Schritt 3 – Als Web-App bereitstellen**
1. Oben rechts auf **Bereitstellen → Neue Bereitstellung**.
2. Symbol/Zahnrad bei "Typ auswählen" → **Web-App**.
3. Einstellungen:
   - **Ausführen als:** Ich (dein Google-Konto)
   - **Zugriff:** Alle
4. Auf **Bereitstellen** klicken. Google fragt beim ersten Mal nach Berechtigungen –
   bestätigen ("Erweitert" → "Zu [Projektname] wechseln (unsicher)" ist bei
   eigenen Skripten normal und unbedenklich).
5. Die angezeigte **Web-App-URL** kopieren (endet auf `/exec`).

**Schritt 4 – URL im Quiz eintragen**
1. Öffne `config.js` in diesem Projekt.
2. Ersetze den Platzhalter:
   ```js
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/…/exec";
   ```
3. Datei speichern.

**Wichtig bei künftigen Code-Änderungen am Apps Script:** Nach jeder Änderung
am `Code.gs`-Inhalt im Apps-Script-Editor musst du erneut **Bereitstellen →
Bereitstellungen verwalten → Bearbeiten (Stift) → Neue Version → Bereitstellen**
wählen, sonst bleibt die alte Version aktiv.

Du kannst das Sheet jederzeit öffnen und dir die Rohdaten ansehen – jede
Quiz-Runde landet dort als eigene Zeile (Zeitstempel, Name, Punkte, Total,
Zeit in Millisekunden).

---

## 2. Auf GitHub Pages veröffentlichen

**Schritt 1 – Repository erstellen**
1. Auf [github.com](https://github.com) ein neues, öffentliches Repository anlegen, z. B. `weinbummel-thurgau-quiz`.

**Schritt 2 – Dateien hochladen**
- Einfachste Variante (ohne Git-Kenntnisse): Im leeren Repo auf **"uploading an existing file"** klicken und alle Dateien und Ordner aus diesem Projekt hineinziehen (inkl. `assets/`-Ordner). `apps-script/Code.gs` darf mit hochgeladen werden – er hat auf der Website keine Funktion, dient nur als Referenz/Backup.
- Alternative über die Kommandozeile:
  ```bash
  git init
  git add .
  git commit -m "Weinbummel Thurgau Quiz"
  git branch -M main
  git remote add origin https://github.com/DEIN-NUTZERNAME/weinbummel-thurgau-quiz.git
  git push -u origin main
  ```

**Schritt 3 – GitHub Pages aktivieren**
1. Im Repository: **Settings → Pages**.
2. Bei "Source" **Deploy from a branch** wählen.
3. Branch **main**, Ordner **/ (root)** auswählen, **Save**.
4. Nach 1–2 Minuten ist die Seite live unter:
   `https://DEIN-NUTZERNAME.github.io/weinbummel-thurgau-quiz/`

Diesen Link kannst du direkt teilen.

---

## 3. Fragen anpassen oder erweitern

Alle Fragen liegen in `questions.js` als einfaches Array. Neue Frage hinzufügen:

```js
{
  category: "Geografie",           // erscheint als kleines Badge über der Frage
  question: "Deine Frage hier?",
  options: ["Antwort A", "Antwort B", "Antwort C", "Antwort D"],
  correct: 1,                      // Index (0-basiert) der richtigen Antwort in options[]
  explanation: "Ein spannender Fakt, der nach der Antwort angezeigt wird."
}
```

Die Reihenfolge der Fragen **und** der Antwortmöglichkeiten wird bei jedem
Durchgang neu gemischt – Auswendiglernen der Reihenfolge bringt also nichts.

---

## 4. Lokal testen

Da die Seite `fetch` benutzt, sollte sie über einen kleinen lokalen Server
geöffnet werden (nicht per Doppelklick auf `index.html`):

```bash
cd weinbummel-thurgau-quiz
python3 -m http.server 8000
```

Danach im Browser `http://localhost:8000` öffnen.

---

## Quellen

Die Inhalte basieren auf offiziellen Informationen von swisswine.ch,
Branchenverband Thurgau Weine / thurgauweine.ch, vinum.eu und
deutschschweizerwein.ch.
