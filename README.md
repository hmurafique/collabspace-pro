# CollabSpace Pro — Full DevOps-Ready Multi-Service Application

**CollabSpace Pro** is a realistic Full-Stack Multi-Service Application scaffold used for end-to-end DevOps practice:
- Developer writes only code (backend/frontend/realtime/worker/db-init)
- DevOps packages services into Docker containers, orchestrates with Docker Compose, and deploys to EC2
- Two deployment flavors:
  - Version 1: Without Domain (IP & Ports)
  - Version 2: With Domain + SSL (two options: host nginx + certbot, or containerized nginx + certbot)

---

## Repository Structure
```
collabspace-pro/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── app.js
│   │   └── routes/
│   │       └── api.js
│   └── .env.example
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       └── App.jsx
├── realtime/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── server.js
├── worker/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── worker.js
├── db/
│   ├── init.sql
│   └── Dockerfile
├── nginx/
│   ├── nginx.conf                 # for containerized nginx (Option B)
│   └── Dockerfile
├── docker-compose.yml             # default (without domain)
├── docker-compose.prod.yml        # containerized nginx + certbot (Option B)
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml             # GitHub Actions CI/CD
└── README.md                      # full step-by-step (below)
```

---

## Quick Start (DevOps)
## Prerequisites
- Ubuntu EC2 instance (or any VM)
- Docker & Docker Compose installed
- GitHub repo with code
- SSH key set up in GitHub Actions secrets
- Ports 80 & 443 open (for Domain/SSL)

---

## Setup Steps (step-by-step)

## 1. **On your Server**
   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose
   sudo usermod -aG docker $USER
   mkdir -p home/ubuntu/deployment/collabspace-pro
```
---

## 2. **Create backend env file (server-side)**
   ```bash
   touch home/ubuntu/deployment/collabspace-pro/backend/.env.local
   MONGO_URI=mongodb://mongo:27017/collabspace
   JWT_SECRET=super-secret
   PORT=5000
```
---

## 3. **Creating Dockerfiles and docker-compose.yml files**

## 4. **Start without Domain**
   ```bash
   cd home/ubuntu/deployment/collabspace-pro
   docker compose -f docker-compose.yml up -d --build
```
---

## 5. **With Domain + SSL — Option A (host nginx + certbot, recommended)**
   - Configure DNS A record: your.domain.com -> <SERVER_IP>
   - Install nginx & certbot:
   - sudo apt install -y nginx certbot python3-certbot-nginx
   - sudo certbot --nginx -d your.domain.com -m you@example.com --non-interactive --agree-tos
   - Keep docker-compose.yml running. Nginx will proxy to container ports

*Explain*
*On the EC2 host*
*Install nginx + certbot*
   - sudo apt update
   - sudo apt install -y nginx certbot python3-certbot-nginx

*Nginx site config (replace your.domain.com)*
   - sudo tee /etc/nginx/sites-available/collabspace <<'NGINX'
server {
    listen 80;
    server_name your.domain.com;

    location /api/ { proxy_pass http://127.0.0.1:5000/; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; }
    location /socket.io/ { proxy_pass http://127.0.0.1:6000/; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; }
    location / { proxy_pass http://127.0.0.1:3000/; }
}
NGINX
   - sudo ln -sf /etc/nginx/sites-available/collabspace /etc/nginx/sites-enabled/
   - sudo nginx -t && sudo systemctl reload nginx

*Obtain cert*
   - sudo certbot --nginx -d your.domain.com --non-interactive --agree-tos -m you@example.com

---

## 6. **With Domain + SSL — Option B (containerized nginx + certbot)**
   - Use docker-compose.prod.yml which includes nginx and certbot
   - First time: request certs:
   - docker compose -f docker-compose.prod.yml up -d --build
   - docker-compose run --rm certbot certonly --webroot -w /var/www/certbot -d your.domain.com --email you@example.com --agree-tos --no-eff-email
   - docker compose -f docker-compose.prod.yml restart nginx

---

## 7. **CI/CD (GitHub Actions)**
## Add Secrets:
   - SSH_PRIVATE_KEY (private key)
   - SSH_USER (e.g., ubuntu)
   - SSH_HOST (server IP)
   - SERVER_APP_DIR (e.g., /home/ubuntu/deployment/collabspace-pro)
   - optional: BACKEND_ENV, DOMAIN_NAME, ADMIN_EMAIL
   - Push to main — workflow will build/pack & deploy.

---

