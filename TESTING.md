# Testing Guide - Authentication Bypass

This guide explains how to bypass middleware authentication for testing profile, forgot password, and reset password pages.

## Quick Start

### Option 1: Using Environment Variable (Recommended)

1. Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_BYPASS_AUTH=true
```

2. Start the development server:
```bash
yarn dev
```

3. Now you can access:
   - `/profile` - Profile page (without authentication)
   - `/forgot-password` - Forgot password page
   - `/reset-password?token=test-token` - Reset password page

### Option 2: Using Script with Environment Variable

1. Set the environment variable before running:
   - **Windows (PowerShell):**
     ```powershell
     $env:NEXT_PUBLIC_BYPASS_AUTH="true"; yarn dev
     ```
   - **Windows (Git Bash):**
     ```bash
     NEXT_PUBLIC_BYPASS_AUTH=true yarn dev
     ```
   - **Linux/Mac:**
     ```bash
     NEXT_PUBLIC_BYPASS_AUTH=true yarn dev
     ```

2. Or use the test script:
```bash
yarn dev:test
```
(Note: You still need to set the environment variable manually or create `.env.local`)

## What Gets Bypassed

When `NEXT_PUBLIC_BYPASS_AUTH=true`:

- ✅ Middleware authentication checks are completely bypassed
- ✅ Profile page can be accessed without login
- ✅ Profile page shows a test user when not authenticated
- ✅ All protected routes become accessible
- ⚠️ A warning banner appears on the profile page indicating test mode

## Testing Password Reset Flow

1. **Test Forgot Password:**
   - Navigate to `/forgot-password`
   - Enter any email address
   - Submit the form
   - Check browser console for the reset email message (mock implementation)

2. **Test Reset Password:**
   - Navigate to `/reset-password?token=test-token`
   - Enter a new password (must meet validation requirements)
   - Submit the form
   - You'll be redirected to login page

## Disabling Test Mode

Simply remove or set the environment variable to `false`:
```bash
NEXT_PUBLIC_BYPASS_AUTH=false
```

Or remove the `.env.local` file.

## Notes

- The bypass only works in development mode
- Never enable this in production
- The profile page will show mock user data when bypass is enabled and user is not authenticated
- Forgot password and reset password pages are already public and don't require bypass

