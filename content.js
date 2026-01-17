console.log("[YT Shorts Blocker] content.js ativo");

let extensionEnabled = true;

// 1. CARREGAMENTO DO ESTADO (Otimizado para iniciar ligado)
chrome.storage.local.get(["enabled"], result => {
  extensionEnabled = result.enabled ?? true;
  // Se já houver body, limpa na hora. Se não, o observer pegará depois.
  if (extensionEnabled && document.body) {
    executarLimpezaGeral();
  }
});

// 2. ESCUTA MUDANÇAS NO BOTÃO
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

// 3. FUNÇÕES DE BLOQUEIO (ORIGINAIS)
function blockElement(element) {
  if (!element || !extensionEnabled) return;
  element.style.display = "none";
  createWarning();
}

function reexibirTudo() {
  const items = document.querySelectorAll(
    "grid-shelf-view-model, ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer"
  );
  items.forEach(el => { el.style.display = ""; });
}

function blockShortsShelf() {
  document.querySelectorAll("grid-shelf-view-model").forEach(el => blockElement(el));
}

function blockInlineShorts() {
  const items = document.querySelectorAll("ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer");
  items.forEach(item => {
    const badge = item.querySelector(".yt-badge-shape__text");
    if (badge && badge.textContent.trim().toUpperCase() === "SHORTS") {
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

// 4. OBSERVER (FLUIDEZ TOTAL)
// Em vez de observar o 'body' direto, observamos o 'document' que sempre existe
const observer = new MutationObserver(() => {
  if (extensionEnabled) {
    executarLimpezaGeral();
  }
});

// Observar o documentElement (HTML) é mais seguro e fluido que o body no início
observer.observe(document.documentElement, { childList: true, subtree: true });

// 5. AVISO VISUAL
function createWarning() {
  if (!extensionEnabled || !document.body || document.getElementById("shorts-block-warning")) return;
  const warning = document.createElement("div");
  warning.id = "shorts-block-warning";
  warning.innerText = "🚫 Bloqueador de Shorts ativo";
  Object.assign(warning.style, {
    position: "fixed", top: "20px", right: "20px", padding: "12px 16px",
    background: "white", border: "2px solid red", color: "red",
    fontWeight: "bold", zIndex: "9999", borderRadius: "8px"
  });
  document.body.appendChild(warning);
}

function removeWarning() {
  const warning = document.getElementById("shorts-block-warning");
  if (warning) warning.remove();
}