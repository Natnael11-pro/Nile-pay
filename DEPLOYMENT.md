# Nile Pay - Production Deployment Guide

## 🇪🇹 Ethiopian Digital Banking Platform

This guide covers the complete production deployment process for Nile Pay, Ethiopia's premier digital payment gateway.

## 📋 Pre-Deployment Checklist

### ✅ Environment Setup
- [ ] Production Supabase project created and configured
- [ ] Environment variables configured (see `.env.production.example`)
- [ ] Domain name registered and DNS configured
- [ ] SSL certificates obtained
- [ ] Ethiopian banking API credentials secured
- [ ] Compliance documentation completed

### ✅ Security Requirements
- [ ] Security headers configured in `next.config.js`
- [ ] Content Security Policy (CSP) implemented
- [ ] Rate limiting configured
- [ ] Authentication flows tested
- [ ] Data encryption verified
- [ ] Ethiopian banking compliance verified

### ✅ Performance Optimization
- [ ] Image optimization enabled
- [ ] Code splitting configured
- [ ] Bundle size analyzed and optimized
- [ ] CDN configured for static assets
- [ ] Database queries optimized
- [ ] Caching strategies implemented

## 🚀 Deployment Options

### Option 1: Vercel Deployment (Recommended)

#### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Production ready deployment"
git push origin main
```

#### Step 2: Configure Vercel
1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Configure custom domain (nilepay.et)
4. Enable automatic deployments

#### Step 3: Environment Variables in Vercel
```bash
# Copy all variables from .env.production.example
# Set them in Vercel dashboard under Settings > Environment Variables
```

#### Step 4: Deploy
```bash
# Automatic deployment on push to main branch
# Or manual deployment via Vercel CLI
npx vercel --prod
```

### Option 2: Docker Deployment

#### Step 1: Build Docker Image
```bash
# Build production image
docker build -t nile-pay:latest .

# Tag for registry
docker tag nile-pay:latest your-registry/nile-pay:latest
```

#### Step 2: Deploy with Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  nile-pay:
    image: nile-pay:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    restart: unless-stopped
```

### Option 3: Traditional Server Deployment

#### Step 1: Server Setup
```bash
# Install Node.js 18+ on Ubuntu/CentOS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2
```

#### Step 2: Application Deployment
```bash
# Clone repository
git clone https://github.com/your-org/nile-pay.git
cd nile-pay

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production
```

## 🔧 Configuration Files

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name nilepay.et www.nilepay.et;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name nilepay.et www.nilepay.et;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2 Ecosystem Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'nile-pay',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

## 🗄️ Database Setup

### Supabase Production Configuration

#### Step 1: Create Production Project
1. Create new Supabase project for production
2. Configure database schema using migration files
3. Set up Row Level Security (RLS) policies
4. Configure authentication providers

#### Step 2: Run Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to production project
supabase link --project-ref your-production-project-ref

# Run migrations
supabase db push
```

#### Step 3: Seed Production Data
```bash
# Run seed script for Ethiopian banks and initial data
npm run seed:production
```

## 🔐 Security Configuration

### SSL/TLS Setup
```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d nilepay.et -d www.nilepay.et
```

### Firewall Configuration
```bash
# Configure UFW firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Security Monitoring
```bash
# Install fail2ban for intrusion prevention
sudo apt install fail2ban

# Configure fail2ban for Nginx
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

## 📊 Monitoring & Logging

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs nile-pay

# Restart application
pm2 restart nile-pay
```

### Health Checks
```bash
# Create health check endpoint
curl https://nilepay.et/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-12-21T10:00:00Z",
  "services": {
    "database": "connected",
    "supabase": "connected"
  }
}
```

## 🔄 Backup & Recovery

### Database Backups
```bash
# Automated daily backups
0 2 * * * /usr/local/bin/supabase db dump --project-ref your-ref > /backups/nile-pay-$(date +\%Y\%m\%d).sql
```

### Application Backups
```bash
# Backup application files
tar -czf /backups/nile-pay-app-$(date +%Y%m%d).tar.gz /var/www/nile-pay
```

## 🚨 Incident Response

### Emergency Procedures
1. **Service Down**: Check PM2 status, restart if needed
2. **Database Issues**: Check Supabase dashboard, verify connections
3. **Security Breach**: Immediately rotate API keys, check logs
4. **High Traffic**: Scale instances, enable CDN caching

### Rollback Procedure
```bash
# Quick rollback to previous version
pm2 stop nile-pay
git checkout previous-stable-tag
npm run build
pm2 start nile-pay
```

## 📞 Support Contacts

### Technical Support
- **Primary**: tech@nilepay.et
- **Emergency**: +251-11-XXX-XXXX
- **Slack**: #nile-pay-production

### Ethiopian Banking Compliance
- **NBE Liaison**: compliance@nilepay.et
- **Legal Team**: legal@nilepay.et

## 📈 Performance Benchmarks

### Expected Performance Metrics
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 500ms
- **Uptime**: 99.9%
- **Concurrent Users**: 10,000+

### Monitoring Tools
- **Uptime**: UptimeRobot or Pingdom
- **Performance**: New Relic or DataDog
- **Errors**: Sentry
- **Analytics**: Google Analytics

## 🔧 Maintenance

### Regular Maintenance Tasks
- [ ] Weekly security updates
- [ ] Monthly dependency updates
- [ ] Quarterly performance reviews
- [ ] Annual security audits

### Scheduled Maintenance Windows
- **Time**: Sundays 2:00 AM - 4:00 AM EAT
- **Notification**: 48 hours advance notice
- **Rollback Plan**: Always prepared

## 🇪🇹 Ethiopian Compliance

### Regulatory Requirements
- [ ] National Bank of Ethiopia registration
- [ ] Data localization compliance
- [ ] KYC/AML procedures implemented
- [ ] Transaction reporting configured
- [ ] Ethiopian tax compliance

### Documentation Required
- [ ] Security audit reports
- [ ] Compliance certificates
- [ ] Data protection policies
- [ ] Incident response procedures

---

## 🎉 Post-Deployment Verification

After deployment, verify:
1. ✅ All pages load correctly
2. ✅ Authentication flows work
3. ✅ Payment processing functional
4. ✅ Ethiopian bank integrations active
5. ✅ Mobile responsiveness verified
6. ✅ Security headers present
7. ✅ Performance metrics within targets
8. ✅ Monitoring alerts configured

**🇪🇹 Nile Pay - Empowering Ethiopian Digital Banking**
