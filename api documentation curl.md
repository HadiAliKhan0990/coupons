# API Documentation - cURL Commands

## Deployment Information

**Production URL**: `http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004`

**Base URL**: `http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api`

**Local Development URL**: `http://localhost:3004/api`

> **Note**: This documentation uses the production URL. If you're testing locally, replace the production URL with `http://localhost:3004`

## Table of Contents
1. [Test Endpoint](#1-test-endpoint)
2. [Create Coupon](#2-create-coupon)
3. [Get All Coupons](#3-get-all-coupons)
4. [Get Single Coupon](#4-get-single-coupon)
5. [Update Coupon](#5-update-coupon)
6. [Delete Coupon](#6-delete-coupon)
7. [Claim Coupon](#7-claim-coupon)
8. [Redeem Coupon](#8-redeem-coupon)
9. [Get Business Statistics](#9-get-business-statistics)
10. [Decrypt QR Code](#10-decrypt-qr-code)

---

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the `Authorization` header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Admin Routes**: Require user_category = 2 (Admin)
**User Routes**: Require valid JWT token

---

## 1. Test Endpoint

**Endpoint**: `GET /api/test`

**Description**: Test if the API server is working

**Authentication**: None

**cURL Command**:
```bash
curl -X GET http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/test
```

**Response**:
```json
{
  "message": "API is working!"
}
```

---

## 2. Create Coupon

**Endpoint**: `POST /api/coupon`

**Description**: Create a new coupon (Admin only)

**Authentication**: Required (Admin)

**Required Fields**:
- `name` (string): Coupon name
- `company_name` (string): Company/business name
- `coupon_type` (string): Type of coupon. Must be one of: `percentageDiscount`, `fixedDiscount`, `other`
- `total_available` (integer): Total number of coupons available (minimum: 1)
- `expiry_date` (string): Expiry date in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ)

**Optional Fields**:
- `product` (string): Product name or description
- `description` (string): Detailed description of the coupon

**cURL Command**:
```bash
curl -X POST http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Summer Sale 2024",
    "company_name": "ABC Store",
    "coupon_type": "percentageDiscount",
    "product": "Electronics",
    "description": "Get 20% off on all electronics",
    "total_available": 100,
    "expiry_date": "2024-12-31T23:59:59.999Z"
  }'
```

**Minimal Required Fields Example**:
```bash
curl -X POST http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Summer Sale",
    "company_name": "ABC Store",
    "coupon_type": "fixedDiscount",
    "total_available": 50,
    "expiry_date": "2024-12-31"
  }'
```

**Response** (201 Created):
```json
{
  "message": "Coupon created successfully",
  "newCoupon": {
    "id": 1,
    "name": "Summer Sale 2024",
    "company_name": "ABC Store",
    "coupon_type": "percentageDiscount",
    "product": "Electronics",
    "description": "Get 20% off on all electronics",
    "total_available": 100,
    "expiry_date": "2024-12-31T23:59:59.999Z",
    "coupon_code": "A1B2C3D4E5F6G7H8",
    "status": "AVAILABLE",
    "claimed_count": 0,
    "redeemed_count": 0,
    "qr_code": "data:image/png;base64,...",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "errors": [
    {
      "msg": "Coupon name is required",
      "param": "name",
      "location": "body"
    },
    {
      "msg": "Invalid coupon type",
      "param": "coupon_type",
      "location": "body"
    }
  ]
}
```

---

## 3. Get All Coupons

**Endpoint**: `GET /api/coupon`

**Description**: Retrieve all coupons (Admin only)

**Authentication**: Required (Admin)

**Query Parameters** (Optional):
- `available` (boolean): Filter to show only available coupons. Set to `true` to get only available, non-expired coupons with stock > 0
- `company_name` (string): Filter coupons by exact company name

**cURL Command** (All coupons):
```bash
curl -X GET http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**cURL Command** (Only available coupons):
```bash
curl -X GET "http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon?available=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**cURL Command** (Filter by company name):
```bash
curl -X GET "http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon?company_name=ABC%20Store" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**cURL Command** (Filter by company + available):
```bash
curl -X GET "http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon?company_name=ABC%20Store&available=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response** (200 OK):
```json
{
  "message": "Coupons retrieved successfully",
  "coupons": [
    {
      "id": 1,
      "name": "Summer Sale 2024",
      "company_name": "ABC Store",
      "coupon_type": "percentageDiscount",
      "product": "Electronics",
      "description": "Get 20% off on all electronics",
      "total_available": 100,
      "claimed_count": 5,
      "redeemed_count": 3,
      "expiry_date": "2024-12-31T23:59:59.999Z",
      "coupon_code": "A1B2C3D4E5F6G7H8",
      "status": "AVAILABLE",
      "qr_code": "data:image/png;base64,...",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z",
      "qrCode": "data:image/png;base64,..."
    }
  ]
}
```

---

## 4. Get Single Coupon

**Endpoint**: `GET /api/coupon/:id`

**Description**: Retrieve a specific coupon by ID (Admin only)

**Authentication**: Required (Admin)

**URL Parameters**:
- `id` (integer): Coupon ID

**cURL Command**:
```bash
curl -X GET http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response** (200 OK):
```json
{
  "coupon": {
    "id": 1,
    "name": "Summer Sale 2024",
    "company_name": "ABC Store",
    "coupon_type": "percentageDiscount",
    "product": "Electronics",
    "description": "Get 20% off on all electronics",
    "total_available": 100,
    "claimed_count": 5,
    "redeemed_count": 3,
    "expiry_date": "2024-12-31T23:59:59.999Z",
    "coupon_code": "A1B2C3D4E5F6G7H8",
    "status": "AVAILABLE",
    "qr_code": "data:image/png;base64,...",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "qrCode": "data:image/png;base64,..."
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "Coupon not found"
}
```

---

## 5. Update Coupon

**Endpoint**: `PUT /api/coupon/:id`

**Description**: Update an existing coupon (Admin only)

**Authentication**: Required (Admin)

**URL Parameters**:
- `id` (integer): Coupon ID

**Required Fields** (all fields from create):
- `name` (string): Coupon name
- `company_name` (string): Company/business name
- `coupon_type` (string): Must be one of: `percentageDiscount`, `fixedDiscount`, `other`
- `total_available` (integer): Total number of coupons available (minimum: 1)
- `expiry_date` (string): Expiry date in ISO 8601 format

**Optional Fields**:
- `product` (string): Product name or description
- `description` (string): Detailed description of the coupon

**cURL Command** (Full update):
```bash
curl -X PUT http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Winter Sale 2024",
    "company_name": "ABC Store",
    "coupon_type": "percentageDiscount",
    "product": "All Items",
    "description": "Get 30% off on all items",
    "total_available": 150,
    "expiry_date": "2024-12-31T23:59:59.999Z"
  }'
```

**cURL Command** (Minimal update):
```bash
curl -X PUT http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Updated Sale",
    "company_name": "ABC Store",
    "coupon_type": "fixedDiscount",
    "total_available": 200,
    "expiry_date": "2024-12-31"
  }'
```

**Response** (200 OK):
```json
{
  "message": "Coupon updated",
  "coupon": {
    "id": 1,
    "name": "Winter Sale 2024",
    "company_name": "ABC Store",
    "coupon_type": "percentageDiscount",
    "product": "All Items",
    "description": "Get 30% off on all items",
    "total_available": 150,
    "claimed_count": 5,
    "redeemed_count": 3,
    "expiry_date": "2024-12-31T23:59:59.999Z",
    "coupon_code": "A1B2C3D4E5F6G7H8",
    "status": "AVAILABLE",
    "qr_code": "data:image/png;base64,...",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-20T15:45:00.000Z"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "Coupon not found"
}
```

---

## 6. Delete Coupon

**Endpoint**: `DELETE /api/coupon/:id`

**Description**: Delete a coupon (Admin only)

**Authentication**: Required (Admin)

**URL Parameters**:
- `id` (integer): Coupon ID

**cURL Command**:
```bash
curl -X DELETE http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response** (200 OK):
```json
{
  "message": "Coupon deleted"
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "Coupon not found"
}
```

---

## 7. Claim Coupon

**Endpoint**: `POST /api/coupon/:id/claim`

**Description**: Claim a coupon (decrements available count, increments claimed count)

**Authentication**: Required (User)

**URL Parameters**:
- `id` (integer): Coupon ID

**Request Body**: None required

**cURL Command**:
```bash
curl -X POST http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon/1/claim \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response** (200 OK):
```json
{
  "message": "Coupon claimed successfully",
  "coupon": {
    "id": 1,
    "name": "Summer Sale 2024",
    "company_name": "ABC Store",
    "coupon_type": "percentageDiscount",
    "product": "Electronics",
    "description": "Get 20% off on all electronics",
    "total_available": 100,
    "claimed_count": 6,
    "redeemed_count": 3,
    "expiry_date": "2024-12-31T23:59:59.999Z",
    "coupon_code": "A1B2C3D4E5F6G7H8",
    "status": "CLAIMED",
    "qr_code": "data:image/png;base64,...",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-20T16:00:00.000Z",
    "qrCode": "data:image/png;base64,..."
  }
}
```

**Error Responses**:

*Coupon not found* (404 Not Found):
```json
{
  "message": "Coupon not found"
}
```

*Coupon not available* (400 Bad Request):
```json
{
  "message": "Coupon is not available for claiming"
}
```

*Coupon expired* (400 Bad Request):
```json
{
  "message": "Coupon has expired"
}
```

*No coupons available* (400 Bad Request):
```json
{
  "message": "No more coupons available to claim"
}
```

---

## 8. Redeem Coupon

**Endpoint**: `POST /api/coupon/redeem`

**Description**: Redeem a claimed coupon using its coupon code

**Authentication**: Required (User)

**Required Fields**:
- `coupon_code` (string): The unique coupon code

**cURL Command**:
```bash
curl -X POST http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon/redeem \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "coupon_code": "A1B2C3D4E5F6G7H8"
  }'
```

**Response** (200 OK):
```json
{
  "message": "Coupon redeemed successfully",
  "coupon": {
    "id": 1,
    "name": "Summer Sale 2024",
    "company_name": "ABC Store",
    "coupon_type": "percentageDiscount",
    "product": "Electronics",
    "description": "Get 20% off on all electronics",
    "total_available": 100,
    "claimed_count": 6,
    "redeemed_count": 4,
    "expiry_date": "2024-12-31T23:59:59.999Z",
    "coupon_code": "A1B2C3D4E5F6G7H8",
    "status": "REDEEMED",
    "qr_code": "data:image/png;base64,...",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-20T16:30:00.000Z",
    "qrCode": "data:image/png;base64,..."
  }
}
```

**Error Responses**:

*Missing coupon code* (400 Bad Request):
```json
{
  "message": "Please provide the coupon code"
}
```

*Coupon not found* (404 Not Found):
```json
{
  "message": "Coupon not found"
}
```

*Already redeemed* (400 Bad Request):
```json
{
  "message": "Coupon has already been redeemed"
}
```

*Coupon expired* (400 Bad Request):
```json
{
  "message": "Coupon has expired"
}
```

*Not claimed yet* (400 Bad Request):
```json
{
  "message": "Coupon must be claimed before redemption"
}
```

---

## 9. Get Business Statistics

**Endpoint**: `GET /api/coupon/business/:company_name/stats`

**Description**: Get statistics for a specific business/company (Admin only)

**Authentication**: Required (Admin)

**URL Parameters**:
- `company_name` (string): Company name (URL encoded if contains spaces)

**cURL Command**:
```bash
curl -X GET http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon/business/ABC%20Store/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**cURL Command** (company name without spaces):
```bash
curl -X GET http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon/business/ABCStore/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response** (200 OK):
```json
{
  "message": "Business statistics retrieved successfully",
  "stats": {
    "total_coupons": 10,
    "total_claimed": 45,
    "total_redeemed": 30
  }
}
```

---

## 10. Decrypt QR Code

**Endpoint**: `POST /api/coupon/qrCode/decrypt`

**Description**: Decrypt QR code data to retrieve coupon information

**Authentication**: None

**Required Fields**:
- `encryptedData` (string): The encrypted data from the QR code

**cURL Command**:
```bash
curl -X POST http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon/qrCode/decrypt \
  -H "Content-Type: application/json" \
  -d '{
    "encryptedData": "ENCRYPTED_STRING_FROM_QR_CODE"
  }'
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "couponId": 1,
    "couponCode": "A1B2C3D4E5F6G7H8",
    "companyName": "ABC Store",
    "expiryDate": "2024-12-31T23:59:59.999Z"
  }
}
```

**Error Responses**:

*Missing encrypted data* (400 Bad Request):
```json
{
  "success": false,
  "message": "Encrypted data is required"
}
```

*Decryption failed* (500 Internal Server Error):
```json
{
  "success": false,
  "message": "Failed to decrypt QR code data",
  "error": "Invalid encryption format"
}
```

---

## Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data or validation failed
- **401 Unauthorized**: Invalid or expired token
- **403 Forbidden**: Missing token or insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Authentication Error Responses

**Missing Token** (403 Forbidden):
```json
{
  "status": false,
  "status_msg": "A token is required for authentication",
  "data": undefined
}
```

**Invalid Token** (401 Unauthorized):
```json
{
  "status": false,
  "status_msg": "Invalid Token",
  "data": undefined
}
```

**Admin Access Denied** (403 Forbidden):
```json
{
  "status": false,
  "status_msg": "Access denied. Admin privileges required.",
  "data": undefined
}
```

---

## Notes

1. **Date Format**: All dates should be in ISO 8601 format. Examples:
   - Simple date: `2024-12-31`
   - Full datetime: `2024-12-31T23:59:59.999Z`

2. **Coupon Types**: Valid values are:
   - `percentageDiscount`
   - `fixedDiscount`
   - `other`

3. **Coupon Status**: Possible values:
   - `AVAILABLE`: Coupon is available for claiming
   - `CLAIMED`: Coupon has been claimed by a user
   - `REDEEMED`: Coupon has been redeemed
   - `EXPIRED`: Coupon has expired

4. **URL Encoding**: Remember to URL encode company names and other URL parameters that contain special characters (spaces, &, etc.)

5. **QR Codes**: QR codes are returned as base64-encoded data URLs. To view them, you can:
   - Use the `/view-qr` endpoint in the browser
   - Decode and display in an `<img>` tag
   - Save as an image file

6. **Token Format**: JWT tokens should be included in the Authorization header with the "Bearer" prefix:
   ```
   Authorization: Bearer YOUR_ACTUAL_JWT_TOKEN
   ```

---

## Quick Reference Table

| Method | Endpoint | Auth | Admin Required | Description |
|--------|----------|------|----------------|-------------|
| GET | `/api/test` | No | No | Test API |
| POST | `/api/coupon` | Yes | Yes | Create coupon |
| GET | `/api/coupon` | Yes | Yes | Get all coupons |
| GET | `/api/coupon/:id` | Yes | Yes | Get single coupon |
| PUT | `/api/coupon/:id` | Yes | Yes | Update coupon |
| DELETE | `/api/coupon/:id` | Yes | Yes | Delete coupon |
| POST | `/api/coupon/:id/claim` | Yes | No | Claim coupon |
| POST | `/api/coupon/redeem` | Yes | No | Redeem coupon |
| GET | `/api/coupon/business/:company_name/stats` | Yes | Yes | Get business stats |
| POST | `/api/coupon/qrCode/decrypt` | No | No | Decrypt QR code |

---

## Testing Tips

1. **Get a Token First**: You'll need a valid JWT token to test most endpoints. This token should be obtained from your authentication service.

2. **Test Order**: Recommended testing sequence:
   - Test the `/api/test` endpoint
   - Create a coupon (admin)
   - Get all coupons (admin)
   - Get single coupon (admin)
   - Claim a coupon (user)
   - Redeem a coupon (user)
   - Update coupon (admin)
   - Get business stats (admin)
   - Delete coupon (admin)

3. **Environment Variables**: Make sure you have the following environment variables set on the server:
   - `PORT`: Server port (default: 3004)
   - `AUTH_KEY`: JWT secret key (used for token verification)
   - `ENCRYPTION_KEY`: For QR code encryption
   - `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`: Database connection variables
   - `ALLOWED_ORIGINS`: CORS allowed origins

4. **Windows PowerShell**: If using PowerShell, wrap the JSON in single quotes and escape double quotes:
   ```powershell
   curl -X POST http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/coupon/redeem `
     -H "Content-Type: application/json" `
     -H "Authorization: Bearer YOUR_JWT_TOKEN" `
     -d '{\"coupon_code\": \"A1B2C3D4E5F6G7H8\"}'
   ```

5. **Postman Alternative**: You can import these curl commands directly into Postman or other API testing tools.

---

## Deployment Information

### Production Server
- **Host**: AWS EC2 (Canada Central - ca-central-1)
- **URL**: `http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004`
- **Port**: 3004
- **Environment**: Production
- **Container**: Docker (coupon-service)

### Quick Deploy
To deploy updates to production:
```powershell
.\deploy.ps1
```

### Server Access
```bash
ssh -i aws-services-stage.pem ubuntu@ec2-3-96-139-52.ca-central-1.compute.amazonaws.com
cd /home/ubuntu/coupon-service
```

### View Logs
```bash
docker-compose logs -f
```

### Restart Service
```bash
docker-compose restart
```

### Test Deployment
After deployment, verify the service is running:
```bash
curl -X GET http://ec2-3-96-139-52.ca-central-1.compute.amazonaws.com:3004/api/test
```

Expected response:
```json
{
  "message": "API is working!"
}
```

---

**Last Updated**: January 6, 2025

