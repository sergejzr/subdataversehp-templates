     var Hyphenopoly = {
                                    require: {
                                        "de": "Silbentrennungsalgorithmus",
                                        "en-us": "Supercalifragilisticexpialidocious"
                                    },
                                    setup: {
                                        dontHyphenate: {
                                            noscript: true,
                                        },
                                        dontHyphenateClass: "ubf-dont-hyphenate",
                                        selectors: {
                                            ".ubf-mainMenu": {},
                                            ".ubf-section": {},
                                            ".ubf-secondaryMenu__item": {},
                                            ".ubf-footer__menuItem": {}
                                        }
                                    }
                                    };

/* ===========================================================================
   Tooltip-Trigger auf der /at/-Landing reaktivieren.

   Problem: Die Landing bringt Trigger im Markup mit, z. B. neben der
   Ueberschrift "Designated collections within ...":

     <span data-toggle="tooltip" data-placement="top"
           class="glyphicon glyphicon-question-sign"
           data-original-title="... is a general-purpose repository ...">

   jQuery und bootstrap.min.js sind auf der Seite geladen, aber der
   Init-Aufruf $('[data-toggle="tooltip"]').tooltip() fehlt — der lebt
   sonst JSF-seitig und laeuft auf der statisch von Apache ausgelieferten
   /at/-Seite nie. Ergebnis: ein Fragezeichen, das nach Bedienelement
   aussieht und nichts tut. Verwandt mit dem Logout-Button, aber im
   Unterschied dazu OHNE Server-Abhaengigkeit loesbar.

   Zweiter Haken: der Text steht in data-original-title, nicht in title.
   Bootstrap verschiebt title -> data-original-title erst BEIM
   Initialisieren; hier ist er direkt so ins Template geschrieben. Ohne
   Init gibt es also auch keinen nativen Browser-Tooltip als Rueckfall.

   Deshalb zwei Stufen, defensiv:
     1. title aus data-original-title nachtragen. Reicht allein schon,
        haengt an keiner Bibliothek und wirkt auch ohne Bootstrap.
     2. Falls die Bootstrap-Tooltips verfuegbar sind, zusaetzlich
        initialisieren (gestylter Tooltip statt nativem Kasten). Bootstrap
        entfernt title dabei wieder von selbst, ein doppelter Tooltip
        entsteht nicht.

   Setzt data-hsbi-tooltips auf <html>, damit der Zustand ohne DevTools
   pruefbar ist:
     document.documentElement.dataset.hsbiTooltips
       -> "native"    nur Stufe 1
       -> "bootstrap" Stufe 2 aktiv
       -> undefined   Datei wurde gar nicht ausgefuehrt
   ========================================================================== */
(function () {
  "use strict";

  function initTooltips() {
    var nodes = document.querySelectorAll('[data-toggle="tooltip"]');
    if (!nodes.length) return;

    var patched = 0;
    Array.prototype.forEach.call(nodes, function (el) {
      var text = el.getAttribute("data-original-title");
      if (text && !el.getAttribute("title")) {
        el.setAttribute("title", text);
        patched++;
      }
    });
    document.documentElement.dataset.hsbiTooltips = "native";

    var $ = window.jQuery;
    if ($ && typeof $.fn.tooltip === "function") {
      try {
        $(nodes).tooltip({ container: "body" });
        document.documentElement.dataset.hsbiTooltips = "bootstrap";
      } catch (err) {
        /* Nativer Tooltip aus Stufe 1 steht bereits — bewusst kein
           Re-Throw, ein Tooltip darf die Seite nicht mitreissen. */
        if (window.console) console.warn("[hsbi] Bootstrap-Tooltip-Init fehlgeschlagen:", err);
      }
    }
    return patched;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTooltips);
  } else {
    initTooltips();
  }
})();

/* ---------------------------------------------------------------------------
   Rueckweg zur /at/-Startseite der Hochschule.

   Label-agnostisch: Alias und Anzeigename kommen aus window.UNIS_OVERVIEW,
   diese Fassung ist also in jedem Uni-Ordner identisch.

   Diese Datei wird von /jslibs/hrz/gui.js dynamisch nachgeladen, also NACH
   DOMContentLoaded. Ein blosser DOMContentLoaded-Listener wuerde nie feuern,
   deshalb der readyState-Guard. Alles in try/catch: eine Navigationszeile ist
   kein Grund, die Seite zu brechen.
   -------------------------------------------------------------------------- */
(function () {
  "use strict";

  function currentAlias() {
    var crumb = document.getElementById("breadcrumbLnk1");
    var header = document.querySelector(".dataverseHeaderDataverseName[href]");
    var href = (crumb && crumb.getAttribute("href")) ||
               (header && header.getAttribute("href")) || "";
    var parts = href.split("/").filter(Boolean);
    return parts[0] === "dataverse" ? (parts[1] || null) : null;
  }

  function addHomeLink() {
    try {
      if (document.getElementById("dp-uni-home")) return;

      var alias = currentAlias();
      if (!alias) return;

      var uni = window.UNIS_OVERVIEW && window.UNIS_OVERVIEW[alias];
      if (!uni) return;                  // nicht in der Registry
      if (uni.repourl) return;           // externes Repo -> es gibt keine /at/-Seite
      if (!uni.css && !uni.js) return;   // Registry-Zeile ohne Template

      var nameCell = document.querySelector("#dataverseHeader .dataverseHeaderName");
      if (!nameCell || !nameCell.parentNode) return;  // /at/, Login, Konto -> no-op

      var cell = document.createElement("div");
      cell.className = "dataverseHeaderCell dp-uni-home-cell";

      var link = document.createElement("a");
      link.id = "dp-uni-home";
      link.href = "/at/" + alias + "/";

      var arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "\u2190";

      link.appendChild(arrow);
      link.appendChild(document.createTextNode("Startseite " + (uni.Name || alias)));
      cell.appendChild(link);

      nameCell.parentNode.insertBefore(cell, nameCell.nextSibling);
    } catch (e) {
      /* still bleiben */
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addHomeLink);
  } else {
    addHomeLink();
  }
})();
