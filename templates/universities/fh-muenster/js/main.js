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
