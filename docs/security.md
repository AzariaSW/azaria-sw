# Security

## Overview

The azaria-sw backend follows a layered security approach. Instead of relying on a single security mechanism, multiple independent protections are applied throughout the application to reduce attack surfaces and protect sensitive resources.

The security implementation covers:

- HTTP security headers
- CORS protection
- Rate limiting
- Hidden administrator interface
- Challenge-based administrator authentication
- Password hashing
- JWT authentication
- Request validation
- File upload validation
- Environment variable protection
- Error handling
- Request tracing
- Database security
- Containerized deployment

---

# Security Layers

```
                Client Request
                       |
                       v
              HTTP Security Headers
                       |
                       v
                  CORS Validation
                       |
                       v
                 Rate Limiting
                       |
                       v
                 Request ID
                       |
                       v
                HTTP Logging
                       |
                       v
              Request Validation
                       |
                       v
           Authentication (if required)
                       |
                       v
            Controller / Service Layer
                       |
                       v
                 Prisma Database
```

Not every request requires authentication. Public portfolio resources remain accessible without an administrator token, while protected administrator operations require authentication.

---

# HTTP Security

Helmet is used to configure secure HTTP response headers.

Configured protections include:

- Removes `X-Powered-By`
- Prevents MIME sniffing
- Clickjacking protection
- DNS prefetch control
- Cross-Origin Resource Policy
- Additional browser security headers

The backend explicitly allows uploaded assets to be requested cross-origin where required by the frontend.

Example:

```javascript
helmet({
    crossOriginResourcePolicy: {
        policy: "cross-origin"
    }
});
```

Helmet reduces browser-level attack surfaces but does not replace application-level authentication or input validation.

---

# Cross-Origin Resource Sharing (CORS)

The API uses CORS to restrict which frontend origins may communicate with it.

Allowed origins are configured through environment variables rather than being hard-coded into application logic.

Typical environments include:

```
http://localhost:5173
https://production-frontend.example
```

An origin that is not included in the configured allowlist is rejected by the CORS middleware.

CORS is a browser security mechanism. It does not replace authentication because non-browser clients can still send HTTP requests directly to the API.

---

# Rate Limiting

The backend uses rate limiting to reduce brute-force attacks, excessive requests, and API abuse.

The current global configuration provides a request limit over a configured time window.

The application currently uses:

- Configurable time window
- Maximum request count
- Standard rate-limit headers

When the configured limit is exceeded, the API returns an error response rather than continuing to process requests normally.

Example:

```json
{
    "success": false,
    "message": "Too many requests. Please try again later."
}
```

Rate limiting is an additional protection layer and should not be treated as the only defense against authentication attacks.

---

# Hidden Administrator Interface

The administrator interface is intentionally not exposed as part of the normal public portfolio navigation.

The frontend contains a hidden administrator entry mechanism.

This reduces accidental discovery of the administration interface but is not considered authentication by itself.

The backend still protects administrator operations using authentication middleware.

The API authentication endpoints remain part of the backend route structure and must therefore be protected independently of whether the frontend exposes links to them.

---

# Administrator Authentication

Administrator authentication uses a two-step process.

```
Secret Challenge
       |
       v
Challenge Verification
       |
       v
Challenge Token
       |
       v
Username + Password
       |
       v
Administrator JWT
       |
       v
Protected Admin Routes
```

## Step 1 - Challenge

The client must successfully complete the administrator challenge.

A valid challenge produces a short-lived challenge JWT.

The challenge token proves that the hidden authentication step has been completed.

## Step 2 - Login

The administrator submits the configured username and password together with the valid challenge authorization.

Only a successful challenge allows the normal administrator login process to continue.

A successful login produces an administrator JWT.

## Important Security Boundary

The hidden frontend entry point and the challenge are defense-in-depth measures.

They do not replace the administrator password or JWT authentication.

An attacker who discovers the backend authentication routes must still satisfy the challenge and valid administrator credentials.

---

# Password Security

Administrator passwords are never stored as plaintext passwords.

Password and challenge verification use bcrypt hashing.

Verification is performed through bcrypt comparison rather than direct plaintext comparison.

Example:

```javascript
bcrypt.compare()
```

Only the required password or challenge hashes are stored in protected configuration.

Secrets and hashes must not be committed to Git.

---

# JWT Authentication

JWT is used for administrator authentication.

Two logical token types are used.

## Challenge Token

The challenge token is issued after successful challenge verification.

Its purpose is to prove that the administrator challenge has been completed.

It is short-lived and must be presented during the administrator login flow.

Example payload structure:

```json
{
    "type": "challenge",
    "authorized": true
}
```

The exact signing secret and expiration configuration are kept outside source control.

---

## Administrator Token

The administrator token is issued after successful administrator authentication.

It is used to authorize protected administrator endpoints.

Example payload structure:

```json
{
    "role": "admin",
    "username": "..."
}
```

The server verifies:

- Token validity
- Token signature
- Token expiration
- Required administrator role

Invalid or expired tokens are rejected before protected controller logic is executed.

---

# Authentication Middleware

Protected routes use administrator authentication middleware.

The middleware performs the authentication checks before the request reaches the controller.

The general flow is:

1. Read the authorization token.
2. Verify the JWT.
3. Check token validity and expiration.
4. Validate the required administrator authorization.
5. Attach authenticated information to the request.
6. Allow the request to continue.

Requests that fail authentication are rejected before protected business logic executes.

---

# Request Validation

Incoming request data is validated before it reaches service or database operations.

Validation is performed using Zod.

Validation can cover:

- Request bodies
- Route parameters
- Query parameters
- UUIDs
- Email addresses
- String lengths
- Required fields
- Optional fields
- Dates
- Arrays
- Resource-specific values

Invalid input is rejected before normal business logic is executed.

This reduces malformed input, unexpected application states, and database-level errors.

---

# File Upload Security

File uploads are validated before they are permanently stored.

The backend supports uploaded assets such as:

- Profile images
- Project images
- Certificate images
- Resume
- CV

Upload validation includes:

- File type
- File extension
- File size
- Storage location
- Generated filenames

---

# Allowed File Types

Image uploads are restricted to supported image formats.

Current image types include:

```
image/jpeg
image/png
image/webp
```

PDF uploads are used for document resources such as:

```
application/pdf
```

Files outside the supported formats are rejected.

---

# Extension Validation

File extensions are also checked independently from the declared MIME type.

Examples:

Allowed:

```
resume.pdf
photo.jpg
photo.png
photo.webp
```

Rejected:

```
virus.exe
script.js
image.php
```

Checking both MIME information and the filename extension provides an additional validation layer.

---

# File Size Limits

Upload size limits are enforced by the upload layer.

This prevents unnecessarily large files from consuming server resources or storage.

The frontend also provides matching validation for user experience, but server-side validation remains authoritative.

An uploaded file must pass the backend validation even if the frontend accepts it.

---

# Random File Names

Uploaded files are not stored using user-provided filenames.

Generated names follow a structure similar to:

```
timestamp-randomUUID.extension
```

Example:

```
1784378888024-ea4f37b4-b1a8-4d9c-aa24-a22691ad69af.pdf
```

Generated filenames help prevent:

- Filename collisions
- Unsafe user-controlled filenames
- Basic path manipulation through filenames
- Accidental overwriting of existing files

---

# Upload Directories

Uploads are separated by resource type.

Current storage structure is:

```
uploads/
  profile/
  resume/
  cv/
  certificates/
  projects/
  temp/
```

Project images are additionally separated into project-specific directories.

Example:

```
uploads/
  projects/
    <project-id>/
      <generated-file-name>
```

This keeps unrelated uploaded resources separated and makes cleanup easier.

---

# Upload Persistence

In the containerized production configuration, uploaded files are stored in a dedicated Docker volume.

The server container uses a volume similar to:

```yaml
volumes:
  - server-uploads:/app/apps/server/uploads
```

This prevents uploaded files from being lost when the server container is recreated.

The upload volume is separate from the PostgreSQL data volume.

Database backups do not automatically contain the uploaded files. Both database data and uploaded assets must therefore be protected separately.

---

# Environment Variables

Sensitive configuration is not committed to source control.

Sensitive values include items such as:

- Database credentials
- Database connection URL
- JWT secrets
- Administrator credentials or hashes
- Challenge hashes
- GitHub credentials or tokens
- Production configuration

Environment example files document required configuration without containing real secrets.

Examples include:

```
.env.example
apps/server/.env.example
apps/client/.env.example
```

Production secrets are supplied through the deployment environment.

---

# Environment Separation

Development and production configuration are kept separate.

The production server uses a production environment file through Docker Compose.

The frontend receives its Vite build configuration through Docker build arguments.

Public frontend configuration such as API URLs is not considered secret because Vite variables are included in the built frontend.

Secrets must never be placed in frontend environment variables.

---

# Error Handling

A centralized error handler prevents unnecessary exposure of internal implementation details.

Expected errors return controlled API responses.

Unexpected errors return a generic server error response.

Example:

```json
{
    "success": false,
    "message": "Internal Server Error"
}
```

Internal error details and stack traces are intended for server-side logging rather than public API responses.

This reduces information leakage about:

- Database implementation
- File system paths
- Internal modules
- Application internals
- Unexpected exceptions

---

# Request Tracing

Every request receives a unique Request ID.

Example:

```
a3d6dbe4-8df0-4cf1-b16d-89f8baf3b9fa
```

The request ID is used to correlate related log messages.

Request logs can include:

- Request ID
- HTTP method
- URL
- Status code
- Response time
- Request information

This makes security incidents and application failures easier to investigate.

---

# Logging

The backend uses Morgan and Winston for request and application logging.

Morgan provides HTTP request logging.

Winston provides application logging and structured log output.

The logging system records information useful for diagnosing:

- Authentication failures
- Application errors
- Request failures
- Unexpected exceptions
- Promise rejections
- Database errors

Sensitive credentials and secrets should not be intentionally written to logs.

---

# Database Security

Database access is handled through Prisma Client.

Prisma provides:

- Parameterized database operations
- Type-safe queries
- Automatic query parameter handling
- Schema validation
- Migration support
- Transaction support

Normal CRUD operations do not construct SQL statements by concatenating user input.

This significantly reduces the risk of SQL injection through ordinary application queries.

---

# Database Credentials

PostgreSQL credentials are supplied through environment configuration.

They are not hard-coded into application source code.

In Docker Compose, PostgreSQL is configured using values such as:

```yaml
environment:
  POSTGRES_USER: ${POSTGRES_USER}
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  POSTGRES_DB: ${POSTGRES_DB}
```

The server connects to PostgreSQL using the configured database connection string.

Production credentials must remain outside Git.

---

# Docker Security Considerations

The application is containerized using separate services for:

- PostgreSQL
- Express server
- React frontend

The server communicates with PostgreSQL through the Docker Compose network.

The PostgreSQL service does not need to expose its port publicly for normal application communication.

The production Compose configuration keeps PostgreSQL and server persistence in named volumes.

Container isolation reduces coupling between application services, but Docker itself does not replace application authentication or network security.

---

# CI Security

The project uses GitHub Actions for continuous integration.

CI validates the application without requiring production secrets.

Current validation includes:

- Dependency installation with `npm ci`
- Prisma schema validation
- Frontend linting
- Frontend production build

Production secrets should not be added to CI unless a future workflow specifically requires them.

---

# Git and Secret Protection

Sensitive environment files must remain ignored by Git.

Files containing real credentials should never be committed.

Before pushing changes, verify:

```bash
git status
```

and inspect staged files when environment or configuration files are modified.

If a secret is accidentally committed, removing the file from the latest commit is not sufficient if the secret has already reached a remote repository. The exposed secret should be rotated.

---

# Security Best Practices

The backend follows several secure development practices:

- Passwords are hashed
- Secrets remain outside source control
- JWT expiration is enforced
- Administrator routes require authentication
- The administrator interface is hidden from normal navigation
- Challenge authentication is required before administrator login
- Input validation is centralized
- Uploads are validated
- Upload filenames are generated
- Upload directories are separated
- SQL injection risk is reduced through Prisma
- Global error handling is used
- Request tracing is enabled
- Rate limiting is enabled
- Secure HTTP headers are enabled
- CORS restrictions are enabled
- Database credentials are environment-based
- Production uploads use a persistent volume
- CI validates important application components

---

# Security Limitations

The current implementation provides multiple security layers but is not a complete security monitoring platform.

The following are not currently treated as fully implemented security features:

- Multi-factor authentication
- Antivirus scanning for uploaded files
- Centralized security monitoring
- Automated intrusion detection
- IP reputation blocking
- Signed upload URLs
- Dedicated audit logging
- Refresh-token rotation
- Full production deployment hardening

These should be considered separately before production deployment.

---

# Future Security Improvements

Potential future enhancements include:

- Refresh tokens and token rotation
- Multi-factor authentication
- Content Security Policy
- Dedicated audit logging
- File malware scanning
- Signed upload URLs
- Security monitoring and alerting
- Automated IP blocking
- Production TLS configuration
- Security headers review for the final domain
- Dependency vulnerability management
- Periodic security audits

---

# Security Review Checklist

Before production deployment, verify:

- [ ] Production secrets are not committed
- [ ] Production CORS origin is correct
- [ ] HTTPS is enabled
- [ ] JWT secrets are strong and unique
- [ ] Administrator credentials are strong
- [ ] Challenge secret is protected
- [ ] Database credentials are protected
- [ ] PostgreSQL is not publicly exposed unnecessarily
- [ ] Upload volume is persistent
- [ ] Database backups exist
- [ ] Upload backups exist
- [ ] Rate limiting is enabled
- [ ] File size limits are configured
- [ ] Allowed file types are restricted
- [ ] Error responses do not expose internal details
- [ ] CI passes before deployment
- [ ] Production environment variables are configured separately
- [ ] Docker images and dependencies are reviewed before deployment
