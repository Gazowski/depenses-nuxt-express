# Étape de production (production)
FROM node:20-alpine AS production 
WORKDIR /app

# Copier le dossier .output depuis le contexte local
COPY .output ./output
COPY package*.json ./
RUN npm ci --omit=dev --production 
# Important : Installer les dépendances dans l'image de production
COPY node_modules ./node_modules
ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["node", "output/server/index.mjs"] 