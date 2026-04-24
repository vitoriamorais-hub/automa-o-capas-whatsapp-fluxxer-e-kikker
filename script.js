function generateImage() {

    if (!clientLogoLoaded) {
        alert("Por favor, selecione o logo do cliente primeiro!");
        return;
    }

    const bg = backgrounds[selectedProduct];
    const logo = productLogos[selectedProduct];

    ctx.clearRect(0, 0, 500, 500);

    // Fundo
    ctx.drawImage(bg, 0, 0, 500, 500);

    const centerX = 250;

    // ========================
    // TAMANHOS MAIORES
    // ========================
    const productHeight = 140; // maior destaque
    const clientHeight = 100;

    const ratioP = productHeight / logo.height;
    const pw = logo.width * ratioP;
    const ph = productHeight;

    const ratioC = clientHeight / clientLogo.height;
    const cw = clientLogo.width * ratioC;
    const ch = clientHeight;

    // ========================
    // CENTRALIZADO
    // ========================
    const spacing = 35;

    const totalHeight = ph + spacing + ch;
    const startY = (500 - totalHeight) / 2;

    const productY = startY;
    const dividerY = productY + ph + (spacing / 2);
    const clientY = productY + ph + spacing;

    // Produto
    ctx.drawImage(logo, centerX - pw / 2, productY, pw, ph);

    // Linha
    ctx.beginPath();
    ctx.moveTo(150, dividerY);
    ctx.lineTo(350, dividerY);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Cliente
    ctx.drawImage(clientLogo, centerX - cw / 2, clientY, cw, ch);

    // Download
    const link = document.getElementById("download");
    link.href = canvas.toDataURL("image/png");
    link.download = `capa-whatsapp-${selectedProduct}.png`;
    link.style.display = "inline-block";
    link.innerText = "4. Baixar Capa de Grupo";
}
