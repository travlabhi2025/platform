# Firebase Storage Setup Guide

## 1. Enable Firebase Storage

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`travlabhi`)

### Step 2: Enable Storage
1. In the left sidebar, click on **"Storage"**
2. Click **"Get started"**
3. Choose **"Start in production mode"** (recommended for security)
4. Select a location for your storage bucket (choose the same region as your Firestore)
5. Click **"Done"**

## 2. Configure Storage Security Rules

### Step 1: Go to Storage Rules
1. In the Storage section, click on the **"Rules"** tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload images to their own folder
    match /trip-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow public read access to trip images
    match /trip-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow users to upload profile images
    match /profile-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow public read access to profile images
    match /profile-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 2: Publish Rules
1. Click **"Publish"** to save the rules

## 3. Install Required Dependencies

Run the following command in your project directory:

```bash
pnpm add firebase
```

## 4. Update Firebase Configuration

The Firebase Storage will automatically be available in your existing Firebase configuration since you already have Firebase set up.

## 5. Storage Structure

Your Firebase Storage will be organized as follows:

```
trip-images/
├── {userId}/
│   ├── trip-{tripId}/
│   │   ├── hero-image.jpg
│   │   ├── gallery-image-1.jpg
│   │   └── gallery-image-2.jpg
│   └── ...
└── ...

profile-images/
├── {userId}/
│   ├── profile-pic.jpg
│   └── ...
└── ...
```

## 6. File Size and Type Limits

### Recommended Limits:
- **Max file size**: 5MB per image
- **Allowed formats**: JPG, JPEG, PNG, WebP
- **Max dimensions**: 2048x2048 pixels (will be resized automatically)

## 7. Testing the Setup

1. Go to the Storage section in Firebase Console
2. You should see an empty bucket
3. Once you implement the upload functionality, you'll see folders and images appear here

## 8. Monitoring and Usage

### View Storage Usage:
1. In Firebase Console, go to **Storage**
2. Click on **"Usage"** tab to see:
   - Storage used
   - Download/Upload operations
   - Bandwidth usage

### Set Up Alerts (Optional):
1. Go to **Project Settings** > **Usage and billing**
2. Set up alerts for storage usage if needed

## 9. Security Best Practices

1. **Authentication Required**: Only authenticated users can upload
2. **User Isolation**: Users can only access their own folders
3. **File Type Validation**: Only image files are allowed
4. **Size Limits**: Enforced both client-side and server-side
5. **Public Read Access**: Images are publicly readable for display

## 10. Cost Considerations

- **Storage**: $0.026 per GB per month
- **Download**: $0.12 per GB
- **Upload**: Free
- **Operations**: $0.05 per 10,000 operations

For a typical travel app, costs should be minimal unless you have very high traffic.

## Next Steps

After completing this setup:
1. The image upload component will be implemented
2. Trip creation form will be updated to use image upload
3. Validation will be updated to handle uploaded images
4. Image URLs will be automatically generated and stored in Firestore

## Troubleshooting

### Common Issues:

1. **"Storage not enabled"**: Make sure you've completed Step 2
2. **"Permission denied"**: Check your security rules
3. **"File too large"**: Implement client-side size validation
4. **"Invalid file type"**: Add file type validation

### Getting Help:
- Check Firebase Storage documentation
- Review security rules examples
- Test with Firebase Console upload feature first
