# Google Maps API Setup Guide

This guide will help you set up Google Maps API for the Lab Center Finder feature.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Select a project" at the top and then "New Project"
4. Enter a project name (e.g., "Ez LabTesting")
5. Click "Create"

## Step 2: Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - **Maps JavaScript API** (Required - for map rendering)
   - **Places API** (Required - for autocomplete search)
   - **Geocoding API** (Optional - for future features)

## Step 3: Create an API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Your new API key will be displayed
4. (Recommended) Click "Restrict Key" to add restrictions:
   - Under "API restrictions", select "Restrict key"
   - Choose "Maps JavaScript API"
   - Add your website domains under "Website restrictions"

## Step 4: Add API Key to Your Project

1. Create a `.env.local` file in the project root (if it doesn't exist)
2. Add the following line:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
3. Replace `your_api_key_here` with your actual API key

**Important**: Make sure both **Maps JavaScript API** AND **Places API** are enabled, otherwise the autocomplete search will not work.

## Step 5: Restart Your Development Server

If your development server is running, restart it to load the new environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
yarn dev
# or
npm run dev
```

## Testing the Setup

1. Navigate to `/find-lab-center` in your browser
2. You should see an interactive Google Map with lab center markers
3. If you see "Map Not Available", check that:
   - Your API key is correctly added to `.env.local`
   - You've restarted your development server
   - The Maps JavaScript API is enabled in Google Cloud Console

## Troubleshooting

### Map doesn't load
- Check browser console for error messages
- Verify your API key is correct
- Ensure Maps JavaScript API is enabled
- Check if your domain needs to be added to allowed referrers

### "For development purposes only" watermark
- This appears when using a restricted API key on localhost
- To remove, add `localhost` and `127.0.0.1` to your key's website restrictions
- Or temporarily remove all restrictions during development

### Billing issues
- Google Maps requires a billing account to be set up
- You get $200 free credits per month
- The free tier is usually sufficient for development and small-scale applications

## Best Practices

1. **Never commit your API key to version control**
   - `.env.local` is already in `.gitignore`
   - Never hardcode the API key in your source code

2. **Use API key restrictions**
   - Restrict by API (Maps JavaScript API only)
   - Restrict by HTTP referrer (your domain)

3. **Monitor usage**
   - Check Google Cloud Console for API usage
   - Set up billing alerts
   - Consider caching map data when possible

## Cost Estimation

Google Maps Platform pricing (as of 2024):
- Maps JavaScript API: $7 per 1,000 map loads
- First $200/month is free (covers ~28,000 map loads)

For a typical lab testing website, the free tier should be sufficient.

## Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)

