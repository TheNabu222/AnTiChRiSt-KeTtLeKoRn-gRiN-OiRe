
# Zettelkasten AI Consciousness Explorer - Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Zettelkasten AI Consciousness Explorer for personal use, including local hosting, cloud deployment options, and important privacy considerations.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Local Production Deployment](#local-production-deployment)
4. [Cloud Deployment Options](#cloud-deployment-options)
5. [Privacy & Security Considerations](#privacy--security-considerations)
6. [Maintenance & Updates](#maintenance--updates)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Node.js**: Version 18.0 or higher
- **npm** or **yarn**: Latest stable version
- **Git**: For version control and updates
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge

### Hardware Requirements
- **Minimum**: 2GB RAM, 1GB storage
- **Recommended**: 4GB RAM, 2GB storage
- **Network**: Stable internet connection for initial setup and updates

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd zettelkasten_ai_app
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Start Development Server
```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:5173`

## Local Production Deployment

### Option 1: Static Build with Local Server

#### 1. Build the Application
```bash
# Using npm
npm run build

# Using yarn
yarn build
```

#### 2. Serve the Built Application
```bash
# Using a simple HTTP server
npx serve -s dist -l 3000

# Or using Python (if available)
cd dist
python -m http.server 3000

# Or using Node.js http-server
npm install -g http-server
http-server dist -p 3000
```

#### 3. Access Your Application
Open `http://localhost:3000` in your browser.

### Option 2: Docker Deployment

#### 1. Create Dockerfile
```dockerfile
# Create this file as 'Dockerfile' in the project root
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. Build and Run Docker Container
```bash
# Build the image
docker build -t zettelkasten-ai .

# Run the container
docker run -d -p 8080:80 --name zettelkasten-app zettelkasten-ai
```

#### 3. Access Your Application
Open `http://localhost:8080` in your browser.

## Cloud Deployment Options

### Option 1: Netlify (Recommended for Beginners)

#### 1. Prepare for Deployment
```bash
npm run build
```

#### 2. Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### 3. Configure Custom Domain (Optional)
- Go to your Netlify dashboard
- Navigate to Domain settings
- Add your custom domain
- Configure DNS settings as instructed

### Option 2: Vercel

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
vercel --prod
```

#### 3. Follow the prompts to configure your deployment

### Option 3: GitHub Pages

#### 1. Install gh-pages
```bash
npm install --save-dev gh-pages
```

#### 2. Add deployment script to package.json
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

#### 3. Build and Deploy
```bash
npm run build
npm run deploy
```

### Option 4: Self-Hosted VPS

#### 1. Server Setup (Ubuntu/Debian)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install nginx
sudo apt install nginx -y

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Deploy Application
```bash
# Clone your repository
git clone <your-repo-url>
cd zettelkasten_ai_app

# Install dependencies and build
npm install
npm run build

# Copy built files to nginx directory
sudo cp -r dist/* /var/www/html/

# Configure nginx (optional, for custom domain)
sudo nano /etc/nginx/sites-available/zettelkasten
```

#### 3. Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## Privacy & Security Considerations

### Data Privacy
- **Local Storage**: All user data is stored locally in the browser
- **No Server Communication**: The app runs entirely client-side
- **No Analytics**: No tracking or analytics by default
- **Offline Capable**: Works without internet after initial load

### Security Best Practices

#### For Local Deployment
- **Network Access**: Limit access to localhost or trusted networks
- **Firewall**: Configure firewall rules to restrict external access
- **Updates**: Regularly update dependencies for security patches

#### For Cloud Deployment
- **HTTPS**: Always use HTTPS in production
- **Domain Security**: Use strong, unique domain names
- **Access Control**: Consider password protection for sensitive content
- **Content Security Policy**: Implement CSP headers

#### Example Security Headers (for nginx)
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### Privacy-Enhanced Deployment

#### 1. Remove External Dependencies (Optional)
- Host fonts locally instead of using Google Fonts
- Remove any external API calls
- Disable any analytics or tracking

#### 2. Tor Hidden Service (Advanced)
For maximum privacy, deploy as a Tor hidden service:

```bash
# Install Tor
sudo apt install tor

# Configure Tor hidden service
sudo nano /etc/tor/torrc

# Add these lines:
HiddenServiceDir /var/lib/tor/zettelkasten/
HiddenServicePort 80 127.0.0.1:80

# Restart Tor
sudo systemctl restart tor

# Get your .onion address
sudo cat /var/lib/tor/zettelkasten/hostname
```

## Maintenance & Updates

### Regular Maintenance Tasks

#### 1. Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Audit for security vulnerabilities
npm audit
npm audit fix
```

#### 2. Application Updates
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild application
npm run build

# Deploy updated version
# (repeat deployment steps for your chosen method)
```

#### 3. Backup Procedures
```bash
# Backup user data (if any custom modifications)
cp -r dist/ backup/zettelkasten-$(date +%Y%m%d)/

# Backup configuration files
cp -r nginx-config/ backup/config-$(date +%Y%m%d)/
```

### Automated Updates (Advanced)

#### 1. Create Update Script
```bash
#!/bin/bash
# save as update-zettelkasten.sh

cd /path/to/zettelkasten_ai_app
git pull origin main
npm install
npm run build

# For nginx deployment
sudo cp -r dist/* /var/www/html/

# For docker deployment
# docker build -t zettelkasten-ai .
# docker stop zettelkasten-app
# docker rm zettelkasten-app
# docker run -d -p 8080:80 --name zettelkasten-app zettelkasten-ai

echo "Update completed at $(date)"
```

#### 2. Schedule with Cron
```bash
# Edit crontab
crontab -e

# Add line for weekly updates (Sundays at 2 AM)
0 2 * * 0 /path/to/update-zettelkasten.sh >> /var/log/zettelkasten-update.log 2>&1
```

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 18+
```

#### 2. Port Conflicts
```bash
# Find process using port
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Use different port
npm run dev -- --port 3001
```

#### 3. Permission Issues
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Fix nginx permissions
sudo chown -R www-data:www-data /var/www/html
```

#### 4. Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Performance Optimization

#### 1. Enable Compression
```nginx
# In nginx configuration
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

#### 2. Browser Caching
```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### 3. CDN Integration (Optional)
- Use Cloudflare or similar CDN for global distribution
- Configure appropriate caching rules
- Enable security features

## Support & Community

### Getting Help
- **Documentation**: Check the README.md for basic usage
- **Issues**: Report bugs or request features via GitHub issues
- **Community**: Join discussions in the project community

### Contributing
- **Bug Reports**: Include detailed reproduction steps
- **Feature Requests**: Describe use cases and benefits
- **Code Contributions**: Follow the contribution guidelines

### License & Legal
- Review the project license before deployment
- Ensure compliance with any third-party dependencies
- Consider legal implications of hosting consciousness exploration tools

---

## Quick Start Summary

For the fastest deployment:

1. **Local Development**: `npm install && npm run dev`
2. **Local Production**: `npm run build && npx serve -s dist`
3. **Cloud (Netlify)**: `npm run build && netlify deploy --prod --dir=dist`
4. **Docker**: Build and run the provided Dockerfile

Choose the deployment method that best fits your technical expertise and privacy requirements.

---

*Last Updated: May 29, 2025*
*Version: 2.0 - Expanded Interactive Features*
