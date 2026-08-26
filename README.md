# Weinbummel Thurgau – Das Weinquiz

Ein verspieltes Wissensquiz über die Weinregion Thurgau, in drei Etappen à
6 Fragen, mit Zwischenrangliste nach jeder Etappe und einer ewigen Rangliste
am Schluss (aus der man sich auch wieder löschen kann). Komplett statisch
hostbar auf GitHub Pages.

## Ablauf

1. **Start** – Übersicht, Route/Karte der sechs Anbaugebiete.
2. **Name eingeben** – erscheint in Zwischen- und ewiger Rangliste.
3. **Teil 1** (6 Fragen) → **Zwischenstand 1** (eigener Fortschritt + wer hat Teil 1 schon gespielt + Mini-Rangliste)
4. **Teil 2** (6 Fragen) → **Zwischenstand 2**
5. **Teil 3** (6 Fragen) → **Ergebnis** (Badge, Titel, automatisches Speichern)
6. **Ewige Rangliste** – eigene Einträge lassen sich mit dem × wieder löschen.

## Inhalt dieses Ordners

```
index.html          Die Quiz-Seite (alle Screens + Icon-Bibliothek)
style.css            Design
script.js            App-Logik
questions.js         Der Fragenpool (3 Teile à 6 Fragen) + Kompliment-Texte
config.js            Hier trägst du die Rangliste-Backend-URL ein
assets/
  weinbummel-logo.png
apps-script/
  Code.gs            Google-Apps-Script-Code für das Rangliste-Backend
```

Das Quiz funktioniert auch **ohne** das Google-Sheet-Backend – dann laufen
Zwischen- und ewige Rangliste einfach lokal im Browser jeder spielenden
Person (kein Vergleich zwischen verschiedenen Personen/Geräten). Für eine
echte, **geräteübergreifende Rangliste** brauchst du die rund 10 Minuten für
das Backend-Setup unten.

---

## 1. Google-Sheet-Backend einrichten (für die echte, geteilte Rangliste)

**Schritt 1 – Google Sheet erstellen**
1. Gehe zu [sheets.google.com](https://sheets.google.com) und erstelle eine neue, leere Tabelle.
2. Nenne sie z. B. "Weinbummel Thurgau – Rangliste".
   (Die zwei Tabellenblätter "Rangliste" und "Fortschritt" richten sich beim
   ersten Aufruf automatisch ein – du musst keine Spalten von Hand anlegen.
   "Rangliste" ist die ewige, permanente Rangliste; "Fortschritt" speichert
   die Zwischenstände nach Teil 1 und Teil 2.)

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

Du kannst das Sheet jederzeit öffnen und dir die Rohdaten ansehen. Im Blatt
"Rangliste" landet jedes fertig gespielte Quiz als eigene Zeile (inkl. einer
zufälligen `EntryId`, über die das Löschen aus dem Browser heraus funktioniert).
Im Blatt "Fortschritt" landet nach Teil 1 und Teil 2 je ein Zwischenstand.

**Wie das Löschen funktioniert:** Beim Speichern eines Ergebnisses erzeugt der
Browser eine zufällige ID und merkt sie sich lokal (`localStorage`). Nur
Einträge, deren ID im selben Browser gespeichert ist, zeigen in der Rangliste
ein × zum Löschen – auf einem anderen Gerät ist der eigene Eintrag zwar
sichtbar, aber nicht löschbar. Das reicht für einen privaten Freundeskreis-Quiz,
ist aber kein Schutz gegen absichtlichen Missbrauch der Web-App-URL.

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

Die Fragen liegen in `questions.js`, gegliedert in `ROUNDS` (3 Teile à 6
Fragen). Neue Frage hinzufügen, innerhalb des gewünschten Teils:

```js
{
  category: "Geografie",           // erscheint als kleines Badge über der Frage
  icon: "map",                     // Kontext-Icon – siehe Liste unten
  question: "Deine Frage hier?",
  options: ["Antwort A", "Antwort B", "Antwort C", "Antwort D"],
  correct: 1,                      // Index (0-basiert) der richtigen Antwort in options[]
  explanation: "Ein spannender Fakt, der nach der Antwort angezeigt wird."
}
```

Verfügbare Icon-Schlüssel (definiert als SVG-Symbole ganz oben in
`index.html`): `land`, `orchard`, `chart`, `shield`, `grapes`, `scroll`,
`tag`, `map`, `bottles`, `monastery`, `thermometer`, `soil`, `barrel`,
`people`, `trend`, `medal`.

Jeder Teil muss aus genau 6 Fragen bestehen (sonst stimmt die
Fortschrittsanzeige nicht mehr). Die Reihenfolge der Antwortmöglichkeiten
wird bei jedem Durchgang neu gemischt.

Die Kompliment-Texte, die bei einer richtigen Antwort zufällig erscheinen,
stehen im Array `PRAISE` ganz oben in `questions.js` – dort kannst du
beliebig weitere Varianten ergänzen.

**Hinweis zu Spoilern:** Achte darauf, dass Start-Seite und Erklärungstexte
keine Antworten späterer Fragen vorwegnehmen (z. B. keine Fakten nennen, die
gleichzeitig die Lösung einer noch offenen Frage sind).

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
