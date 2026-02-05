FROM node:18-alpine

WORKDIR /app

# Install dependencies first (cache)
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy source
COPY . .

# Build
RUN npm run build || true

EXPOSE 3000

# By default run dev for mounted volumes (docker-compose overrides command)
CMD ["sh", "-c", "npm run start:prod"]
