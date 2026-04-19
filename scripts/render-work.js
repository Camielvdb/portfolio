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

    if (item.frontClass === "tokenization-prep") {
      var tokenizationVisual = document.createElement("div");
      tokenizationVisual.className = "tokenization-card-visual";
      tokenizationVisual.setAttribute("data-tokenization-visual", "card");
      tokenizationVisual.setAttribute("aria-hidden", "true");
      front.appendChild(tokenizationVisual);
    }

    if (item.frontClass === "kanban") {
      var kanbanVisual = document.createElement("div");
      var kanbanUiLayer = document.createElement("img");
      var kanbanAbstractLayer = document.createElement("img");

      kanbanVisual.className = "kanban-card-visual";
      kanbanVisual.setAttribute("aria-hidden", "true");

      kanbanUiLayer.className = "kanban-card-layer kanban-card-layer--ui";
      kanbanUiLayer.src = "./images/honeybook-kanban-ui.png";
      kanbanUiLayer.alt = "";
      kanbanUiLayer.decoding = "async";

      var kanbanAbstractLayerLight = document.createElement("img");
      var kanbanAbstractLayerDark = document.createElement("img");

      kanbanAbstractLayer.className = "kanban-card-layer kanban-card-layer--abstract kanban-card-layer--abstract-light";
      kanbanAbstractLayer.src = "./images/honeybook-kanban-abstract-light.png";
      kanbanAbstractLayer.alt = "";
      kanbanAbstractLayer.decoding = "async";

      kanbanAbstractLayerDark.className = "kanban-card-layer kanban-card-layer--abstract kanban-card-layer--abstract-dark";
      kanbanAbstractLayerDark.src = "./images/honeybook-kanban-abstract-dark.png";
      kanbanAbstractLayerDark.alt = "";
      kanbanAbstractLayerDark.decoding = "async";

      kanbanVisual.appendChild(kanbanAbstractLayer);
      kanbanVisual.appendChild(kanbanAbstractLayerDark);
      kanbanVisual.appendChild(kanbanUiLayer);

      var kanbanSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      var kanbanDividerLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      kanbanSvg.setAttribute("class", "kanban-divider-svg");
      kanbanSvg.setAttribute("aria-hidden", "true");
      kanbanDividerLine.setAttribute("class", "kanban-divider-line");
      kanbanSvg.appendChild(kanbanDividerLine);

      front.appendChild(kanbanVisual);
      front.appendChild(kanbanSvg);
    }

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
