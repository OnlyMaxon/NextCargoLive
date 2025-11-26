# NextCargo - Firebase Ready 🚀

Этот проект полностью подготовлен для интеграции с Firebase Authentication и Firestore.

## 📋 Что уже готово

✅ Структура Firebase конфигурации  
✅ Сервисы для работы с Firebase (auth, orders, support, notifications)  
✅ Security Rules для Firestore  
✅ Индексы для оптимизации запросов  
✅ Конфигурация для Firebase Hosting  
✅ Пример `.env` файла  
✅ Полная документация по настройке  

## 🚀 Быстрый старт

### 1. Установите Firebase SDK

```bash
npm install firebase
```

### 2. Настройте Firebase проект

Следуйте инструкциям в файле **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

Кратко:
1. Создайте проект на [Firebase Console](https://console.firebase.google.com/)
2. Включите Email/Password Authentication
3. Создайте Firestore Database
4. Скопируйте конфигурацию

### 3. Создайте .env файл

```bash
cp .env.example .env
```

Заполните `.env` вашими Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Примените Security Rules

1. Откройте Firebase Console → Firestore Database → Rules
2. Скопируйте содержимое файла `firestore.rules`
3. Вставьте и опубликуйте

Или используйте Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

### 5. Запустите приложение

```bash
npm run dev
```

## 📁 Структура файлов Firebase

```
/workspaces/spark-template/
├── src/
│   └── lib/
│       ├── firebase.ts              # Инициализация Firebase
│       └── firebase-services.ts     # Сервисы для работы с данными
├── .env.example                     # Шаблон переменных окружения
├── .env                            # Ваши credentials (не коммитится)
├── firebase.json                   # Конфигурация Firebase
├── firestore.rules                 # Правила безопасности
├── firestore.indexes.json          # Индексы для запросов
├── FIREBASE_SETUP.md              # Полная инструкция по настройке
├── INTEGRATION_GUIDE.md           # Руководство по интеграции в код
└── README_FIREBASE.md             # Этот файл
```

## 🔧 Доступные сервисы

### authService
```typescript
import { authService } from '@/lib/firebase-services'

// Регистрация
await authService.register(email, password, userData)

// Вход
await authService.login(email, password)

// Выход
await authService.logout()

// Получить данные пользователя
await authService.getUserData(userId)

// Поиск по FIN коду
await authService.getUserByFinCode(finCode)
```

### ordersService
```typescript
import { ordersService } from '@/lib/firebase-services'

// Создать заказ
await ordersService.createOrder(orderData)

// Обновить заказ
await ordersService.updateOrder(orderId, updates)

// Удалить заказ
await ordersService.deleteOrder(orderId)

// Получить заказы пользователя
await ordersService.getUserOrders(userId)

// Получить все заказы (админ)
await ordersService.getAllOrders()
```

### supportService
```typescript
import { supportService } from '@/lib/firebase-services'

// Отправить сообщение
await supportService.sendMessage(messageData)

// Получить сообщения пользователя
await supportService.getUserMessages(userId)

// Получить все сообщения (админ)
await supportService.getAllMessages()
```

### notificationsService
```typescript
import { notificationsService } from '@/lib/firebase-services'

// Создать уведомление
await notificationsService.createNotification(notificationData)

// Получить уведомления пользователя
await notificationsService.getUserNotifications(userId)

// Отметить как прочитанное
await notificationsService.markAsRead(notificationId)
```

### usersService
```typescript
import { usersService } from '@/lib/firebase-services'

// Получить всех пользователей (админ)
await usersService.getAllUsers()

// Поиск пользователей
await usersService.searchUsers(searchTerm)
```

## 🗄️ Структура данных Firestore

### Collection: users
```typescript
{
  firstName: string
  lastName: string
  finCode: string        // 7-значный код (например: "ABC1234")
  isAdmin: boolean
  createdAt: Timestamp
}
```

### Collection: orders
```typescript
{
  userId: string
  trackingNumber: string
  description: string
  status: "В пути" | "На складе" | "Доставлен"
  weight: string
  price: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Collection: support_messages
```typescript
{
  userId: string
  userName: string
  message: string
  isAdmin: boolean
  timestamp: Timestamp
}
```

### Collection: notifications
```typescript
{
  userId: string
  title: string
  message: string
  read: boolean
  timestamp: Timestamp
}
```

## 👨‍💼 Создание первого админа

После регистрации пользователя через приложение:

1. Откройте Firebase Console → Firestore
2. Найдите вашего пользователя в коллекции `users`
3. Добавьте поле: `isAdmin: true`

Теперь этот пользователь может входить как админ.

## 🔒 Безопасность

- ✅ Security Rules настроены
- ✅ Пользователи видят только свои данные
- ✅ Админы имеют полный доступ
- ✅ Пароли хранятся в Firebase Auth (зашифрованы)
- ✅ `.env` не коммитится в Git

## 📱 Интеграция в компоненты

Подробная инструкция в файле **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)**

Краткий пример:

```typescript
// App.tsx
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { authService, ordersService } from '@/lib/firebase-services'

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await authService.getUserData(firebaseUser.uid)
        setCurrentUser(userData)
        
        const userOrders = await ordersService.getUserOrders(firebaseUser.uid)
        setOrders(userOrders)
      }
    })

    return () => unsubscribe()
  }, [])

  // ...
}
```

## 🚀 Деплой на Firebase Hosting

```bash
# Установите Firebase CLI
npm install -g firebase-tools

# Войдите в аккаунт
firebase login

# Инициализируйте проект
firebase init hosting

# Соберите проект
npm run build

# Задеплойте
firebase deploy
```

## 📚 Документация

- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Полная настройка Firebase
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Интеграция в код
- **[firestore.rules](./firestore.rules)** - Security Rules
- **[firestore.indexes.json](./firestore.indexes.json)** - Индексы

## ❓ FAQ

**Q: Нужно ли устанавливать Firebase CLI?**  
A: Только если хотите деплоить на Firebase Hosting или управлять проектом через CLI.

**Q: Где хранятся пароли?**  
A: Пароли хранятся в Firebase Authentication (зашифрованы), НЕ в Firestore.

**Q: Как создать админа?**  
A: Зарегистрируйте пользователя, затем добавьте `isAdmin: true` в его документ в Firestore.

**Q: Можно ли использовать другой backend?**  
A: Да, но проект оптимизирован для Firebase. Файлы `firebase-services.ts` можно адаптировать.

**Q: Нужно ли менять существующий код?**  
A: Минимально. Замените `useKV` на Firebase сервисы. См. INTEGRATION_GUIDE.md

## 🆘 Поддержка

Если возникли проблемы:

1. Проверьте `.env` файл
2. Убедитесь, что Firebase credentials верные
3. Проверьте Security Rules в Firestore
4. Посмотрите консоль браузера на ошибки
5. Убедитесь, что Email/Password authentication включен

## 🎯 Следующие шаги

После интеграции Firebase вы можете:

- [ ] Добавить push-уведомления (FCM)
- [ ] Настроить Cloud Functions для автоматизации
- [ ] Добавить Firebase Analytics
- [ ] Настроить автоматический бэкап
- [ ] Добавить загрузку файлов (Firebase Storage)
- [ ] Внедрить real-time обновления с `onSnapshot`

## 📄 Лицензия

См. [LICENSE](./LICENSE)

---

**NextCargo** - Доставка из Польши в Азербайджан 🇵🇱 → 🇦🇿
