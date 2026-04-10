(function () {
  var button = document.querySelector("[data-theme-toggle]");
  var tooltip = button ? button.querySelector(".theme-tooltip") : null;
  var tooltipTitle = tooltip ? tooltip.querySelector(".theme-tooltip-title") : null;
  var storageKey = "camiel-theme";
  var mediaQuery =
    typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var tooltipTimer = null;
  var themeTransitionTimer = null;

  if (!button) {
    return;
  }

  function showTooltipWithDelay() {
    if (getTheme() !== "dark") {
      return;
    }

    window.clearTimeout(tooltipTimer);
    tooltipTimer = window.setTimeout(function () {
      button.setAttribute("data-tooltip-visible", "true");
    }, 2000);
  }

  function hideTooltip() {
    window.clearTimeout(tooltipTimer);
    button.removeAttribute("data-tooltip-visible");
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

  function sunIcon() {
    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="4.25"></circle>' +
      '<path d="M12 2.75v2.5M12 18.75v2.5M21.25 12h-2.5M5.25 12H2.75M18.54 5.46l-1.77 1.77M7.23 16.77l-1.77 1.77M18.54 18.54l-1.77-1.77M7.23 7.23 5.46 5.46"></path>' +
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

  function getMoonPhaseName() {
    var phaseIndex = getMoonPhaseIndex();
    var phaseNames = [
      "new moon",
      "waxing crescent",
      "first quarter",
      "waxing gibbous",
      "full moon",
      "waning gibbous",
      "last quarter",
      "waning crescent",
    ];

    return phaseNames[phaseIndex];
  }

  function moonIcon() {
    var phaseIndex = getMoonPhaseIndex();
    var sharedDefs =
      '<defs>' +
      '<mask id="moon-crescent-right"><rect width="24" height="24" fill="black"></rect><circle cx="12" cy="12" r="7.5" fill="white"></circle><circle cx="16.4" cy="12" r="7.5" fill="black"></circle></mask>' +
      '<mask id="moon-crescent-left"><rect width="24" height="24" fill="black"></rect><circle cx="12" cy="12" r="7.5" fill="white"></circle><circle cx="7.6" cy="12" r="7.5" fill="black"></circle></mask>' +
      '<mask id="moon-gibbous-right"><rect width="24" height="24" fill="black"></rect><circle cx="12" cy="12" r="7.5" fill="white"></circle><circle cx="18.4" cy="12" r="7.5" fill="black"></circle></mask>' +
      '<mask id="moon-gibbous-left"><rect width="24" height="24" fill="black"></rect><circle cx="12" cy="12" r="7.5" fill="white"></circle><circle cx="5.6" cy="12" r="7.5" fill="black"></circle></mask>' +
      '<mask id="moon-half-right"><rect width="24" height="24" fill="black"></rect><circle cx="12" cy="12" r="7.5" fill="white"></circle><rect x="12" y="0" width="12" height="24" fill="black"></rect></mask>' +
      '<mask id="moon-half-left"><rect width="24" height="24" fill="black"></rect><circle cx="12" cy="12" r="7.5" fill="white"></circle><rect x="0" y="0" width="12" height="24" fill="black"></rect></mask>' +
      "</defs>";
    var icons = [
      '<circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor"></circle>',
      '<circle cx="12" cy="12" r="7.5" fill="currentColor" mask="url(#moon-crescent-right)" stroke="none"></circle>',
      '<circle cx="12" cy="12" r="7.5" fill="currentColor" mask="url(#moon-half-right)" stroke="none"></circle>',
      '<circle cx="12" cy="12" r="7.5" fill="currentColor" mask="url(#moon-gibbous-right)" stroke="none"></circle>',
      '<circle cx="12" cy="12" r="7.5" fill="currentColor" stroke="none"></circle>',
      '<circle cx="12" cy="12" r="7.5" fill="currentColor" mask="url(#moon-gibbous-left)" stroke="none"></circle>',
      '<circle cx="12" cy="12" r="7.5" fill="currentColor" mask="url(#moon-half-left)" stroke="none"></circle>',
      '<circle cx="12" cy="12" r="7.5" fill="currentColor" mask="url(#moon-crescent-left)" stroke="none"></circle>',
    ];

    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + sharedDefs + icons[phaseIndex] + "</svg>";
  }

  function setButtonState(theme) {
    var nextTheme = theme === "dark" ? "light" : "dark";
    var icon = button.querySelector(".theme-toggle-icon");
    var iconMarkup = theme === "light" ? sunIcon() : moonIcon();

    button.setAttribute("aria-label", "Theme: " + theme + ". Switch to " + nextTheme + " theme");
    icon.innerHTML = iconMarkup;

    if (tooltipTitle) {
      tooltipTitle.textContent = theme === "dark" ? "Moon: " + getMoonPhaseName() : "";
    }

    button.toggleAttribute("data-tooltip-enabled", theme === "dark");
  }

  function applyTheme(theme) {
    var previousTheme = document.documentElement.dataset.theme;

    if (previousTheme && previousTheme !== theme) {
      document.documentElement.classList.remove("is-theme-switching");
      void document.documentElement.offsetWidth;
      document.documentElement.classList.add("is-theme-switching");
      window.clearTimeout(themeTransitionTimer);
      themeTransitionTimer = window.setTimeout(function () {
        document.documentElement.classList.remove("is-theme-switching");
      }, 360);
    }

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

  applyTheme(getTheme());

  button.addEventListener("click", function () {
    var currentTheme = getTheme();
    var nextTheme = currentTheme === "dark" ? "light" : "dark";

    try {
      window.localStorage.setItem(storageKey, nextTheme);
    } catch (error) {}

    applyTheme(nextTheme);
  });

  button.addEventListener("pointerenter", function () {
    showTooltipWithDelay();
  });

  button.addEventListener("pointerleave", function () {
    hideTooltip();
  });

  button.addEventListener("focus", function () {
    showTooltipWithDelay();
  });

  button.addEventListener("blur", function () {
    hideTooltip();
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
