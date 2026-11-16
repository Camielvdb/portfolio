(function () {
  var modalContainer = document.querySelector(".modal-container");
  var mediaGrid = document.querySelector(".media-grid");
  var overlay = document.querySelector(".overlay");

  if (!modalContainer || !mediaGrid || !overlay) {
    return;
  }

  var dialogs = Array.from(modalContainer.querySelectorAll(".modal"));
  var activeDialog = null;
  var activeTrigger = null;
  var lastFocusedElement = null;
  var lockedScrollY = 0;

  function getCards() {
    return Array.from(mediaGrid.querySelectorAll(".item"));
  }

  function getFocusableElements(node) {
    return Array.from(
      node.querySelectorAll(
        'a[href], area[href], button:not([disabled]), [role="button"], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function (element) {
      return !element.hasAttribute("hidden");
    });
  }

  function lockPageScroll() {
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    document.body.style.position = "fixed";
    document.body.style.top = "-" + lockedScrollY + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockPageScroll() {
    document.documentElement.classList.remove("modal-open");
    document.body.classList.remove("modal-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, lockedScrollY);
  }

  function hideDialog(dialog) {
    dialog.hidden = true;
    dialog.style.display = "";
    dialog.classList.remove("is-visible", "is-closing");
    dialog.setAttribute("aria-hidden", "true");
  }

  function focusDialog(dialog) {
    var focusables = getFocusableElements(dialog);
    var closeButton = dialog.querySelector(".iconbutton");
    var target = closeButton || focusables[0] || dialog;
    window.setTimeout(function () {
      target.focus();
    }, 10);
  }

  function openDialog(index, trigger) {
    var dialog = dialogs[index];
    if (!dialog || activeDialog === dialog) {
      return;
    }

    dialogs.forEach(function (otherDialog) {
      if (otherDialog !== dialog) {
        hideDialog(otherDialog);
      }
    });

    activeDialog = dialog;
    activeTrigger = trigger || null;
    lastFocusedElement = document.activeElement;

    lockPageScroll();
    modalContainer.classList.add("is-active");
    modalContainer.setAttribute("aria-hidden", "false");

    dialog.hidden = false;
    dialog.style.display = "flex";
    dialog.classList.remove("is-closing");
    dialog.setAttribute("aria-hidden", "false");

    requestAnimationFrame(function () {
      dialog.classList.add("is-visible");
    });

    focusDialog(dialog);
  }

  function closeActiveDialog() {
    if (!activeDialog) {
      return;
    }

    var dialogToClose = activeDialog;
    dialogToClose.classList.remove("is-visible");
    dialogToClose.classList.add("is-closing");

    window.setTimeout(function () {
      hideDialog(dialogToClose);
      modalContainer.classList.remove("is-active");
      modalContainer.setAttribute("aria-hidden", "true");
      unlockPageScroll();

      if (activeTrigger) {
        activeTrigger.focus();
      } else if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
      }

      activeDialog = null;
      activeTrigger = null;
    }, 110);
  }

  function handleCardActivation(card) {
    var index = Number(card.getAttribute("data-dialog-index"));
    if (Number.isNaN(index)) {
      index = getCards().indexOf(card);
    }
    openDialog(index, card);
  }

  dialogs.forEach(function (dialog, index) {
    dialog.hidden = true;
    dialog.style.display = "";
    dialog.style.opacity = "";
    dialog.style.transform = "";
    dialog.style.webkitTransform = "";
    dialog.style.mozTransform = "";
    dialog.style.msTransform = "";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-hidden", "true");
    dialog.setAttribute("tabindex", "-1");
    dialog.setAttribute("data-dialog-index", String(index));

    var header = dialog.querySelector(".modal-header");
    if (header && !header.id) {
      header.id = "dialog-title-" + index;
    }
    if (header) {
      dialog.setAttribute("aria-labelledby", header.id);
    }

    var closeButton = dialog.querySelector(".iconbutton");
    if (closeButton) {
      closeButton.setAttribute("role", "button");
      closeButton.setAttribute("tabindex", "0");
      closeButton.setAttribute("aria-label", "Close dialog");
    }
  });

  modalContainer.style.display = "";
  modalContainer.setAttribute("aria-hidden", "true");
  overlay.style.display = "";

  document.addEventListener(
    "click",
    function (event) {
      var card = event.target.closest(".media-grid .item");
      if (card) {
        event.preventDefault();
        handleCardActivation(card);
        return;
      }

      if (event.target.classList.contains("overlay")) {
        closeActiveDialog();
        return;
      }

      var closeButton = event.target.closest(".iconbutton");
      if (closeButton && activeDialog && activeDialog.contains(closeButton)) {
        event.preventDefault();
        closeActiveDialog();
      }
    },
    true
  );

  document.addEventListener("keydown", function (event) {
    var card = event.target.closest(".media-grid .item");
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      handleCardActivation(card);
      return;
    }

    var closeButton = event.target.closest(".iconbutton");
    if (closeButton && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      closeActiveDialog();
      return;
    }

    if (!activeDialog) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeActiveDialog();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    var focusables = getFocusableElements(activeDialog);
    if (!focusables.length) {
      event.preventDefault();
      activeDialog.focus();
      return;
    }

    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
