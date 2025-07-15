# Simple Deployment Script for Coupon Service
$EC2_HOST = "ec2-15-223-192-87.ca-central-1.compute.amazonaws.com"
$KEY_FILE = "E:\aws-services-stage.pem"

Write-Host "`nUploading files..." -ForegroundColor Cyan
scp -i $KEY_FILE -r package.json package-lock.json Dockerfile docker-compose.yml .dockerignore env.example index.js controllers models routes validations middlewares config utils connection "ubuntu@${EC2_HOST}:/home/ubuntu/coupon-service/"

Write-Host "Deploying..." -ForegroundColor Cyan
ssh -i $KEY_FILE "ubuntu@$EC2_HOST" "cd /home/ubuntu/coupon-service && [ ! -f .env ] && cp env.example .env; docker-compose down; docker-compose build; docker-compose up -d; docker ps"

Write-Host "`nDone! http://$EC2_HOST:3004" -ForegroundColor Green

