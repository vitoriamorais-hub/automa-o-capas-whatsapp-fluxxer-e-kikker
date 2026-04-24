const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ============================
// CONFIGURAÇÃO DE TAMANHOS
// ============================
const MAX_PRODUCT_SIZE = 300;  // destaque maior
const MAX_CLIENT_SIZE  = 220;  // apoio mais visível

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

// --- Logo do cliente ---
let clientLogo = new Image();
let clientLogoLoaded = false;

// ============================
// SELEÇÃO DE PRODUTO
// ============================
function selectProduct(product) {
    selectedProduct = product;

    document.getElementById("btn-kikker").classList.toggle("active", product === "kikker");
    document.getElementById("btn-fluxxer").classList.toggle("active", product === "fluxxer");

    const link = document.getElementById("download");
    if (link.style.display !== "none") {
        link.download = `capa-whatsapp-${product}.png`;
    }
}

// ============================
// UPLOAD DO CLIENTE
// ============================
document.getElementById("upload").addEventListener("change", function (e) {
    const reader = new FileReader();

    reader.onload = function (event) {
        clientLogo = new Image();

        clientLogo.onload = function () {
            clientLogoLoaded = true;
            console.log("✅ Logo do cliente carregado.");
        };

        clientLogo.src = event.target.result;
    };

    if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
    }
});

// ============================
// GERAR IMAGEM
// ============================
function generateImage() {

    if (!clientLogoLoaded) {
        alert("Por favor, selecione o logo do cliente primeiro!");
        return;
    }

    const bg   = backgrounds[selectedProduct];
    const logo = productLogos[selectedProduct];

    ctx.clearRect(0, 0, 500, 500);

    // ============================
    // 1. BACKGROUND
    // ============================
    if (bg.complete && bg.naturalWidth !== 0) {
        ctx.drawImage(bg, 0, 0, 500, 500);
    } else {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, 500, 500);
    }

    // ============================
    // CONFIG DE POSIÇÃO (CENTRAL)
    // ============================
    const centerX = 250;

    const productY = 110;
    const dividerY = 300;
    const clientY  = 340;

    // ============================
    // 2. LOGO PRODUTO
    // ============================
    if (logo.complete && logo.naturalWidth !== 0) {

        const ratioP = Math.min(
            MAX_PRODUCT_SIZE / logo.width,
            MAX_PRODUCT_SIZE / logo.height
        );

        const pw = logo.width  * ratioP;
        const ph = logo.height * ratioP;

        // sombra leve (destaque)
        ctx.shadowColor = "rgba(0,0,0,0.08)";
        ctx.shadowBlur = 10;

        ctx.drawImage(logo, centerX - pw / 2, productY, pw, ph);

        ctx.shadowBlur = 0;
    }

    // ============================
    // 3. LINHA DIVISÓRIA
    // ============================
    ctx.beginPath();
    ctx.moveTo(130, dividerY);
    ctx.lineTo(370, dividerY);
    ctx.strokeStyle = "rgba(204, 204, 204, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // ============================
    // 4. LOGO CLIENTE
    // ============================
    const ratioC = Math.min(
        MAX_CLIENT_SIZE / clientLogo.width,
        MAX_CLIENT_SIZE / clientLogo.height
    );

    const cw = clientLogo.width  * ratioC;
    const ch = clientLogo.height * ratioC;

    ctx.drawImage(clientLogo, centerX - cw / 2, clientY, cw, ch);

    // ============================
    // 5. DOWNLOAD
    // ============================
    const link = document.getElementById("download");

    link.href = canvas.toDataURL("image/png");
    link.download = `capa-whatsapp-${selectedProduct}.png`;
    link.style.display = "inline-block";
    link.innerText = "4. Baixar Capa de Grupo";
}
