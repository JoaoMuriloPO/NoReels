const toggle = document.getElementById("toggle");
const status = document.getElementById("status");


function updateUI(enabled) {
  status.textContent = enabled ? "Bloqueio ATIVO" : "Bloqueio DESATIVADO";
  status.style.color = enabled ? "red" : "#666";
}


chrome.storage.local.get(["enabled"], result => {
  const enabled = result.enabled ?? true; 
  toggle.checked = enabled;
  updateUI(enabled);
});

toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  
  chrome.storage.local.set({ enabled }, () => {
    updateUI(enabled);
    console.log("[NoReels] Novo estado salvo:", enabled);
  });
});
