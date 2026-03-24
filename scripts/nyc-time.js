(function () {
  var elements = Array.from(document.getElementsByClassName("local-time"));

  if (!elements.length) {
    return;
  }

  var formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  var timerId = null;

  function renderTime() {
    var currentTime = formatter.format(new Date());
    elements.forEach(function (element) {
      element.textContent = currentTime;
    });
  }

  function scheduleNextTick() {
    var now = Date.now();
    var delay = 1000 - (now % 1000);

    timerId = window.setTimeout(function () {
      renderTime();
      scheduleNextTick();
    }, delay);
  }

  renderTime();
  scheduleNextTick();

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (timerId) {
        window.clearTimeout(timerId);
        timerId = null;
      }
      return;
    }

    renderTime();
    if (!timerId) {
      scheduleNextTick();
    }
  });
})();
