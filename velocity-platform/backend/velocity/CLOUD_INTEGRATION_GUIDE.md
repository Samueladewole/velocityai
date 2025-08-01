# Cloud Integration Management System Guide

## Overview

The Velocity AI Platform's Cloud Integration Management System provides comprehensive, production-ready integration capabilities for AWS, GCP, Azure, and GitHub platforms. This system is designed with enterprise security, scalability, and compliance requirements in mind.

## Architecture

### Core Components

1. **CloudIntegrationManager**: Main orchestrator for all cloud integrations
2. **Platform-Specific Clients**: AWS, GCP, Azure, and GitHub clients
3. **Security Layer**: Credential encryption and secure storage
4. **Evidence Collection**: Automated compliance evidence gathering
5. **Health Monitoring**: Connection health checks and status monitoring
6. **API Endpoints**: RESTful API for integration management

### Key Features

- ✅ **Multi-Cloud Support**: AWS, GCP, Azure, GitHub
- ✅ **Enterprise Security**: Encrypted credential storage, secure authentication
- ✅ **Evidence Collection**: Automated compliance evidence gathering
- ✅ **Health Monitoring**: Real-time connection health checks
- ✅ **Error Handling**: Comprehensive error handling and retry mechanisms
- ✅ **Audit Logging**: Complete audit trail for all operations
- ✅ **RBAC Integration**: Role-based access control
- ✅ **Real-time Updates**: WebSocket notifications for status changes

## API Endpoints

### Connection Management

#### Connect to Cloud Platform
```http
POST /api/v1/integrations/cloud/{platform}/connect
```

**Request Body:**
```json
{
  "platform": "aws",
  "credentials": {
    "access_key_id": "your-access-key",
    "secret_access_key": "your-secret-key",
    "region": "us-east-1"
  },
  "configuration": {
    "sync_frequency": 3600,
    "evidence_types": ["policies", "security_groups"]
  },
  "test_connection": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "integration_id": "uuid-here",
    "platform": "aws",
    "status": "connected"
  },
  "message": "Successfully connected to AWS"
}
```

#### Test Connection Health
```http
GET /api/v1/integrations/cloud/{platform}/test?integration_id={id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "integration_id": "uuid-here",
    "platform": "aws",
    "status": "healthy",
    "response_time_ms": 245.6,
    "error_message": null,
    "last_checked": "2025-01-01T12:00:00Z",
    "metadata": {
      "account_id": "123456789012",
      "region": "us-east-1"
    }
  }
}
```

#### Synchronize Platform Data
```http
POST /api/v1/integrations/cloud/{platform}/sync
```

**Request Body:**
```json
{
  "integration_id": "uuid-here",
  "evidence_types": ["policies", "security_groups", "encryption_status"],
  "framework": "soc2"
}
```

#### Get Integration Status
```http
GET /api/v1/integrations/cloud/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "integrations": [
      {
        "integration_id": "uuid-here",
        "name": "AWS Integration",
        "platform": "aws",
        "db_status": "connected",
        "connection_status": "healthy",
        "last_sync": "2025-01-01T11:30:00Z",
        "supported_evidence_types": ["policies", "security_groups", "encryption_status"]
      }
    ],
    "summary": {
      "total_integrations": 3,
      "connected_integrations": 2,
      "healthy_integrations": 2,
      "platforms": ["aws", "gcp", "github"]
    }
  }
}
```

#### Get Supported Evidence Types
```http
GET /api/v1/integrations/cloud/{platform}/evidence-types
```

#### Disconnect Integration
```http
DELETE /api/v1/integrations/cloud/{integration_id}
```

## Platform-Specific Configuration

### AWS Integration

**Required Credentials:**
- `access_key_id`: AWS Access Key ID
- `secret_access_key`: AWS Secret Access Key
- `region`: AWS Region (optional, defaults to us-east-1)
- `session_token`: Session token for temporary credentials (optional)

**Supported Evidence Types:**
- `policies`: IAM policies and roles
- `security_groups`: EC2 security groups
- `encryption_status`: S3 bucket encryption status
- `audit_logs`: CloudTrail audit logs
- `compliance_rules`: AWS Config compliance rules

**Example Configuration:**
```json
{
  "credentials": {
    "access_key_id": "AKIAIOSFODNN7EXAMPLE",
    "secret_access_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    "region": "us-west-2"
  },
  "configuration": {
    "sync_frequency": 3600,
    "max_items_per_collection": 100
  }
}
```

### Google Cloud Platform (GCP) Integration

**Required Credentials:**
- `service_account_key`: Service account JSON key
- `project_id`: GCP Project ID

**Supported Evidence Types:**
- `policies`: IAM policies and bindings
- `configurations`: Project configurations

**Example Configuration:**
```json
{
  "credentials": {
    "service_account_key": {
      "type": "service_account",
      "project_id": "your-project-id",
      "private_key_id": "key-id",
      "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",
      "client_email": "service-account@your-project.iam.gserviceaccount.com",
      "client_id": "123456789",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token"
    },
    "project_id": "your-project-id"
  }
}
```

### Microsoft Azure Integration

**Required Credentials:**
- `tenant_id`: Azure AD Tenant ID
- `client_id`: Application (client) ID
- `client_secret`: Application client secret
- `subscription_id`: Azure Subscription ID

**Supported Evidence Types:**
- `configurations`: Resource group configurations

**Example Configuration:**
```json
{
  "credentials": {
    "tenant_id": "your-tenant-id",
    "client_id": "your-client-id",
    "client_secret": "your-client-secret",
    "subscription_id": "your-subscription-id"
  }
}
```

### GitHub Integration

**Required Credentials:**
- `token`: GitHub Personal Access Token
- `username`: GitHub username
- `organization`: GitHub organization (optional)

**Supported Evidence Types:**
- `configurations`: Repository configurations
- `security_groups`: Branch protection rules

**Example Configuration:**
```json
{
  "credentials": {
    "token": "ghp_xxxxxxxxxxxxxxxxxxxx",
    "username": "your-username",
    "organization": "your-org"
  }
}
```

## Security Considerations

### Credential Encryption

All credentials are encrypted before being stored in the database using AES encryption:

```python
from security import encrypt_credentials, decrypt_credentials

# Encrypt credentials before storage
encrypted_creds = encrypt_credentials({
    "access_key_id": "your-key",
    "secret_access_key": "your-secret"
})

# Decrypt when needed
decrypted_creds = decrypt_credentials(encrypted_creds)
```

### Access Control

The system integrates with the platform's RBAC system:

- `integration:create` - Create new integrations
- `integration:view` - View integration status
- `integration:connect` - Connect/sync integrations
- `integration:delete` - Remove integrations

### Audit Logging

All integration operations are logged with:
- User identity
- Operation type
- Timestamp
- Success/failure status
- Error details (if applicable)

## Evidence Collection

### Evidence Types

1. **Policies**: IAM policies, access controls, permissions
2. **Configurations**: System and service configurations
3. **Audit Logs**: Security events, access logs, administrative actions
4. **Security Groups**: Network security rules, firewall configurations
5. **Encryption Status**: Data encryption settings and status
6. **Access Controls**: User access permissions and restrictions
7. **Compliance Rules**: Automated compliance checks and results

### Evidence Data Structure

Each evidence item contains:

```json
{
  "id": "evidence-uuid",
  "title": "AWS IAM Policies Evidence",
  "description": "IAM policies collected from AWS",
  "evidence_type": "api_response",
  "status": "pending",
  "framework": "soc2",
  "control_id": "CC6.1",
  "data": {
    "policy_name": "example-policy",
    "policy_arn": "arn:aws:iam::123456789012:policy/example-policy",
    "create_date": "2025-01-01T00:00:00Z"
  },
  "evidence_metadata": {
    "platform": "aws",
    "collection_type": "policies",
    "collected_at": "2025-01-01T12:00:00Z"
  },
  "confidence_score": 0.85,
  "trust_points": 10
}
```

## Error Handling

### Connection Errors

The system handles various types of connection errors:

1. **Authentication Errors**: Invalid credentials, expired tokens
2. **Authorization Errors**: Insufficient permissions
3. **Network Errors**: Timeouts, connection failures
4. **API Errors**: Rate limits, service unavailability

### Retry Mechanism

Failed operations are automatically retried with exponential backoff:

- Initial retry after 1 second
- Maximum of 3 retry attempts
- Exponential backoff (1s, 2s, 4s)

### Error Response Format

```json
{
  "success": false,
  "error": "Connection test failed",
  "details": [
    {
      "code": "AUTHENTICATION_ERROR",
      "message": "Invalid AWS credentials",
      "field": "access_key_id"
    }
  ],
  "timestamp": "2025-01-01T12:00:00Z"
}
```

## Monitoring and Health Checks

### Health Check Status

- `healthy`: Connection is working properly
- `degraded`: Connection is working but with issues
- `unhealthy`: Connection is not working
- `unknown`: Unable to determine connection status

### Health Check Metrics

Each health check includes:
- Response time in milliseconds
- Error message (if any)
- Last check timestamp
- Platform-specific metadata

### Monitoring Integration

The system integrates with the platform's monitoring infrastructure:

- Prometheus metrics for connection health
- Real-time WebSocket notifications
- Alert generation for connection failures

## Development and Testing

### Running Tests

```bash
# Run the comprehensive test suite
python test_cloud_integration.py

# Set environment variables for real testing
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
export GITHUB_TOKEN="your-token"
export AZURE_TENANT_ID="your-tenant"
# ... etc

# Run tests with real credentials
python test_cloud_integration.py
```

### Local Development Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
export DATABASE_URL="postgresql://user:pass@localhost/velocity_db"
export REDIS_URL="redis://localhost:6379"
export JWT_SECRET="your-jwt-secret"
export ENCRYPTION_KEY="your-encryption-key"
```

3. Initialize the database:
```bash
python -c "from database import create_tables; create_tables()"
```

### Adding New Cloud Platforms

To add support for a new cloud platform:

1. Create a new credentials class inheriting from `CloudCredentials`
2. Implement a new client class inheriting from `BaseCloudClient`
3. Add the platform to the `Platform` enum
4. Update the `CloudIntegrationManager._create_credentials` method
5. Update the `CloudIntegrationManager._create_client` method
6. Add appropriate tests

Example:
```python
@dataclass
class NewPlatformCredentials(CloudCredentials):
    api_key: str
    endpoint: str
    
    def __post_init__(self):
        self.platform = Platform.NEW_PLATFORM

class NewPlatformClient(BaseCloudClient):
    async def test_connection(self) -> ConnectionHealthCheck:
        # Implement connection test
        pass
    
    async def collect_evidence(self, evidence_types, framework) -> List[EvidenceCollectionResult]:
        # Implement evidence collection
        pass
```

## Performance Considerations

### Connection Pooling

The system implements connection pooling for cloud platform clients to improve performance and reduce connection overhead.

### Caching

- Health check results are cached for 5 minutes
- Evidence collection results are cached for 1 hour
- Configuration data is cached for 15 minutes

### Rate Limiting

The system respects cloud platform rate limits:
- AWS: 5000 requests per second per region
- GCP: 100 requests per second per project
- Azure: 12000 requests per hour per subscription
- GitHub: 5000 requests per hour for authenticated users

### Batch Processing

Evidence collection is performed in batches to optimize performance:
- Default batch size: 100 items
- Configurable per integration
- Automatic pagination handling

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify credentials are correct and not expired
   - Check required permissions for the service account/user
   - Ensure MFA is not required for programmatic access

2. **Connection Timeouts**
   - Check network connectivity
   - Verify firewall rules allow outbound connections
   - Increase timeout values if needed

3. **Permission Errors**
   - Review IAM policies and ensure sufficient permissions
   - Check service account permissions for GCP
   - Verify application registration for Azure

4. **Rate Limiting**
   - Implement exponential backoff
   - Consider using multiple service accounts/keys
   - Monitor usage against platform limits

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
export LOG_LEVEL=DEBUG
```

This will provide detailed logs for all integration operations.

### Support

For additional support:
1. Check the application logs for error details
2. Review the integration status via the API
3. Run the test suite to verify system functionality
4. Contact the platform support team with specific error messages

## Compliance and Governance

### Data Handling

- All data is encrypted in transit and at rest
- PII is identified and handled according to privacy policies
- Data retention policies are enforced automatically

### Compliance Frameworks

The system supports evidence collection for:
- SOC 2 Type II
- ISO 27001
- CIS Controls
- GDPR
- HIPAA
- PCI DSS

### Audit Requirements

- All operations are logged with full audit trails
- Evidence collection activities are timestamped and attributed
- Data integrity is maintained through checksums and validation

This comprehensive cloud integration system provides enterprise-grade capabilities for compliance automation and evidence collection across multiple cloud platforms while maintaining the highest standards of security and reliability.