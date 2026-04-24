function generateImage() {

    const bg   = backgrounds[selectedProduct];
    const logo = productLogos[selectedProduct];

    ctx.clearRect(0, 0, 500, 500);

    // ============================
    // BACKGROUND
    // ============================
    if (bg && bg.complete && bg.naturalWidth !== 0) {
        ctx.drawImage(bg, 0, 0, 500, 500);
    } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 500, 500);
    }

    const centerX = 250;

    // ============================
    // TAMANHO PRODUTO (SEGURO)
    // ============================
    let pw = 200;
    let ph = 100;

    if (logo && logo.complete && logo.naturalWidth !== 0) {
        const ratioP = 120 / logo.naturalHeight;
        pw = logo.naturalWidth * ratioP;
        ph = 120;
    }

    // ============================
    // TAMANHO CLIENTE (SEGURO)
    // ============================
    let cw = 150;
    let ch = 80;

    if (clientLogo && clientLogo.complete && clientLogo.naturalWidth !== 0) {
        const ratioC = 90 / clientLogo.naturalHeight;
        cw = clientLogo.naturalWidth * ratioC;
        ch = 90;
    }

    // ============================
    // CENTRALIZAÇÃO REAL
    // ============================
    const spacing = 40;

    const totalHeight = ph + spacing + ch;
    const startY = (500 - totalHeight) / 2;

    const productY = startY;
    const clientY  = productY + ph + spacing;
    const dividerY = productY + ph + (spacing / 2);

    // ============================
    // DESENHAR PRODUTO
    // ============================
    if (logo && logo.complete) {
        ctx.drawImage(logo, centerX - pw / 2, productY, pw, ph);
    }

    // ============================
    // LINHA
    // ============================
    ctx.beginPath();
    ctx.moveTo(150, dividerY);
    ctx.lineTo(350, dividerY);
    ctx.strokeStyle = "rgba(200,200,200,0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // ============================
    // DESENHAR CLIENTE
    // ============================
    if (clientLogo && clientLogo.complete) {
        ctx.drawImage(clientLogo, centerX - cw / 2, clientY, cw, ch);
    }

    // ============================
    // DOWNLOAD
    // ============================
    const link = document.getElementById("download");

    link.href = canvas.toDataURL("image/png");
    link.download = `capa-whatsapp-${selectedProduct}.png`;
    link.style.display = "inline-block";
    link.innerText = "4. Baixar Capa de Grupo";
}
