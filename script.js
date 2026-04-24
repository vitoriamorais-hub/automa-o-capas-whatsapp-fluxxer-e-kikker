const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let selectedProduct = "kikker";

function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

const backgrounds = {
    kikker: loadImage("background.png"),
    fluxxer: loadImage("background-fluxxer.png")
};

const productLogos = {
    kikker: loadImage("logo-kikker.png"),
    fluxxer: loadImage("logo-fluxxer.png")
};

let clientLogo = new Image();
let clientLogoLoaded = false;

function selectProduct(product) {
    selectedProduct = product;

    document.getElementById("btn-kikker").classList.toggle("active", product === "kikker");
    document.getElementById("btn-fluxxer").classList.toggle("active", product === "fluxxer");
}

document.getElementById("upload").addEventListener("change", function(e){

    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(event){
        clientLogo = new Image();

        clientLogo.onload = function(){
            clientLogoLoaded = true;
        }

        clientLogo.src = event.target.result;
    }

    reader.readAsDataURL(file);
});

function generateImage(){

    if(!clientLogoLoaded){
        alert("Suba o logo do cliente.");
        return;
    }

    const bg = backgrounds[selectedProduct];
    const logo = productLogos[selectedProduct];

    ctx.clearRect(0,0,500,500);

    ctx.drawImage(bg,0,0,500,500);

    const centerX = 250;

    const productHeight = 140;
    const clientHeight = 100;

    const ratioP = productHeight / logo.height;
    const pw = logo.width * ratioP;
    const ph = productHeight;

    const ratioC = clientHeight / clientLogo.height;
    const cw = clientLogo.width * ratioC;
    const ch = clientHeight;

    const spacing = 35;

    const totalHeight = ph + spacing + ch;
    const startY = (500 - totalHeight) / 2;

    const productY = startY;
    const dividerY = productY + ph + (spacing/2);
    const clientY = productY + ph + spacing;

    ctx.drawImage(logo, centerX - pw/2, productY, pw, ph);

    ctx.beginPath();
    ctx.moveTo(150, dividerY);
    ctx.lineTo(350, dividerY);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.stroke();

    ctx.drawImage(clientLogo, centerX - cw/2, clientY, cw, ch);

    const link = document.getElementById("download");

    link.href = canvas.toDataURL("image/png");
    link.download = `capa-whatsapp-${selectedProduct}.png`;
    link.style.display = "inline-block";
    link.innerText = "4. Baixar Capa";
}
