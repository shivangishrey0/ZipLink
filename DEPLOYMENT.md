# Deployment notes

The Docker Compose file in this project is made for running everything on your own computer. It uses plain http, addresses on localhost, and databases without passwords. These notes list what to change before you run ZipLink for other people. Nothing here has been tried on a real server, so treat it as a checklist, not a recipe.

## Before you go live

1. Use HTTPS. Put a TLS certificate in front of Nginx (a cloud load balancer, Caddy, or certificates on Nginx itself). Logins use a cookie, and over plain http the cookie can be read on the network.
2. Set `NODE_ENV=production` for the backend. This makes the login cookie Secure, so browsers send it only over HTTPS. Do this only after HTTPS works, or logins will stop working. In `docker-compose.yml`, add it under `environment` in the `x-app` block.
3. Use your own domain in the three address settings in `docker-compose.yml`:
   - `APP_URL` and `FRONTEND_URL`: for example `https://links.example.com`
   - `GOOGLE_CALLBACK_URL`: for example `https://links.example.com/api/auth/google/callback`
4. If you use Google sign-in, add that callback address under authorized redirect URIs in Google Cloud Console, and move the consent screen out of testing mode when you want anyone to sign in.
5. Set `TRUST_PROXY` to the number of proxies in front of the backend. Nginx alone is 1. If a cloud load balancer sits in front of Nginx, it is 2. A wrong number makes the rate limits count the wrong address. Too high a number lets visitors fake their address.
6. Publish only what is needed. The compose file publishes only Nginx (port 8080 on the host). Keep MongoDB and Redis off public networks.

## Secrets

- Generate a new `JWT_SECRET` for each environment. Never reuse the one from your own computer. Changing it logs everyone out.
- Do not copy a `.env` file to a server by committing it. Use the secret store of your hosting platform, or create the file on the server by hand.
- The compose file reads `Backend/.env` when containers start. Secrets are not baked into any image.
- Keep the Google client secret out of the frontend and out of Git. If it leaks, create a new one in Google Cloud Console.

## Databases

- The MongoDB container has no username or password and no backups. For real use, prefer a managed MongoDB service (Atlas, for example) or a replica set with authentication, and set `MONGO_URI` to it.
- Redis keeps its data on a volume with append-only saving, so queued clicks survive a Redis restart. It has no password. If you use an external Redis, use one with a password and put it in `REDIS_URL`.
- Back up the MongoDB data. `docker compose down -v` deletes the volumes and everything in them.

## Scaling and reliability

- To add a backend copy, add another service like `app3` in `docker-compose.yml` and another `server` line in `nginx/nginx.conf`, then rebuild with `docker compose up -d --build`.
- Redis, Nginx and MongoDB are each a single instance, so each is a single point of failure. See the README for what stops working in each case. The usual fixes are Redis replicas with Sentinel, more than one Nginx behind a cloud load balancer, and a MongoDB replica set.
- There is no health check endpoint. Nginx only notices a broken copy when a request to it fails, then skips it for 10 seconds.
- Always stop with `docker compose stop` or `docker stop`, so each copy gets time to save queued clicks. The compose file gives each copy 15 seconds. Killing a container loses the clicks it was holding, up to 500.
- Short codes, Nginx and the React routes must agree. The names `api`, `login`, `register`, `urls`, `analytics`, `auth`, `expired`, `not-active`, `protected` and `assets` are reserved in `Backend/src/Utils/validateSlug.js`. The page names among them (all except `api` and `assets`) are also listed in the page rule in `nginx/nginx.conf` and are routes in `Frontend/src/routing/index.jsx`. If you add a page, add its name in all three places.

## Different domains for the app and the API

ZipLink is designed to run on one address, with Nginx serving both the React app and the API. The login cookie is `SameSite=Lax`, which works for that. If you host the React app and the API on different sites, browsers will not send the cookie. You would need `SameSite=None` together with `Secure`, which is a code change in `Backend/src/controller/auth.controller.js`, and you would set `VITE_API_URL` when building the frontend. This setup has not been tried.

## Images and dependencies

- The images use `node:22-alpine`, `nginx:1.27-alpine`, `mongo:7` and `redis:7-alpine`. Pin and update them on purpose.
- `npm audit` reports 3 high severity advisories in `Backend`. All three come from `nodemon` (through `chokidar` and `braces`), a tool that restarts the server while you develop. It is listed under `dependencies` in `Backend/package.json`, so it is also installed into the Docker image, although the image runs `node app.js` and never starts it. A sensible fix is to move `nodemon` to `devDependencies` and install production dependencies only. This has not been done. `Frontend` reports no advisories. Run `npm audit` again before you deploy.
- Run the testing checklist from the README against the deployed address, including a real Google sign-in, before you tell anyone the link.
