(function () {
  var items = window.PORTFOLIO_ITEMS;
  var grid = document.querySelector("[data-portfolio-grid]");

  if (!grid || !Array.isArray(items)) {
    return;
  }

  function createCard(item, index) {
    var card = document.createElement("div");
    card.className = "item";
    card.setAttribute("data-dialog-index", String(index));
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", item.title);

    var wrapper = document.createElement("div");
    wrapper.className = item.wrapperClass ? "item-wrapper " + item.wrapperClass : "item-wrapper";

    var front = document.createElement("div");
    front.className = "item-front " + item.frontClass;

    var titleContainer = document.createElement("div");
    titleContainer.className = "item-title-container";

    var title = document.createElement("div");
    title.className = "item-title";
    title.textContent = item.title;

    var bottom = document.createElement("div");
    bottom.className = "item-bottom-container";

    var client = document.createElement("div");
    client.className = "item-client";
    client.textContent = item.client;

    var year = document.createElement("div");
    year.className = "item-year";
    year.textContent = item.year;

    titleContainer.appendChild(title);
    bottom.appendChild(client);
    bottom.appendChild(year);
    wrapper.appendChild(front);
    wrapper.appendChild(titleContainer);
    wrapper.appendChild(bottom);
    card.appendChild(wrapper);

    return card;
  }

  var fragment = document.createDocumentFragment();

  items.forEach(function (item, index) {
    fragment.appendChild(createCard(item, index));
  });

  grid.appendChild(fragment);
})();
