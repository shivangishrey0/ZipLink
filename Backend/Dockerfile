FROM node:22-alpine
WORKDIR /app

# Dependencies first, so this layer is reused until package.json changes.
COPY package*.json ./
RUN npm ci --omit=dev

COPY app.js ./
COPY src ./src

# Do not run as root inside the container.
USER node
EXPOSE 5000

# Run node directly (not through npm) so docker stop's SIGTERM reaches the app,
# which then writes the clicks still waiting in Redis before it exits.
CMD ["node", "app.js"]
