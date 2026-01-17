console.log("[YT Shorts Blocker] content.js ativo");

let extensionEnabled = true;

// ==========================
// 1. SINCRONIA COM O BOTÃO (STORAGE)
// ==========================
// Carrega o estado inicial
chrome.storage.local.get(["enabled"], result => {
  extensionEnabled = result.enabled ?? true;
  executarLimpezaGeral(); // Tenta limpar assim que carrega
});

// Escuta a mudança do botão em tempo real
chrome.storage.onChanged.addListener(changes => {
  if (changes.enabled) {
    extensionEnabled = changes.enabled.newValue;
    console.log("[YT Shorts Blocker] Estado alterado para:", extensionEnabled);
    
    if (extensionEnabled) {
      executarLimpezaGeral();
    } else {
      reexibirTudo(); // Se desligar, precisamos mostrar os vídeos de volta
      removeWarning();
    }
  }
});

// ==========================
// 2. FUNÇÕES DE BLOQUEIO (SUA LÓGICA ORIGINAL)
// ==========================

function blockElement(element) {
  if (!element) return;
  
  // Apenas bloqueia se a extensão estiver ligada
  if (extensionEnabled) {
    element.style.display = "none";
    createWarning();
  }
}

// Para o botão funcionar, precisamos de uma forma de "desbloquear"
function reexibirTudo() {
  const items = document.querySelectorAll(
    "grid-shelf-view-model, ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer"
  );
  items.forEach(el => {
    el.style.display = ""; // Remove o "none" e volta ao padrão do YouTube
  });
}

// 1️⃣ Shelf inteira
function blockShortsShelf() {
  document.querySelectorAll("grid-shelf-view-model").forEach(el => blockElement(el));
}

// 2️⃣ Shorts inline (badge)
function blockInlineShorts() {
  const items = document.querySelectorAll(
    "ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer"
  );

  items.forEach(item => {
    // Verificamos o badge SHORTS
    const badge = item.querySelector(".yt-badge-shape__text");
    if (badge && badge.textContent.trim().toUpperCase() === "SHORTS") {
      blockElement(item);
    }
  });
}

// 3️⃣ Shorts via overlay (mais confiável)
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

// Função para rodar todas as suas detecções de uma vez
function executarLimpezaGeral() {
  if (!extensionEnabled) return;
  blockShortsShelf();
  blockInlineShorts();
  blockOverlayShorts();
}

// ==========================
// 3. OBSERVER (VIGIA O SCROLL)
// ==========================
const observer = new MutationObserver(() => {
  if (extensionEnabled) {
    executarLimpezaGeral();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Execução inicial manual
executarLimpezaGeral();

// ==========================
// 4. AVISO VISUAL (SUA LÓGICA)
// ==========================
function createWarning() {
  if (!extensionEnabled || document.getElementById("shorts-block-warning")) return;

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