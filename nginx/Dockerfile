# Build the React app, then serve it from Nginx together with the load balancer rules.
# The build context is the repository root, because this image needs the Frontend folder.

FROM node:22-alpine AS frontend
WORKDIR /build
COPY Frontend/package*.json ./
RUN npm ci
COPY Frontend/ ./
# The API is on the same address as the page (Nginx serves both), so requests use relative URLs.
ENV VITE_API_URL=""
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend /build/dist /usr/share/nginx/html
