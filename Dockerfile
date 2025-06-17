# Usando Node.js 18 como imagem base (certifique-se de que é uma versão compatível)
FROM node:18

# Instalando o Poppler (necessário para o pdftoppm)
# Usamos 'apt-get' porque a imagem 'node:18' é baseada em Debian/Ubuntu
RUN apt-get update && apt-get install -y \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Criando o diretório de trabalho dentro do container
WORKDIR /app

# Copiando os arquivos de dependência do projeto para o container
# Isso é feito primeiro para aproveitar o cache do Docker (se as dependências não mudarem)
COPY package.json package-lock.json ./

# Instalando as dependências do Node.js
RUN npm install

# Copiando todo o código fonte da sua aplicação para o diretório de trabalho
COPY . .

# Criando o diretório 'temp' que o seu programa usa para arquivos temporários
RUN mkdir temp

# Expondo a porta 3001, que é onde seu servidor Express irá rodar
EXPOSE 3001

# Comando para iniciar a aplicação quando o container for iniciado
CMD ["npm", "start"] 