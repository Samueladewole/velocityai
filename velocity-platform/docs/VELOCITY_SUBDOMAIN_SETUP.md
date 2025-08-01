# Velocity Subdomain Setup on AWS Amplify

## Overview
This guide walks you through setting up `velocity.eripapp.com` as a subdomain for your ERIP Velocity platform on AWS Amplify.

## Prerequisites
- AWS Account with Amplify access
- Domain `eripapp.com` ownership
- ERIP platform already deployed on Amplify

## Method 1: AWS Console Setup (Recommended)

### Step 1: Access Amplify Console
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your ERIP platform app

### Step 2: Add Custom Domain
1. Click **"Domain management"** in the left sidebar
2. Click **"Add domain"**
3. Enter your root domain: `eripapp.com`
4. Configure subdomains:
   ```
   app.eripapp.com     → main branch (existing)
   velocity.eripapp.com → main branch (new)
   ```

### Step 3: DNS Configuration
1. Amplify will provide DNS records like:
   ```
   Type: CNAME
   Name: velocity
   Value: d1234567890abcdef.cloudfront.net
   ```
2. Add these records to your domain registrar (GoDaddy, Route 53, etc.)

### Step 4: SSL Certificate
- Amplify automatically provisions SSL certificates
- Wait 5-15 minutes for certificate validation
- Status will change from "Pending" to "Available"

## Method 2: AWS CLI Setup

### Step 1: Install AWS CLI
```bash
# macOS
brew install awscli

# Configure credentials
aws configure
```

### Step 2: Run Setup Script
```bash
# Update variables in the script first
./scripts/setup-velocity-domain.sh
```

### Step 3: Get Your App ID
```bash
aws amplify list-apps --region us-east-1
```

## Routing Configuration

The `amplify.yml` file has been configured with proper routing:

```yaml
rewrites:
  # Velocity subdomain routing
  - source: '/velocity'
    target: '/velocity'
    status: '200'
  - source: '/velocity/*'
    target: '/index.html'
    status: '200'
  # API routes
  - source: '/api/*'
    target: 'https://api.eripapp.com/<*>'
    status: '200'
```

## Environment Configuration

Production environment variables in `.env.production`:
```env
VITE_APP_ENV=production
VITE_VELOCITY_BASE_URL=https://velocity.eripapp.com
VITE_VELOCITY_API_ENDPOINT=https://api.eripapp.com/v1/velocity
```

## Domain Structure

After setup, your domain structure will be:
```
eripapp.com
├── app.eripapp.com        (Main ERIP platform)
├── velocity.eripapp.com   (Velocity AI platform)
├── api.eripapp.com        (Backend APIs)
└── docs.eripapp.com       (Documentation - future)
```

## Verification Steps

### 1. DNS Propagation Check
```bash
# Check DNS resolution
nslookup velocity.eripapp.com

# Check globally
dig velocity.eripapp.com
```

### 2. SSL Certificate Verification
```bash
# Check SSL certificate
openssl s_client -connect velocity.eripapp.com:443 -servername velocity.eripapp.com
```

### 3. Application Testing
1. Navigate to `https://velocity.eripapp.com`
2. Verify Velocity dashboard loads
3. Test routing: `https://velocity.eripapp.com/velocity/live`
4. Check API endpoints respond correctly

## Troubleshooting

### Common Issues

#### DNS Not Resolving
- **Cause**: DNS propagation delay
- **Solution**: Wait 24-48 hours for global propagation
- **Quick Test**: Use DNS checker tools online

#### SSL Certificate Pending
- **Cause**: Domain validation pending
- **Solution**: Ensure DNS records are correct in registrar

#### 404 Errors on Velocity Routes
- **Cause**: Routing configuration issue
- **Solution**: Verify `amplify.yml` rewrites are correct

#### CORS Issues
- **Cause**: API not configured for subdomain
- **Solution**: Update API CORS settings to include `velocity.eripapp.com`

### Support Commands

```bash
# Check build logs
aws amplify list-jobs --app-id YOUR_APP_ID --branch-name main

# Get domain status
aws amplify get-domain-association --app-id YOUR_APP_ID --domain-name eripapp.com

# Redeploy app
aws amplify start-job --app-id YOUR_APP_ID --branch-name main --job-type RELEASE
```

## Security Considerations

The `amplify.yml` includes security headers:
- `Strict-Transport-Security`: Force HTTPS
- `X-Content-Type-Options`: Prevent MIME sniffing
- `X-Frame-Options`: Prevent clickjacking
- `X-XSS-Protection`: XSS protection

## Performance Optimization

### CDN Configuration
- Amplify uses CloudFront CDN automatically
- Static assets cached at edge locations
- Gzip compression enabled by default

### Monitoring
Set up monitoring for:
- Domain certificate expiration
- DNS resolution health
- Application performance metrics

## Next Steps

1. **Update Marketing Materials**: Include velocity.eripapp.com in documentation
2. **SEO Configuration**: Add sitemap and meta tags for Velocity subdomain
3. **Analytics**: Configure Google Analytics/Amplitude for subdomain tracking
4. **Backup Domain**: Consider setting up `velocity.erip.app` as backup

## Cost Implications

AWS Amplify pricing for custom domains:
- **Custom Domain**: €0.025 per domain per month
- **SSL Certificate**: Free (AWS Certificate Manager)
- **Bandwidth**: Standard Amplify rates apply

Estimated monthly cost: ~€0.25 for the subdomain itself.

---

**Implementation Time**: 15-30 minutes  
**DNS Propagation**: 24-48 hours  
**Total Setup Time**: 1-2 days complete

For support, contact the Velocity development team or check AWS Amplify documentation.