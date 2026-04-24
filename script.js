const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ============================
// CONFIGURAÇÃO
// ============================

// ALTURA PADRÃO (CONSISTÊNCIA DE MARCA)
const TARGET_PRODUCT_HEIGHT = 120;
const TARGET_CLIENT_HEIGHT  = 90;

let selectedProduct = "kikker";

// ============================
// LOAD DE IMAGENS
// ============================
function loadImage(src) {
    const img = new Image();
    img.onload  = () => console.log(`✅ Imagem carregada: ${src}`);
    img.onerror = () => console.error(`❌ ERRO ao carregar: ${src}`);
    img.src = src;
    return img;
}

// Backgrounds
const backgrounds = {
    kikker:  loadImage("background.png"),
    fluxxer: loadImage("background-fluxxer.png"),
};

// Logos produtos
const productLogos = {
    kikker:  loadImage("logo-kikker.png"),
    fluxxer: loadImage("logo-fluxxer.png"),
};

// Logo cliente
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
// UPLOAD CLIENTE
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

    // segurança de carregamento
    if (!logo.complete || logo.naturalWidth === 0) {
        alert("Logo do produto ainda não carregou.");
        return;
    }

    if (!clientLogo.complete || clientLogo.naturalWidth === 0) {
        alert("Logo do cliente inválido.");
        return;
    }

    ctx.clearRect(0, 0, 500, 500);

    // ============================
    // BACKGROUND
    // ============================
    if (bg.complete && bg.naturalWidth !== 0) {
        ctx.drawImage(bg, 0, 0, 500, 500);
    } else {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, 500, 500);
    }

    const centerX = 250;

    // ============================
    // TAMANHO PRODUTO (ALTURA FIXA)
    // ============================
    const ratioP = TARGET_PRODUCT_HEIGHT / logo.naturalHeight;

    const pw = logo.naturalWidth * ratioP;
    const ph = TARGET_PRODUCT_HEIGHT;

    // ============================
    // TAMANHO CLIENTE (MENOR)
    // ============================
    const ratioC = TARGET_CLIENT_HEIGHT / clientLogo.naturalHeight;

    const cw = clientLogo.naturalWidth * ratioC;
    const ch = TARGET_CLIENT_HEIGHT;

    // ============================
    // ESPAÇAMENTO
    // ============================
    const spacing = 40;

    // BLOCO CENTRAL
    const totalHeight = ph + spacing + ch;
    const startY = (500 - totalHeight) / 2;

    const productY = startY;
    const dividerY = productY + ph + (spacing / 2);
    const clientY  = productY + ph + spacing;

    // ============================
    // DESENHAR PRODUTO
    // ============================
    ctx.drawImage(logo, centerX - pw / 2, productY, pw, ph);

    // ============================
    // LINHA DIVISÓRIA
    // ============================
    ctx.beginPath();
    ctx.moveTo(150, dividerY);
    ctx.lineTo(350, dividerY);
    ctx.strokeStyle = "rgba(204,204,204,0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // ============================
    // DESENHAR CLIENTE
    // ============================
    ctx.drawImage(clientLogo, centerX - cw / 2, clientY, cw, ch);

    // ============================
    // DOWNLOAD
    // ============================
    const link = document.getElementById("download");

    link.href = canvas.toDataURL("image/png");
    link.download = `capa-whatsapp-${selectedProduct}.png`;
    link.style.display = "inline-block";
    link.innerText = "4. Baixar Capa de Grupo";
}
