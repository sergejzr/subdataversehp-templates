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