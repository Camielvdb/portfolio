(function () {
  var cards = Array.from(document.querySelectorAll(".media-grid .item"));

  if (!cards.length) {
    return;
  }

  var reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || typeof window.IntersectionObserver !== "function") {
    cards.forEach(function (card) {
      card.classList.add("is-visible");
    });
    return;
  }

  var heroTypingDone = false;

  function revealCard(card, observer) {
    if (!heroTypingDone) {
      return;
    }

    card.classList.add("is-visible");
    if (observer) {
      observer.unobserve(card);
    }
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          return;
        }

        revealCard(entry.target, observer);
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    }
  );

  cards.forEach(function (card) {
    var index = cards.indexOf(card);
    var columnDelay = index % 2 === 0 ? 0 : 90;
    card.style.setProperty("--card-reveal-delay", columnDelay + "ms");
    observer.observe(card);
  });

  document.addEventListener("heroTypingComplete", function () {
    heroTypingDone = true;

    cards.forEach(function (card) {
      var rect = card.getBoundingClientRect();
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      var inView = rect.top <= viewportHeight * 0.92 && rect.bottom >= 0;

      if (inView) {
        revealCard(card, observer);
      }
    });
  });
})();
