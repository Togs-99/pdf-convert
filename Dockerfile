# Usando Node.js 18 como imagem base (certifique-se de que é uma versão compatível)
FROM node:18

# Instalando poppler-utils para o comando pdftoppm
RUN apt-get update && apt-get install -y \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Criando diretório da aplicação
WORKDIR /app

# Copiando package.json e package-lock.json
COPY package*.json ./

# Instalando dependências
RUN npm install

# Copiando o resto do código
COPY . .

# Criando diretório temp
RUN mkdir -p temp

# Expondo a porta
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["node", "index.js"] 