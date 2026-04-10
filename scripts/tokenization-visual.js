(function () {
  var placeholders = Array.from(document.querySelectorAll("[data-tokenization-visual]"));
  var assetBase = "./images/";
  var preloadCache = {};

  if (!placeholders.length) {
    return;
  }

  function getTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }

  function getAsset(theme) {
    return assetBase + "honeybook-tokenization-" + theme + ".png";
  }

  function preload(theme) {
    if (preloadCache[theme]) {
      return preloadCache[theme];
    }

    preloadCache[theme] = new Promise(function (resolve, reject) {
      var image = new window.Image();
      image.onload = function () {
        resolve(image);
      };
      image.onerror = reject;
      image.src = getAsset(theme);
    });

    return preloadCache[theme];
  }

  function ensureImage(placeholder) {
    var image = placeholder.querySelector("img");

    if (!image) {
      image = document.createElement("img");
      image.alt = "";
      image.loading = placeholder.getAttribute("data-tokenization-visual") === "modal" ? "lazy" : "eager";
      image.decoding = "async";
      image.className = "tokenization-static-image";
      placeholder.textContent = "";
      placeholder.appendChild(image);
    }

    return image;
  }

  function setImageTheme(placeholder, theme) {
    var image = ensureImage(placeholder);
    image.src = getAsset(theme);
    placeholder.setAttribute("data-tokenization-theme", theme);
  }

  function applyTheme(theme) {
    placeholders.forEach(function (placeholder) {
      setImageTheme(placeholder, theme);
    });
  }

  function animateThemeChange(theme) {
    placeholders.forEach(function (placeholder) {
      var currentTheme = placeholder.getAttribute("data-tokenization-theme") || getTheme();

      if (currentTheme === theme) {
        return;
      }

      preload(theme)
        .catch(function () {
          return null;
        })
        .then(function () {
          setImageTheme(placeholder, theme);
        });
    });
  }

  preload("light");
  preload("dark");
  applyTheme(getTheme());

  document.addEventListener("siteThemeChange", function (event) {
    var nextTheme = event.detail && event.detail.theme ? event.detail.theme : getTheme();
    animateThemeChange(nextTheme === "dark" ? "dark" : "light");
  });
})();
