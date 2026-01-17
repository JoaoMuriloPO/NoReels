const toggle = document.getElementById("toggle");
const status = document.getElementById("status");

// Carregar estado salvo
chrome.storage.local.get(["enabled"], result => {
  const enabled = result.enabled ?? true;
  toggle.checked = enabled;
  status.textContent = enabled ? "Bloqueio ATIVO" : "Bloqueio DESATIVADO";
});

// Quando mudar
toggle.addEventListener("change", () => {
  const enabled = toggle.checked;

  chrome.storage.local.set({ enabled });

  status.textContent = enabled
    ? "Bloqueio ATIVO"
    : "Bloqueio DESATIVADO";
});
