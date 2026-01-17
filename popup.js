const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

// Função para atualizar o texto e a cor do status
function updateUI(enabled) {
  status.textContent = enabled ? "Bloqueio ATIVO" : "Bloqueio DESATIVADO";
  status.style.color = enabled ? "red" : "#666";
}

// 1. Carregar estado salvo ao abrir o popup
chrome.storage.local.get(["enabled"], result => {
  const enabled = result.enabled ?? true; // Ligado por padrão
  toggle.checked = enabled;
  updateUI(enabled);
});

// 2. Quando o usuário clicar no interruptor
toggle.addEventListener("change", () => {
  const enabled = toggle.checked;

  // Salva no storage local
  chrome.storage.local.set({ enabled }, () => {
    updateUI(enabled);
    console.log("[NoReels] Novo estado salvo:", enabled);
  });
});