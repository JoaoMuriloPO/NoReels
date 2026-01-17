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

  // Selecionamos o botão após ele ser adicionado ao corpo da página
  const closeBtn = document.getElementById("close-warning");

  closeBtn.onclick = (e) => {
    e.stopPropagation(); // IMPEDE o clique de "vazar" para a div pai
    
    warning.innerHTML = "🚫"; // Minimiza
    warning.style.padding = "10px";
    warning.style.cursor = "pointer";
    warning.title = "Bloqueador ativo (Clique para expandir)";
    
    // Agora, quando a div estiver minimizada, clicar nela expande novamente
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