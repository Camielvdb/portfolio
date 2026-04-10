(function () {
  var cards = Array.from(document.querySelectorAll(".media-grid .item"));
  var supportsFinePointer =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!cards.length || !supportsFinePointer) {
    return;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function setCardTransform(card, event) {
    var wrapper = card.querySelector(".item-wrapper");
    if (!wrapper) {
      return;
    }

    var rect = card.getBoundingClientRect();
    var relativeX = (event.clientX - rect.left) / rect.width;
    var relativeY = (event.clientY - rect.top) / rect.height;
    var rotateY = clamp((relativeX - 0.5) * 14, -7, 7);
    var rotateX = clamp((0.5 - relativeY) * 14, -7, 7);

    card.setAttribute("data-hover-active", "true");
    wrapper.style.setProperty("--card-rotate-x", rotateX.toFixed(2) + "deg");
    wrapper.style.setProperty("--card-rotate-y", rotateY.toFixed(2) + "deg");
    wrapper.style.setProperty("--card-z", "18px");
  }

  function resetCard(card) {
    var wrapper = card.querySelector(".item-wrapper");
    if (!wrapper) {
      return;
    }

    card.removeAttribute("data-hover-active");
    wrapper.style.setProperty("--card-rotate-x", "0deg");
    wrapper.style.setProperty("--card-rotate-y", "0deg");
    wrapper.style.setProperty("--card-z", "0px");

    window.setTimeout(function () {
      if (!card.hasAttribute("data-hover-active")) {
        wrapper.style.removeProperty("--card-rotate-x");
        wrapper.style.removeProperty("--card-rotate-y");
        wrapper.style.removeProperty("--card-z");
      }
    }, 360);
  }

  cards.forEach(function (card) {
    card.addEventListener("pointerenter", function (event) {
      setCardTransform(card, event);
    });

    card.addEventListener("pointermove", function (event) {
      setCardTransform(card, event);
    });

    card.addEventListener("pointerleave", function () {
      resetCard(card);
    });

    card.addEventListener("blur", function () {
      resetCard(card);
    });
  });
})();
