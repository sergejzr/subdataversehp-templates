# Design-Profil: Bergische Universität Wuppertal (BUW)

Phase 1 der Hochschul-Blaupause · Stand: 2026-09-08 · label = `uni-wuppertal`
Quelle: **CD-Leitfaden des BUW-Kontakts (Torsten Rathmann)**, Werte mündlich
bzw. per Übergabe bestätigt.

> **Autoritativ = CD-Leitfaden des Kontakts.** Die Werte hier sind mit Torsten
> abgestimmt. Wo dieses Profil „offen" schreibt, steht die Antwort nicht im
> Leitfaden — dann nachfragen, nicht aus Logo oder Website sampeln
> (Hausregel: bei th-koeln, h-brs und hochschule-rhein-waal wichen die
> Logowerte regelmäßig vom CD ab).

**Sonderfall Wuppertal.** Als einziger Bereich von der Hochschule selbst
eingerichtet (Commit `b3b47e1` „Initial layout for Uni Wuppertal", Nachzug
`9e6ba2d` am 20.08.). Wuppertal hat als **einzige Uni die
`layout-adapted`-Basis nicht kopiert** — die `main.css` bestand bis
2026-09-08 ausschließlich aus `@font-face`-Blöcken. Zwei Konsequenzen, die
bei keiner anderen Uni gelten:

- Es gibt hier **kein Platzhalter-Türkis `#14f5b3`** aufzuräumen (der
  Nachlauf, der uni-koeln und uni-siegen je einen eigenen Patch gekostet
  hat). Die Datei ist frei von Fremdfarben.
- Es gibt aber auch **keine geerbten Struktur-Deklarationen**
  (Padding/Flex/Radius der Buttons). Die `main.css` themt gegen
  Plattform-Defaults. Aus uni-koeln wurden deshalb bewusst nur Farb- und
  Schriftregeln übernommen, keine Geometrie.

---

## 1. Farben

| Rolle | Name | HEX | Herkunft | Web-Einsatz |
|---|---|---|---|---|
| Primär | Unigrün | `#89ba17` | Pantone 376 | Flächen, Linien, Rahmen, Hover |
| Primär, eine Stufe tiefer | Etikettenfarbe | `#7fad18` | Pantone 376 + K10 | Logo-Untergrund, Aktiv-/Hover-Fläche |
| Text | neutrales Dunkel | `#1a1a1a` | keine Markenfarbe | Fließtext, Links, Überschriften |

### Kontrast-Pitfall (WCAG AA) — bestimmt die gesamte Farbführung

Nachgerechnet, nicht geschätzt:

| Paarung | Ratio | Text AA (4.5:1) | Groß/UI AA (3:1) |
|---|---:|---|---|
| `#89ba17` auf Weiß | **2.31:1** | FAIL | FAIL |
| `#7fad18` auf Weiß | **2.66:1** | FAIL | FAIL |
| Weiß auf `#89ba17` | **2.31:1** | FAIL | FAIL |
| Weiß auf `#7fad18` | **2.66:1** | FAIL | FAIL |
| `#1a1a1a` auf `#89ba17` | 7.54:1 | PASS | PASS |
| `#1a1a1a` auf `#7fad18` | 6.54:1 | PASS | PASS |
| `#1a1a1a` auf Weiß | 17.40:1 | PASS | PASS |

→ **Grün ist weder Textfarbe noch Fläche unter weißer Schrift.** Es erscheint
als Fläche mit dunklem Text, als Linie, als Rahmen, als Unterstreichung und
als Hover-Fläche. Analog zum Türkis-Pitfall bei uni-koeln
(`design-profil-uni-koeln.md` §1) und zum Hellblau bei uni-siegen.

Praktische Folge, die Wuppertal von den anderen Unis unterscheidet: die
`.statistics-footer` läuft hier **grün mit dunklem Text**, nicht dunkel mit
weißem Text. Die sonst übliche Paarung ist genau die, die ausscheidet.

**Offen:** Ob der Leitfaden Tonabstufungen zulässt. `#7fad18` ist bereits eine
CD-eigene Abstufung (K10), was dafür spricht — belegt ist es nicht. Solange
das offen ist, gibt es **keine dritte, dunklere Grünstufe**; Links laufen
deshalb in `#1a1a1a` mit grüner Unterstreichung statt in einem erfundenen
Dunkelgrün. Entscheidung vom 2026-09-08, revidierbar sobald der Leitfaden
vorliegt.

### Grün als Fläche hat eine Grenze: nicht auf `a:hover`

Korrektur vom 2026-09-08, nach dem ersten Rendering auf der Instanz. Die
erste Fassung setzte auf `a:hover` eine grüne Fläche — konsequent gedacht
(Grün darf Fläche sein), in der Wirkung aber falsch.

`a` trifft **jeden** Anker der Seite, und **10 der 26 Anker im
Basis-Template enthalten keinen Text**: das Kopflogo
(`<a><img class="header_logo"></a>`), die Karten-Thumbnails, die Anker um
die Hero-Buttons. Beim Hover über das Logo legte sich `#89ba17` um die
Etikettenfläche `#7fad18`. Die beiden Grüns stehen mit **1.15:1**
zueinander — das ergibt kein Highlight, sondern eine minimal hellere
Fläche mit harter Kante, also einen Schmutzrand um das Logo.

Dazu die generische Schwäche: eine Fläche auf einem **inline**-Anker ohne
Padding klebt an den Glyphen und bricht an Zeilenumbrüchen in Fragmente.

**Alle acht anderen Hochschulen tauschen auf `a:hover` nur die Farbe**
(uni-koeln, th-koeln, h-brs, fernuni-hagen, hsbi, hochschule-rhein-waal,
fh-muenster, uni-siegen). Wuppertal war die einzige mit `background-color`
— nicht weil die anderen es vergessen hätten, sondern weil sie eine dunkle
CD-Farbe haben und den Hover über die Textfarbe fahren können. Wuppertal
kann das nicht (§1) und ist deshalb überhaupt erst auf die Fläche
gekommen.

Jetzt: Unterstreichung wechselt von Grün auf Ink und wird dicker (Muster
hsbi). Flächen-Hover bleibt dort, wo das Element **eigenes Padding** hat
und die Fläche gewollt ist — Navigationspunkte, Buttons, `.btn-contact`,
`.btn-share`.

➡️ **Verallgemeinerbar:** Wo eine Hochschule keine textfähige CD-Farbe hat,
ist die Versuchung groß, den Hover über eine Fläche zu lösen. Auf dem
generischen `a` geht das nicht, weil die Plattform Anker ohne Textinhalt
kennt. Gehört bei der nächsten Uni mit hellem CD gleich mitgedacht.

**NEUTRAL (nicht überschreiben, Blaupause §3c):**
`#666666` in `.card-title-icon-block`, `#333333` in `.ui-datatable`. Das sind
Plattform-Textgrautöne, keine fremden Markenfarben. Bei diesen Selektoren
wird die Schriftfamilie korrigiert, das Grau bleibt.

---

## 2. Typografie

| Rolle | Schrift | Schnitte | Lizenz | Status |
|---|---|---|---|---|
| Sans (primär) | **Open Sans** | 300/400/500/600/700, je normal + kursiv | SIL OFL 1.1 | self-hosted, aktiv |
| Serif | **Mignon** | Regular 400 | kommerziell (Adobe/Linotype) | **nicht ausgeliefert** |

### Open Sans

Ablage `css/fonts/`, absolute Pfade `/at/uni-wuppertal/css/fonts/*.woff2` —
Hauskonvention von uni-koeln, th-koeln, h-brs und hsbi. Kein
`@import` von `fonts.googleapis.com` (DSGVO, RUNBOOK §8 B). Die OFL-Kopie
liegt als `css/fonts/LICENSE-OFL-1.1.txt` daneben.

**Vorzustand, der das nötig machte:** die elf `@font-face`-Blöcke zeigten auf
`../Fonts/*.woff2`, also `/at/uni-wuppertal/Fonts/`. Dieses Verzeichnis lag
**nicht im Repo**. Alle Requests liefen ins Leere, die Seite rendert seit dem
Onboarding in Systemdefaults. Das ist exakt der Befund, den Blaupause §3d als
einzige belastbare Prüfgröße benennt (`checkFontFaces`: liefert das Dokument
die Familie mit?) — nur hier ohne den Selbstbetrug einer lokal installierten
Schrift, weil gar nichts geladen wurde.

**Zwei Abweichungen vom Übergabe-Auftrag:**

1. **Bezugsquelle.** `google-webfonts-helper` (gwfh.mranftl.com) ist aus der
   Arbeitsumgebung nicht erreichbar. Verwendet wurde `@fontsource/open-sans`
   **5.3.0** — dieselbe Upstream-Quelle (`github.com/googlefonts/opensans`),
   dasselbe Latin-Subset, dieselbe Lizenz. Wer gwfh-Dateien bevorzugt: die
   zehn `.woff2` austauschen, die Pfade bleiben gültig.
2. **Kein `.woff`-Fallback.** Browser wählen das erste unterstützte Format;
   steht `woff2` davor, wird `woff` nie angefragt. Die alten `.woff`-URLs
   waren folgenlos, aber tot. woff2-only ist Hauskonvention.

Zehn Schnitte werden ausgeliefert, weil Torsten zehn deklariert hatte. Das
kostet zur Laufzeit nichts: Browser laden nur die `@font-face`-Blöcke, die von
tatsächlich gesetztem Text getroffen werden. Gesamtvolumen 212 KB im Repo,
davon lädt ein typischer Seitenaufruf zwei bis drei Dateien à ~19 KB.

### Mignon — bewusst nicht ausgeliefert

Mit Torsten abgestimmt. Zwei unabhängige Gründe:

1. **Lizenz.** Kommerzielle Schrift. Ob eine Webfont-Lizenz die Auslieferung
   durch das HRZ Bonn unter fremder Domain deckt, ist ungeklärt.
   Blaupause §3d: wo die CD-Schrift nicht lizenziert werden kann, gehört sie
   *aus dem Stack* — nicht als stiller Fallback stehen gelassen.
2. **Wirkungslos.** Keine Regel hat je `font-family: Mignon` gesetzt. Die
   Deklaration war auch vor der Lizenzfrage tot.

Der Block ist entfernt; die Begründung steht im Kommentar von
`css/main.css` §1, damit sie nicht als Versehen zurückkommt. Wird die Lizenz
später geklärt, ist dort auch beschrieben, was nachzuziehen wäre.

**Offen:** `text-transform` auf Überschriften. Ob die BUW Versalien führt, ist
eine CD-Frage, die der Leitfaden nicht beantwortet. uni-koeln hat sie als
belegtes CD-Merkmal, die übrigen Unis nicht. Bis dahin gilt der
Plattform-Default.

---

## 3. Logo

**Geliefert:** `img/logo_footer_white.svg`, 327×104, 74 `<path>` + 4
`<polygon>` in einer Gruppe `fill="#FFFFFF"`, keine `<style>`, keine `<defs>`,
keine IDs. Trägt `width`/`height` **und** `viewBox` — Fall B der
`logo-hausregel.md` §3a (SVG ohne intrinsische Größe, rendert 0×0) greift
also **nicht**. Die Datei liegt unverändert im Repo als Herkunftsbeleg.

**Ausgeliefert:** `img/logo.svg` — identische Zeichnung, Canvas horizontal
beschnitten auf **267.13×104**.

### Warum beschnitten

Vermessen an der Originaldatei (Rasterung 8×, Alphakanal):

| | Wert |
|---|---|
| Löwe | x 19.00 … 98.25, y 9.75 … 93.62 (79.25 × 83.88) |
| Wortmarke | x 118.38 … 248.12, y 19.00 … 84.00 |
| Versalhöhe | 13.62 / 13.50 / 13.25 (drei Zeilen) |
| Ränder | links 19.00 · **rechts 78.88** · oben 9.75 · unten 10.38 |
| Abstand Löwe → Wortmarke | 20.12 |

Die 78.88 rechts sind **Layout-Totraum aus dem Footer-Slot** der Uni-Website
(daher der Dateiname), kein Schutzraum: links stehen 19.00, oben und unten je
rund 10.1, und 20.12 ist zugleich der interne Abstand Löwe→Wortmarke. Der
Beschnitt setzt den rechten Rand auf exakt den linken — nachgemessen
19.00 / 19.00. Geändert wurde nur das `viewBox`/`width`/`height`-Tripel, die
Zeichnung ist unangetastet.

### Schutzzone

Das Logo **trägt seine Schutzzone selbst** (wie uni-koeln): die grüne Fläche
ist die Bildfläche, der weiße Freiraum darin ist der Schutzraum. Es braucht
kein zusätzliches CSS-Padding — und darf keins haben, sonst stünde der
Freiraum doppelt.

**Offen:** 19.00 Einheiten sind der Freiraum, den die gelieferte Datei
mitbringt, kein aus dem Leitfaden belegter Wert. Bei 80px Logohöhe sind das
14.6px. Nennt der Leitfaden eine Schutzzone in Modulen — üblich sind
Versalhöhe (hier 13.5 Einheiten = 10.4px) oder Löwenbreite —, ist der Wert
gegenzuprüfen.

### Geometrie (logo-hausregel.md §3/§4)

| | |
|---|---|
| Verhältnis | 267.13 / 104 = **2.5685:1** |
| `max-width` | 360px (custom-stylesheet.css deckelt sonst auf 200px) |
| `max-height` | 80px (custom-stylesheet.css setzt sonst height 45px) |
| es bindet | die **Höhe** — 80 × 2.5685 = 205.5px < 360px |
| Margin | (104 − 80) / 2 = **12px** |
| Logobox | 104px, wie alle anderen |
| gerendert | 205.5 × 80 |
| sichtbare Tinte darin | 176.3 × 64.5 = **11.4k px²** |

Die 11.4k liegen rechnerisch am unteren Rand des Verbunds (th-koeln 11.8k,
fernuni-hagen 24.3k). Hier unkritisch: die grüne Etikettenfläche trägt
205.5 × 80 = **16.4k**, das Logo liest als geschlossene Kachel. Kein
Nachziehen auf 96px wie bei uni-koeln.

### Weiß auf Grün statt eingebranntem Grün

Vorher: `BUW_Logo-weiss-auf-gruen-rgb.png`, 623×253, Grün in der Datei.
Jetzt: weißes SVG auf `background-color: #7fad18` mit
**`background-clip: content-box`**. Das clip ist Pflicht, nicht Kosmetik —
`custom-stylesheet.css` setzt auf `.header_logo` ein `padding-left: 20px`;
ohne clip liefe die grüne Fläche 20px nach links über das Bild hinaus und das
Logo säße sichtbar aus der Mitte seiner eigenen Etikette. Das Padding selbst
bleibt: es hält den Abstand zum Viewportrand.

Die alte PNG bleibt vorerst im Repo (unbenutzt, Herkunft).

---

## 4. Favicon

Aus `logo.svg` abgeleitet, also aus offizieller Quelle — nicht aus dem
untracked `img/Pasted image.png` (199×178, Screenshot-Ausschnitt mit
Beschnittartefakt an der Oberkante, Herkunft undokumentiert). Diese Datei ist
**nicht** Teil der Lieferung und sollte gelöscht oder ersetzt werden.

`img/favicon.svg`: Quadrat um den Löwen. Kantenlänge 104 = Löwenhöhe 83.88 +
2 × 10.06 (der vertikale Freiraum der Originaldatei), horizontal auf die
Löwenmitte 58.625 zentriert → `viewBox="6.625 0 104 104"`, freier Rand
12.375 links und rechts, 9.75 oben, 10.38 unten. Grüne Etikettenfläche
`#7fad18` als `<rect>` darunter, weißer Löwe darauf — dieselbe CD-Paarung wie
das Header-Logo.

Daraus gerastert: `favicon-16/32/48/64.png` und `apple-touch-icon-180.png`.
Die CSV zeigt auf **`favicon-64.png`** (Hauskonvention: uni-koeln, th-koeln,
fernuni-hagen, hochschule-rhein-waal, hsbi). Das Basis-Template gibt genau
einen `<link rel="icon" type="image/png">` aus, mehr Größen kann es derzeit
nicht ausspielen.

**Bekannte Schwäche:** der Bergische Löwe ist eine schraffierte Zeichnung. Ab
etwa 32px hält sie, bei 16px laufen die Striche zu einer Fläche zusammen. Das
ist keine Rasterungsfrage, sondern die Zeichnung selbst — eine für kleine
Größen vereinfachte Variante wäre eine Neuzeichnung und damit eine
CD-Entscheidung. **Beim Kontakt anfragen**, ob das CD eine solche Variante
kennt.

---

## 5. Gestaltungselemente

**Titelbild `img/wuppertal-bg.jpg`** (3246×1375) — stammt von Torsten, **noch
nicht final abgestimmt**, der zweite Vorgesetzte hat sich nicht geäußert. Ein
Angebot für ein selbst gebautes Motiv liegt vor. **Ohne Rückmeldung nichts
ändern**, auch nicht Kompression oder Größe.

**Hero-Overlay:** `homepage.css` legt unbedingt zwei 40-%-Gradienten über den
Hero (Blaupause §3b). Bei H-BRS und uni-koeln war das störend, weil dort ein
helles generiertes SVG darunterliegt. Hier liegt ein Foto — genau der Fall,
für den das Overlay gebaut wurde. Bleibt stehen; Hero-Titel und -Beschreibung
bleiben im weißen Plattform-Default, solange das Titelbild nicht final ist.

---

## 6. Registry-Zeile (`config/unis.csv`)

| Spalte | vorher | jetzt |
|---|---|---|
| `Name` | `Uni Wuppertal` | `Universität Wuppertal` |
| `logo` | `…/BUW_Logo-weiss-auf-gruen-rgb.png` | `…/img/logo.svg` |
| `js` | *leer* | `…/js/main.js` |
| `txt` | `…/txt/main.txt` | *leer* |
| `favicon` | *leer* | `…/img/favicon-64.png` |

- **`Name`.** Der in der GUI korrigierte Tippfehler („UNIVERRSITÄT") steckte
  **nicht** in der CSV — Spalte 1 trug `Uni Wuppertal`. Die beiden Felder sind
  auch nicht dasselbe: der Hero („Welcome to …") rendert
  `main_dataverse_info.name` aus Dataverse, die CSV-Spalte `Name` speist den
  NRW-Karten-Tooltip (`svg_manipulator.py`), den Login-Prompt
  („Log in via …") und das Anlegen neuer Collections
  (`create_and_publish_dataverses.py`; bestehende werden übersprungen).
  GUI-Stand und Registry laufen also **nicht** auseinander. Geändert wurde nur
  die Schreibweise: alle übrigen Zeilen führen den ausgeschriebenen Namen
  (`Universität Bonn`, `Universität Siegen`, `Universität zu Köln`).
  Bewusst **nicht** die Vollform „Bergische Universität Wuppertal", solange
  Bonn nicht als „Rheinische Friedrich-Wilhelms-Universität" geführt wird.
- **`js`.** Die Datei lag seit dem Onboarding im Repo, wurde aber nie geladen.
  Inhaltlich ist sie **inert**: eine Hyphenopoly-Konfiguration mit Selektoren
  der Uni-Website (`.ubf-mainMenu`, `.ubf-section`, …), die es in Dataverse
  nicht gibt — und die Hyphenopoly-Bibliothek selbst wird nirgends geladen.
  Alle anderen Unis liefern dieselbe Datei aus. Die Spalte wird gefüllt, damit
  Wuppertal nicht der Sonderfall bleibt; eine Wirkung hat das nicht.
- **`txt`.** Geleert. Bei `layout-adapted` wird `txt/main.txt` nirgends
  ausgespielt (`custom_text` nutzt nur das Siegen-Template), der Inhalt steht
  bereits in der Collection-Beschreibung. Die Datei bleibt als Herkunftsbeleg
  liegen. Wuppertal war die einzige Uni mit gesetzter Spalte.

---

## 7. Offene Punkte für den Kontakt

1. **Tonabstufungen** — lässt der Leitfaden weitere Grünstufen zu? Davon hängt
   ab, ob Links eine grüne Markenfarbe bekommen können (§1).
2. **Schutzzone** — nennt der Leitfaden einen Modulwert? (§3)
3. **Versalien** — führt die BUW Versalien in Überschriften? (§2)
4. **Favicon klein** — gibt es eine für 16px vereinfachte Löwenvariante? (§4)
5. **Titelbild** — Freigabe von Torsten und dem zweiten Vorgesetzten, oder
   Annahme des Angebots für ein eigenes Motiv. (§5)
6. **Mignon** — falls die Webfont-Lizenz für die Auslieferung durch das HRZ
   Bonn doch geklärt werden kann, ist der Wiedereinbau in `main.css` §1
   beschrieben. (§2)
