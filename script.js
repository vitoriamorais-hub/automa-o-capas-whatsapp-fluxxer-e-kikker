function generateImage() {

    if (!clientLogoLoaded) {
        alert("Por favor, selecione o logo do cliente primeiro!");
        return;
    }

    const bg   = backgrounds[selectedProduct];
    const logo = productLogos[selectedProduct];

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
    // CALCULAR TAMANHOS
    // ============================

    // PRODUTO
    const ratioP = Math.min(
        MAX_PRODUCT_SIZE / logo.width,
        MAX_PRODUCT_SIZE / logo.height
    );
    const pw = logo.width * ratioP;
    const ph = logo.height * ratioP;

    // CLIENTE
    const ratioC = Math.min(
        MAX_CLIENT_SIZE / clientLogo.width,
        MAX_CLIENT_SIZE / clientLogo.height
    );
    const cw = clientLogo.width * ratioC;
    const ch = clientLogo.height * ratioC;

    // ============================
    // ESPAÇAMENTOS
    // ============================
    const spacing = 25;   // espaço entre logo e linha
    const spacing2 = 25;  // espaço entre linha e cliente

    // altura total do bloco
    const totalHeight = ph + spacing + 2 + spacing2 + ch;

    // ponto inicial (centralizado verticalmente)
    const startY = (500 - totalHeight) / 2;

    // posições finais
    const productY = startY;
    const dividerY = productY + ph + spacing;
    const clientY  = dividerY + spacing2;

    // ============================
    // DESENHAR PRODUTO
    // ============================
    ctx.drawImage(logo, centerX - pw / 2, productY, pw, ph);

    // ============================
    // LINHA
    // ============================
    ctx.beginPath();
    ctx.moveTo(120, dividerY);
    ctx.lineTo(380, dividerY);
    ctx.strokeStyle = "rgba(204, 204, 204, 0.6)";
    ctx.lineWidth = 1.5;
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
