# SOC Simulation - Deployment Guide

A comprehensive guide for deploying the SOC (Security Operations Center) Simulation application to a production environment.

---

## Table of Contents

1. [Server Requirements](#server-requirements)
2. [Prerequisites](#prerequisites)
3. [Deployment Steps](#deployment-steps)
4. [PM2 Configuration](#pm2-configuration)
5. [Nginx Configuration](#nginx-configuration)
6. [Database Backup Strategy](#database-backup-strategy)
7. [Monitoring & Logs](#monitoring--logs)
8. [Troubleshooting Common Issues](#troubleshooting-common-issues)

---

## Server Requirements

### Minimum Requirements

| Resource    | Minimum   | Recommended |
| ----------- | --------- | ----------- |
| **CPU**     | 2 cores   | 4+ cores    |
| **RAM**     | 4 GB      | 8+ GB       |
| **Storage** | 20 GB SSD | 50+ GB SSD  |
| **Network** | 100 Mbps  | 1 Gbps      |

### Supported Operating Systems

- **Ubuntu** 20.04 LTS / 22.04 LTS (Recommended)
- **Debian** 11 / 12
- **CentOS** 8 / Rocky Linux 8+
- **Amazon Linux** 2

### Network Requirements

- Open ports: 80 (HTTP), 443 (HTTPS), 22 (SSH)
- Internal port 5001 for the application (behind reverse proxy)
- WebSocket support enabled

---

## Prerequisites

### 1. Node.js (v18.x LTS or higher)

```bash
# Install Node.js using NodeSource repository (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. MongoDB (v6.x or higher)

```bash
# Import MongoDB GPG key
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

# Add MongoDB repository (Ubuntu 22.04)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### 3. Nginx

```bash
# Install nginx
sudo apt-get install -y nginx

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify nginx is running
sudo systemctl status nginx
```

### 4. PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### 5. Git

```bash
# Install Git
sudo apt-get install -y git

# Verify installation
git --version
```

### 6. Certbot (Let's Encrypt)

```bash
# Install Certbot and nginx plugin
sudo apt-get install -y certbot python3-certbot-nginx
```

---

## Deployment Steps

### Step 1: Clone Repository

```bash
# Create application directory
sudo mkdir -p /var/www
cd /var/www

# Clone the repository
sudo git clone https://github.com/your-username/soc-simulation.git
cd soc-simulation

# Set ownership (replace 'deploy' with your deployment user)
sudo chown -R deploy:deploy /var/www/soc-simulation
```

### Step 2: Install Dependencies

```bash
cd /var/www/soc-simulation

# Install production dependencies
npm ci --production

# Or for all dependencies (if building frontend)
npm ci
```

### Step 3: Configure Environment Variables

Create the production environment file:

```bash
# Create .env.production file
sudo nano /var/www/soc-simulation/.env.production
```

Add the following configuration:

```env
# Server Configuration
NODE_ENV=production
PORT=5001
HOST=0.0.0.0

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/soc_simulation
MONGODB_DB_NAME=soc_simulation

# WebSocket Configuration
WS_HEARTBEAT_INTERVAL=30000
WS_MAX_CONNECTIONS=1000

# Security
JWT_SECRET=your-super-secure-jwt-secret-change-this
SESSION_SECRET=your-session-secret-change-this
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=/var/log/soc-simulation/app.log

# Incident Generation (for simulation)
INCIDENT_GENERATION_INTERVAL=5000
MAX_INCIDENTS_STORED=10000
```

Create the log directory:

```bash
sudo mkdir -p /var/log/soc-simulation
sudo chown -R deploy:deploy /var/log/soc-simulation
```

### Step 4: Setup MongoDB

```bash
# Connect to MongoDB shell
mongosh

# Create database and user
use soc_simulation

db.createUser({
  user: "soc_admin",
  pwd: "your-secure-password",
  roles: [
    { role: "readWrite", db: "soc_simulation" },
    { role: "dbAdmin", db: "soc_simulation" }
  ]
})

# Create indexes for better performance
db.incidents.createIndex({ "timestamp": -1 })
db.incidents.createIndex({ "severity": 1 })
db.incidents.createIndex({ "status": 1 })
db.incidents.createIndex({ "sourceIP": 1 })

# Exit MongoDB shell
exit
```

Update MongoDB connection string in `.env.production`:

```env
MONGODB_URI=mongodb://soc_admin:your-secure-password@localhost:27017/soc_simulation?authSource=soc_simulation
```

Enable MongoDB authentication:

```bash
# Edit MongoDB configuration
sudo nano /etc/mongod.conf
```

Add/modify the security section:

```yaml
security:
  authorization: enabled
```

Restart MongoDB:

```bash
sudo systemctl restart mongod
```

### Step 5: Build Frontend

```bash
cd /var/www/soc-simulation

# Install build dependencies if not already installed
npm ci

# Build the frontend for production
npm run build

# Verify build output
ls -la dist/
```

### Step 6: Setup PM2 for Backend

Create the PM2 ecosystem file (see [PM2 Configuration](#pm2-configuration) section below):

```bash
nano /var/www/soc-simulation/ecosystem.config.js
```

Start the application with PM2:

```bash
cd /var/www/soc-simulation

# Start the application
pm2 start ecosystem.config.js --env production

# Save the PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd
# Follow the instructions provided by the command above

# Verify application is running
pm2 status
pm2 logs soc-simulation
```

### Step 7: Configure Nginx Reverse Proxy

Create the nginx configuration (see [Nginx Configuration](#nginx-configuration) section below):

```bash
# Create nginx site configuration
sudo nano /etc/nginx/sites-available/soc-simulation
```

Enable the site:

```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/soc-simulation /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 8: Setup SSL with Let's Encrypt

```bash
# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter email address for renewal notices
# - Agree to terms of service
# - Choose whether to redirect HTTP to HTTPS (recommended: yes)

# Verify automatic renewal is configured
sudo systemctl status certbot.timer

# Test renewal process
sudo certbot renew --dry-run
```

---

## PM2 Configuration

Create `ecosystem.config.js` in the project root:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      // Application name
      name: "soc-simulation",

      // Entry point
      script: "server.js",

      // Working directory
      cwd: "/var/www/soc-simulation",

      // Number of instances (0 = max CPUs)
      instances: "max",

      // Cluster mode for load balancing
      exec_mode: "cluster",

      // Watch for file changes (disable in production)
      watch: false,

      // Max memory before restart
      max_memory_restart: "1G",

      // Environment variables
      env: {
        NODE_ENV: "development",
        PORT: 5001,
      },

      // Production environment variables
      env_production: {
        NODE_ENV: "production",
        PORT: 5001,
      },

      // Logging configuration
      log_file: "/var/log/soc-simulation/combined.log",
      out_file: "/var/log/soc-simulation/out.log",
      error_file: "/var/log/soc-simulation/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // Merge logs from all instances
      merge_logs: true,

      // Restart configuration
      autorestart: true,
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: "10s",

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,

      // Source maps support
      source_map_support: true,

      // Exponential backoff restart delay
      exp_backoff_restart_delay: 100,
    },
  ],

  // Deployment configuration (optional)
  deploy: {
    production: {
      // SSH user
      user: "deploy",

      // Server host
      host: ["your-server-ip"],

      // SSH port
      port: "22",

      // Git reference
      ref: "origin/main",

      // Git repository
      repo: "git@github.com:your-username/soc-simulation.git",

      // Deployment path
      path: "/var/www/soc-simulation",

      // Pre-setup commands
      "pre-setup": 'echo "Running pre-setup"',

      // Post-setup commands
      "post-setup": "npm ci --production",

      // Pre-deploy commands (local)
      "pre-deploy-local": 'echo "Deploying to production"',

      // Post-deploy commands (remote)
      "post-deploy":
        "npm ci --production && pm2 reload ecosystem.config.js --env production",

      // Environment variables
      env: {
        NODE_ENV: "production",
      },
    },
  },
};
```

### PM2 Commands Reference

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Restart application
pm2 restart soc-simulation

# Reload with zero downtime
pm2 reload soc-simulation

# Stop application
pm2 stop soc-simulation

# Delete from PM2
pm2 delete soc-simulation

# View status
pm2 status

# View logs
pm2 logs soc-simulation
pm2 logs soc-simulation --lines 100

# Monitor in real-time
pm2 monit

# Flush logs
pm2 flush

# Save process list
pm2 save

# Resurrect saved processes
pm2 resurrect
```

---

## Nginx Configuration

Create `/etc/nginx/sites-available/soc-simulation`:

```nginx
# /etc/nginx/sites-available/soc-simulation

# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

# Upstream for Node.js backend
upstream soc_backend {
    # Use IP hash for sticky sessions (important for WebSocket)
    ip_hash;

    server 127.0.0.1:5001;

    # Health check settings
    keepalive 64;
}

# HTTP - Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;

    server_name yourdomain.com www.yourdomain.com;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS - Main server block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS (comment out if testing)
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Root directory for static files
    root /var/www/soc-simulation/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # Connection limits
    limit_conn conn_limit 20;

    # Static files - React app
    location / {
        try_files $uri $uri/ /index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API endpoints
    location /api/ {
        # Rate limiting
        limit_req zone=api_limit burst=20 nodelay;

        # Proxy settings
        proxy_pass http://soc_backend;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }

    # WebSocket endpoint for Socket.IO
    location /socket.io/ {
        proxy_pass http://soc_backend;
        proxy_http_version 1.1;

        # WebSocket headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket timeouts
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;

        # Disable buffering for WebSocket
        proxy_buffering off;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://soc_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;

        # No caching for health checks
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }

    # Error pages
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }

    # Access and error logs
    access_log /var/log/nginx/soc-simulation.access.log;
    error_log /var/log/nginx/soc-simulation.error.log;
}
```

### Nginx Commands Reference

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# View nginx status
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/soc-simulation.access.log
sudo tail -f /var/log/nginx/soc-simulation.error.log
```

---

## Database Backup Strategy

### Automated Backup Script

Create `/opt/scripts/mongodb-backup.sh`:

```bash
#!/bin/bash
# MongoDB Backup Script for SOC Simulation

# Configuration
BACKUP_DIR="/var/backups/mongodb"
MONGODB_HOST="localhost"
MONGODB_PORT="27017"
MONGODB_DB="soc_simulation"
MONGODB_USER="soc_admin"
MONGODB_PASS="your-secure-password"
RETENTION_DAYS=30

# Create timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="soc_simulation_${TIMESTAMP}"

# Create backup directory if not exists
mkdir -p "${BACKUP_DIR}"

# Log file
LOG_FILE="${BACKUP_DIR}/backup.log"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "${LOG_FILE}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting MongoDB backup: ${BACKUP_NAME}"

# Perform backup using mongodump
mongodump \
    --host="${MONGODB_HOST}" \
    --port="${MONGODB_PORT}" \
    --db="${MONGODB_DB}" \
    --username="${MONGODB_USER}" \
    --password="${MONGODB_PASS}" \
    --authenticationDatabase="${MONGODB_DB}" \
    --out="${BACKUP_DIR}/${BACKUP_NAME}" \
    --gzip

# Check if backup was successful
if [ $? -eq 0 ]; then
    log "Backup completed successfully"

    # Create compressed archive
    cd "${BACKUP_DIR}"
    tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"
    rm -rf "${BACKUP_NAME}"

    log "Archive created: ${BACKUP_NAME}.tar.gz"

    # Calculate and log backup size
    BACKUP_SIZE=$(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)
    log "Backup size: ${BACKUP_SIZE}"
else
    log "ERROR: Backup failed!"
    exit 1
fi

# Remove old backups (older than RETENTION_DAYS)
log "Removing backups older than ${RETENTION_DAYS} days"
find "${BACKUP_DIR}" -name "soc_simulation_*.tar.gz" -mtime +${RETENTION_DAYS} -delete

# List remaining backups
log "Current backups:"
ls -lh "${BACKUP_DIR}"/*.tar.gz 2>/dev/null >> "${LOG_FILE}"

log "Backup process completed"
```

Make the script executable and set up cron:

```bash
# Make script executable
sudo chmod +x /opt/scripts/mongodb-backup.sh

# Create backup directory
sudo mkdir -p /var/backups/mongodb

# Edit crontab
sudo crontab -e
```

Add the following cron jobs:

```cron
# Daily backup at 2:00 AM
0 2 * * * /opt/scripts/mongodb-backup.sh >> /var/log/mongodb-backup.log 2>&1

# Weekly full backup on Sunday at 3:00 AM
0 3 * * 0 /opt/scripts/mongodb-backup.sh --full >> /var/log/mongodb-backup.log 2>&1
```

### Manual Backup Commands

```bash
# Quick manual backup
mongodump --db soc_simulation --out /var/backups/mongodb/manual_$(date +%Y%m%d)

# Backup with compression
mongodump --db soc_simulation --gzip --archive=/var/backups/mongodb/soc_$(date +%Y%m%d).gz

# Restore from backup
mongorestore --db soc_simulation /var/backups/mongodb/soc_simulation_20260122/soc_simulation

# Restore from compressed archive
mongorestore --gzip --archive=/var/backups/mongodb/soc_20260122.gz
```

### Offsite Backup (Optional)

```bash
# Sync to AWS S3
aws s3 sync /var/backups/mongodb s3://your-bucket/mongodb-backups/

# Sync to remote server via rsync
rsync -avz /var/backups/mongodb/ backup-server:/backups/mongodb/
```

---

## Monitoring & Logs

### Application Logs

```bash
# View PM2 logs in real-time
pm2 logs soc-simulation

# View last 100 lines
pm2 logs soc-simulation --lines 100

# View error logs only
pm2 logs soc-simulation --err

# View application log files directly
tail -f /var/log/soc-simulation/out.log
tail -f /var/log/soc-simulation/error.log
tail -f /var/log/soc-simulation/combined.log
```

### PM2 Monitoring

```bash
# Real-time monitoring dashboard
pm2 monit

# Process status
pm2 status

# Detailed process info
pm2 show soc-simulation

# Memory and CPU usage
pm2 list
```

### Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/soc-simulation.access.log

# Error logs
tail -f /var/log/nginx/soc-simulation.error.log

# Analyze access patterns
cat /var/log/nginx/soc-simulation.access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
```

### MongoDB Monitoring

```bash
# Connect to MongoDB
mongosh soc_simulation

# Check database status
db.serverStatus()

# Check collection stats
db.incidents.stats()

# Current operations
db.currentOp()

# Database size
db.stats()
```

### System Monitoring

```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check network connections
netstat -tlnp

# Check open ports
ss -tlnp
```

### Log Rotation

Create `/etc/logrotate.d/soc-simulation`:

```
/var/log/soc-simulation/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 deploy deploy
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### Health Check Script

Create `/opt/scripts/health-check.sh`:

```bash
#!/bin/bash
# Health Check Script

API_URL="http://localhost:5001/health"
SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"

# Check API health
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ "$HTTP_STATUS" != "200" ]; then
    MESSAGE="⚠️ SOC Simulation Health Check Failed! HTTP Status: $HTTP_STATUS"

    # Send Slack notification
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"$MESSAGE\"}" \
        $SLACK_WEBHOOK

    # Attempt restart
    pm2 restart soc-simulation

    echo "[$(date)] Health check failed, attempted restart" >> /var/log/soc-simulation/health-check.log
else
    echo "[$(date)] Health check passed" >> /var/log/soc-simulation/health-check.log
fi
```

Add to cron for regular checks:

```cron
# Health check every 5 minutes
*/5 * * * * /opt/scripts/health-check.sh
```

---

## Troubleshooting Common Issues

### 1. Application Won't Start

**Symptoms:** PM2 shows application in "errored" state

**Solutions:**

```bash
# Check error logs
pm2 logs soc-simulation --err --lines 50

# Check if port is in use
sudo lsof -i :5001
sudo netstat -tlnp | grep 5001

# Kill process using the port
sudo kill -9 $(sudo lsof -t -i:5001)

# Verify environment file
cat /var/www/soc-simulation/.env.production

# Check Node.js version
node --version

# Reinstall dependencies
cd /var/www/soc-simulation
rm -rf node_modules
npm ci --production
```

### 2. WebSocket Connection Issues

**Symptoms:** Real-time updates not working, Socket.IO errors in browser console

**Solutions:**

```bash
# Verify nginx WebSocket configuration
sudo nginx -t

# Check nginx error logs
sudo tail -f /var/log/nginx/soc-simulation.error.log

# Ensure WebSocket headers in nginx config
# proxy_set_header Upgrade $http_upgrade;
# proxy_set_header Connection "upgrade";

# Test WebSocket connection
wscat -c wss://yourdomain.com/socket.io/?EIO=4&transport=websocket

# Restart nginx
sudo systemctl restart nginx
```

### 3. MongoDB Connection Errors

**Symptoms:** "MongoNetworkError" or "Authentication failed"

**Solutions:**

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Verify MongoDB is listening
sudo netstat -tlnp | grep 27017

# Test connection
mongosh "mongodb://localhost:27017/soc_simulation"

# Check authentication
mongosh "mongodb://soc_admin:password@localhost:27017/soc_simulation?authSource=soc_simulation"

# Restart MongoDB
sudo systemctl restart mongod
```

### 4. SSL Certificate Issues

**Symptoms:** Browser shows security warning, HTTPS not working

**Solutions:**

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Test certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check certificate expiry
echo | openssl s_client -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# Force renewal
sudo certbot renew --force-renewal
```

### 5. High Memory Usage

**Symptoms:** Application slow, system running out of memory

**Solutions:**

```bash
# Check memory usage
free -h
pm2 monit

# Check PM2 memory settings
pm2 show soc-simulation

# Restart application to clear memory
pm2 restart soc-simulation

# Adjust max_memory_restart in ecosystem.config.js
# max_memory_restart: '1G'

# Check for memory leaks
pm2 logs soc-simulation | grep -i "memory\|heap"
```

### 6. Nginx 502 Bad Gateway

**Symptoms:** Browser shows "502 Bad Gateway" error

**Solutions:**

```bash
# Check if application is running
pm2 status

# Check if application is listening on correct port
curl http://localhost:5001/health

# Check nginx upstream configuration
sudo nginx -t

# Check nginx error logs
sudo tail -f /var/log/nginx/soc-simulation.error.log

# Restart services
pm2 restart soc-simulation
sudo systemctl restart nginx
```

### 7. Slow Performance

**Symptoms:** High response times, timeouts

**Solutions:**

```bash
# Check system resources
htop
iostat
vmstat 1

# Check MongoDB slow queries
mongosh soc_simulation --eval "db.setProfilingLevel(1, { slowms: 100 })"
mongosh soc_simulation --eval "db.system.profile.find().sort({ts:-1}).limit(5).pretty()"

# Check nginx access logs for slow requests
awk '$NF > 1 {print}' /var/log/nginx/soc-simulation.access.log

# Optimize MongoDB indexes
mongosh soc_simulation --eval "db.incidents.getIndexes()"

# Scale PM2 instances
pm2 scale soc-simulation 4
```

### 8. Permission Denied Errors

**Symptoms:** "EACCES" errors, cannot write to files

**Solutions:**

```bash
# Fix ownership
sudo chown -R deploy:deploy /var/www/soc-simulation
sudo chown -R deploy:deploy /var/log/soc-simulation

# Fix permissions
sudo chmod -R 755 /var/www/soc-simulation
sudo chmod -R 644 /var/www/soc-simulation/.env.production

# Check SELinux (CentOS/RHEL)
getenforce
sudo setenforce 0  # Temporarily disable for testing
```

### Quick Diagnostic Commands

```bash
# Full system check
echo "=== PM2 Status ===" && pm2 status
echo "=== Nginx Status ===" && sudo systemctl status nginx
echo "=== MongoDB Status ===" && sudo systemctl status mongod
echo "=== Disk Space ===" && df -h
echo "=== Memory ===" && free -h
echo "=== Recent Errors ===" && pm2 logs soc-simulation --err --lines 20
```

---

## Quick Reference

### Service Management

| Action        | Command                                          |
| ------------- | ------------------------------------------------ |
| Start App     | `pm2 start ecosystem.config.js --env production` |
| Stop App      | `pm2 stop soc-simulation`                        |
| Restart App   | `pm2 restart soc-simulation`                     |
| Reload App    | `pm2 reload soc-simulation`                      |
| View Logs     | `pm2 logs soc-simulation`                        |
| Start Nginx   | `sudo systemctl start nginx`                     |
| Restart Nginx | `sudo systemctl restart nginx`                   |
| Start MongoDB | `sudo systemctl start mongod`                    |

### Important File Locations

| File         | Location                                      |
| ------------ | --------------------------------------------- |
| Application  | `/var/www/soc-simulation`                     |
| Environment  | `/var/www/soc-simulation/.env.production`     |
| PM2 Config   | `/var/www/soc-simulation/ecosystem.config.js` |
| Nginx Config | `/etc/nginx/sites-available/soc-simulation`   |
| App Logs     | `/var/log/soc-simulation/`                    |
| Nginx Logs   | `/var/log/nginx/`                             |
| MongoDB Logs | `/var/log/mongodb/`                           |
| Backups      | `/var/backups/mongodb/`                       |
| SSL Certs    | `/etc/letsencrypt/live/yourdomain.com/`       |

---

## Support

For additional support:

- Check the [README.md](README.md) for basic usage
- Review the [API_DOCS.md](API_DOCS.md) for API documentation
- Submit issues on GitHub

---

_Last updated: January 2026_
