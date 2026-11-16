(function () {
  var elements = Array.from(document.querySelectorAll("[data-scramble-text]"));

  if (!elements.length) {
    return;
  }

  var reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function randomFromPool(pool) {
    return pool.charAt(Math.floor(Math.random() * pool.length));
  }

  function getScrambleCharacter(targetCharacter) {
    if (/\s/.test(targetCharacter)) {
      return targetCharacter;
    }

    if (/[.,:;'`!|]/.test(targetCharacter)) {
      return randomFromPool(".:'`");
    }

    if (/[ijlItfr1]/.test(targetCharacter)) {
      return randomFromPool("i.l'!");
    }

    if ("()[]{}-/\\".indexOf(targetCharacter) !== -1) {
      return randomFromPool("l.|:");
    }

    return randomFromPool("il.:!|'`");
  }

  function buildScrambleMarkup(text) {
    var output = "";

    for (var index = 0; index < text.length; index += 1) {
      output += escapeHtml(getScrambleCharacter(text.charAt(index)));
    }

    return output;
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function runTypingEffect(element) {
    var finalText = element.getAttribute("data-scramble-text") || element.textContent || "";
    var interval = Number(element.getAttribute("data-scramble-interval")) || 8;
    var completionEvent = element.getAttribute("data-scramble-complete-event");
    var hasStarted = element.getAttribute("data-scramble-started") === "true";

    if (hasStarted) {
      return;
    }

    element.setAttribute("data-scramble-started", "true");

    if (reduceMotion || !finalText) {
      element.textContent = finalText;
      element.classList.add("is-typed");
      if (completionEvent) {
        element.dispatchEvent(new CustomEvent(completionEvent, { bubbles: true }));
      }
      return;
    }

    // Inline rendering (no overlay box) so the line flows right after the
    // preceding words and wraps naturally. The untyped remainder is present
    // but transparent, so layout never shifts while typing.
    var settledLength = 0;
    var scrambleFrames = 0;
    var intervalId = null;
    var scrambleFrameLimit = 1;

    function render(scrambling) {
      var trailLength = Math.min(3, finalText.length - settledLength);
      var html = '<span class="scramble-settled">' + escapeHtml(finalText.slice(0, settledLength)) + "</span>";
      var restStart = settledLength;

      if (scrambling && trailLength > 0) {
        var targetSlice = finalText.slice(settledLength, settledLength + trailLength);
        html +=
          '<span class="scramble-slot"><span class="scramble-slot-real">' +
          escapeHtml(targetSlice) +
          '</span><span class="title-typed-scramble scramble-slot-glyphs" aria-hidden="true">' +
          buildScrambleMarkup(targetSlice) +
          "</span></span>";
        restStart += trailLength;
      }

      html += '<span class="scramble-rest">' + escapeHtml(finalText.slice(restStart)) + "</span>";
      element.innerHTML = html;
    }

    function finishTyping() {
      element.textContent = finalText;
      element.classList.add("is-typed");
      if (completionEvent) {
        element.dispatchEvent(new CustomEvent(completionEvent, { bubbles: true }));
      }
    }

    render(false);

    intervalId = window.setInterval(function () {
      if (settledLength >= finalText.length) {
        window.clearInterval(intervalId);
        finishTyping();
        return;
      }

      if (scrambleFrames < scrambleFrameLimit) {
        render(true);
        scrambleFrames += 1;
        return;
      }

      settledLength += 1;
      scrambleFrames = 0;
      render(false);
    }, interval);
  }

  window.setTimeout(function () {
    elements.forEach(runTypingEffect);
  }, 220);
})();
