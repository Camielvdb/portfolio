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

  // Shared hover highlight that morphs between the bar's buttons.
  var highlight = document.createElement("span");
  highlight.className = "glass-bar-hover";
  highlight.setAttribute("aria-hidden", "true");
  bar.insertBefore(highlight, bar.firstChild);

  var targets = Array.from(bar.querySelectorAll(".glass-bar-link, .theme-toggle"));

  function moveTo(target) {
    var appearing = !highlight.classList.contains("is-active");
    // Appear in place the first time; slide between targets after that.
    highlight.classList.toggle("no-slide", appearing);
    highlight.style.left = target.offsetLeft + "px";
    highlight.style.width = target.offsetWidth + "px";
    highlight.style.top = target.offsetTop + "px";
    highlight.style.height = target.offsetHeight + "px";
    if (appearing) {
      void highlight.offsetWidth;
    }
    highlight.classList.add("is-active");
  }

  function hide() {
    highlight.classList.remove("is-active");
  }

  targets.forEach(function (target) {
    target.addEventListener("pointerenter", function () {
      moveTo(target);
    });
    target.addEventListener("focus", function () {
      if (target.matches(":focus-visible")) {
        moveTo(target);
      }
    });
    target.addEventListener("blur", hide);
  });

  bar.addEventListener("pointerleave", hide);
})();
