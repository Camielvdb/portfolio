(function () {
  // Subtle 3D tilt that follows the pointer. Only the card wrapper rotates;
  // its contents stay flat (no preserve-3d / translateZ), which keeps Safari's
  // rounded clipping and the contrast labels working.
  var cards = Array.from(document.querySelectorAll(".media-grid .item"));
  var supportsFinePointer =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!cards.length || !supportsFinePointer || reduceMotion) {
    return;
  }

  var MAX_TILT = 4; // degrees

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function tilt(card, event) {
    var wrapper = card.querySelector(".item-wrapper");
    if (!wrapper) {
      return;
    }

    var rect = card.getBoundingClientRect();
    var x = (event.clientX - rect.left) / rect.width - 0.5;
    var y = (event.clientY - rect.top) / rect.height - 0.5;

    wrapper.style.setProperty("--card-rotate-y", clamp(x * MAX_TILT * 2, -MAX_TILT, MAX_TILT).toFixed(2) + "deg");
    wrapper.style.setProperty("--card-rotate-x", clamp(-y * MAX_TILT * 2, -MAX_TILT, MAX_TILT).toFixed(2) + "deg");
  }

  function reset(card) {
    var wrapper = card.querySelector(".item-wrapper");
    if (!wrapper) {
      return;
    }

    wrapper.style.removeProperty("--card-rotate-x");
    wrapper.style.removeProperty("--card-rotate-y");
  }

  cards.forEach(function (card) {
    card.addEventListener("pointerenter", function (event) {
      tilt(card, event);
    });
    card.addEventListener("pointermove", function (event) {
      tilt(card, event);
    });
    card.addEventListener("pointerleave", function () {
      reset(card);
    });
    card.addEventListener("blur", function () {
      reset(card);
    });
  });
})();
