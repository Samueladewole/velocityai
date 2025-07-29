# ERIP Development Setup Guide

## Quick Start - Development Mode

### 🚧 **Development Mode (Default)**
The ERIP platform is configured for **unrestricted development** by default:

- **✅ No Authentication Required** - All endpoints accessible without tokens
- **✅ Full Permissions** - Automatic super_admin access to all components  
- **✅ Zero Setup** - Start developing immediately
- **✅ All Features Available** - Test any component without restrictions

### **Starting the Backend**

```bash
# Navigate to backend directory
cd backend/python

# Activate virtual environment
source venv/bin/activate

# Install dependencies (if needed)
pip install fastapi uvicorn pydantic structlog pandas numpy scipy

# Start the development server
python main.py
```

**Backend will be available at:** `http://localhost:8001`

### **Verify Development Mode**

Visit `http://localhost:8001` and you should see:

```json
{
  "service": "ERIP Python Backend",
  "version": "1.0.0",
  "environment": "development",
  "development_mode": {
    "auth_bypass": true,
    "default_user": "dev@erip.com",
    "message": "🚧 Development Mode: Authentication bypassed for testing"
  },
  "components": [...]
}
```

### **Available Components & Endpoints**

#### **Core Risk Management**
- **COMPASS** - `/compass/*` - Regulatory Intelligence
- **ATLAS** - `/atlas/*` - Security Assessment  
- **PRISM** - `/prism/*` - Risk Quantification
- **BEACON** - `/beacon/*` - Value Demonstration
- **PULSE** - `/pulse/*` - Real-time Analytics

#### **Enterprise Features**
- **Sales Accelerator** - `/sales/*` - Revenue Intelligence
- **Sheets Integration** - `/sheets/*` - Native Spreadsheet Engine
- **Data Architecture** - `/data/*` - Multi-cloud Data Platform (19 endpoints)

#### **Documentation**
- **Interactive API Docs** - `http://localhost:8001/docs`
- **ReDoc Documentation** - `http://localhost:8001/redoc`

## Environment Configuration

### **Development (Default)**
```bash
ENVIRONMENT=development
DEV_MODE_BYPASS_AUTH=true
```
- No authentication required
- Full access to all features
- Ideal for feature development and testing

### **Staging (Testing Production Auth)**
```bash
ENVIRONMENT=staging  
DEV_MODE_BYPASS_AUTH=false
```
- Full authentication required
- Test production-like security
- Validate auth flows before production

### **Production (Secure)**
```bash
ENVIRONMENT=production
DEV_MODE_BYPASS_AUTH=false
JWT_SECRET_KEY=your-production-secret
```
- Enterprise authentication required
- Role-based access control enforced
- Full security features active

## Component Testing

### **Data Architecture (Latest)**
All 19 endpoints available without authentication:

```bash
# Test cloud connections
curl http://localhost:8001/data/health

# Test quality assessment  
curl http://localhost:8001/data/quality/summary

# Test data catalog
curl http://localhost:8001/data/catalog/search?query=test
```

### **Risk Analysis**
```bash
# PRISM Monte Carlo simulations
curl http://localhost:8001/prism/simulate

# BEACON ROI calculations
curl http://localhost:8001/beacon/roi/calculate
```

### **Sales Intelligence**
```bash
# Sales accelerator features
curl http://localhost:8001/sales/proposals/generate
curl http://localhost:8001/sales/compliance/assess
```

## Development Workflow

### **Feature Development**
1. **Start Backend** - `python main.py` (no auth setup needed)
2. **Access Any Endpoint** - All components immediately available
3. **Test Features** - Full functionality without restrictions
4. **Use API Docs** - Interactive testing at `/docs`

### **Integration Testing**
1. **Component Tests** - Each component has dedicated test suites
2. **Cross-Component** - Test integration flows without auth barriers
3. **Data Pipeline** - Full data architecture testing (26/26 tests pass)

### **Authentication Development**
1. **Parallel Development** - Auth enhancements don't block current work
2. **Environment Testing** - Switch to staging for auth testing
3. **Production Ready** - Full security available when needed

## Troubleshooting

### **Common Issues**

#### **Import Errors**
```bash
# Install missing dependencies
pip install pandas numpy scipy structlog

# For sheets integration
pip install openpyxl

# For full requirements
pip install -r requirements.txt
```

#### **Port Conflicts**
```bash
# Backend default: localhost:8001
# Frontend default: localhost:5173
# Change port in main.py if needed
```

#### **Authentication Testing**
```bash
# To test production auth locally
export ENVIRONMENT=staging
export DEV_MODE_BYPASS_AUTH=false

# Restart backend
python main.py
```

## Production Deployment

When ready for production:

1. **Set Environment Variables**
   ```bash
   ENVIRONMENT=production
   DEV_MODE_BYPASS_AUTH=false
   JWT_SECRET_KEY=secure-production-key
   ```

2. **Enterprise Security Enabled**
   - JWT token authentication required
   - Role-based access control active
   - Component permissions enforced

3. **Enhanced Features Available**
   - Priority 4: Enhanced Authentication (MFA, SSO)
   - Priority 5: Advanced User Roles
   - Enterprise deployment ready

## Next Steps

### **Current Priorities**
1. **Enhanced Authentication** (Priority 4) - Enterprise MFA & SSO
2. **Advanced User Roles** (Priority 5) - Complex organizational hierarchies

### **Advanced Analytics** (Phase 3)
- **GBM Risk Engine** (Priority 6) - Quantitative finance modeling
- **Real-time Collaboration** (Priority 7) - WebSocket features

**Development Mode enables unrestricted feature development while maintaining a clear path to production security.**