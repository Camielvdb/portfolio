(function () {
  // Give the floating bar its glass container only once the page is scrolled.
  var bar = document.querySelector(".glass-bar");
  if (!bar) {
    return;
  }

  var THRESHOLD = 8;
  var ticking = false;

  function update() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset || 0;
    // While a project is open the body is pinned with a negative top offset.
    if (document.body.classList.contains("modal-open")) {
      y = -parseInt(document.body.style.top || "0", 10) || 0;
    }
    bar.classList.toggle("is-scrolled", y > THRESHOLD);
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true }
  );

  update();
})();
