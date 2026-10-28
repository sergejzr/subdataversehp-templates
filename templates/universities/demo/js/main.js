/* ---------------------------------------------------------------------------
   demo: DataPublication.nrw demo area, main.js. layout-dapu's main.js with
   the demo note instead of the "being set up" badge, plus adaptForDemo():
   the login box becomes a hint where to publish, the sidebar heading
   speaks to visitors.

   Diese Datei wird von /jslibs/hrz/gui.js dynamisch nachgeladen, also NACH
   DOMContentLoaded. Ein blosser DOMContentLoaded-Listener wuerde nie feuern,
   deshalb der readyState-Guard. Alles in try/catch: eine Navigationszeile
   oder ein Hinweis ist kein Grund, die Seite zu brechen.
   -------------------------------------------------------------------------- */
(function () {
  "use strict";

  /* Rueckweg zur /at/-Startseite der Hochschule (native Views).
     Alias und Anzeigename kommen aus window.UNIS_OVERVIEW. */
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
      arrow.textContent = "←";

      // Sichtbar bleibt nur "Startseite": der volle Name laesst den Button bei
      // langen Hochschulnamen umbrechen. Der Accessible Name traegt ihn weiter,
      // und "Startseite" steht darin vorn (WCAG 2.5.3 Label in Name).
      link.setAttribute("aria-label", "Startseite " + (uni.Name || alias));
      link.appendChild(arrow);
      link.appendChild(document.createTextNode("Startseite"));
      cell.appendChild(link);

      nameCell.parentNode.insertBefore(cell, nameCell.nextSibling);
    } catch (e) {
      /* still bleiben */
    }
  }

  /* Demo-Hinweis im Hero, nur auf der Landing /at/<label>/
     (#repository-title gibt es auf den nativen Views nicht). Als Geschwister
     NACH dem Titel, nicht darin: #repository-title hat role="heading", Text
     darin wuerde Teil des Accessible Name der Ueberschrift. Englisch wie der
     Rest der Seite; echter DOM-Text, kein CSS content. */
  function addDemoBadge() {
    try {
      if (document.getElementById("dp-demo-badge")) return;

      var title = document.getElementById("repository-title");
      if (!title || !title.parentNode) return;

      var badge = document.createElement("p");
      badge.id = "dp-demo-badge";
      badge.textContent =
        "Demo area on the test system. All datasets here are invented examples.";

      title.parentNode.insertBefore(badge, title.nextSibling);
    } catch (e) {
      /* still bleiben */
    }
  }

  /* Im Demo-Bereich reicht niemand ein. Den Anmelde-/Einreichen-Block
     (#loginActionRequest samt Button) ersetzt ein Hinweis, wo man
     veroeffentlicht; das "Or" zwischen Suche und Block entfaellt. Die
     Sidebar-Ueberschrift spricht Besucher an statt Einreichende. */
  function link(href, text) {
    var a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    return a;
  }

  function adaptForDemo() {
    try {
      var prompt = document.getElementById("loginActionRequest");
      var block = prompt && prompt.parentNode;
      if (block && block.parentNode &&
          !document.getElementById("dp-demo-publish-hint")) {
        var hint = document.createElement("div");
        hint.id = "dp-demo-publish-hint";
        var text = document.createElement("p");
        text.textContent = "Nobody can add datasets here: this area only " +
          "shows examples. To publish your own data, use the space of " +
          "your university.";
        var links = document.createElement("p");
        links.appendChild(link("/at/", "Participating universities"));
        links.appendChild(document.createTextNode(" · "));
        links.appendChild(link("/docs/en/", "How publishing works"));
        hint.appendChild(text);
        hint.appendChild(links);
        block.parentNode.replaceChild(hint, block);
      }
      var dividers = document.querySelectorAll(".information-box .search-or-divider");
      for (var i = 0; i < dividers.length; i++) {
        dividers[i].style.display = "none";
      }
      var headings = document.querySelectorAll(".col-md-4 h3");
      for (var j = 0; j < headings.length; j++) {
        if (headings[j].textContent.trim() === "Before your first dataset") {
          headings[j].textContent = "How publishing works";
        }
      }
    } catch (e) {
      /* still bleiben */
    }
  }

  function init() {
    addHomeLink();
    addDemoBadge();
    adaptForDemo();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
