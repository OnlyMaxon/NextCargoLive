# Firebase Integration Complete Guide

## ✅ What Has Been Integrated

Your NextCargo application now uses **Firebase Authentication** and **Firestore Database** instead of localStorage (useKV).

### Changes Made:

1. **App.tsx** - Completely refactored to use Firebase
   - Removed `useKV` hooks
   - Added Firebase Authentication state listener with `onAuthStateChanged`
   - All data operations now use Firestore services
   - Added loading state while checking authentication
   - Real-time data sync with Firebase

2. **Auth.tsx** - Updated authentication flow
   - User registration now creates Firebase Authentication accounts
   - Login uses Firebase Authentication
   - Email format: `{fincode}@nextcargo.app` (e.g., `ABC1234@nextcargo.app`)
   - FIN code is stored in Firestore user document
   - Added loading states and better error handling

3. **firebase-services.ts** - Enhanced error handling
   - Improved timestamp conversion for Firestore compatibility
   - Better error handling with try-catch blocks
   - Proper data transformation between Firestore and app models

## 🔧 How to Set Up Firebase

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Save changes

### Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Production mode** (we have security rules ready)
4. Select your region (choose closest to Azerbaijan/Poland for best performance)
5. Click "Enable"

### Step 4: Set Up Security Rules

In Firestore Database, go to **Rules** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isAuthenticated() && 
                     (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAdmin();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Support messages collection
    match /support_messages/{messageId} {
      allow read: if isAuthenticated() && 
                     (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow create: if isAdmin();
      allow update: if isOwner(resource.data.userId) || isAdmin();
      allow delete: if isAdmin();
    }
  }
}
```

### Step 5: Get Firebase Configuration

1. In Firebase Console, click the **gear icon** → **Project settings**
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app (name: "NextCargo")
5. Copy the configuration object

### Step 6: Configure Your App

1. Create a `.env` file in the root of your project:

```bash
cp .env.example .env
```

2. Fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
```

### Step 7: Create First Admin User (Optional)

Since admin login uses hardcoded credentials defined in `src/lib/constants.ts`, you can still use the admin panel by logging in with those credentials. However, to create an admin user in Firebase:

1. Register a regular user through the app
2. Go to Firestore Database in Firebase Console
3. Find the user document in the `users` collection
4. Edit the document and add/change: `isAdmin: true`
5. Save

Or use Firebase Console Authentication to create a user manually, then add their document to Firestore.

## 🔄 Data Migration (if you have existing data)

If you have existing data in localStorage (useKV), you'll need to migrate it to Firestore:

### Option 1: Manual Migration
1. Export data from browser console before updating
2. Use Firebase Console to import data

### Option 2: Keep Local Data
The old localStorage data will remain but won't be used. You'll start fresh with Firebase.

## 🧪 Testing the Integration

### Test User Registration:
1. Open the app
2. Go to Register tab
3. Fill in:
   - First Name: Test
   - Last Name: User
   - FIN Code: TEST123
   - Password: test1234
4. Click Register
5. You should be logged in automatically

### Test User Login:
1. Logout
2. Go to Login tab
3. Enter:
   - FIN Code: TEST123
   - Password: test1234
4. Click Login
5. You should be logged in and see your orders

### Test Admin Login:
1. Logout
2. Go to Login tab
3. Enter the admin credentials from `src/lib/constants.ts`
4. You should see the admin panel

## 📊 Firestore Collections Structure

Your database will have these collections:

### `users`
```javascript
{
  firstName: "John",
  lastName: "Doe",
  finCode: "ABC1234",
  isAdmin: false,
  createdAt: Timestamp
}
```

### `orders`
```javascript
{
  userId: "user_firebase_uid",
  trackingNumber: "PL123456789",
  description: "Package description",
  status: "in_transit" | "at_warehouse" | "delivered",
  createdAt: number (timestamp),
  updatedAt: number (timestamp),
  origin: "Poland",
  destination: "Azerbaijan",
  weight: "5.2 kg",
  trackingHistory: [
    {
      id: "event_123",
      timestamp: number,
      status: "in_transit",
      location: "Poland - In Transit",
      description: "Order created",
      updatedBy: "Admin"
    }
  ]
}
```

### `support_messages`
```javascript
{
  userId: "user_firebase_uid",
  userName: "John Doe",
  message: "Hello, I need help",
  timestamp: number (timestamp),
  isAdmin: false,
  conversationId: "user_firebase_uid"
}
```

### `notifications`
```javascript
{
  userId: "user_firebase_uid",
  message: "Your order status changed",
  timestamp: number (timestamp),
  read: false,
  orderId: "order_id"
}
```

## 🔐 Authentication Flow

### Registration:
1. User enters: firstName, lastName, finCode, password
2. App creates Firebase auth account with email: `{fincode}@nextcargo.app`
3. App creates Firestore user document with user details
4. User is automatically logged in

### Login:
1. User enters: finCode, password
2. App looks up user by finCode in Firestore
3. App constructs email: `{fincode}@nextcargo.app`
4. App authenticates with Firebase Auth
5. User data is loaded from Firestore

### Admin Login:
1. Admin enters credentials from constants.ts
2. App recognizes admin login (doesn't use Firebase)
3. Admin panel is shown with all data

## 🚀 Deployment Notes

### Environment Variables:
Make sure to set all environment variables in your deployment platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Other: Follow platform-specific guides

### CORS & Security:
- Firestore security rules are already configured
- Firebase Auth restricts to authorized domains
- Add your deployment domain to Firebase Console → Authentication → Settings → Authorized domains

## 📱 Features Working with Firebase

✅ User registration with Firebase Authentication
✅ User login with Firebase Authentication  
✅ Admin panel (still uses hardcoded credentials)
✅ Order management (CRUD operations in Firestore)
✅ Support messages (real-time sync with Firestore)
✅ Notifications (stored in Firestore)
✅ User profiles (stored in Firestore)
✅ Order tracking history
✅ Mobile responsive design

## 🐛 Troubleshooting

### "Failed to load user data" error:
- Check if Firebase credentials are correct in .env
- Verify Firestore Database is created and active
- Check browser console for detailed error messages

### "Too many attempts" error:
- Firebase rate limiting is active
- Wait a few minutes and try again
- Consider adjusting Firebase Auth settings

### Authentication not persisting:
- Firebase automatically handles session persistence
- Check if cookies are enabled in browser
- Clear browser cache and try again

### Data not loading:
- Verify Firestore security rules are set correctly
- Check if collections exist in Firestore
- Open browser console and check for errors

## 🎯 Next Steps

1. Set up Firebase project following steps above
2. Configure environment variables
3. Test registration and login
4. Create some test orders via admin panel
5. Deploy to production
6. Monitor Firebase Console for usage and errors

## 📚 Additional Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Database Docs](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Console](https://console.firebase.google.com/)

---

## ⚠️ Important Security Notes

1. **Never commit .env file** - It's already in .gitignore
2. **Keep admin credentials secure** - Consider moving to environment variables
3. **Review security rules** - Adjust based on your requirements
4. **Enable Firebase App Check** - Additional security layer (optional but recommended)
5. **Monitor Firebase Usage** - Set up billing alerts to avoid unexpected charges

---

Your NextCargo app is now fully integrated with Firebase! 🎉
