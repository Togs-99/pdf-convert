// Importando as bibliotecas necessárias
const express = require('express');
const axios = require('axios');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const path = require('path');

// Criando o servidor Express
const app = express();
app.use(express.json());

// Configurando o servidor para servir arquivos estáticos da pasta temp
app.use('/temp', express.static(path.join(__dirname, 'temp')));

// Função para limpar arquivos temporários
async function cleanupTempFiles(tempDir) {
    try {
        await fs.remove(tempDir);
    } catch (error) {
        console.error('Erro ao limpar arquivos temporários:', error);
    }
}

// Função para executar o comando pdftoppm
function convertPdfToImages(pdfPath, outputDir) {
    return new Promise((resolve, reject) => {
        const command = `pdftoppm -jpeg "${pdfPath}" "${path.join(outputDir, 'output')}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

// Rota principal para conversão de PDF
app.post('/convert', async (req, res) => {
    // Criando um ID único para esta conversão
    const uniqueId = uuidv4();
    const tempDir = path.join(__dirname, 'temp', uniqueId);
    const pdfPath = path.join(tempDir, 'input.pdf');

    try {
        // Verificando se a URL do PDF foi fornecida
        const { pdfUrl } = req.body;
        if (!pdfUrl) {
            throw new Error('URL do PDF não fornecida');
        }

        // Criando diretório temporário
        await fs.ensureDir(tempDir);

        // Baixando o PDF
        console.log('Baixando PDF...');
        const response = await axios({
            method: 'GET',
            url: pdfUrl,
            responseType: 'arraybuffer'
        });

        // Salvando o PDF
        await fs.writeFile(pdfPath, response.data);

        // Convertendo PDF para imagens
        console.log('Convertendo PDF para imagens...');
        await convertPdfToImages(pdfPath, tempDir);

        // Listando as imagens geradas
        const files = await fs.readdir(tempDir);
        const images = files
            .filter(file => file.startsWith('output-') && file.endsWith('.jpg'))
            .map(file => {
                const imagePath = `temp/${uniqueId}/${file}`;
                // Criando URLs completas para as imagens
                const imageUrl = `http://localhost:${PORT}/${imagePath}`;
                return {
                    path: imagePath,
                    url: imageUrl
                };
            });

        // Respondendo com sucesso
        res.json({
            success: true,
            images: images
        });

    } catch (error) {
        console.error('Erro durante a conversão:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    } finally {
        // Limpando arquivos temporários após 5 minutos
        setTimeout(() => cleanupTempFiles(tempDir), 5 * 60 * 1000);
    }
});

// Iniciando o servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Para converter um PDF, envie uma requisição POST para http://localhost:${PORT}/convert`);
    console.log('Exemplo de corpo da requisição:');
    console.log('{');
    console.log('  "pdfUrl": "https://exemplo.com/arquivo.pdf"');
    console.log('}');
}); 