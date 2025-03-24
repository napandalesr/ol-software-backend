# Usa la imagen oficial de Node.js como base
FROM node:18-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package.json package-lock.json ./

# Instala dependencias
RUN npm install --legacy-peer-deps

# Copia el resto de la aplicación
COPY . .

# Compila la aplicación
RUN npm run build

# Instala Prisma y genera el cliente
RUN npx prisma generate

# Usa una imagen más ligera para producción
FROM node:18-alpine

WORKDIR /app

# Copia solo lo necesario desde la fase de construcción
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# Expone el puerto de la aplicación
EXPOSE 5000

# Carga las variables de entorno en tiempo de ejecución
ENV DATABASE_URL=${DATABASE_URL}

# 🔥 Ejecutar migraciones y seeds al iniciar el contenedor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/prisma/seed -- all && node dist/src/main"]
