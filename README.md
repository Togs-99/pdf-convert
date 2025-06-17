# Conversor de PDF para Imagens

Este é um servidor Node.js que converte arquivos PDF em imagens JPEG. O servidor recebe uma URL de um PDF, baixa o arquivo e o converte em uma série de imagens usando o comando `pdftoppm`.

## Requisitos

- Node.js
- pdftoppm (parte do pacote poppler-utils)

## Instalação

1. Clone este repositório:
```bash
git clone [URL_DO_SEU_REPOSITÓRIO]
```

2. Instale as dependências:
```bash
npm install
```

3. Certifique-se de ter o pdftoppm instalado no seu sistema:
   - Windows: Instale o poppler-utils
   - Linux: `sudo apt-get install poppler-utils`
   - macOS: `brew install poppler`

## Uso

1. Inicie o servidor:
```bash
node index.js
```

2. O servidor estará rodando em `http://localhost:3001`

3. Para converter um PDF, envie uma requisição POST para `/convert` com o seguinte corpo:
```json
{
  "pdfUrl": "https://exemplo.com/arquivo.pdf"
}
```

4. A resposta incluirá URLs para as imagens geradas.

## Estrutura do Projeto

- `index.js`: Arquivo principal do servidor
- `temp/`: Diretório temporário para armazenar arquivos durante a conversão

## Licença

MIT 