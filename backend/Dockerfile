FROM node:24-alpine

WORKDIR /app

# Copy dependency manifests first (better Docker layer caching —
# npm install only re-runs when package.json actually changes)
COPY package*.json ./
RUN npm install

# Now copy the rest of the source code
COPY . .

EXPOSE 4000

CMD ["node", "index.js"]