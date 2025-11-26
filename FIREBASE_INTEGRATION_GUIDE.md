# 🔥 Firebase Integration Guide - NextCargo

This guide will help you connect your NextCargo application to Firebase for production use.

## 📋 Prerequisites

1. A Google account
2. Access to [Firebase Console](https://console.firebase.google.com/)

## 🚀 Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `NextCargo` (or your preferred name)
4. Click **Continue**
5. Disable Google Analytics (optional, but recommended for simpler setup)
6. Click **Create project**
7. Wait for project creation, then click **Continue**

### 2. Register Web App

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `NextCargo Web App`
3. **Check** the box "Also set up Firebase Hosting"
4. Click **Register app**
5. You'll see a configuration object - **keep this page open**, you'll need these values

### 3. Enable Authentication

1. In Firebase Console sidebar, click **Build** → **Authentication**
2. Click **Get started**
3. Click on **Email/Password** provider
4. **Enable** the first toggle (Email/Password)
5. Click **Save**

### 4. Create Firestore Database

1. In Firebase Console sidebar, click **Build** → **Firestore Database**
2. Click **Create database**
3. Select **Production mode** (we'll update security rules later)
4. Choose your Cloud Firestore location (pick closest to your users, e.g., `europe-west1` for Europe)
5. Click **Enable**

### 5. Set Up Security Rules

After creating the database, update Firestore Security Rules:

1. Click on **Rules** tab in Firestore Database
2. Replace the existing rules with:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Support messages
    match /support_messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      
      allow update: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **Publish**

### 6. Configure Environment Variables

Create a `.env` file in the root of your project (if it doesn't exist):

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**To get these values:**

1. Go to Firebase Console → Project Settings (gear icon)
2. Scroll down to **"Your apps"** section
3. You'll see your Web app configuration
4. Copy each value to your `.env` file

**Example:**
```bash
VITE_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=nextcargo-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nextcargo-12345
VITE_FIREBASE_STORAGE_BUCKET=nextcargo-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

⚠️ **Important:** Never commit the `.env` file to Git! It's already in `.gitignore`.

### 7. Create Initial Admin User

Since you need an admin account, you'll need to create one manually:

1. Run your application locally
2. Register a new account with your admin credentials
3. Go to Firebase Console → Firestore Database
4. Find the `users` collection
5. Click on your user document
6. Add a new field:
   - Field: `isAdmin`
   - Type: `boolean`
   - Value: `true`
7. Save the document

Now you can log in with this account and access the Admin Panel!

### 8. Test Your Setup

1. Start your application: `npm run dev`
2. Try to register a new user
3. Try to log in with the user
4. Log in with your admin account and access Admin Panel
5. Create a test order
6. Send a support message

If everything works, your Firebase integration is complete! 🎉

## 📱 Collections Structure

Your Firestore database will have these collections:

### `users`
```javascript
{
  id: "auto-generated",
  firstName: "string",
  lastName: "string",
  finCode: "string",
  isAdmin: boolean,
  createdAt: timestamp
}
```

### `orders`
```javascript
{
  id: "auto-generated",
  userId: "string",
  trackingNumber: "string",
  description: "string",
  status: "in_transit" | "at_warehouse" | "delivered",
  origin: "string",
  destination: "string",
  weight: "string",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### `support_messages`
```javascript
{
  id: "auto-generated",
  userId: "string",
  userName: "string",
  message: "string",
  isAdmin: boolean,
  conversationId: "string",
  timestamp: timestamp
}
```

### `notifications`
```javascript
{
  id: "auto-generated",
  userId: "string",
  message: "string",
  read: boolean,
  orderId: "string" (optional),
  timestamp: timestamp
}
```

## 🔒 Security Best Practices

1. **Never expose your Firebase config in public repositories**
2. **Use environment variables** for all sensitive data
3. **Review and test security rules** before deploying to production
4. **Enable App Check** for additional security (optional but recommended)
5. **Monitor usage** in Firebase Console to detect unusual activity
6. **Set up billing alerts** to avoid unexpected charges

## 🌐 Deployment

When deploying to production (e.g., Vercel, Netlify):

1. Add all environment variables from `.env` to your hosting platform
2. Make sure to use the same Firebase project
3. Test authentication and database operations after deployment

## 🆘 Troubleshooting

### "Firebase: Error (auth/operation-not-allowed)"
- Make sure Email/Password authentication is enabled in Firebase Console

### "Missing or insufficient permissions"
- Check your Firestore Security Rules
- Make sure the user is authenticated
- Verify admin status if trying to access admin features

### "Cannot connect to Firebase"
- Verify all environment variables are set correctly
- Check that your Firebase project is active
- Ensure your API key is correct

### Support Messages not appearing
- Check that both users are logged in
- Verify the conversationId matches the userId
- Check Firestore Security Rules allow reading messages

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Review Firebase Console → Firestore Database for data
3. Check Firebase Console → Authentication for user accounts
4. Verify Security Rules in Firebase Console

---

**Remember:** After setting up Firebase, your app will persist all data in the cloud and work across devices! 🚀
