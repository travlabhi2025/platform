# Environment Variables Update for Firebase Storage

## Required Environment Variables

Make sure your `.env.local` file includes the Firebase Storage bucket URL:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## How to Find Your Storage Bucket URL

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Scroll down to **Your apps** section
5. Click on your web app
6. Copy the `storageBucket` value from the config

## Example

If your project ID is `travlabhi`, your storage bucket should be:
```bash
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=travlabhi.appspot.com
```

## Verification

After updating your `.env.local` file:

1. Restart your development server (`pnpm dev`)
2. Try uploading an image in the create trip form
3. Check the browser console for any Firebase Storage errors
4. Verify the image appears in Firebase Console > Storage

## Troubleshooting

### Common Issues:

1. **"Storage bucket not found"**: Check that the bucket URL is correct
2. **"Permission denied"**: Make sure Storage is enabled and rules are set
3. **"Invalid bucket name"**: Verify the bucket URL format

### Getting Help:

- Check Firebase Console for bucket status
- Verify Storage is enabled in your project
- Review the Firebase Storage setup guide
