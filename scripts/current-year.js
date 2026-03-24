(function () {
  var elements = Array.from(document.querySelectorAll("[data-current-year]"));

  if (!elements.length) {
    return;
  }

  var year = String(new Date().getFullYear());

  elements.forEach(function (element) {
    element.textContent = year;
  });
})();
