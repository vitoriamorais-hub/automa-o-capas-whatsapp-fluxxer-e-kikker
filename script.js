const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// CONFIGURAÇÃO DE TAMANHOS
const MAX_PRODUCT_SIZE = 350;  // Logo do produto — destaque
const MAX_CLIENT_SIZE  = 200;  // Logo do cliente — apoio

// --- Produto selecionado ---
let selectedProduct = "kikker";

// --- Função utilitária: carrega imagem e avisa no console se falhar ---
function loadImage(src) {
    const img = new Image();
    img.onload  = () => console.log(`✅ Imagem carregada: ${src}`);
    img.onerror = () => console.error(`❌ ERRO ao carregar: ${src} — verifique o nome exato no GitHub`);
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
        clientLogo.onload = function () {
            clientLogoLoaded = true;
            console.log("✅ Logo do cliente carregado com sucesso.");
        };
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

    console.log(`🎨 Gerando capa para produto: ${selectedProduct}`);
    console.log(`   Background pronto? ${bg.complete && bg.naturalWidth !== 0}`);
    console.log(`   Logo produto pronto? ${logo.complete && logo.naturalWidth !== 0}`);

    ctx.clearRect(0, 0, 500, 500);

    // 1. Fundo
    if (bg.complete && bg.naturalWidth !== 0) {
        ctx.drawImage(bg, 0, 0, 500, 500);
    } else {
        // Fallback: fundo branco com aviso visual
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, 500, 500);
        ctx.fillStyle = "#cc0000";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`background-${selectedProduct === 'kikker' ? '' : selectedProduct + '-'}... não encontrado`, 250, 250);
        console.warn(`⚠️ Background não carregado para: ${selectedProduct}`);
    }

    // 2. Logo do produto — destaque, topo
    if (logo.complete && logo.naturalWidth !== 0) {
        const ratioP = Math.min(MAX_PRODUCT_SIZE / logo.width, MAX_PRODUCT_SIZE / logo.height);
        const pw = logo.width  * ratioP;
        const ph = logo.height * ratioP;
        ctx.drawImage(logo, (500 - pw) / 2, 60, pw, ph);
    } else {
        ctx.fillStyle = "#cc0000";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`logo-${selectedProduct}.png não encontrado`, 250, 150);
        console.warn(`⚠️ Logo do produto não carregado para: ${selectedProduct}`);
    }

    // 3. Linha divisória
    ctx.beginPath();
    ctx.moveTo(150, 330);
    ctx.lineTo(350, 330);
    ctx.strokeStyle = "rgba(204, 204, 204, 0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 4. Logo do cliente — apoio, abaixo da linha
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
