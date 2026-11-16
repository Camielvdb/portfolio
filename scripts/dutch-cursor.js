(function () {
  // Hovering "Dutch" in the H1 swaps the cursor for a random Dutch emoji.
  var target = document.querySelector(".dutch-cursor");
  if (!target) {
    return;
  }

  var ICONS = ["🚲", "🌷", "🧇"];
  var last = -1;

  function cursorFor(emoji) {
    var svg =
      "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>" +
      "<text x='16' y='23' font-size='22' text-anchor='middle'>" + emoji + "</text></svg>";
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '") 16 16, auto';
  }

  target.addEventListener("mouseenter", function () {
    var i;
    do {
      i = Math.floor(Math.random() * ICONS.length);
    } while (i === last && ICONS.length > 1);
    last = i;
    target.style.cursor = cursorFor(ICONS[i]);
  });
})();
