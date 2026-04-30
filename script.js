const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_SIZE     = 500;
const MAX_PRODUCT_SIZE = 320;
const MAX_CLIENT_SIZE  = 320;
const GAP_LINE        = 18;  // espaço entre logo do produto e a linha
const GAP_CLIENT      = 18;  // espaço entre a linha e o logo do cliente

let selectedProduct = "kikker";

function loadImage(src) {
    const img = new Image();
    img.onload  = () => console.log(`✅ ${src}`);
    img.onerror = () => console.error(`❌ ${src}`);
    img.src = src;
    return img;
}

const backgrounds  = { kikker: loadImage("background.png"),       fluxxer: loadImage("background-fluxxer.png") };
const productLogos = { kikker: loadImage("logo-kikker.png"),       fluxxer: loadImage("logo-fluxxer.png") };

let clientLogo = new Image();
let clientLogoLoaded = false;

function selectProduct(product) {
    selectedProduct = product;
    document.getElementById("btn-kikker").classList.toggle("active", product === "kikker");
    document.getElementById("btn-fluxxer").classList.toggle("active", product === "fluxxer");
    const link = document.getElementById("download");
    if (link.style.display !== "none") link.download = `capa-whatsapp-${product}.png`;
}

document.getElementById("upload").addEventListener("change", function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        clientLogo = new Image();
        clientLogo.onload = () => { clientLogoLoaded = true; };
        clientLogo.src = event.target.result;
    };
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0]);
});

function generateImage() {
    if (!clientLogoLoaded) { alert("Por favor, selecione o logo do cliente primeiro!"); return; }

    const bg   = backgrounds[selectedProduct];
    const logo = productLogos[selectedProduct];

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 1. Fundo
    if (bg.complete && bg.naturalWidth !== 0) {
        ctx.drawImage(bg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    } else {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }

    // 2. Calcular dimensões reais dos logos
    const ratioP = Math.min(MAX_PRODUCT_SIZE / logo.width,      MAX_PRODUCT_SIZE / logo.height);
    const pw = logo.width  * ratioP;
    const ph = logo.height * ratioP;

    const ratioC = Math.min(MAX_CLIENT_SIZE / clientLogo.width, MAX_CLIENT_SIZE / clientLogo.height);
    const cw = clientLogo.width  * ratioC;
    const ch = clientLogo.height * ratioC;

    // Altura total do bloco: logo produto + gap + linha(1px) + gap + logo cliente
    const blockHeight = ph + GAP_LINE + 1 + GAP_CLIENT + ch;

    // Ponto de início para centralizar verticalmente
    const startY = (CANVAS_SIZE - blockHeight) / 2;

    // 3. Logo do produto
    const logoY = startY;
    if (logo.complete && logo.naturalWidth !== 0) {
        ctx.drawImage(logo, (CANVAS_SIZE - pw) / 2, logoY, pw, ph);
    }

    // 4. Linha divisória
    const lineY = logoY + ph + GAP_LINE;
    ctx.beginPath();
    ctx.moveTo(150, lineY);
    ctx.lineTo(350, lineY);
    ctx.strokeStyle = "rgba(204, 204, 204, 0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 5. Logo do cliente
    const clientY = lineY + 1 + GAP_CLIENT;
    ctx.drawImage(clientLogo, (CANVAS_SIZE - cw) / 2, clientY, cw, ch);

    // 6. Download
    const link = document.getElementById("download");
    link.href     = canvas.toDataURL("image/png");
    link.download = `capa-whatsapp-${selectedProduct}.png`;
    link.style.display = "inline-block";
    link.innerText = "4. Baixar Capa de Grupo";
}
