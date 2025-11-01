# Authentication System Setup Guide

This guide will help you complete the authentication system setup for Frank.

## Current Status

✅ All authentication code has been implemented
✅ UI pages created and styled
✅ tRPC router and NextAuth configuration complete
⚠️ Database schema needs to be pushed
⚠️ Email service needs to be configured

## Quick Start Steps

### 1. Push Database Schema

Once your database is available, run:

```bash
cd frank
npm run db:push
```

This will apply the updated User model with:
- `password` field (nullable string)
- `role` field (UserRole enum: FREE, TEAM, ENTERPRISE)
- `createdAt` and `updatedAt` timestamps

### 2. Restart TypeScript Server

After database push, restart your editor's TypeScript server to pick up the new Prisma types:
- In VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- Or close and reopen VS Code

### 3. Environment Variables

Ensure your `.env` file has these variables:

```env
# Database (already configured)
DATABASE_URL="your-database-url"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Email (optional for now, needed for production)
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="noreply@frank.app"
```

### 4. Test the Application

```bash
cd frank
npm run dev
```

Visit these pages to test:
- http://localhost:3000/sign-up - User registration
- http://localhost:3000/sign-in - Login
- http://localhost:3000/dashboard - Protected dashboard (requires auth)
- http://localhost:3000/profile - Profile editing (requires auth)
- http://localhost:3000/forgot-password - Password reset request

## What's Been Implemented

### Pages Created
- `/sign-up` - Registration form with email, password, name, role
- `/sign-in` - Login form with email and password
- `/forgot-password` - Request password reset
- `/reset-password` - Reset password with token
- `/profile` - Edit user profile (name, role)
- `/dashboard` - Main dashboard (placeholder for future features)

### API Endpoints (tRPC)
- `auth.register` - Create new user account
- `auth.resendVerification` - Resend verification email
- `auth.requestPasswordReset` - Request password reset
- `auth.resetPassword` - Reset password with token
- `auth.updateProfile` - Update user profile
- `auth.getProfile` - Get current user profile

### Security Features
- ✅ bcrypt password hashing (12 salt rounds)
- ✅ JWT session tokens (7-day expiration)
- ✅ HttpOnly cookies
- ✅ Input validation with Zod
- ✅ Protected routes with middleware
- ✅ CSRF protection (Next.js built-in)

## Known Limitations

### Email Service Not Configured
The following features are stubbed out and need email service integration:
- Email verification after registration
- Password reset emails
- Resend verification email

**To implement:**
1. Choose an email provider (SendGrid, Resend, AWS SES, or SMTP)
2. Add email credentials to `.env`
3. Update auth router to actually send emails (marked with TODO comments)

For development testing, you can use [Ethereal Email](https://ethereal.email/) which provides a fake SMTP service for testing.

### Email Verification Not Enforced
Currently, the system allows login without email verification for development purposes. In production, you should:
1. Uncomment the email verification check in the auth config
2. Implement the email sending functionality
3. Test the full verification flow

### Rate Limiting Not Implemented
The story requirements specify rate limiting on auth endpoints:
- Registration: 5 per hour per IP
- Login: 10 per hour per IP
- Password reset: 3 per hour per email

This should be implemented using a library like `@upstash/ratelimit` or custom middleware.

### Tests Not Written
Unit tests, integration tests, and E2E tests are not included in this implementation. These should be added according to the testing strategy outlined in the story.

## Design System

All auth pages follow Frank's "Calm Clarity" design system:
- **Background**: Warm White/Soft Gray (#F6F7F8)
- **Text**: Soft Charcoal (#1D1F21)
- **Accent**: Muted Sage/Teal (#76A99A)
- **Typography**: Inter font, sentence case
- **Components**: Soft rounded corners (4-6px), generous whitespace

## Troubleshooting

### TypeScript Errors About Missing Fields
If you see errors like "Property 'password' does not exist" or "Property 'role' does not exist":
1. Make sure you ran `npm run db:push`
2. Restart the TypeScript server
3. Try running `npx prisma generate` again

### Can't Connect to Database
If you see "Can't reach database server":
1. Check your `DATABASE_URL` in `.env`
2. Ensure your database is running
3. Check firewall/network settings

### Authentication Not Working
1. Check that `NEXTAUTH_SECRET` is set in `.env`
2. Clear browser cookies and try again
3. Check the terminal for error messages
4. Verify the NextAuth API route is accessible at `/api/auth/signin`

## Next Steps

1. **Configure Email Service** - Set up email provider for verification and password reset
2. **Add Rate Limiting** - Implement rate limiting on auth endpoints
3. **Write Tests** - Add comprehensive test coverage
4. **Email Verification** - Implement and test email verification flow
5. **OAuth Providers** - Add Google/GitHub OAuth (future story)
6. **2FA** - Two-factor authentication (Epic 4)

## Questions?

If you encounter any issues:
1. Check the error messages in the terminal
2. Review the Prisma schema in `frank/prisma/schema.prisma`
3. Check the auth configuration in `frank/src/server/auth/config.ts`
4. Look for TODO comments in the code for areas that need completion
