FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3002

RUN ls -la dist/main.js || echo "¡ALERTA: No se encontró el archivo main.js!"

CMD ["npm", "run", "start:prod"]