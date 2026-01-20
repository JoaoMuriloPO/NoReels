console.log("[YT Shorts Blocker] content.js ativo");

let extensionEnabled = true;

function iniciar() {
  chrome.storage.local.get(["enabled"], result => {
    extensionEnabled = result.enabled ?? true;
    if (extensionEnabled && document.body) {
      executarLimpezaGeral();
      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
}

if (document.body) {
  iniciar();
} else {
  document.addEventListener("DOMContentLoaded", iniciar);
}

chrome.storage.onChanged.addListener(changes => {
  if (changes.enabled) {
    extensionEnabled = changes.enabled.newValue;
    if (extensionEnabled) {
      executarLimpezaGeral();
    } else {
      reexibirTudo();
      removeWarning();
    }
  }
});

function blockElement(element) {
  if (!element || !extensionEnabled || element.style.display === "none") return;
  element.style.display = "none";
  createWarning();
}

function reexibirTudo() {
  const items = document.querySelectorAll(
    "grid-shelf-view-model, ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-rich-section-renderer, ytd-reel-shelf-renderer, ytd-grid-video-renderer"
  );
  items.forEach(el => { el.style.display = ""; });
}

function blockShortsShelf() {
  const shelves = document.querySelectorAll("ytd-rich-section-renderer, ytd-reel-shelf-renderer, grid-shelf-view-model");
  shelves.forEach(el => {
    if (el.textContent.includes("Shorts")) {
      blockElement(el);
    }
  });
}

function blockInlineShorts() {
  const items = document.querySelectorAll("ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer");
  items.forEach(item => {
    const badge = item.querySelector(".yt-badge-shape__text");
    const thumbnail = item.querySelector("a#thumbnail");
    
    if ((badge && badge.textContent.trim().toUpperCase() === "SHORTS") || 
        (thumbnail && thumbnail.href.includes("/shorts/"))) {
      blockElement(item);
    }
  });
}

function blockOverlayShorts() {
  document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer[overlay-style="SHORTS"]')
    .forEach(overlay => {
      const card = overlay.closest("ytd-rich-item-renderer") ||
                   overlay.closest("ytd-video-renderer") ||
                   overlay.closest("ytd-grid-video-renderer") ||
                   overlay.closest("ytd-compact-video-renderer");
      blockElement(card);
    });
}

function executarLimpezaGeral() {
  if (!extensionEnabled || !document.body) return;
  blockShortsShelf();
  blockInlineShorts();
  blockOverlayShorts();
}

const observer = new MutationObserver(() => {
  if (extensionEnabled) {
    executarLimpezaGeral();
  }
});

function createWarning() {
  if (!extensionEnabled || document.getElementById("shorts-block-warning")) return;

  const warning = document.createElement("div");
  warning.id = "shorts-block-warning";
  
  warning.innerHTML = `
    <span id="warning-text">🚫 Shorts bloqueados</span>
    <button id="close-warning" style="margin-left: 10px; cursor: pointer; background: none; border: none; color: #cc0000; font-weight: bold; padding: 2px 5px;">✕</button>
  `;

  Object.assign(warning.style, {
    position: "fixed", top: "20px", right: "20px", 
    padding: "10px 15px", background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(5px)", border: "1px solid rgba(204, 0, 0, 0.3)",
    color: "#cc0000", fontWeight: "600", zIndex: "9999", 
    borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    display: "flex", alignItems: "center", transition: "all 0.2s ease",
    fontSize: "13px", fontFamily: "sans-serif"
  });

  document.body.appendChild(warning);

  const closeBtn = document.getElementById("close-warning");
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    warning.innerHTML = "🚫";
    warning.style.padding = "10px";
    warning.style.cursor = "pointer";
    warning.title = "Bloqueador ativo (Clique para expandir)";
    
    warning.onclick = () => {
      warning.remove();
      createWarning();
    };
  };
}

function removeWarning() {
  const warning = document.getElementById("shorts-block-warning");
  if (warning) warning.remove();
}
