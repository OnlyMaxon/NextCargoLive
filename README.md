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
- Firebase account

## 🛠️ Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Email/Password authentication
3. Create a Firestore database
4. Copy `.env.example` to `.env` and add your Firebase config

### 3. Run Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 🔥 Firebase Setup

Required Firebase services:
- **Authentication** (Email/Password)
- **Firestore Database**

### Environment Variables

Create `.env` file with:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

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

1. Set up Firebase project
2. Add environment variables to your hosting platform
3. Build the application: `npm run build`
4. Deploy the `dist` folder to your hosting service

Recommended platforms:
- Vercel
- Netlify
- Firebase Hosting

## 🆘 Support

For issues or questions:
1. Review browser console for errors
2. Verify Firebase configuration






Все работает через cloudFlare с Файлами Index.js wrangler.jsonc
База и регистрация работает через Firebase Console (CargoRealTime)
Domain будет куплен через GoDaddy
3. Check Firestore security rules

## 📄 License

MIT License

в Кратце Оплата будет на мою карту Сантандер с Азер карты
это будет обсуждать по телефону Ватцап 
нам нужно будет отправлять Меил когда поступил закакз обращение к оплате и дальше обновление статуса заказа 