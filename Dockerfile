
# Imagen base oficial de Node
FROM node:20-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias y código
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Construir el frontend
RUN npm run build

# Imagen final para servir archivos estáticos
FROM node:20-alpine AS production
WORKDIR /app
RUN npm install -g http-server
COPY --from=build /app/dist ./dist

# Puerto para servir la app
EXPOSE 8080

# Comando para servir archivos estáticos
CMD ["http-server", "dist", "-p", "8080"]
