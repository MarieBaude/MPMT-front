FROM node:18 as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

# Supprime la configuration par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copie la configuration perso et les fichiers buildés
COPY --from=build-stage /app/dist/MPMT/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]