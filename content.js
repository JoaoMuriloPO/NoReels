console.log("[YT Shorts Blocker] content.js ativo");
let extensionEnabled = true;

chrome.storage.local.get(["enabled"], result => {
  extensionEnabled = result.enabled ?? true;
});
chrome.storage.onChanged.addListener(changes => {
  if (changes.enabled) {
    extensionEnabled = changes.enabled.newValue;

    console.log(
      "[YT Shorts Blocker] Estado alterado:",
      extensionEnabled ? "ATIVO" : "DESATIVADO"
    );

    if (!extensionEnabled) {
      removeWarning();
    }
  }
});

let warningShown = false;

function createWarning() {
  if (warningShown) return;
  warningShown = true;

  console.log("[YT Shorts Blocker] EXTENSAO RODANDO");

  const warning = document.createElement("div");
  warning.id = "shorts-block-warning";
  warning.innerText = "🚫 Bloqueador de Shorts ativo";

  warning.style.position = "fixed";
  warning.style.top = "20px";
  warning.style.right = "20px";
  warning.style.padding = "12px 16px";
  warning.style.background = "white";
  warning.style.border = "2px solid red";
  warning.style.color = "red";
  warning.style.fontWeight = "bold";
  warning.style.zIndex = "9999";
  warning.style.borderRadius = "8px";

  document.body.appendChild(warning);
}
function removeWarning() {
  const warning = document.getElementById("shorts-block-warning");
  if (warning) {
    warning.remove();
    warningShown = false;
  }
}


/**
 * MÉTODO 1 — Remove a seção inteira de Shorts
 */
function removeShortsShelf() {
  const shelves = document.querySelectorAll("grid-shelf-view-model");

  if (shelves.length > 0) {
    shelves.forEach(el => el.remove());
    createWarning();
  }
}

/**
 * MÉTODO 2 — Remove Shorts misturados no feed (badge visível)
 */
function removeInlineShorts() {
  const videoItems = document.querySelectorAll(
    "ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer"
  );

  videoItems.forEach(item => {
    if (item.dataset.checked) return;
    item.dataset.checked = "true";

    const badgeText = item.querySelector(".yt-badge-shape__text");

    if (
      badgeText &&
      badgeText.textContent.trim().toUpperCase() === "SHORTS"
    ) {
      console.log("[YT Shorts Blocker] Short inline removido (badge)", item);
      item.remove();
      createWarning();
    }
  });
}

/**
 * MÉTODO 3 — Remove Shorts via overlay-style="SHORTS" (OURO 🔥)
 */
function removeOverlayShorts() {
  const overlays = document.querySelectorAll(
    'ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]'
  );

  overlays.forEach(overlay => {
    const videoCard =
      overlay.closest("ytd-rich-item-renderer") ||
      overlay.closest("ytd-video-renderer") ||
      overlay.closest("ytd-grid-video-renderer") ||
      overlay.closest("ytd-compact-video-renderer");

    if (videoCard) {
      console.log("[YT Shorts Blocker] Short removido (overlay)", videoCard);
      videoCard.remove();
      createWarning();
    }
  });
}

/**
 * Observer principal
 */
const observer = new MutationObserver(() => {
if (!extensionEnabled) return;
  removeShortsShelf();
  removeInlineShorts();
  removeOverlayShorts();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Primeira execução
removeShortsShelf();
removeInlineShorts();
removeOverlayShorts();
