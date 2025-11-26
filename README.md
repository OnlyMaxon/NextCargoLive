# NextCargo - Cargo Management Application

A modern cargo tracking and management application built with React, TypeScript, and Firebase.

## 🚀 Features

- **User Authentication**: Secure registration and login with Firebase Auth
- **Order Tracking**: Real-time tracking of cargo shipments with status updates
- **Support Chat**: Direct communication between users and support team
- **Admin Panel**: Comprehensive management interface for administrators
- **Marketplace Links**: Quick access to popular Polish marketplaces
- **Mobile-First Design**: Optimized for all devices with responsive UI

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account (for production deployment)

## 🛠️ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

Follow the comprehensive guide in [FIREBASE_INTEGRATION_GUIDE.md](./FIREBASE_INTEGRATION_GUIDE.md)

Quick summary:
1. Create a Firebase project
2. Enable Email/Password authentication
3. Create a Firestore database
4. Copy `.env.example` to `.env` and add your Firebase config

### 3. Run Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 🔥 Firebase Setup

**Important**: This application requires Firebase to work in production. See [FIREBASE_INTEGRATION_GUIDE.md](./FIREBASE_INTEGRATION_GUIDE.md) for detailed setup instructions.

Required Firebase services:
- **Authentication** (Email/Password)
- **Firestore Database**

## 📱 User Features

- Track your cargo shipments
- View order details and status updates
- Chat with support team
- Access Polish marketplace links
- Manage your profile

## 👨‍💼 Admin Features

- View all orders from all users
- Create, update, and delete orders
- Change order statuses
- Respond to support messages
- Send notifications to users
- Search users by name or FIN code

## 🏗️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Backend**: Firebase (Auth + Firestore)
- **Icons**: Phosphor Icons
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Auth.tsx        # Authentication component
│   ├── AdminPanel.tsx  # Admin interface
│   ├── OrderList.tsx   # User order list
│   ├── Support.tsx     # Support chat
│   └── ...
├── lib/                # Utilities and services
│   ├── firebase.ts     # Firebase configuration
│   ├── firebase-services.ts  # Firebase API services
│   ├── types.ts        # TypeScript types
│   └── utils.ts        # Helper functions
├── App.tsx             # Main application component
└── index.css           # Global styles
```

## 🔐 Security

- Firebase Security Rules are configured for data protection
- User data is isolated and only accessible by the owner
- Admin operations require admin privileges
- Environment variables protect sensitive credentials

## 🚀 Deployment

1. Set up Firebase (see [FIREBASE_INTEGRATION_GUIDE.md](./FIREBASE_INTEGRATION_GUIDE.md))
2. Add environment variables to your hosting platform
3. Build the application: `npm run build`
4. Deploy the `dist` folder to your hosting service

Recommended platforms:
- Vercel
- Netlify
- Firebase Hosting

## 📄 Documentation

- [Firebase Integration Guide](./FIREBASE_INTEGRATION_GUIDE.md) - Complete Firebase setup
- [Firebase Setup](./FIREBASE_SETUP.md) - Quick Firebase reference
- [Security Guide](./SECURITY.md) - Security best practices

## 🆘 Support

For issues or questions:
1. Check the Firebase Integration Guide
2. Review browser console for errors
3. Verify Firebase configuration
4. Check Firestore security rules

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
