# DataPublication.nrw – Subdataverse Templates

Dieses Repository enthält Vorlagen und Konfigurationsdateien zur Gestaltung von institutionellen oder fachlichen Unterbereichen („Subdataverses“) innerhalb von DataPublication.nrw.

Ziel ist es, Hochschulen und Projekten eine einfache Möglichkeit zu geben, eigene Startseiten, Inhalte und Designs innerhalb der gemeinsamen Dataverse-Infrastruktur bereitzustellen — ohne die zentrale Plattform selbst verändern zu müssen.

---

# 🚀 Quickstart

## In wenigen Minuten zum eigenen Hochschulbereich

### 1. Zugriff anfragen

Für Schreibrechte wird ein SSH-Key benötigt.

Siehe Abschnitt:
👉 [🔐 Repository-Zugriff](#-repository-zugriff)

---

### 2. Repository klonen

```bash
git clone git@github.com:sergejzr/subdataversehp-templates.git
cd subdataversehp-templates
```

---

### 3. Vorlage kopieren

Beispiel für eine neue Hochschule:

```bash
cp -r templates/universities/layout-standard \
      templates/universities/uni-siegen
```

---

### 4. Inhalte anpassen

Typische Anpassungen:

- Texte
- Ansprechpartner
- Logos
- Bilder
- CSS
- Links

Wichtige Verzeichnisse:

```text
templates/universities/uni-siegen/
├── css/
├── img/
├── txt/
└── template/
```

---

### 5. Hochschule registrieren

Die Hochschule muss in:

```text
config/unis.csv
```

eingetragen werden. 

Beispiel:

```csv
Universität Siegen,https://www.uni-siegen.de,,uni-siegen,1
Es sollten bereits alle dort gelistet sein, bitte infach die entsprechende Zeile editieren (und sich am layout-standard orientieren)
```

---

### 6. Änderungen committen & pushen

```bash
git add .
git commit -m "Initial layout for Uni Siegen"
git push
```

---

### 7. Ergebnis prüfen

Nach wenigen Minuten wird die Seite automatisch auf dem Testsystem erzeugt:

```text
https://datapublication-nrw-test.hrz.uni-bonn.de/at/uni-siegen
```

---

# 🔐 Repository-Zugriff

Damit Hochschulen eigene Anpassungen vornehmen können, benötigen sie Schreibzugriff auf dieses Repository.

## SSH-Key erzeugen

Falls noch kein SSH-Key vorhanden ist:

```bash
ssh-keygen -t ed25519 -C "name@hochschule.de"
```

Die Standardpfade können einfach bestätigt werden.

Der öffentliche Schlüssel befindet sich anschließend typischerweise unter:

```bash
~/.ssh/id_ed25519.pub
```

---

## Öffentlichen Schlüssel senden

Den Inhalt der `.pub` Datei bitte an das DataPublication.nrw-Team senden.

Beispiel:

```bash
cat ~/.ssh/id_ed25519.pub
```

---

## Repository klonen

Nach Freischaltung kann das Repository per SSH geklont werden:

```bash
git clone git@github.com:sergejzr/subdataversehp-templates.git
```

---

## GitHub-Dokumentation

SSH-Keys:
https://docs.github.com/en/authentication/connecting-to-github-with-ssh

SSH-Verbindung testen:
https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection

---

# 🧩 Grundprinzip

Die Plattform basiert auf einem Template-System.

Jede Hochschule oder Organisation erhält einen eigenen Bereich innerhalb von DataPublication.nrw.

Die Inhalte werden aus Templates generiert und automatisch in das Dataverse-System integriert.

---

# 🏗️ Architektur

```text
Hochschule / Projekt
        ↓
Git Repository
        ↓
Template Rendering
        ↓
DataPublication.nrw Testsystem
        ↓
Subdataverse-Seite
```

---

# 📁 Repository-Struktur

```text
.
├── config/
│   └── unis.csv
│
├── templates/
│   ├── universities/
│   ├── institutes/
│   └── projects/
│
├── scripts/
└── output/
```

---

# 🧱 Template-Struktur

Ein typisches Template sieht wie folgt aus:

```text
templates/universities/uni-bonn/
├── css/
├── img/
├── txt/
└── template/
```

## Bedeutung der Verzeichnisse

| Ordner | Beschreibung |
|---|---|
| `css/` | Individuelle Stylesheets |
| `img/` | Logos und Bilder |
| `txt/` | Inhaltliche Texte |
| `template/` | Jinja2-Templates |

---

# 🎨 Anpassungsmöglichkeiten

## Inhalte

Folgende Inhalte können individuell angepasst werden:

- Begrüßungstexte
- Ansprechpartner
- Kontaktinformationen
- Logos
- Bilder
- Links
- Beschreibungen

---

## Darstellung

Anpassbar sind unter anderem:

- Farben
- CSS
- Layoutstruktur
- Headerbilder
- Kachelansichten
- Landingpages

---

## Erweiterte Anpassungen

Für größere Einrichtungen oder Projekte sind zusätzlich möglich:

- Eigene Frontends
- Spezielle Komponenten
- Erweiterte Metadatenansichten
- API-Integration
- Fachspezifische Layouts

Diese Anpassungen erfolgen nach technischer Abstimmung mit dem DataPublication.nrw-Team.

---

# ⚠️ Nicht verändert werden sollte

Folgende zentrale Komponenten sollten nicht verändert werden:

- Routing-Struktur
- zentrale Dataverse-Komponenten
- globale Templates
- Systemkonfigurationen

---

# 🧪 Testsystem vs. Produktivsystem

Änderungen werden zunächst ausschließlich im Testsystem angezeigt.

Das Testsystem dient zur:

- technischen Prüfung
- Qualitätssicherung
- Abstimmung mit den Standorten

Die Übernahme in das Produktivsystem erfolgt nach Freigabe durch das DataPublication.nrw-Team.

---

# 🔄 Automatische Bereitstellung

Das Repository wird regelmäßig automatisch synchronisiert.

Neue Änderungen werden dadurch ohne manuelle Deployments auf dem Testsystem sichtbar.

---

# 📚 Personalisierungsstufen

Die Templates können unterschiedlich stark angepasst werden.

## Level 1 – Standardlayout

- Texte
- Logos
- Farben

Minimaler Aufwand.

---

## Level 2 – Erweiterte Anpassung

Zusätzlich:

- eigene CSS-Anpassungen
- individuelle Komponenten
- angepasste Startseiten

---

## Level 3 – Individuelle Oberfläche

Für größere Projekte oder Fachcommunities:

- eigene Frontends
- API-Nutzung
- individuelle Visualisierung
- komplexe Integrationen

Nur nach technischer Abstimmung.

---

# 🧠 Technische Grundlagen

Verwendete Technologien:

- Dataverse
- Jinja2 Templates
- HTML/CSS
- Python Rendering Scripts
- Git/GitHub

---

# 🛠️ Voraussetzungen

Empfohlen:

- grundlegende Git-Kenntnisse
- einfacher Umgang mit Textdateien
- HTML/CSS optional

Es sind keine tiefgehenden Dataverse-Kenntnisse erforderlich.

Bereits einfache Anpassungen von Texten und Bildern reichen aus.

---

# 🤝 Zusammenarbeit

Beiträge und Verbesserungen durch teilnehmende Hochschulen sind ausdrücklich erwünscht.

Bitte größere strukturelle Änderungen vorab abstimmen.

---

# 📬 Kontakt

DataPublication.nrw  
Servicestelle Forschungsdatenmanagement  
Universität Bonn

E-Mail:

forschungsdaten@uni-bonn.de

Repository:
https://github.com/sergejzr/subdataversehp-templates
