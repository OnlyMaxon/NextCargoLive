# Firebase Setup Guide для NextCargo

## Шаг 1: Создание Firebase проекта

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Нажмите "Add project" (Создать проект)
3. Введите имя проекта: `nextcargo` или любое другое
4. Следуйте инструкциям для создания проекта

## Шаг 2: Регистрация веб-приложения

1. В консоли Firebase выберите ваш проект
2. Нажмите на иконку Web (</>)
3. Зарегистрируйте приложение с именем "NextCargo Web"
4. Скопируйте Firebase configuration объект

## Шаг 3: Настройка Authentication

1. В боковом меню выберите **Build** → **Authentication**
2. Нажмите "Get started"
3. Включите **Email/Password** метод аутентификации:
   - Нажмите на "Email/Password"
   - Включите первый переключатель (Email/Password)
   - Сохраните

## Шаг 4: Создание Firestore Database

1. В боковом меню выберите **Build** → **Firestore Database**
2. Нажмите "Create database"
3. Выберите режим:
   - **Production mode** (рекомендуется для начала)
4. Выберите локацию (ближайшую к Азербайджану):
   - `europe-west1` (Belgium) - рекомендуется
   - или `europe-central2` (Warsaw, Poland)

## Шаг 5: Настройка Security Rules для Firestore

Вставьте следующие правила безопасности в Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Функция для проверки, является ли пользователь админом
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Функция для проверки, владелец ли пользователь документа
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Только аутентифицированные пользователи могут читать профили
      allow read: if request.auth != null;
      
      // Создание профиля при регистрации
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Обновление только своего профиля или админом
      allow update: if isOwner(userId) || isAdmin();
      
      // Удаление только админом
      allow delete: if isAdmin();
    }
    
    // Orders collection
    match /orders/{orderId} {
      // Пользователь может читать только свои заказы, админ - все
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || isAdmin());
      
      // Создание заказов только админом
      allow create: if isAdmin();
      
      // Обновление заказов только админом
      allow update: if isAdmin();
      
      // Удаление заказов только админом
      allow delete: if isAdmin();
    }
    
    // Support Messages collection
    match /support_messages/{messageId} {
      // Пользователь может читать только свои сообщения, админ - все
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || isAdmin());
      
      // Пользователь может создавать свои сообщения, админ - любые
      allow create: if request.auth != null && 
                       (request.resource.data.userId == request.auth.uid || isAdmin());
      
      // Обновление и удаление только админом
      allow update, delete: if isAdmin();
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      // Пользователь может читать только свои уведомления, админ - все
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || isAdmin());
      
      // Создание уведомлений только админом
      allow create: if isAdmin();
      
      // Пользователь может обновить только поле read своих уведомлений
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid &&
                       request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read']);
      
      // Удаление только админом
      allow delete: if isAdmin();
    }
  }
}
```

## Шаг 6: Создание .env файла

1. Скопируйте файл `.env.example` в `.env`:
   ```bash
   cp .env.example .env
   ```

2. Заполните `.env` файл вашими данными из Firebase Config:
   ```
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=nextcargo-xxxxx.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=nextcargo-xxxxx
   VITE_FIREBASE_STORAGE_BUCKET=nextcargo-xxxxx.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

## Шаг 7: Установка Firebase зависимостей

Выполните команду для установки Firebase SDK:

```bash
npm install firebase
```

## Шаг 8: Создание первого админа

После первого деплоя приложения вам нужно вручную создать админа:

1. Зарегистрируйте обычного пользователя через приложение
2. Перейдите в Firebase Console → Firestore Database
3. Найдите созданного пользователя в коллекции `users`
4. Добавьте поле `isAdmin` со значением `true`

Либо создайте документ вручную:
- Collection: `users`
- Document ID: любой (будет использован как UID)
- Fields:
  ```
  firstName: "Admin"
  lastName: "User"
  finCode: "ADMIN01"
  isAdmin: true
  createdAt: (timestamp) now
  ```

Затем в Firebase Authentication создайте пользователя с этим UID.

## Шаг 9: Коллекции Firestore

Приложение использует следующие коллекции:

### users
```javascript
{
  firstName: string,
  lastName: string,
  finCode: string,     // 7-значный код
  isAdmin: boolean,
  createdAt: timestamp
}
```

### orders
```javascript
{
  userId: string,           // ID пользователя
  trackingNumber: string,
  description: string,
  status: "В пути" | "На складе" | "Доставлен",
  weight: string,
  price: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### support_messages
```javascript
{
  userId: string,
  userName: string,
  message: string,
  isAdmin: boolean,     // true если сообщение от админа
  timestamp: timestamp
}
```

### notifications
```javascript
{
  userId: string,
  title: string,
  message: string,
  read: boolean,
  timestamp: timestamp
}
```

## Шаг 10: Индексы Firestore (опционально)

Для оптимизации запросов создайте следующие индексы:

1. **orders**:
   - `userId` (Ascending) + `createdAt` (Descending)

2. **support_messages**:
   - `userId` (Ascending) + `timestamp` (Ascending)

3. **notifications**:
   - `userId` (Ascending) + `timestamp` (Descending)

Firebase автоматически предложит создать индексы при первых запросах.

## Безопасность

⚠️ **ВАЖНО:**
- Никогда не коммитьте `.env` файл в Git
- Храните Firebase credentials в безопасности
- Используйте сложные пароли для админа
- Регулярно проверяйте Security Rules

## Деплой

После настройки Firebase приложение готово к работе. Вы можете развернуть его на:
- Firebase Hosting
- Vercel
- Netlify
- Любой другой платформе для статических сайтов

### Firebase Hosting (рекомендуется)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Поддержка

Если возникнут проблемы, проверьте:
1. Правильность Firebase credentials в `.env`
2. Security Rules в Firestore
3. Настройки Authentication
4. Консоль браузера на наличие ошибок
