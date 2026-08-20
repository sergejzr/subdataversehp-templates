#!/usr/bin/env python3
"""guard.py — PreToolUse-Hook: erzwingt die harten Regeln des Repos.

Registriert in .claude/settings.json. Blockiert zwei Dinge:

  1. git commit / git push in JEDER Form, die durch das Bash-Tool laeuft.
     Die permissions.deny-Regeln in settings.json decken den Normalfall ab,
     greifen laut Doku aber nicht zuverlaessig bei Verkettungen
     (`foo && git push`), Subshells oder `git -C <pfad> push`. Dieser Hook
     ist die zweite Schicht.
  2. Schreibzugriffe auf tooling/visual-audit/profiles/ — die CD-Profile sind
     fertig und gehoeren nicht zum Logo-Auftrag.

Warum Python und nicht jq: python3 ist im Repo ohnehin Voraussetzung
(csv_lint.py, onboard-proxy.py), jq ist es nicht.

Protokoll (code.claude.com/docs/en/hooks):
  stdin  = JSON mit tool_name und tool_input
  stdout = JSON mit hookSpecificOutput.permissionDecision
  exit 0 auch im deny-Fall — exit 2 waere die Alternative OHNE JSON.

Fail-open INNERHALB des Skripts ist Absicht: ein unerwarteter Fehler beim
Auswerten darf die Sitzung nicht lahmlegen, deshalb geht jede Exception nach
stderr und wird mit "allow" beantwortet.

ACHTUNG, die Grenze dieser Zusage (gelernt am 2026-08-20): sie gilt erst, WENN
das Skript laeuft. Startet der Prozess gar nicht — Datei nicht gefunden,
python3 fehlt —, dann sieht Claude Code nur einen Exit-Code != 0 und blockiert
fail-closed. Das legte die Sitzung komplett lahm, inklusive des `cd`, das sie
wieder herausgeholt haette. Ursache war ein relativer Pfad im command-Feld, der
gegen das AKTUELLE Arbeitsverzeichnis aufgeloest wird, nicht gegen die
Projektwurzel. Deshalb steht in settings.json ${CLAUDE_PROJECT_DIR} und kein
relativer Pfad. Wer das command-Feld anfasst: erst in einem Unterverzeichnis
testen, nicht nur im Repo-Root.

Bewusst NICHT abgesichert mit `|| exit 0`: das wuerde jeden Startfehler still
zu einem "allow" machen und damit die Leitplanke unbemerkt abschalten. Faellt
das Skript aus, ist Blockieren das richtige Verhalten — wer die Regel hart
braucht, prueft zusaetzlich mit `git log` gegen den erwarteten HEAD.
"""
import json
import re
import sys

PROTECTED_PATH = 'tooling/visual-audit/profiles/'

# git-Unterkommandos, die den Zustand nach aussen tragen.
FORBIDDEN_GIT = re.compile(
    r'\bgit\b'                       # git ...
    r'(?:\s+-[cC]\s+\S+)*'           # ... optional -C <pfad> / -c key=val
    r'\s+(commit|push)\b',
    re.IGNORECASE,
)


def deny(reason):
    json.dump({
        'hookSpecificOutput': {
            'hookEventName': 'PreToolUse',
            'permissionDecision': 'deny',
            'permissionDecisionReason': reason,
        }
    }, sys.stdout)
    sys.exit(0)


def main():
    payload = json.load(sys.stdin)
    tool = payload.get('tool_name', '')
    args = payload.get('tool_input') or {}

    if tool == 'Bash':
        cmd = args.get('command', '') or ''
        m = FORBIDDEN_GIT.search(cmd)
        if m:
            deny(
                f'"git {m.group(1)}" ist in diesem Repo gesperrt. main synct in '
                f'<=5 Minuten produktiv an alle Konsortial-Standorte, deshalb '
                f'entscheidet ein Mensch ueber jeden Commit. Zeig den Diff und '
                f'lass Flemming committen.'
            )

    elif tool in ('Write', 'Edit', 'MultiEdit', 'NotebookEdit'):
        # file_path ist in der Regel absolut; Substring-Vergleich statt
        # startswith, sonst greift die Regel nur bei relativen Pfaden.
        path = str(args.get('file_path', '') or '').replace('\\', '/')
        if PROTECTED_PATH in path:
            deny(
                f'{PROTECTED_PATH} ist schreibgeschuetzt. Die CD-Profile sind '
                f'abgeschlossen und gegen die CD-Quellen belegt; der Logo-'
                f'Auftrag fasst nur css/main.css an. Faellt dir am Profil '
                f'etwas auf: melden, nicht aendern.'
            )

    sys.stdout.write('{}')
    sys.exit(0)


if __name__ == '__main__':
    try:
        main()
    except Exception as err:                      # noqa: BLE001 — fail-open, s. o.
        print(f'guard.py: {err!r} — Aufruf durchgelassen', file=sys.stderr)
        sys.stdout.write('{}')
        sys.exit(0)
