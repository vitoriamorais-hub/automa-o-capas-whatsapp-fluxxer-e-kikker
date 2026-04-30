const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// CONFIGURAÇÃO DE TAMANHOS
const MAX_PRODUCT_SIZE = 220;  // Logo do produto — destaque
const MAX_CLIENT_SIZE  = 160;  // Logo do cliente — apoio

// --- Produto selecionado ---
let selectedProduct = "kikker";

// --- Função utilitária ---
function loadImage(src) {
    const img = new Image();
    img.onload  = () => console.log(`✅ Imagem carregada: ${src}`);
    img.onerror = () => console.error(`❌ ERRO ao carregar: ${src}`);
    img.src = src;
    return img;
}

// --- Backgrounds ---
const backgrounds = {
    kikker:  loadImage("background.png"),
    fluxxer: loadImage("background-fluxxer.png"),
};

// --- Logos dos produtos ---
const productLogos = {
    kikker:  loadImage("logo-kikker.png"),
    fluxxer: loadImage("logo-fluxxer.png"),
};

// --- Logo do cliente (upload) ---
let clientLogo = new Image();
let clientLogoLoaded = false;

// --- Seletor de produto ---
function selectProduct(product) {
    selectedProduct = product;
    document.getElementById("btn-kikker").classList.toggle("active", product === "kikker");
    document.getElementById("btn-fluxxer").classList.toggle("active", product === "fluxxer");

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

    // 1. Fundo
    if (bg.complete && bg.naturalWidth !== 0) {
        ctx.drawImage(bg, 0, 0, 500, 500);
    } else {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, 500, 500);
    }

    // 2. Logo do produto — calcula altura real após escala
    let productBottom = 40; // fallback
    if (logo.complete && logo.naturalWidth !== 0) {
        const ratioP = Math.min(MAX_PRODUCT_SIZE / logo.width, MAX_PRODUCT_SIZE / logo.height);
        const pw = logo.width  * ratioP;
        const ph = logo.height * ratioP;
        const logoY = 40; // começa mais perto do topo
        ctx.drawImage(logo, (500 - pw) / 2, logoY, pw, ph);
        productBottom = logoY + ph; // onde o logo do produto termina
    }

    // 3. Linha divisória — logo após o logo do produto + pequena margem
    const lineY = productBottom + 20;
    ctx.beginPath();
    ctx.moveTo(150, lineY);
    ctx.lineTo(350, lineY);
    ctx.strokeStyle = "rgba(204, 204, 204, 0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 4. Logo do cliente — logo abaixo da linha + pequena margem
    const clientY = lineY + 20;
    const ratioC = Math.min(MAX_CLIENT_SIZE / clientLogo.width, MAX_CLIENT_SIZE / clientLogo.height);
    const cw = clientLogo.width  * ratioC;
    const ch = clientLogo.height * ratioC;
    ctx.drawImage(clientLogo, (500 - cw) / 2, clientY, cw, ch);

    // 5. Link de download
    const link = document.getElementById("download");
    link.href     = canvas.toDataURL("image/png");
    link.download = `capa-whatsapp-${selectedProduct}.png`;
    link.style.display = "inline-block";
    link.innerText = "4. Baixar Capa de Grupo";
}
