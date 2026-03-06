document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const generateBtn = document.getElementById('generateBtn');
    const qrcodeContainer = document.getElementById('qrcode');
    const downloadBtn = document.getElementById('downloadBtn');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    let history = JSON.parse(localStorage.getItem('qrHistory')) || [];

    // Inicializa o histórico na tela
    renderHistory();

    // Evento de clique para gerar
    generateBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (!url) {
            alert("Por favor, insira uma URL válida.");
            return;
        }
        processQRCode(url);
    });

    // Função principal de processamento
    function processQRCode(url) {
        generateQR(url);
        saveToHistory(url);
    }

    function generateQR(url) {
        // Limpa o container
        qrcodeContainer.innerHTML = "";
        
        // Gera o QR Code usando a biblioteca externa
        new QRCode(qrcodeContainer, {
            text: url,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        // Mostra o botão de download
        setTimeout(() => {
            downloadBtn.style.display = "block";
        }, 150);
    }

    function saveToHistory(url) {
        // Remove se já existir para colocar no topo
        history = history.filter(item => item !== url);
        history.unshift(url);
        
        // Limita a 10 itens
        if (history.length > 10) history.pop();
        
        localStorage.setItem('qrHistory', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = "";
        history.forEach(url => {
            const li = document.createElement('li');
            li.textContent = url;
            li.title = "Clique para gerar novamente";
            li.addEventListener('click', () => {
                urlInput.value = url;
                generateQR(url);
            });
            historyList.appendChild(li);
        });
    }

    // Lógica de Download
    downloadBtn.addEventListener('click', () => {
        const canvas = qrcodeContainer.querySelector('canvas');
        if (canvas) {
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = 'qrcode-gerado.png';
            link.click();
        }
    });

    // Limpar Histórico
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm("Deseja apagar todo o histórico?")) {
            history = [];
            localStorage.removeItem('qrHistory');
            renderHistory();
            qrcodeContainer.innerHTML = "";
            downloadBtn.style.display = "none";
            urlInput.value = "";
        }
    });
});