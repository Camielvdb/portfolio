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
  });

  var timerId = null;

  function extractTimeParts(date) {
    var parts = formatter.formatToParts(date);
    var result = {
      hour: "",
      minute: "",
      dayPeriod: "",
    };

    parts.forEach(function (part) {
      if (part.type === "hour") {
        result.hour = part.value;
      } else if (part.type === "minute") {
        result.minute = part.value;
      } else if (part.type === "dayPeriod") {
        result.dayPeriod = part.value;
      }
    });

    return result;
  }

  function buildMarkup(timeParts) {
    return (
      '<span class="local-time-hour">' +
      timeParts.hour +
      '</span><span class="local-time-separator">:</span><span class="local-time-minute">' +
      timeParts.minute +
      '</span><span class="local-time-period"> ' +
      timeParts.dayPeriod +
      "</span>"
    );
  }

  function renderTime() {
    var timeParts = extractTimeParts(new Date());
    var currentMinute = timeParts.minute;

    elements.forEach(function (element) {
      if (!element.dataset.clockInitialized) {
        element.innerHTML = buildMarkup(timeParts);
        element.dataset.clockInitialized = "true";
      } else {
        var hourNode = element.querySelector(".local-time-hour");
        var minuteNode = element.querySelector(".local-time-minute");
        var periodNode = element.querySelector(".local-time-period");

        if (hourNode) {
          hourNode.textContent = timeParts.hour;
        }

        if (periodNode) {
          periodNode.textContent = " " + timeParts.dayPeriod;
        }

        if (minuteNode && minuteNode.textContent !== currentMinute) {
          minuteNode.textContent = currentMinute;
        }
      }
    });
  }

  function scheduleNextTick() {
    var now = Date.now();
    var delay = 60000 - (now % 60000);

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
