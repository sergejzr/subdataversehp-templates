# 🧩 DataPublication.nrw Homepages -- Nutzung für Hochschulen


Dieses Repository stellt **Vorlagen (Templates) für DataPublication.nrw-Unterseiten** bereit.

👉 Fokus: **individuell gestaltbare Bereiche innerhalb DataPublication.nrw**

---

## 🎯 Zielgruppe

Dieses Repository richtet sich an:

- teilnehmende Hochschulen im Datapublication-Kontext
- Forschungsdatenmanagement (FDM) Teams
- Bibliotheken und IT-Abteilungen
- Verantwortliche für Dataverse-Strukturen

👉 Ziel ist es, **eigene DataPublication.nrw-Seiten anzupassen**.

---

## 🧭 Ziel des Repositories

Dieses Repository dient dazu:

- **standardisierte Einstiegsseiten bereitzustellen**
- unterschiedliche **Level der Personalisierung** zu ermöglichen
- eine einfache Integration zu gewährleisten

👉 Wichtig:
Es geht **nicht um komplette Homepages**, sondern ausschließlich um:

➡️ **Unterseiten innerhalb DataPublication.nrw (Subdataverses)**

---

## 🌐 Integration in DataPublication.nrw

Die Templates werden in das Testsystem automatisch übernommen :

👉 https://datapublication-nrw-test.hrz.uni-bonn.de/

Beispiel:

👉 https://datapublication-nrw-test.hrz.uni-bonn.de/at/layout-standard

💡 Das bedeutet:
- Änderungen in diesem Repository wirken sich direkt auf die Darstellung im Testsystem aus (alle 5 Minuten wird diese Repository gescannt)
- keine manuelle HTML-Pflege im System notwendig

---

------------------------------------------------------------------------

## 🧱 Struktur des Repositories

    templates/
      └── universities/         → Beispiele für Hochschulen
                ├──layout-standard
                ├──layout-adapted
                └──layout-custom
    config/
      └── unis.csv              → Konfiguration der Einrichtungen

------------------------------------------------------------------------

## 🧩 Personalisierungslevel

### 🔹 Level 1: Standard-Layout

-   Nutzung des Basis-Templates
-   keine Anpassung
-   Beispiel: templates/universities/layout-standard/

------------------------------------------------------------------------

### 🔹 Level 2: Angepasstes Layout

-   eigene Texte und Inhalte
-   Anpassung einzelner Komponenten in den Ordnern css img js
-   Beispiel: templates/universities/layout-adapted/

------------------------------------------------------------------------

### 🔹 Level 3: Stark individualisiert

-   eigenes Layout möglich
-   eigene Struktur und Inhalte über junja Template subdataverse-homepage-jinja.html
-   vollständige Kontrolle über Darstellung

------------------------------------------------------------------------


## 🚀 Nutzung

### 1. Repository klonen

``` bash
git clone https://github.com/sergejzr/subdataversehp-templates
cd subdataversehp-templates
```

### 3. Funktionsprinzip

1.  Template auswählen und als ein neuer Prdner unter "universities" kopieren (z.B) templates/universities/layout-adapted/ -> templates/universities/uni-siegen
2.  Inhalte anpassen\
3.  Änderungen commiten\
4.  Nach etwa 5 Minuten automatisch im Testsystem verfügbar https://datapublication-nrw-test.hrz.uni-bonn.de/at/uni-siegen
Wichtig - der Unterbereich (hier "uni-siegen") muss im DataPublication.nrw vorher vorhanden sein

------------------------------------------------------------------------

### 2. Inhalte anpassen

-   Texte in templates/universities/`<layout>`{=html}/txt/\
-   Bilder in templates/universities/`<layout>`{=html}/img/\
-   Styles in templates/universities/`<layout>`{=html}/css/

---

#### 🗂️ Konfiguration über `config/unis.csv`

Die Datei `config/unis.csv` ist das **zentrale Steuerungselement** des Systems.

Sie definiert:

- welche Hochschulen berücksichtigt werden
- wie Subdataverse-Seiten aussehen
- welche Assets (Logo, CSS, JS, Hintergrund) geladen werden
- ob ein Dataverse erstellt/veröffentlicht wird

---

#### 🧱 Aufbau der CSV

``` csv
Name,homepage,repourl,label,enabled,logo,background,css,js,txt
```

------------------------------------------------------------------------

#### 🔑 Bedeutung der Spalten

  -----------------------------------------------------------------------
  Feld                               Beschreibung
  ---------------------------------- ------------------------------------
  `Name`                             Anzeigename der Hochschule

  `homepage`                         Link zur Hochschul-Webseite

  `repourl`                          Optional: externe Ziel-URL
                                     (überschreibt interne Verlinkung)

  `label`                            **Zentrale ID** (Dataverse-Alias +
                                     URL-Pfad)

  `enabled`                          `1` = aktiv, `0` = deaktiviert

  `logo`                             URL oder Pfad zum Hochschullogo

  `background`                       Hintergrundbild der Seite

  `css`                              Pfad zu individuellem CSS

  `js`                               Pfad zu individuellem JavaScript

  `txt`                              optionaler Textinhalt
  -----------------------------------------------------------------------

------------------------------------------------------------------------

#### ⚙️ Verwendung im System


Beim Rendering:

-   `label` → bestimmt Zielpfad (`/at/<label>/`)
-   `logo`, `background`, `css`, `js` → werden ins Template injiziert
-   `Name` → Anzeige auf der Seite

👉 Beispiel:

``` csv
Uni Bielefeld,...,uni-bielefeld,1,...,/at/uni-bielefeld/css/main.css
```

→ erzeugt:

    /at/uni-bielefeld/index.html

------------------------------------------------------------------------

#### 🧠 Wichtiges Konzept

👉 `label` ist der wichtigste Wert im System:

Er bestimmt gleichzeitig:

-   Dataverse-Alias
-   URL-Pfad (`/at/<label>/`)
-   Template-Zuordnung (`templates/universities/<label>/`)
-   Assets-Pfade

------------------------------------------------------------------------

### 💡 Best Practices

-   Assets pro Hochschule sauber strukturieren\
-   CSS/JS nur verwenden, wenn wirklich nötig\
-   möglichst viele Hochschulen mit Standard-Template betreiben


### 3. Änderungen commiten

``` bash
git add .
git commit -m "Anpassungen im neuen Bereich - \"uni-siegen\" "
```

### 4. Integration

👉 erfolgt automatisch im Testsystem (nach Rückspracher mit DataPublication.nrw Team dann auch im Produktivsystem)

------------------------------------------------------------------------

## 🎨 Anpassungsmöglichkeiten

-   Inhalte (Texte, Ansprechpartner, Links)\
-   Design (Farben, Logos, Layout)\
-   Struktur (Sektionen, Komponenten)

------------------------------------------------------------------------

## 🧠 Best Practices

-   Basis-Templates verwenden\
-   Inhalte getrennt von Layout pflegen\
-   Templates wiederverwenden

------------------------------------------------------------------------

## ⚠️ Hinweise

-   Änderungen wirken sich direkt auf das Dataverse aus\
-   Templates müssen valide HTML-Strukturen enthalten\
-   Assets korrekt referenzieren
-   Der entsprechende Unterbereich (muss im Testsystem vorher vorhanden sein

------------------------------------------------------------------------

## 🧾 Fazit

👉 **strukturierte und flexible Gestaltung von Subdataverse-Seiten**

Vorteile:

-   einfache Anpassung eigener Bereiche\
-   konsistentes Erscheinungsbild\
-   klare Trennung von Inhalt und Technik
