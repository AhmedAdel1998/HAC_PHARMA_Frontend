# HAC Pharma CMS - Backend API Specification

> **For Backend Team**: .NET Core Web API with SQL Server

---

## Authentication

### POST `/api/auth/login`
```json
Request:
{
  "email": "admin@hacpharma.com",
  "password": "string"
}

Response (200):
{
  "token": "JWT_TOKEN",
  "refreshToken": "REFRESH_TOKEN",
  "user": {
    "id": 1,
    "email": "admin@hacpharma.com",
    "role": "Admin",
    "name": "John Doe"
  },
  "expiresIn": 3600
}
```

### POST `/api/auth/refresh`
### POST `/api/auth/logout`
### GET `/api/auth/me` (Protected)

---

## Content Management (CMS)

### GET `/api/content/{pageKey}/{lang}`
Get content for a specific page in a language.
```json
Response:
{
  "id": 1,
  "pageKey": "home",
  "language": "en",
  "content": {
    "hero": {
      "title": "HAC Pharma",
      "subtitle": "Innovating Healthcare"
    },
    "about": { ... }
  },
  "updatedAt": "2026-01-17T12:00:00Z",
  "updatedBy": "admin@hacpharma.com"
}
```

### PUT `/api/content/{pageKey}/{lang}` (Protected: Admin/Editor)
```json
Request:
{
  "content": { ... JSON object ... }
}
```

### GET `/api/content/pages`
List all page keys: `["home", "about", "services", "products", ...]`

---

## Products / Drug Database

### GET `/api/products`
```json
Query: ?category=Oncology&search=CardioPlus&page=1&limit=20

Response:
{
  "items": [
    {
      "id": 1,
      "name": "CardioPlus",
      "nameAr": "كارديو بلس",
      "category": "Cardiovascular",
      "description": "Advanced treatment...",
      "dosage": "10mg, 20mg",
      "stockStatus": "available",
      "priceSar": 150.00,
      "priceUsd": 40.00,
      "image": "/media/products/cardioplus.jpg"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### GET `/api/products/{id}`
### POST `/api/products` (Protected: Admin)
### PUT `/api/products/{id}` (Protected: Admin)
### DELETE `/api/products/{id}` (Protected: Admin)

### GET `/api/products/categories`
```json
["Cardiovascular", "Oncology", "Neurology", "Diabetes", "Dermatology"]
```

### GET `/api/products/{id}/interactions`
```json
[
  { "drugId": 5, "drugName": "Aspirin", "severity": "moderate", "description": "May increase bleeding risk" }
]
```

---

## Media Library

### GET `/api/media`
```json
Query: ?type=image&page=1

Response:
{
  "items": [
    {
      "id": 1,
      "filename": "product-image.jpg",
      "url": "/uploads/product-image.jpg",
      "type": "image",
      "size": 102400,
      "uploadedAt": "2026-01-17T12:00:00Z"
    }
  ]
}
```

### POST `/api/media/upload` (multipart/form-data)
### DELETE `/api/media/{id}` (Protected: Admin)

---

## Users Management

### GET `/api/users` (Protected: Admin)
### POST `/api/users` (Protected: Admin)
```json
Request:
{
  "email": "editor@hacpharma.com",
  "password": "string",
  "name": "Jane Doe",
  "role": "Editor"
}
```
Roles: `Admin`, `Editor`, `Viewer`

### PUT `/api/users/{id}` (Protected: Admin)
### DELETE `/api/users/{id}` (Protected: Admin)

---

## Request for Quotation (RFQ)

### POST `/api/rfq`
```json
Request:
{
  "companyName": "Hospital XYZ",
  "contactName": "John",
  "email": "john@hospital.com",
  "phone": "+966500000000",
  "products": [
    { "productId": 1, "quantity": 100 },
    { "productId": 5, "quantity": 50 }
  ],
  "message": "Need bulk order"
}
```

### GET `/api/rfq` (Protected: Admin)
### GET `/api/rfq/{id}` (Protected: Admin)
### PUT `/api/rfq/{id}/status` (Protected: Admin)
Status: `pending`, `reviewed`, `quoted`, `accepted`, `rejected`

---

## Career Applications

### GET `/api/jobs`
```json
[
  {
    "id": 1,
    "title": "Sales Representative",
    "titleAr": "مندوب مبيعات",
    "department": "Sales",
    "location": "Riyadh",
    "type": "Full-time",
    "description": "...",
    "requirements": ["..."],
    "isActive": true
  }
]
```

### GET `/api/jobs/{id}`
### POST `/api/jobs` (Protected: Admin)
### PUT `/api/jobs/{id}` (Protected: Admin)

### POST `/api/jobs/{id}/apply` (multipart/form-data)
```
Fields: name, email, phone, coverLetter, resume (file)
```

### GET `/api/applications` (Protected: Admin)

---

## Events / Webinars

### GET `/api/events`
```json
[
  {
    "id": 1,
    "title": "Pharmaceutical Trends 2026",
    "date": "2026-02-15T10:00:00Z",
    "type": "webinar",
    "description": "...",
    "registrationUrl": "https://...",
    "isUpcoming": true
  }
]
```

### POST `/api/events` (Protected: Admin)
### PUT `/api/events/{id}` (Protected: Admin)
### POST `/api/events/{id}/register`

---

## Analytics (Protected: Admin)

### GET `/api/analytics/overview`
```json
{
  "visitors": { "today": 150, "week": 1200, "month": 5000 },
  "pageViews": { "today": 450, "week": 3500, "month": 15000 },
  "topPages": [
    { "page": "/products", "views": 500 },
    { "page": "/", "views": 400 }
  ],
  "rfqCount": { "pending": 5, "total": 50 },
  "applicationCount": 12
}
```

---

## Settings

### GET `/api/settings` (Protected: Admin)
### PUT `/api/settings` (Protected: Admin)
```json
{
  "siteName": "HAC Pharma",
  "contactEmail": "info@hacpharma.com",
  "contactPhone": "+966...",
  "socialLinks": {
    "linkedin": "...",
    "twitter": "..."
  },
  "whatsappNumber": "+966...",
  "defaultLanguage": "en",
  "maintenanceMode": false
}
```

---

## Database Tables (SQL Server)

```sql
-- Users
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Name NVARCHAR(100),
    Role NVARCHAR(20) DEFAULT 'Viewer',
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Content
CREATE TABLE Content (
    Id INT PRIMARY KEY IDENTITY,
    PageKey NVARCHAR(50) NOT NULL,
    Language NVARCHAR(5) NOT NULL,
    ContentJson NVARCHAR(MAX),
    UpdatedAt DATETIME2,
    UpdatedBy INT FOREIGN KEY REFERENCES Users(Id),
    UNIQUE(PageKey, Language)
);

-- Products
CREATE TABLE Products (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(200) NOT NULL,
    NameAr NVARCHAR(200),
    Category NVARCHAR(100),
    Description NVARCHAR(MAX),
    DescriptionAr NVARCHAR(MAX),
    Dosage NVARCHAR(200),
    StockStatus NVARCHAR(20) DEFAULT 'available',
    PriceSar DECIMAL(10,2),
    PriceUsd DECIMAL(10,2),
    ImageUrl NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Media
CREATE TABLE Media (
    Id INT PRIMARY KEY IDENTITY,
    Filename NVARCHAR(255) NOT NULL,
    Url NVARCHAR(500) NOT NULL,
    Type NVARCHAR(20),
    Size BIGINT,
    UploadedAt DATETIME2 DEFAULT GETUTCDATE(),
    UploadedBy INT FOREIGN KEY REFERENCES Users(Id)
);

-- RFQ
CREATE TABLE RfqRequests (
    Id INT PRIMARY KEY IDENTITY,
    CompanyName NVARCHAR(200),
    ContactName NVARCHAR(100),
    Email NVARCHAR(255),
    Phone NVARCHAR(50),
    ProductsJson NVARCHAR(MAX),
    Message NVARCHAR(MAX),
    Status NVARCHAR(20) DEFAULT 'pending',
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Jobs & Applications
CREATE TABLE Jobs (
    Id INT PRIMARY KEY IDENTITY,
    Title NVARCHAR(200),
    TitleAr NVARCHAR(200),
    Department NVARCHAR(100),
    Location NVARCHAR(100),
    Type NVARCHAR(50),
    Description NVARCHAR(MAX),
    Requirements NVARCHAR(MAX),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE Applications (
    Id INT PRIMARY KEY IDENTITY,
    JobId INT FOREIGN KEY REFERENCES Jobs(Id),
    Name NVARCHAR(100),
    Email NVARCHAR(255),
    Phone NVARCHAR(50),
    CoverLetter NVARCHAR(MAX),
    ResumeUrl NVARCHAR(500),
    Status NVARCHAR(20) DEFAULT 'pending',
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Events
CREATE TABLE Events (
    Id INT PRIMARY KEY IDENTITY,
    Title NVARCHAR(200),
    TitleAr NVARCHAR(200),
    Date DATETIME2,
    Type NVARCHAR(50),
    Description NVARCHAR(MAX),
    RegistrationUrl NVARCHAR(500),
    IsActive BIT DEFAULT 1
);

-- Settings
CREATE TABLE Settings (
    Key NVARCHAR(100) PRIMARY KEY,
    Value NVARCHAR(MAX)
);
```

---

## JWT Configuration

```csharp
// appsettings.json
{
  "Jwt": {
    "Key": "YOUR_SECRET_KEY_HERE",
    "Issuer": "HACPharma",
    "Audience": "HACPharmaFrontend",
    "ExpiryMinutes": 60
  }
}
```

---

## CORS Configuration

Allow origins:
- `http://localhost:4200` (development)
- `https://hacpharma.com` (production)
- `https://admin.hacpharma.com` (admin dashboard)
