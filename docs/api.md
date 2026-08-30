# Azaria SW Backend API

# 1. Overview

## Base URL

```
https://<server-domain>/api/v1
```

All API endpoints are relative to this base URL.

---

## Authentication

Administrative endpoints require a JSON Web Token (JWT).

Authentication is performed in two steps:

1. Obtain a temporary challenge token.

```
POST /auth/challenge
```

2. Exchange the challenge token for an admin access token.

```
POST /auth/login
```

Protected endpoints require the following request header:

```
Authorization: Bearer <access_token>
```

If the token is missing, invalid, or expired, the API returns a `401 Unauthorized` response.

---

## Content Types

The API accepts two request formats depending on the endpoint.

### JSON

Used for standard CRUD operations.

```
Content-Type: application/json
```

### Multipart Form Data

Used when uploading files.

```
Content-Type: multipart/form-data
```

Multipart requests may contain both files and regular form fields.

---

## Standard Response Format

Successful requests follow a consistent response structure.

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully.",
  "data": {}
}
```

Paginated endpoints return:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resources retrieved successfully.",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

---

## Error Response Format

All errors follow the same structure.

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [],
  "requestId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

The `requestId` uniquely identifies each request and can be used for server-side log tracing.

---

## Common Query Parameters

Many collection endpoints support pagination, searching, filtering, and sorting.

| Parameter | Description                                             |
| --------- | ------------------------------------------------------- |
| `page`    | Page number (default: `1`)                              |
| `limit`   | Number of items per page (default: `30`, maximum: `50`) |
| `search`  | Case-insensitive search                                 |
| `sort`    | Field used for sorting                                  |
| `order`   | `asc` or `desc`                                         |

Some resources expose additional filters (such as `featured`, `category`, `role`, or `isRead`) which are documented with their respective endpoints.

---

## HTTP Status Codes

| Status                      | Meaning                                  |
| --------------------------- | ---------------------------------------- |
| `200 OK`                    | Request completed successfully           |
| `201 Created`               | Resource created successfully            |
| `400 Bad Request`           | Invalid request or validation error      |
| `401 Unauthorized`          | Authentication required or token invalid |
| `403 Forbidden`             | Access denied                            |
| `404 Not Found`             | Requested resource does not exist        |
| `409 Conflict`              | Resource conflict                        |
| `429 Too Many Requests`     | Rate limit exceeded                      |
| `500 Internal Server Error` | Unexpected server error                  |

# 2. Authentication

| Method | Endpoint          | Authentication                | Description            |
| ------ | ----------------- | ----------------------------- | ---------------------- |
| POST   | `/auth/challenge` | X-Admin-Challenge: <token>    | Verify admin challenge |
| POST   | `/auth/login`     | Authorization: Bearer <token> | Login                  |

# 3. Health

## GET /health

Returns the health status of the API and database connection.

### Response Format

```json
{
  {
    "success": true,
    "statusCode": 200,
    "message": "Health check successful",
    "data": {
        "status": "healthy",
        "database": "connected",
        "uptime": 3644.2243995,
        "responseTime": "103ms"
    }
 }
}
```

# 4. Profile

## GET /profile

Returns portfolio profile.

## PUT /profile

Updates the portfolio profile.

Authentication Required:

```
Authorization: Bearer <token>
```

### Request Body

multipart/form-data

| Field        | Type                      | size limit |
| ------------ | ------------------------- | ---------- |
| fullName     | string                    | 100 char   |
| title        | string                    | 150 char   |
| bio          | String                    | 3000 char  |
| email        | String(email)             |            |
| phone        | String(phone number)      | 20 char    |
| telegram     | String(username)          | 5-32 char  |
| location     | String                    | 100 char   |
| profileImage | file(jpg, jpeg,png, webp) | 10mb       |
| resume       | pdf                       | 10mb       |
| cv           | pdf                       | 10mb       |
| github       | String(url)               |            |
| linkedin     | String(url)               |            |

# 5. Projects

## GET /projects

Returns paginated projects including paths of the images they contains.

### Unique Query Parameters

| Parameter | Type    | Description                                                   |
| --------- | ------- | ------------------------------------------------------------- |
| sort      | string  | `title`, `createdAt`,`description`, `featured` or `updatedAt` |
| featured  | boolean | Filter featured projects                                      |

## GET /projects/:id

Returns specific project including the paths of the images it contains.

## POST /projects

Creates a project.

Authentication Required:

```
Authorization: Bearer <token>
```

### Request Body

## |JSON | multipart/form-data |

multipart/form-data

| Field                 | Type                      | Max Size  |
| --------------------- | ------------------------- | --------- |
| title(REQUIRED)       | string                    | 100 char  |
| description(REQUIRED) | string                    | 1000 char |
| githubUrl             | String(url)               |           |
| liveUrl               | String(url)               |           |
| images                | file(jpg, jpeg,png, webp) | 10mb      |
| images                | file(jpg, jpeg,png, webp) | 10mb      |
| images                | file(jpg, jpeg,png, webp) | 10mb      |
| images                | file(jpg, jpeg,png, webp) | 10mb      |
| .                     | .                         | .         |
| .                     | .                         | .         |
| .                     | .                         | .         |

upto 20 images

## PUT /projects/:id

updates a project.

Authentication Required:

```
Authorization: Bearer <token>
```

### Request Body

multipart/form-data

| Field         | Type                                                          | Max Size  |
| ------------- | ------------------------------------------------------------- | --------- |
| title         | string                                                        | 100 char  |
| description   | string                                                        | 1000 char |
| githubUrl     | String(url)                                                   |           |
| liveUrl       | String(url)                                                   |           |
| deletedImages | array of Strings(UUID)                                        | 10mb      |
| imageOrder    | array of object({id: String(UUID), order: int(non negative)}) |           |
| images        | file(jpg, jpeg,png, webp)                                     | 10mb      |
| images        | file(jpg, jpeg,png, webp)                                     | 10mb      |
| images        | file(jpg, jpeg,png, webp)                                     | 10mb      |
| images        | file(jpg, jpeg,png, webp)                                     | 10mb      |
| .             | .                                                             | .         |
| .             | .                                                             | .         |
| .             | .                                                             | .         |

upto 20 images

## DELETE /projects/:id

Deletes a project.

Authentication Required:

```
Authorization: Bearer <token>
```

# 6. Skills

## GET /skills

Returns paginated skills.

### Unique Query Parameters

| Parameter | Type   | Description                              |
| --------- | ------ | ---------------------------------------- |
| sort      | string | `name`, `category`,`createdAt`or `level` |
| category  | string | search for the specific category skills  |

## GET /skills/:id

Returns specific skill.

## POST /skills

Creates a skill.

Authentication Required:

```
Authorization: Bearer <token>
```

### Request Body

```json
{
  "name": "skill name (Max 100 characters)(REQUIRED)",
  "category": "category name (Max 100 characters)(REQUIRED)",
  "level": "3-30 character(Max 50 characters)(REQUIRED)",
  "icon": "https://..."
}
```

## PUT /skills/:id

updates a skill.

Authentication Required:

```
Authorization: Bearer <token>
```

### Request Body

```json
{
  "name": "skill name (Max 100 character)",
  "category": "category name (Max 100 characters)",
  "level": "3-30 character(Max 50 characters)",
  "icon": "https://..."
}
```

## DELETE /skills/:id

Deletes a skill.

Authentication Required:

```
Authorization: Bearer <token>
```

# 7. Experiences

## GET /experiences

Returns paginated experiences.

### Unique Query Parameters

| Parameter | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| sort      | string | `company`, `role`,`createdAt`or `startDate` |
| role      | string | search for the specific role experiences    |

## GET /experiences/:id

Returns specific experience.

## POST /experiences

Creates an experience.

Authentication Required:

```
Authorization: Bearer <token>
```

### Request Body

```json
{
  "company": "company name (Max 100 characters)(REQUIRED)",
  "role": "role (Max 50 characters)(REQUIRED)",
  "description": "description (Max 1000 characters)(REQUIRED)",
  "startDate": "dd/mm/yyyy(REQUIRED)",
  "endDate": "dd/mm/yyyy"
}
```

## PUT /experiences/:id

updates a experience.

Authentication Required:

```
Authorization: Bearer <token>
```

### Request Body

```json
{
  "company": "company name (Max 100 characters)",
  "role": "role (Max 50 characters)",
  "description": "description (Max 1000 characters)",
  "startDate": "dd/mm/yyyy",
  "endDate": "dd/mm/yyyy"
}
```

## DELETE /experiences/:id

Deletes a experience.

Authentication Required:

```
Authorization: Bearer <token>
```

# 8. Education

## GET /education

Returns paginated educations.

### Unique Query Parameters

| Parameter | Type   | Description                                                          |
| --------- | ------ | -------------------------------------------------------------------- |
| sort      | string | `institution`, `degree`,`field`,`endDate`,`createdAt` or `startDate` |

## GET /education/degrees

Returns all distinct attained degrees.

## GET /education/:id

Returns specific education.

## POST /education

Creates an education.

Authentication Required:
Authorization: Bearer <token>

### Request Body

```json
{
  "institution": "institution name (Max 100 characters)(REQUIRED)",
  "degree": "degree (Max 50 characters)(REQUIRED)",
  "field": "field (Max 100 characters)(REQUIRED)",
  "startDate": "dd/mm/yyyy(REQUIRED)",
  "endDate": "dd/mm/yyyy"
}
```

## PUT /education/:id

updates a education.

Authentication Required:

```
Authorization: Bearer <token>
```

### Request Body

```json
{
  "institution": "institution name (Max 100 characters)",
  "degree": "degree (Max 50 characters)",
  "field": "field (Max 100 characters)",
  "startDate": "dd/mm/yyyy",
  "endDate": "dd/mm/yyyy"
}
```

## DELETE /education/:id

Deletes a education.

Authentication Required:

```
Authorization: Bearer <token>
```

# 9. Certificates

## GET /certificates

Returns paginated certificates.

### Unique Query Parameters

| Parameter | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| sort      | string | `name`, `issuer`,`createdAt` or `issueDate` |

## GET /certificates/:id

Returns specific certificate.

## POST /certificates

Creates a certificate.

Authentication Required:

```
Authorization: Bearer <token>
```

### Request Body

multipart/form-data

| Field               | Type                      | Max Size |
| ------------------- | ------------------------- | -------- |
| name(REQUIRED)      | string                    | 100 char |
| issuer(REQUIRED)    | string                    | 100 char |
| issueDate(REQUIRED) | dd/mm/yyyy                |          |
| credentialUrl       | String(url)               |          |
| image               | file(jpg, jpeg,png, webp) | 10mb     |

## PUT /certificates/:id

updates a certificate.

Authentication Required:

```
Authorization: Bearer <token>
```

### Request Body

multipart/form-data

| Field         | Type                      | Max Size |
| ------------- | ------------------------- | -------- |
| name          | string                    | 100 char |
| issuer        | string                    | 100 char |
| issueDate     | Date(dd/mm/yyyy)          |          |
| credentialUrl | String(url)               |          |
| image         | file(jpg, jpeg,png, webp) | 10mb     |

## DELETE /certificates/:id

Deletes a certificate.

Authentication Required:

```
Authorization: Bearer <token>
```

# 10. Messages

## GET /messages

Returns paginated messages.

Authentication Required:

```
Authorization: Bearer <token>
```

### Unique Query Parameters

| Parameter | Type    | Description                                                |
| --------- | ------- | ---------------------------------------------------------- |
| sort      | string  | `name`,`email`,`subject`,`message`,`createdAt` or `isRead` |
| isRead    | boolean | filter meassage                                            |

## GET /messages/:id

Returns specific message.

Authentication Required:

```
Authorization: Bearer <token>
```

## POST /messages

Sends a message.

### Request Body

```json
{
  "name": " name (Max 100 characters)(REQUIRED)",
  "email": "eg@gmail.com(REQUIRED)",
  "subject": "subject (Max 200 characters)(REQUIRED)",
  "message": "message (Max 2000 characters)(REQUIRED)"
}
```

## PATCH /messages/:id

mark message as read.

Authentication Required:

```
Authorization: Bearer <token>
```

### Request Body

empty body {}

## DELETE /messages/:id

Deletes a message.

Authentication Required:

```
Authorization: Bearer <token>
```

# 11. GitHub

Cached for 15 minutes.

Data fetched from GitHub API.

## GET /github/profile

Returns github profile.

## GET /github/repositories

Returns repositories from github.

## GET /github/activity

Returns recent github activities.

# 12. File Storage

The API supports file uploads for profile assets, project images, and certificate images.

Files are stored in Cloudinary. The database stores the Cloudinary URL and asset metadata.

---

## Storage

Cloudinary folders:

```text
profile/
resume/
cv/
projects/
certificates/
```

Project images use generated project-specific public IDs.

---

## Supported File Types

### Images

Used for:

- Profile image
- Project images
- Certificate images

Supported formats:

- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- WebP (`.webp`)

---

### Documents

Used for:

- Resume
- Curriculum Vitae (CV)

Supported format:

- PDF (`.pdf`)

---

## Validation

Before a file is accepted, the server validates:

- File extension
- MIME type
- Maximum file size
- Expected upload field

Invalid uploads are rejected before reaching the application.

---

## Stored Data

For uploaded assets, the database stores the Cloudinary URL and, where applicable, the Cloudinary public ID and resource type.

Example:

```json
{
  "id": "uuid",
  "url": "https://res.cloudinary.com/...",
  "publicId": "projects/project-id/generated-id",
  "resourceType": "image",
  "order": 1
}
```

---

## Multipart Requests

Endpoints that support file uploads use:

```
Content-Type: multipart/form-data
```

Files and regular form fields can be submitted in the same request.

For example:

```
title
description
featured
images[]
```

or

```
fullName
bio
profileImage
resume
cv
```

---

## Project Images

Each project may contain multiple images.

Images are stored independently from the project itself and include ordering information.

Each image record contains:

```json
{
  "id": "uuid",
  "url": "https://res.cloudinary.com/...",
  "publicId": "projects/project-id/generated-id",
  "resourceType": "image",
  "order": 1
}
```

The `order` property determines the display sequence of images.

---

## File Replacement and Deletion

When an uploaded asset is replaced or deleted, the previous Cloudinary asset is removed.

Deleting a project also removes its associated Cloudinary images.

Database updates and file cleanup are handled by the corresponding service layer.

## Notes

- File uploads are validated before any database changes are committed.
