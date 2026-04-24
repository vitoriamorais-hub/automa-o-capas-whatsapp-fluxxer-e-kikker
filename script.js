const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// CONFIGURAÇÃO DE TAMANHOS
const MAX_PRODUCT_SIZE = 250;  // Logo do produto (Kikker ou Fluxxer) — destaque
const MAX_CLIENT_SIZE  = 180;  // Logo do cliente — apoio

// --- Produto selecionado ---
let selectedProduct = "kikker";

// --- Backgrounds (um por produto) ---
const backgrounds = {
    kikker:  loadImage("background.png"),         // já existente no projeto
    fluxxer: loadImage("background-fluxxer.png"), // adicionar no GitHub
};

// --- Logos dos produtos ---
const productLogos = {
    kikker:  loadImage("logo-kikker.png"),         // já existente no projeto
    fluxxer: loadImage("logo-fluxxer.png"),        // adicionar no GitHub
};

// --- Logo do cliente (upload) ---
let clientLogo = new Image();
let clientLogoLoaded = false;

// Utilitário: cria e retorna um objeto Image já com src definido
function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

// --- Seletor de produto ---
function selectProduct(product) {
    selectedProduct = product;
    document.getElementById("btn-kikker").classList.toggle("active", product === "kikker");
    document.getElementById("btn-fluxxer").classList.toggle("active", product === "fluxxer");

    // Atualiza nome do arquivo de download se já estiver visível
    const link = document.getElementById("download");
    if (link.style.display !== "none") {
        link.download = `capa-whatsapp-${product}.png`;
    }
}

// --- Upload do logo do cliente ---
document.getElementById("upload").addEventListener("change", function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        clientLogo = new Image();
        clientLogo.onload = function () { clientLogoLoaded = true; };
        clientLogo.src = event.target.result;
    };
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
});

// --- Geração da capa ---
function generateImage() {
    if (!clientLogoLoaded) {
        alert("Por favor, selecione o logo do cliente primeiro!");
        return;
    }

    const bg   = backgrounds[selectedProduct];
    const logo = productLogos[selectedProduct];

    ctx.clearRect(0, 0, 500, 500);

    // 1. Fundo do produto selecionado
    if (bg.complete && bg.naturalWidth !== 0) {
        ctx.drawImage(bg, 0, 0, 500, 500);
    } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 500, 500);
    }

    // 2. Logo do PRODUTO — destaque, topo, centralizado
    if (logo.complete && logo.naturalWidth !== 0) {
        const ratioP = Math.min(MAX_PRODUCT_SIZE / logo.width, MAX_PRODUCT_SIZE / logo.height);
        const pw = logo.width  * ratioP;
        const ph = logo.height * ratioP;
        ctx.drawImage(logo, (500 - pw) / 2, 60, pw, ph);
    }

    // 3. Linha divisória
    ctx.beginPath();
    ctx.moveTo(150, 330);
    ctx.lineTo(350, 330);
    ctx.strokeStyle = "rgba(204, 204, 204, 0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 4. Logo do CLIENTE — apoio, abaixo da linha
    const ratioC = Math.min(MAX_CLIENT_SIZE / clientLogo.width, MAX_CLIENT_SIZE / clientLogo.height);
    const cw = clientLogo.width  * ratioC;
    const ch = clientLogo.height * ratioC;
    ctx.drawImage(clientLogo, (500 - cw) / 2, 355, cw, ch);

    // 5. Link de download
    const link = document.getElementById("download");
    link.href     = canvas.toDataURL("image/png");
    link.download = `capa-whatsapp-${selectedProduct}.png`;
    link.style.display = "inline-block";
    link.innerText = "4. Baixar Capa de Grupo";
}
