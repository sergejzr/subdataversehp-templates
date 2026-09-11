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
   Diese Datei wird von /jslibs/hrz/gui.js dynamisch nachgeladen, also NACH
   DOMContentLoaded. Ein blosser DOMContentLoaded-Listener wuerde nie feuern,
   deshalb der readyState-Guard. Alles in try/catch: eine Navigationszeile ist
   kein Grund, die Seite zu brechen.
   -------------------------------------------------------------------------- */
(function () {
  "use strict";

  var LABEL = "fh-muenster";
  var LINK_TEXT = "Startseite FH Münster";

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
      if (currentAlias() !== LABEL) return;

      var nameCell = document.querySelector("#dataverseHeader .dataverseHeaderName");
      if (!nameCell || !nameCell.parentNode) return;

      var cell = document.createElement("div");
      cell.className = "dataverseHeaderCell dp-uni-home-cell";

      var link = document.createElement("a");
      link.id = "dp-uni-home";
      link.href = "/at/" + LABEL + "/";

      var arrow = document.createElement("span");
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "← ";

      link.appendChild(arrow);
      link.appendChild(document.createTextNode(LINK_TEXT));
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
