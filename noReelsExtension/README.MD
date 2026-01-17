<img src="LINK_DA_SUA_IMAGEM_AQUI" alt="NoReels Preview" width="100%" />

# NoReels - YouTube Shorts Blocker

# 🌐 Landing Page & Demo
Você pode visualizar a página oficial do projeto e baixar a versão pronta para uso aqui: 👉 

# [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) [![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue)](https://developer.chrome.com/docs/extensions/) [![HTML5](https://img.shields.io/badge/HTML5-orange)](https://developer.mozilla.org/pt-BR/docs/Web/HTML) [![CSS3](https://img.shields.io/badge/CSS3-blue)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)


Extensão para Google Chrome desenvolvida com JavaScript puro e Web Extensions API (Manifest V3), projetada para ocultar automaticamente os "Shorts" do YouTube, permitindo uma navegação focada e livre de distrações.

## 🚀 Tecnologias

- **JavaScript (ES6+)** - Lógica principal de manipulação do DOM e observer
- **Web Extensions API (V3)** - Padrão moderno para desenvolvimento de extensões
- **Chrome Storage API** - Persistência de preferências do usuário
- **HTML5 & CSS3** - Estrutura e estilização da interface do Popup

## 📋 Pré-requisitos

Para utilizar ou testar esta extensão em modo desenvolvedor:

- Navegador baseado em Chromium (Google Chrome, Brave, Edge, Opera)
- Acesso às configurações de extensões do navegador

## 🛠️ Instalação (Modo Desenvolvedor)

1. Clone o repositório:

```bash
git clone https://github.com/JoaoMuriloPO/NoReels.git
cd NoReels
Configure o navegador:

Abra o Chrome e vá para chrome://extensions/

Ative o Modo do desenvolvedor no canto superior direito

Clique em Carregar sem compactação

Selecione a pasta raiz deste projeto

🎯 Como Utilizar
Ativando o Bloqueio
Ao instalar, a extensão já vem ativada por padrão. Ela monitora o carregamento da página do YouTube e oculta as prateleiras de Shorts e vídeos individuais marcados com a badge "SHORTS".

Controle via Popup
Clique no ícone da extensão na barra de ferramentas para:

Ativar/Desativar o bloqueio em tempo real

Visualizar o status atual do filtro

O estado será salvo automaticamente para futuras sessões

🎨 Características
✅ Bloqueio instantâneo via injeção de CSS

✅ Detecção dinâmica com MutationObserver (sem necessidade de F5)

✅ Interface de controle (Popup) intuitiva e minimalista

✅ Persistência de estado (ON/OFF) entre reinicializações do navegador

✅ Extremamente leve (baixo consumo de CPU e RAM)

✅ Código limpo e sem dependências externas

📱 Componentes
Manifest V3 - Configurações e permissões de sistema

Content Script - O "motor" que identifica e oculta os elementos no YouTube

Popup (UI) - Interface de controle rápido para o usuário

Icons - Identidade visual da extensão no navegador

👤 Autor
João Murilo Pereira de Oliveira

Email: j.murilo.mobile@gmail.com

LinkedIn: joaomurilopoo

GitHub: JoaoMuriloPO