# 🚀 OME Deployment Guide

## Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Quick Start
```bash
# Clone repository
cd Ome

# Install dependencies
npm run install-all

# Start development
npm run dev
```

Access the app at `http://localhost:5173`

---

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed

### Build and Run with Docker Compose

```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Stop services
docker-compose down
```

The app will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

### Build Individual Images

**Backend:**
```bash
docker build -t ome-backend ./server
docker run -p 5000:5000 ome-backend
```

**Frontend:**
```bash
docker build -t ome-frontend ./client
docker run -p 5173:5173 ome-frontend
```

---

## Cloud Deployment

### Heroku (Backend)

1. **Create Heroku app:**
```bash
heroku create ome-backend
```

2. **Set environment variables:**
```bash
heroku config:set CLIENT_URL=https://your-frontend.vercel.app
```

3. **Deploy:**
```bash
cd server
git push heroku main
```

4. **View logs:**
```bash
heroku logs --tail
```

### Vercel (Frontend)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import project on Vercel dashboard**

3. **Set environment variable:**
   - `VITE_SOCKET_URL` = Your Heroku backend URL

4. **Deploy** - Automatic on push

### DigitalOcean (Both)

1. **Create App Platform project**

2. **Connect GitHub repository**

3. **Configure services:**

**Backend Service:**
```yaml
name: ome-backend
github:
  branch: main
  repo: your-username/ome
build_command: npm install
run_command: npm start
envs:
  - key: PORT
    value: "5000"
  - key: CLIENT_URL
    value: https://ome.ondigitalocean.app
http_port: 5000
```

**Frontend Service:**
```yaml
name: ome-frontend
github:
  branch: main
  repo: your-username/ome
source_dir: client
build_command: npm install && npm run build
run_command: npm run preview
envs:
  - key: VITE_SOCKET_URL
    value: https://ome-backend.ondigitalocean.app
http_port: 5173
```

### Railway

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login and link project:**
```bash
railway login
railway link
```

3. **Deploy:**
```bash
railway up
```

4. **Set environment variables:**
```bash
railway variables set CLIENT_URL=https://your-frontend.com
```

### AWS (EC2)

1. **Launch EC2 instance** (Ubuntu 20.04 LTS)

2. **SSH into instance:**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install PM2:**
```bash
sudo npm install -g pm2
```

5. **Clone and setup:**
```bash
git clone https://github.com/your-repo/ome.git
cd ome
npm run install-all
```

6. **Start with PM2:**
```bash
pm2 start "npm run dev" --name "ome"
pm2 save
pm2 startup
```

7. **Setup Nginx reverse proxy:**
```bash
sudo apt-get install nginx
```

Create `/etc/nginx/sites-available/ome`:
```nginx
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:5173;
}

server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        proxy_pass http://frontend;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/ome /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. **Setup SSL with Let's Encrypt:**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS/SSL certificates
- [ ] Set secure CORS origins
- [ ] Enable rate limiting
- [ ] Add request logging
- [ ] Monitor server metrics
- [ ] Setup error tracking (Sentry)
- [ ] Configure database backups
- [ ] Setup CI/CD pipeline
- [ ] Add health checks
- [ ] Implement caching
- [ ] Setup CDN for static files

---

## Environment Variables

### Production Backend (.env)
```
PORT=5000
CLIENT_URL=https://your-frontend.com
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ome
REDIS_URL=redis://...
```

### Production Frontend (.env)
```
VITE_SOCKET_URL=https://your-backend.com
VITE_API_URL=https://your-backend.com/api
```

---

## Monitoring & Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 save
```

### CloudWatch (AWS)
- Monitor CPU, memory, disk usage
- Track error rates
- Setup alarms

### Sentry (Error Tracking)
```bash
npm install @sentry/node @sentry/tracing
```

In `server.js`:
```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## Performance Optimization

### Backend
- Enable gzip compression
- Implement rate limiting
- Add caching layer (Redis)
- Use connection pooling
- Monitor memory leaks

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle size analysis
- Service workers

### Network
- Use CDN for static files
- Enable HTTP/2
- Optimize asset delivery
- Reduce latency
- Monitor bandwidth

---

## Backup & Recovery

### Database Backups
```bash
# MongoDB
mongodump --uri mongodb+srv://user:pass@cluster.mongodb.net/ome --out backup/

# Restore
mongorestore --uri mongodb+srv://user:pass@cluster.mongodb.net/ome backup/
```

### Application Backups
```bash
# Automated daily backups
0 2 * * * tar -czf /backups/ome-$(date +\%Y\%m\%d).tar.gz /app
```

---

## Troubleshooting Deployments

### Cold Start Issues
- Pre-warm connections
- Optimize initialization
- Use connection pooling

### Memory Leaks
- Monitor heap size
- Profile application
- Check for circular references

### High Latency
- Check network conditions
- Enable compression
- Optimize database queries
- Use caching

### CORS Errors
- Verify origin headers
- Check allowed origins list
- Review CORS middleware configuration

---

## Scaling Strategy

### Horizontal Scaling
1. Use load balancer (nginx, AWS ELB)
2. Deploy multiple backend instances
3. Use sticky sessions for Socket.io
4. Implement Redis for session storage

### Vertical Scaling
1. Increase server resources
2. Optimize code for better performance
3. Enable clustering (Node.js cluster module)

### Database Scaling
1. Implement read replicas
2. Use sharding for large datasets
3. Optimize indexes
4. Archive old data

---

## Cost Optimization

- Use spot instances
- Schedule auto-scaling
- Optimize bandwidth usage
- Implement caching
- Use serverless where possible

---

**Ready to deploy? Choose your platform and follow the steps above! 🚀**
