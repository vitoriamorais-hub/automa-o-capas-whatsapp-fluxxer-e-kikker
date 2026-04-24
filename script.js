async function generateImage() {

    if (!clientLogoLoaded) {
        alert("Suba o logo do cliente primeiro.");
        return;
    }

    try {

        // carrega tudo corretamente
        const bg   = await loadImage(selectedProduct === "kikker" ? "background.png" : "background-fluxxer.png");
        const logo = await loadImage(selectedProduct === "kikker" ? "logo-kikker.png" : "logo-fluxxer.png");

        ctx.clearRect(0, 0, 500, 500);

        // ============================
        // BACKGROUND
        // ============================
        ctx.drawImage(bg, 0, 0, 500, 500);

        const centerX = 250;

        // ============================
        // TAMANHO PADRÃO
        // ============================
        const productHeight = 120;
        const clientHeight  = 90;

        const ratioP = productHeight / logo.height;
        const pw = logo.width * ratioP;
        const ph = productHeight;

        const ratioC = clientHeight / clientLogo.height;
        const cw = clientLogo.width * ratioC;
        const ch = clientHeight;

        // ============================
        // CENTRALIZAÇÃO
        // ============================
        const spacing = 40;

        const totalHeight = ph + spacing + ch;
        const startY = (500 - totalHeight) / 2;

        const productY = startY;
        const clientY  = productY + ph + spacing;
        const dividerY = productY + ph + (spacing / 2);

        // ============================
        // DESENHO
        // ============================
        ctx.drawImage(logo, centerX - pw / 2, productY, pw, ph);

        ctx.beginPath();
        ctx.moveTo(150, dividerY);
        ctx.lineTo(350, dividerY);
        ctx.strokeStyle = "rgba(200,200,200,0.6)";
        ctx.stroke();

        ctx.drawImage(clientLogo, centerX - cw / 2, clientY, cw, ch);

        // ============================
        // DOWNLOAD
        // ============================
        const link = document.getElementById("download");

        link.href = canvas.toDataURL("image/png");
        link.download = `capa-whatsapp-${selectedProduct}.png`;
        link.style.display = "inline-block";
        link.innerText = "4. Baixar Capa de Grupo";

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar imagens. Verifique os arquivos.");
    }
}
