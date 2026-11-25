(function () {
  // One shared hover highlight for the work grid. It grows out of the card
  // under the pointer and flows to the next card (CSS does the easing). It is
  // positioned with left/top/width/height so Safari animates it too.
  var grid = document.querySelector("[data-portfolio-grid]");
  var cards = grid ? Array.from(grid.querySelectorAll(".item")) : [];
  var supportsFinePointer =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!grid || !cards.length || !supportsFinePointer) {
    return;
  }

  // How far the highlight bleeds past a card (matches the 26px radius in CSS).
  var BLEED_X = 10;
  var BLEED_TOP = 10;
  var BLEED_BOTTOM = 14;

  var highlight = document.createElement("span");
  highlight.className = "card-highlight";
  highlight.setAttribute("aria-hidden", "true");
  grid.insertBefore(highlight, grid.firstChild);

  function moveTo(card) {
    var appearing = !highlight.classList.contains("is-active");
    // Grow in place the first time; slide between cards after that.
    highlight.classList.toggle("no-slide", appearing);
    highlight.style.left = card.offsetLeft - BLEED_X + "px";
    highlight.style.top = card.offsetTop - BLEED_TOP + "px";
    highlight.style.width = card.offsetWidth + BLEED_X * 2 + "px";
    highlight.style.height = card.offsetHeight + BLEED_TOP + BLEED_BOTTOM + "px";
    if (appearing) {
      void highlight.offsetWidth;
    }
    highlight.classList.add("is-active");
  }

  function hide() {
    highlight.classList.remove("is-active");
  }

  cards.forEach(function (card) {
    card.addEventListener("pointerenter", function () {
      moveTo(card);
    });
    card.addEventListener("focus", function () {
      if (card.matches(":focus-visible")) {
        moveTo(card);
      }
    });
    card.addEventListener("blur", hide);
    // Opening a case study: clear it so it isn't left behind when the dialog closes.
    card.addEventListener("click", hide);
  });

  grid.addEventListener("pointerleave", hide);
  window.addEventListener("resize", hide);
})();
