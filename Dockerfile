FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN ls

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY .sequelizerc ./
COPY migrations/ ./migrations/
COPY src/config/sequelize-cli.js ./src/config/sequelize-cli.js
RUN npm install --only=production

# Copy compiled output and necessary files
COPY --from=builder /app/dist ./dist

# Use environment variables from outside
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/server.js"]
