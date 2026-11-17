(function () {
  var button = document.querySelector("[data-theme-toggle]");
  var storageKey = "camiel-theme";
  var mediaQuery =
    typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var themeTransitionTimer = null;

  if (!button) {
    return;
  }

  function getSavedMode() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function getSystemTheme() {
    return mediaQuery && mediaQuery.matches ? "dark" : "light";
  }

  function getTheme() {
    var theme = document.documentElement.dataset.theme || getSavedMode();
    return theme === "light" || theme === "dark" ? theme : getSystemTheme();
  }

  // Hugeicons "Sun03" (Stroke Rounded, MIT).
  function sunIcon() {
    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"></path>' +
      '<path d="M12 2V3.5M12 20.5V22M19.0708 19.0713L18.0101 18.0106M5.98926 5.98926L4.9286 4.9286M22 12H20.5M3.5 12H2M19.0713 4.92871L18.0106 5.98937M5.98975 18.0107L4.92909 19.0714"></path>' +
      "</svg>"
    );
  }

  function getMoonPhaseFraction(date) {
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1;
    var day =
      date.getUTCDate() +
      date.getUTCHours() / 24 +
      date.getUTCMinutes() / 1440 +
      date.getUTCSeconds() / 86400;

    if (month < 3) {
      year -= 1;
      month += 12;
    }

    month += 1;

    var c = 365.25 * year;
    var e = 30.6 * month;
    var jd = c + e + day - 694039.09;
    var cycle = jd / 29.5305882;
    var fraction = cycle - Math.floor(cycle);

    return fraction < 0 ? fraction + 1 : fraction;
  }

  function getMoonPhaseIndex() {
    return Math.round(getMoonPhaseFraction(new Date()) * 8) % 8;
  }

  // Live moon phase, drawn to match Hugeicons: 1.5px outline on every phase,
  // with the lit part filled.
  function moonIcon() {
    var phaseIndex = getMoonPhaseIndex();
    var R = 8.5;
    function mask(id, shape) {
      return '<mask id="' + id + '"><rect width="24" height="24" fill="black"></rect><circle cx="12" cy="12" r="' + R + '" fill="white"></circle>' + shape + "</mask>";
    }
    var defs =
      "<defs>" +
      mask("moon-crescent-right", '<circle cx="17" cy="12" r="' + R + '" fill="black"></circle>') +
      mask("moon-crescent-left", '<circle cx="7" cy="12" r="' + R + '" fill="black"></circle>') +
      mask("moon-gibbous-right", '<circle cx="19.25" cy="12" r="' + R + '" fill="black"></circle>') +
      mask("moon-gibbous-left", '<circle cx="4.75" cy="12" r="' + R + '" fill="black"></circle>') +
      mask("moon-half-right", '<rect x="12" y="0" width="12" height="24" fill="black"></rect>') +
      mask("moon-half-left", '<rect x="0" y="0" width="12" height="24" fill="black"></rect>') +
      "</defs>";
    var lit = function (id) {
      return '<circle cx="12" cy="12" r="' + R + '" fill="currentColor" stroke="none"' + (id ? ' mask="url(#' + id + ')"' : "") + "></circle>";
    };
    var fills = [
      "",
      lit("moon-crescent-right"),
      lit("moon-half-right"),
      lit("moon-gibbous-right"),
      lit(null),
      lit("moon-gibbous-left"),
      lit("moon-half-left"),
      lit("moon-crescent-left"),
    ];
    var outline = '<circle cx="12" cy="12" r="' + R + '" fill="none"></circle>';

    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + defs + fills[phaseIndex] + outline + "</svg>";
  }

  function setButtonState(theme) {
    var nextTheme = theme === "dark" ? "light" : "dark";
    var icon = button.querySelector(".theme-toggle-icon");
    var iconMarkup = theme === "light" ? sunIcon() : moonIcon();

    button.setAttribute("aria-label", "Theme: " + theme + ". Switch to " + nextTheme + " theme");
    icon.innerHTML = iconMarkup;
    if (theme === "light") {
      setSunRotation(false);
    }
  }

  // Sun only: every hover turns it one ray (45deg) clockwise, and it keeps
  // that angle until the next hover.
  var sunRotation = 0;

  function setSunRotation(animate) {
    var svg = button.querySelector(".theme-toggle-icon svg");
    if (!svg) {
      return;
    }
    svg.style.transition = animate ? "transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1)" : "none";
    svg.style.transform = "rotate(" + sunRotation + "deg)";
  }

  button.addEventListener("pointerenter", function (event) {
    if (event.pointerType && event.pointerType !== "mouse") {
      return;
    }
    if (document.documentElement.dataset.theme !== "light") {
      return;
    }
    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    sunRotation += 45;
    setSunRotation(true);
  });

  function commitTheme(theme, previousTheme) {
    document.documentElement.dataset.theme = theme;
    setButtonState(theme);

    if (previousTheme && previousTheme !== theme) {
      document.dispatchEvent(
        new CustomEvent("siteThemeChange", {
          detail: {
            previousTheme: previousTheme,
            theme: theme,
          },
        })
      );
    }
  }

  // The whole page switches as one: a single View Transition cross-fade where
  // supported, otherwise an instant switch. Element-level colour transitions are
  // switched off for the swap, so no part of the page changes on its own clock.
  function applyTheme(theme) {
    var root = document.documentElement;
    var previousTheme = root.dataset.theme;
    var changing = previousTheme && previousTheme !== theme;
    var reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!changing) {
      commitTheme(theme, previousTheme);
      return;
    }

    root.classList.add("is-theme-switching");
    var done = function () {
      window.clearTimeout(themeTransitionTimer);
      themeTransitionTimer = window.setTimeout(function () {
        root.classList.remove("is-theme-switching");
      }, 50);
    };

    if (typeof document.startViewTransition === "function" && !reduceMotion) {
      var transition = document.startViewTransition(function () {
        commitTheme(theme, previousTheme);
      });
      transition.finished.then(done, done);
    } else {
      commitTheme(theme, previousTheme);
      done();
    }
  }

  applyTheme(getTheme());

  button.addEventListener("click", function () {
    var currentTheme = getTheme();
    var nextTheme = currentTheme === "dark" ? "light" : "dark";

    try {
      window.localStorage.setItem(storageKey, nextTheme);
    } catch (error) {}

    applyTheme(nextTheme);
  });

  if (mediaQuery) {
    mediaQuery.addEventListener("change", function () {
      if (getSavedMode()) {
        return;
      }

      applyTheme(getSystemTheme());
    });
  }
})();
