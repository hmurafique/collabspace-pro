FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production --legacy-peer-deps
COPY . .
CMD ["node","src/worker.js"]
