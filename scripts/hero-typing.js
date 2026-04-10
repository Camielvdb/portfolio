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
    var reserve = document.createElement("span");
    var live = document.createElement("span");
    var interval = Number(element.getAttribute("data-scramble-interval")) || 8;
    var completionEvent = element.getAttribute("data-scramble-complete-event");
    var hasStarted = element.getAttribute("data-scramble-started") === "true";

    if (hasStarted) {
      return;
    }

    element.setAttribute("data-scramble-started", "true");

    if (reduceMotion || !finalText) {
      element.textContent = finalText;
      element.style.color = "";
      if (completionEvent) {
        element.dispatchEvent(new CustomEvent(completionEvent, { bubbles: true }));
      }
      return;
    }

    reserve.className = "scramble-text-reserve";
    reserve.textContent = finalText;
    reserve.setAttribute("aria-hidden", "true");

    live.className = "scramble-text-live";

    element.textContent = "";
    element.appendChild(reserve);
    element.appendChild(live);

    var settledLength = 0;
    var scrambleFrames = 0;
    var intervalId = null;
    var scrambleFrameLimit = 1;

    function finishTyping() {
      live.textContent = finalText;
      if (completionEvent) {
        element.dispatchEvent(new CustomEvent(completionEvent, { bubbles: true }));
      }
    }

    intervalId = window.setInterval(function () {
      if (settledLength >= finalText.length) {
        window.clearInterval(intervalId);
        finishTyping();
        return;
      }

      if (scrambleFrames < scrambleFrameLimit) {
        var trailLength = Math.min(3, finalText.length - settledLength);
        var targetSlice = finalText.slice(settledLength, settledLength + trailLength);
        live.innerHTML =
          escapeHtml(finalText.slice(0, settledLength)) +
          '<span class="title-typed-scramble">' +
          buildScrambleMarkup(targetSlice) +
          "</span>";
        scrambleFrames += 1;
        return;
      }

      settledLength += 1;
      scrambleFrames = 0;
      live.textContent = finalText.slice(0, settledLength);
    }, interval);
  }

  window.setTimeout(function () {
    elements.forEach(runTypingEffect);
  }, 220);
})();
