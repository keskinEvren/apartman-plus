# Security Policy

## Supported Versions

We actively support the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

### 1. Do NOT Open a Public Issue

Please **do not** create a public GitHub issue for security vulnerabilities.

### 2. Report Privately

Send an email to: **mustafaasan73@gmail.com**

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity (critical issues prioritized)

## Security Best Practices

When using ASANMOD Enterprise Template:

### Environment Variables

- ✅ **Never commit** `.env` files
- ✅ Use `.env.example` as a template
- ✅ Rotate secrets regularly
- ✅ Use strong database passwords

### Database

- ✅ Use connection pooling
- ✅ Enable SSL in production
- ✅ Apply least-privilege principle
- ✅ Regular backups

### Authentication

- ✅ Use strong password hashing (bcrypt/argon2)
- ✅ Implement rate limiting
- ✅ Enable CSRF protection
- ✅ Use secure session management

### Dependencies

- ✅ Run `npm audit` regularly
- ✅ Keep dependencies updated
- ✅ Review dependency changes

### Production Deployment

- ✅ Enable HTTPS/TLS
- ✅ Use secure headers
- ✅ Implement proper CORS
- ✅ Hide error details from users
- ✅ Enable logging and monitoring

## Known Security Features

ASANMOD includes built-in security features:

1. **Input Validation**: All inputs validated with Zod
2. **Type Safety**: End-to-end TypeScript
3. **SQL Injection Prevention**: Drizzle ORM with prepared statements
4. **CORS**: Configurable in production
5. **Rate Limiting**: Via Redis (optional)

## Vulnerability Disclosure

We follow responsible disclosure practices:

1. **Private Report → Fix → Public Disclosure**
2. Credit given to reporters (if desired)
3. Security advisories published after fix

---

**Last Updated**: 2026-01-13
