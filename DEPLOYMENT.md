# Deployment Guide - Digital Mirror

Complete guide for deploying Digital Mirror to production.

## Prerequisites

- Docker Hub or AWS ECR account
- AWS account with appropriate permissions
- Kubernetes cluster (AWS EKS recommended)
- Domain name configured
- SSL certificate (Let's Encrypt recommended)

## Step 1: Build & Push Docker Images

### Backend

```bash
cd backend

# Build image
docker build -t jeremymartinezq/digital-mirror-backend:latest .

# Push to registry
docker push jeremymartinezq/digital-mirror-backend:latest
```

### Frontend

```bash
cd frontend/web

# Build image
docker build -t jeremymartinezq/digital-mirror-frontend:latest .

# Push to registry
docker push jeremymartinezq/digital-mirror-frontend:latest
```

## Step 2: Deploy AWS Infrastructure (Terraform)

```bash
cd infra/terraform

# Initialize Terraform
terraform init

# Create terraform.tfvars
cat > terraform.tfvars <<EOF
aws_region = "us-east-1"
environment = "production"
db_username = "postgres"
db_password = "CHANGE-ME-SECURE-PASSWORD"
EOF

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply

# Save outputs
terraform output > outputs.txt
```

This creates:
- VPC with public/private subnets
- EKS cluster
- RDS PostgreSQL database
- ElastiCache Redis cluster
- S3 bucket for assets
- Security groups

## Step 3: Configure Kubernetes

### Connect to EKS cluster

```bash
aws eks update-kubeconfig --name digital-mirror-eks --region us-east-1
```

### Update Kubernetes manifests

Edit `infra/k8s/backend-deployment.yaml`:
- Update image to your Docker registry
- Update DATABASE_URL with RDS endpoint
- Update REDIS_URL with ElastiCache endpoint
- Set strong SECRET_KEY

Edit `infra/k8s/frontend-deployment.yaml`:
- Update image to your Docker registry
- Set NEXT_PUBLIC_API_URL to your API domain

Edit `infra/k8s/ingress.yaml`:
- Update domains to your actual domains
- Configure TLS certificates

### Deploy to Kubernetes

```bash
cd infra/k8s

# Create namespace
kubectl apply -f namespace.yaml

# Deploy Redis
kubectl apply -f redis-deployment.yaml

# Wait for Redis to be ready
kubectl wait --for=condition=available --timeout=120s deployment/redis -n digital-mirror

# Deploy backend
kubectl apply -f backend-deployment.yaml

# Wait for backend to be ready
kubectl wait --for=condition=available --timeout=120s deployment/backend -n digital-mirror

# Deploy frontend
kubectl apply -f frontend-deployment.yaml

# Configure ingress (requires nginx-ingress controller)
kubectl apply -f ingress.yaml

# Check status
kubectl get pods -n digital-mirror
kubectl get services -n digital-mirror
kubectl get ingress -n digital-mirror
```

## Step 4: Configure Ingress & SSL

### Install NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/aws/deploy.yaml
```

### Install Cert-Manager (for Let's Encrypt)

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer for Let's Encrypt
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

## Step 5: Configure DNS

Get the Load Balancer URL:

```bash
kubectl get ingress digital-mirror-ingress -n digital-mirror
```

Create DNS records:
- `digitalmirror.app` → CNAME to Load Balancer
- `api.digitalmirror.app` → CNAME to Load Balancer

## Step 6: Database Migrations

If using managed database (RDS), run initial setup:

```bash
# Port-forward to backend pod
kubectl port-forward -n digital-mirror deployment/backend 8000:8000

# Tables are auto-created on first run
# Or run manual migrations if implemented
```

## Step 7: Environment Variables & Secrets

### Create Kubernetes secrets

```bash
kubectl create secret generic backend-secret \
  --from-literal=SECRET_KEY='your-production-secret-key' \
  -n digital-mirror

kubectl create secret generic postgres-secret \
  --from-literal=POSTGRES_USER='postgres' \
  --from-literal=POSTGRES_PASSWORD='your-secure-password' \
  -n digital-mirror
```

### Update ConfigMaps

```bash
kubectl create configmap backend-config \
  --from-literal=DATABASE_URL='postgresql+asyncpg://user:pass@rds-endpoint:5432/digital_mirror' \
  --from-literal=REDIS_URL='redis://elasticache-endpoint:6379' \
  -n digital-mirror
```

## Step 8: Monitoring & Logging (Optional)

### Prometheus & Grafana

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```

### CloudWatch Integration

AWS EKS automatically integrates with CloudWatch for logs.

## Step 9: Scaling

### Manual scaling

```bash
kubectl scale deployment backend --replicas=5 -n digital-mirror
kubectl scale deployment frontend --replicas=3 -n digital-mirror
```

### Auto-scaling

HPA is already configured in `backend-deployment.yaml`:
- Min replicas: 2
- Max replicas: 10
- CPU threshold: 70%
- Memory threshold: 80%

## Step 10: Backup & Disaster Recovery

### Database backups

RDS automatically creates backups (configured in Terraform):
- Retention: 7 days
- Backup window: 03:00-04:00 UTC

### Manual backup

```bash
aws rds create-db-snapshot \
  --db-instance-identifier digital-mirror-db \
  --db-snapshot-identifier manual-backup-$(date +%Y%m%d)
```

## Production Checklist

- [ ] Strong SECRET_KEY generated
- [ ] Database password changed from default
- [ ] SSL certificates configured
- [ ] DNS records updated
- [ ] Environment variables set
- [ ] Secrets created in Kubernetes
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Auto-scaling tested
- [ ] Health checks passing
- [ ] CORS origins configured
- [ ] Rate limiting configured (if needed)
- [ ] Log aggregation setup
- [ ] Error tracking (Sentry, etc.)

## Maintenance

### Update application

```bash
# Build and push new images
docker build -t jeremymartinezq/digital-mirror-backend:v1.1.0 backend/
docker push jeremymartinezq/digital-mirror-backend:v1.1.0

# Update Kubernetes deployment
kubectl set image deployment/backend backend=jeremymartinezq/digital-mirror-backend:v1.1.0 -n digital-mirror

# Check rollout status
kubectl rollout status deployment/backend -n digital-mirror

# Rollback if needed
kubectl rollout undo deployment/backend -n digital-mirror
```

### View logs

```bash
# Backend logs
kubectl logs -f deployment/backend -n digital-mirror

# Frontend logs
kubectl logs -f deployment/frontend -n digital-mirror

# All pods
kubectl logs -l app=backend -n digital-mirror --tail=100
```

### Database maintenance

```bash
# Connect to RDS
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d digital_mirror

# Check database size
SELECT pg_size_pretty(pg_database_size('digital_mirror'));

# Vacuum and analyze
VACUUM ANALYZE;
```

## Cost Optimization

### AWS Resources

- Use t3 instances for EKS (cost-effective)
- Enable auto-scaling to scale down during low traffic
- Use RDS reserved instances for production
- Enable S3 lifecycle policies
- Use CloudFront CDN for static assets

### Monitoring Costs

```bash
# Check AWS costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

## Security Best Practices

1. **Network**: Use VPC, private subnets, security groups
2. **Secrets**: Never commit secrets, use AWS Secrets Manager
3. **Database**: Encryption at rest and in transit
4. **Access**: IAM roles with least privilege
5. **Updates**: Keep all dependencies updated
6. **Scanning**: Regular vulnerability scans
7. **Logging**: Enable audit logs
8. **Firewall**: Use AWS WAF for application firewall

## Support

For deployment issues:
- Check logs: `kubectl logs`
- Check events: `kubectl get events -n digital-mirror`
- Check pod status: `kubectl describe pod <pod-name> -n digital-mirror`
- AWS Support: Use AWS Console or CLI

