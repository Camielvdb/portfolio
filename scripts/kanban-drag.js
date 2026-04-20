(function () {
  // Custom cursor: ↖/↘ arrowheads with a / bar in the centre (matching the divider angle)
  var CURSOR = "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22%3E%3Cpath d=%22M2 2 L9 2 L2 9 Z%22 fill=%22white%22 stroke=%22white%22 stroke-width=%222%22 stroke-linejoin=%22round%22/%3E%3Cpath d=%22M22 22 L15 22 L22 15 Z%22 fill=%22white%22 stroke=%22white%22 stroke-width=%222%22 stroke-linejoin=%22round%22/%3E%3Cline x1=%228%22 y1=%2216%22 x2=%2216%22 y2=%228%22 stroke=%22white%22 stroke-width=%224%22 stroke-linecap=%22round%22/%3E%3Cpath d=%22M2 2 L9 2 L2 9 Z%22 fill=%22black%22/%3E%3Cpath d=%22M22 22 L15 22 L22 15 Z%22 fill=%22black%22/%3E%3Cline x1=%228%22 y1=%2216%22 x2=%2216%22 y2=%228%22 stroke=%22black%22 stroke-width=%222%22 stroke-linecap=%22round%22/%3E%3C/svg%3E') 12 12, nwse-resize";

  // Registered BEFORE modal.js — runs first in capture phase, so we can block the modal click after a drag.
  var suppressNextClick = false;
  document.addEventListener("click", function (e) {
    if (suppressNextClick) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      suppressNextClick = false;
    }
  }, true);

  var DEFAULT_POS = 10; // center of diagonal as % of card width

  function initKanbanDrag(card) {
    var front = card.querySelector(".item-front.kanban");
    if (!front) return;

    // Skip drag on touch/small-screen devices — mobile shows abstract layer only via CSS
    if (typeof window.matchMedia === "function" && (
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(max-width: 991px)").matches)) return;

    var svg = front.querySelector(".kanban-divider-svg");
    var line = svg && svg.querySelector(".kanban-divider-line");
    if (!svg || !line) return;

    var dragging = false;
    var hasDragged = false;
    var currentPos = DEFAULT_POS;
    var slope = 100; // (cardHeight / cardWidth) * 100, computed on init

    function computeSlope() {
      var w = front.offsetWidth;
      var h = front.offsetHeight;
      slope = (w > 0 && h > 0) ? (h / w) * 100 : 100;
    }

    function applyDivider(pos) {
      currentPos = pos;
      var topX = pos + slope / 2;
      var bottomX = pos - slope / 2;

      front.style.setProperty("--kanban-divider-top", topX.toFixed(2) + "%");
      front.style.setProperty("--kanban-divider-bottom", bottomX.toFixed(2) + "%");

      var w = front.offsetWidth;
      var h = front.offsetHeight;
      line.setAttribute("x1", ((topX / 100) * w).toFixed(1));
      line.setAttribute("y1", "0");
      line.setAttribute("x2", ((bottomX / 100) * w).toFixed(1));
      line.setAttribute("y2", String(h));
    }

    function dividerXAtY(yPct) {
      var topX = currentPos + slope / 2;
      var bottomX = currentPos - slope / 2;
      return topX + (bottomX - topX) * (yPct / 100);
    }

    computeSlope();
    applyDivider(DEFAULT_POS);

    if (typeof ResizeObserver === "function") {
      var ro = new ResizeObserver(function () {
        computeSlope();
        applyDivider(currentPos);
      });
      ro.observe(front);
    }

    front.addEventListener("pointerdown", function (e) {
      var rect = front.getBoundingClientRect();
      var xPct = ((e.clientX - rect.left) / rect.width) * 100;
      var yPct = ((e.clientY - rect.top) / rect.height) * 100;
      var projectedPos = xPct + (yPct - 50) * (slope / 100);
      var hitPct = (44 / rect.width) * 100;

      if (Math.abs(projectedPos - currentPos) > hitPct) return;

      e.stopPropagation();
      e.preventDefault();
      dragging = true;
      hasDragged = false;
      front.setPointerCapture(e.pointerId);
      card.setAttribute("data-kanban-dragging", "true");
    });

    front.addEventListener("pointermove", function (e) {
      var rect = front.getBoundingClientRect();
      var xPct = ((e.clientX - rect.left) / rect.width) * 100;
      var yPct = ((e.clientY - rect.top) / rect.height) * 100;

      // Project cursor onto the perpendicular of the 45° diagonal.
      // For a line going top-right → bottom-left, the perpendicular is ↖↘.
      // Formula: the center pos that puts the line exactly under the cursor.
      var projectedPos = xPct + (yPct - 50) * (slope / 100);

      if (!dragging) {
        var hitPct = (44 / rect.width) * 100;
        var near = Math.abs(projectedPos - currentPos) <= hitPct;
        front.style.cursor = near ? CURSOR : "";
        card.toggleAttribute("data-divider-near", near);
        return;
      }

      hasDragged = true;
      var min = 10 - slope / 2;
      var max = 90 + slope / 2;
      var layers = front.querySelectorAll(".kanban-card-layer");
      layers.forEach(function (l) { l.style.transition = "none"; });
      applyDivider(Math.max(min, Math.min(max, projectedPos)));
    });

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      card.removeAttribute("data-kanban-dragging");

      var layers = front.querySelectorAll(".kanban-card-layer");
      layers.forEach(function (l) { l.style.transition = ""; });

      if (hasDragged) {
        suppressNextClick = true;
        setTimeout(function () { suppressNextClick = false; }, 300);
      }

      // If pointer released outside card, reset its hover state
      if (e && e.clientX !== undefined) {
        var rect = card.getBoundingClientRect();
        var outside = e.clientX < rect.left || e.clientX > rect.right ||
                      e.clientY < rect.top  || e.clientY > rect.bottom;
        if (outside) {
          card.removeAttribute("data-hover-active");
          var wrapper = card.querySelector(".item-wrapper");
          if (wrapper) {
            wrapper.style.setProperty("--card-rotate-x", "0deg");
            wrapper.style.setProperty("--card-rotate-y", "0deg");
            wrapper.style.setProperty("--card-z", "0px");
          }
        }
      }
    }

    front.addEventListener("pointerup", endDrag);
    front.addEventListener("pointercancel", endDrag);
    front.addEventListener("pointerleave", function () {
      if (!dragging) {
        front.style.cursor = "";
        card.removeAttribute("data-divider-near");
      }
    });
  }

  document.querySelectorAll(".media-grid .item").forEach(initKanbanDrag);
})();
