# NextCargo - Cargo Management Application

A modern cargo tracking and management application built with React, TypeScript, and Firebase.

## 🚀 Features

- **User Authentication**: Secure registration and login with Firebase Auth
- **Order Tracking**: Real-time tracking of cargo shipments with status updates
- **Notifications**: In-app notifications about order status changes
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

### Checks

```bash
npm run typecheck   # tsc -b, strict mode
npm run lint        # eslint
npm run build       # typecheck + production build
```

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
- See notifications about status changes
- Access Polish marketplace links
- Manage your profile

## 👨‍💼 Admin Features

- View all orders from all users
- Create, update, and delete orders
- Change order statuses
- Send notifications to users
- Search orders by customer FIN code

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
│   ├── Instructions.tsx # Warehouse address and how-to
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

See `firestore.rules`. Key invariants:

- A user profile (`users/{uid}`) is readable only by its owner and by admins —
  it contains the FIN code, document serial number and date of birth.
- Clients may update only `firstName`, `lastName`, `documentSerial`, `birthDate`
  on their own profile. `isAdmin` is not writable from the client, and `create`
  requires `isAdmin == false`.
- Orders are readable by their owner and admins; writable by admins only.
- FIN uniqueness is enforced by `fin_index/{FIN}`: the `create` rule only
  applies when the document does not exist yet, so a duplicate is rejected
  atomically.
- The Firebase web config is public by design; access is restricted by rules.
  Restrict the API key by HTTP referrer in Google Cloud Console.

### Making a user an admin

Set `isAdmin: true` on `users/{uid}` from the Firebase Console — the Console
bypasses security rules, and the client cannot do it.

## 🚀 Deployment

Hosting is Cloudflare Workers via `index.js` + `wrangler.jsonc` (static assets
from `dist`, the worker only handles not-found paths). Firebase project:
`CargoRealTime`. Domain: nextcargo.eu.

`VITE_*` variables are inlined by Vite **at build time**, so they must exist in
the Cloudflare build environment — not only in a local `.env`.

## 🆘 Support

For issues or questions:
1. Review the browser console for errors
2. Verify the Firebase configuration
3. Check the Firestore security rules

## 📄 License

MIT License

Основная палитра
СИНИЙ (Blue) — Основной фирменный цвет

blue-50 — очень светлый синий фон для иконок и акцентов
blue-100 — светлый синий для текста и номеров шагов
blue-200 — соединительные линии между шагами
blue-600 — основной синий для кнопок, иконок, выделения
blue-800 — тёмный синий в градиентах (Hero и CTA секции)
blue-900 — очень тёмный синий для текста в жёлтом лейбле
Роль: Вызывает доверие и безопасность. Используется на всех главных элементах — кнопках, градиентах, иконках. Это цвет корпоративности и надёжности.

БЕЛЫЙ (White) — Контраст и чистота

Основной фон сайта
Контрастная кнопка на синем фоне
Карточки с информацией
Роль: Чистота, профессионализм, читаемость

СЕРЫЙ (Gray) — Нейтральность и иерархия

gray-50 — фон альтернативных секций
gray-100 — иконки фона в карточках
gray-200 — бордеры карточек
gray-300-800 — различные уровни текста (от светлого к тёмному)
gray-900 — основной текст
Роль: Создаёт структуру, разделяет контент, обеспечивает читаемость

ЗЕЛЁНЫЙ (Green) — Действие и СМС

green-500 — кнопка WhatsApp (основной)
green-600 — при наведении на кнопку WhatsApp
green-400 — ссылка на Telegram в футере
Роль: Универсальный цвет мессенджеров. Зелёный ассоциируется с приватностью, безопасностью переговоров и быстрым общением.

ЖЁЛТЫЙ (Yellow) — Привлечение внимания

yellow-400 — лейбл "ЛУЧШИЙ ВЫБОР" на тарифе "Популярный"
yellow-400 — лейбл "Первая регистрация — бесплатно!" в CTA
Роль: Выделяет специальные предложения, создаёт ощущение срочности и выгоды

Цветовая иерархия на странице
Синий — главные действия (регистрация, основные кнопки)
Зелёный — вторичные действия (мессенджеры)
Жёлтый — выделение лучших предложений
Серый — текст, разделители, фоны секций
Белый — основной фон и контраст
Эта палитра создаёт профессиональный, надёжный и современный внешний вид, который вызывает доверие у потенциальных клиентов
