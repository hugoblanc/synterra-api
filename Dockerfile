FROM node:10 AS builder
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:10-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["node", "dist/main.js"]
