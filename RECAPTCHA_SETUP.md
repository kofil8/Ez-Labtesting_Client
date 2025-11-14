# Google reCAPTCHA Setup Guide

This project uses Google reCAPTCHA v2 for bot protection on the login and signup pages.

## Setup Instructions

### 1. Register Your Site with Google reCAPTCHA

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Sign in with your Google account
3. Fill in the registration form:
   - **Label**: Give your site a name (e.g., "EZ Lab Testing")
   - **reCAPTCHA type**: Select **reCAPTCHA v2** → **"I'm not a robot" Checkbox**
   - **Domains**: Add your domains:
     - For development: `localhost`
     - For production: your production domain (e.g., `yourdomain.com`)
4. Accept the reCAPTCHA Terms of Service
5. Click **Submit**

### 2. Get Your Keys

After registration, you'll receive:
- **Site Key** (public key - used in the browser)
- **Secret Key** (private key - used on the server)

### 3. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```env
# Google reCAPTCHA v2 Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

Replace `your_site_key_here` and `your_secret_key_here` with your actual keys from step 2.

**Important:** 
- The `.env.local` file is already in `.gitignore` and will not be committed to version control
- Never share your Secret Key publicly
- The `NEXT_PUBLIC_` prefix is required for the Site Key to be accessible in the browser

### 4. Restart Your Development Server

After adding the environment variables, restart your development server:

```bash
npm run dev
```

### 5. Testing

#### Development Testing
During development on `localhost`, reCAPTCHA will work automatically.

#### Production Testing
Make sure you've added your production domain to the list of domains in the reCAPTCHA admin console.

## How It Works

- The captcha appears on both the **Login** and **Signup** pages
- Users must complete the captcha before they can submit the form
- The submit button is disabled until the captcha is completed
- If the captcha expires (after 2 minutes), users will need to complete it again
- If login/signup fails, the captcha is reset and must be completed again

## Troubleshooting

### Captcha Not Appearing
- Make sure `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set in your `.env.local` file
- Verify the environment variable name includes the `NEXT_PUBLIC_` prefix
- Restart your development server after adding environment variables

### "Invalid Site Key" Error
- Double-check that you copied the Site Key correctly
- Ensure you're using the Site Key (not the Secret Key) for `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

### Captcha Working Locally but Not in Production
- Make sure you've added your production domain to the allowed domains in the reCAPTCHA admin console
- Remove `www.` if you added it - add both versions if needed (with and without `www.`)

## Server-Side Validation (Optional)

While the current implementation validates the captcha on the client-side, for additional security, you should also validate the captcha token on your backend:

```typescript
// Example server-side validation
async function verifyCaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    { method: 'POST' }
  );
  const data = await response.json();
  return data.success;
}
```

Add this validation to your authentication API routes for maximum security.

## Resources

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/display)
- [react-google-recaptcha NPM Package](https://www.npmjs.com/package/react-google-recaptcha)

