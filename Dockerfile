# Build Backend
FROM node:lts-alpine as backend-builder
WORKDIR /app
COPY ./back-end/package*.json ./
RUN npm install
COPY ./back-end/ ./
RUN npm run build

# Build Frontend
FROM node:lts-alpine as frontend-builder
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/ ./
RUN npm run build

# Backend Image
FROM node:lts-alpine as backend
WORKDIR /app
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/node_modules ./node_modules
CMD ["node", "dist/App.js"]

# Frontend Image
FROM nginx:alpine as frontend
COPY --from=frontend-builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
