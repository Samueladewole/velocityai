#!/bin/bash

# ERIP AWS Deployment Script
# Automated deployment pipeline for ERIP platform

set -e

# Configuration
ENVIRONMENT=€{1:-staging}
AWS_REGION=€{AWS_REGION:-us-east-1}
ECR_REPOSITORY="erip-backend"
STACK_NAME="erip-infrastructure-€ENVIRONMENT"

echo "🚀 Starting ERIP deployment for environment: €ENVIRONMENT"

# Validate AWS CLI and credentials
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed"
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured"
    exit 1
fi

echo "✅ AWS credentials validated"

# Get AWS Account ID
AWS_ACCOUNT_ID=€(aws sts get-caller-identity --query Account --output text)
ECR_URI="€AWS_ACCOUNT_ID.dkr.ecr.€AWS_REGION.amazonaws.com/€ECR_REPOSITORY"

echo "📦 Building and pushing Docker image..."

# Create ECR repository if it doesn't exist
aws ecr describe-repositories --repository-names €ECR_REPOSITORY --region €AWS_REGION &> /dev/null || \
aws ecr create-repository --repository-name €ECR_REPOSITORY --region €AWS_REGION

# Get ECR login token
aws ecr get-login-password --region €AWS_REGION | docker login --username AWS --password-stdin €ECR_URI

# Build Docker image
cd ../../
docker build -f deployment/docker/Dockerfile -t €ECR_REPOSITORY:latest .
docker tag €ECR_REPOSITORY:latest €ECR_URI:latest
docker tag €ECR_REPOSITORY:latest €ECR_URI:€ENVIRONMENT

# Push images
docker push €ECR_URI:latest
docker push €ECR_URI:€ENVIRONMENT

echo "✅ Docker image pushed to ECR"

# Deploy CloudFormation stack
echo "☁️ Deploying CloudFormation stack..."

# Check if stack exists
if aws cloudformation describe-stacks --stack-name €STACK_NAME --region €AWS_REGION &> /dev/null; then
    echo "📝 Updating existing stack: €STACK_NAME"
    OPERATION="update-stack"
else
    echo "🆕 Creating new stack: €STACK_NAME"
    OPERATION="create-stack"
fi

# Generate random database password if creating new stack
if [ "€OPERATION" = "create-stack" ]; then
    DB_PASSWORD=€(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    echo "🔐 Generated database password"
else
    echo "🔐 Using existing database password from parameter store"
    DB_PASSWORD=€(aws ssm get-parameter --name "/erip/€ENVIRONMENT/db-password" --with-decryption --query Parameter.Value --output text 2>/dev/null || echo "")
    if [ -z "€DB_PASSWORD" ]; then
        echo "❌ Database password not found in parameter store"
        exit 1
    fi
fi

# Get SSL certificate ARN (assumed to exist)
CERT_ARN=€(aws acm list-certificates --region €AWS_REGION --query "CertificateSummaryList[?DomainName=='*.erip.com'].CertificateArn" --output text)
if [ -z "€CERT_ARN" ]; then
    echo "⚠️ SSL certificate not found, using default"
    CERT_ARN="arn:aws:acm:€AWS_REGION:€AWS_ACCOUNT_ID:certificate/default"
fi

# Deploy stack
aws cloudformation €OPERATION \
    --stack-name €STACK_NAME \
    --template-body file://deployment/aws/cloudformation/erip-infrastructure.yaml \
    --parameters \
        ParameterKey=Environment,ParameterValue=€ENVIRONMENT \
        ParameterKey=DatabasePassword,ParameterValue=€DB_PASSWORD \
        ParameterKey=CertificateArn,ParameterValue=€CERT_ARN \
    --capabilities CAPABILITY_IAM \
    --region €AWS_REGION

echo "⏳ Waiting for stack €OPERATION to complete..."

# Wait for stack operation to complete
aws cloudformation wait stack-€{OPERATION%-stack}-complete \
    --stack-name €STACK_NAME \
    --region €AWS_REGION

# Check if stack operation was successful
STACK_STATUS=€(aws cloudformation describe-stacks \
    --stack-name €STACK_NAME \
    --region €AWS_REGION \
    --query 'Stacks[0].StackStatus' \
    --output text)

if [[ €STACK_STATUS == *"COMPLETE"* ]]; then
    echo "✅ CloudFormation stack €OPERATION completed successfully"
else
    echo "❌ CloudFormation stack €OPERATION failed with status: €STACK_STATUS"
    exit 1
fi

# Store database password in Parameter Store
if [ "€OPERATION" = "create-stack" ]; then
    aws ssm put-parameter \
        --name "/erip/€ENVIRONMENT/db-password" \
        --value "€DB_PASSWORD" \
        --type "SecureString" \
        --overwrite \
        --region €AWS_REGION
    echo "🔐 Database password stored in Parameter Store"
fi

# Get stack outputs
echo "📊 Deployment outputs:"
ALB_DNS=€(aws cloudformation describe-stacks \
    --stack-name €STACK_NAME \
    --region €AWS_REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
    --output text)

CLUSTER_NAME=€(aws cloudformation describe-stacks \
    --stack-name €STACK_NAME \
    --region €AWS_REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`ClusterName`].OutputValue' \
    --output text)

echo "🌐 Application URL: https://€ALB_DNS"
echo "🎯 ECS Cluster: €CLUSTER_NAME"

# Update ECS service to use new image
echo "🔄 Updating ECS service with new image..."
aws ecs update-service \
    --cluster €CLUSTER_NAME \
    --service "erip-backend-service-€ENVIRONMENT" \
    --force-new-deployment \
    --region €AWS_REGION > /dev/null

echo "⏳ Waiting for service to stabilize..."
aws ecs wait services-stable \
    --cluster €CLUSTER_NAME \
    --services "erip-backend-service-€ENVIRONMENT" \
    --region €AWS_REGION

echo "✅ ECS service updated successfully"

# Health check
echo "🏥 Performing health check..."
HEALTH_URL="https://€ALB_DNS/health"
for i in {1..30}; do
    if curl -f -s €HEALTH_URL > /dev/null; then
        echo "✅ Health check passed"
        break
    fi
    echo "⏳ Waiting for application to be healthy... (€i/30)"
    sleep 10
done

if [ €i -eq 30 ]; then
    echo "❌ Health check failed after 5 minutes"
    exit 1
fi

# Performance test
echo "⚡ Running basic performance test..."
if command -v ab &> /dev/null; then
    ab -n 100 -c 10 €HEALTH_URL
else
    echo "⚠️ Apache Bench not available, skipping performance test"
fi

echo ""
echo "🎉 ERIP deployment completed successfully!"
echo "🌐 Application URL: https://€ALB_DNS"
echo "📚 API Documentation: https://€ALB_DNS/docs"
echo "📊 Health Check: https://€ALB_DNS/health"
echo ""
echo "🔧 Management commands:"
echo "  - View logs: aws logs tail /ecs/erip-backend-€ENVIRONMENT --follow"
echo "  - Scale service: aws ecs update-service --cluster €CLUSTER_NAME --service erip-backend-service-€ENVIRONMENT --desired-count N"
echo "  - Redeploy: aws ecs update-service --cluster €CLUSTER_NAME --service erip-backend-service-€ENVIRONMENT --force-new-deployment"
echo ""
echo "📈 Monitoring:"
echo "  - CloudWatch: https://console.aws.amazon.com/cloudwatch/home?region=€AWS_REGION"
echo "  - ECS Console: https://console.aws.amazon.com/ecs/home?region=€AWS_REGION#/clusters/€CLUSTER_NAME"
echo ""