# ✅ Firebase Integration Checklist

## 📋 Перед началом

- [ ] У вас есть Google аккаунт
- [ ] Node.js и npm установлены
- [ ] Проект NextCargo скачан/клонирован

## 🔥 Настройка Firebase Console

### 1. Создание проекта
- [ ] Открыть [Firebase Console](https://console.firebase.google.com/)
- [ ] Нажать "Add project" / "Создать проект"
- [ ] Ввести имя проекта (например: `nextcargo`)
- [ ] Отключить Google Analytics (опционально)
- [ ] Дождаться создания проекта

### 2. Регистрация Web App
- [ ] В обзоре проекта нажать на иконку `</>`
- [ ] Ввести App nickname: "NextCargo Web"
- [ ] НЕ включать Firebase Hosting пока
- [ ] Нажать "Register app"
- [ ] Скопировать `firebaseConfig` объект
- [ ] Нажать "Continue to console"

### 3. Настройка Authentication
- [ ] В боковом меню: Build → Authentication
- [ ] Нажать "Get started"
- [ ] Выбрать "Email/Password"
- [ ] Включить первый переключатель (Email/Password)
- [ ] Сохранить

### 4. Создание Firestore Database
- [ ] В боковом меню: Build → Firestore Database
- [ ] Нажать "Create database"
- [ ] Выбрать режим: **Production mode**
- [ ] Выбрать локацию: `europe-west1` (Belgium) или `europe-central2` (Warsaw)
- [ ] Нажать "Enable"

### 5. Настройка Security Rules
- [ ] В Firestore Database перейти на вкладку "Rules"
- [ ] Скопировать содержимое файла `firestore.rules` из проекта
- [ ] Вставить в редактор правил
- [ ] Нажать "Publish"

## 💻 Локальная настройка

### 6. Установка зависимостей
```bash
cd /workspaces/spark-template
npm install firebase
```
- [ ] Команда выполнена успешно
- [ ] Firebase пакет установлен

### 7. Создание .env файла
```bash
cp .env.example .env
```
- [ ] Файл `.env` создан
- [ ] Открыть `.env` в редакторе
- [ ] Заполнить из Firebase Config:
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`
- [ ] Сохранить файл

### 8. Проверка файлов Firebase
Убедитесь, что созданы:
- [ ] `src/lib/firebase.ts` - инициализация
- [ ] `src/lib/firebase-services.ts` - сервисы
- [ ] `firestore.rules` - правила безопасности
- [ ] `firestore.indexes.json` - индексы
- [ ] `firebase.json` - конфигурация

## 🧪 Тестирование

### 9. Запуск приложения
```bash
npm run dev
```
- [ ] Приложение запустилось без ошибок
- [ ] Открыть в браузере (обычно http://localhost:5173)
- [ ] Проверить консоль браузера (F12) - не должно быть Firebase ошибок

### 10. Тест регистрации
- [ ] Нажать "Register"
- [ ] Заполнить форму:
  - Имя: Test
  - Фамилия: User
  - FIN код: TEST123
  - Пароль: test1234
- [ ] Нажать "Register"
- [ ] Проверить Firebase Console → Authentication
- [ ] Должен появиться пользователь с email `test123@nextcargo.az`
- [ ] Проверить Firestore Database → users
- [ ] Должен появиться документ пользователя

### 11. Тест входа
- [ ] Выйти из приложения (если залогинены)
- [ ] Ввести FIN код: TEST123
- [ ] Ввести пароль: test1234
- [ ] Нажать "Login"
- [ ] Должен произойти успешный вход

## 👨‍💼 Создание админа

### 12. Создание первого админа
**Вариант A (рекомендуется):**
- [ ] Зарегистрировать пользователя через приложение
- [ ] Firebase Console → Firestore Database → users
- [ ] Найти созданного пользователя
- [ ] Нажать на документ
- [ ] Добавить поле: `isAdmin` = `true` (boolean)
- [ ] Сохранить
- [ ] Перезайти в приложение

**Вариант B (ручное создание):**
- [ ] Firestore → users → Add document
- [ ] Document ID: (auto-generate, скопировать ID)
- [ ] Добавить поля:
  ```
  firstName: "Admin"
  lastName: "NextCargo"
  finCode: "ADMIN01"
  isAdmin: true
  createdAt: (timestamp) now
  ```
- [ ] Authentication → Add user
  - Email: admin01@nextcargo.az
  - Password: ваш пароль
- [ ] Скопировать UID из Authentication
- [ ] Вернуться в Firestore, изменить Document ID на этот UID

### 13. Тест админ панели
- [ ] Выйти из приложения
- [ ] Ввести admin username: `CRG_ADMIN_PL2024`
- [ ] Ввести admin password: `Crg0!Plnd#Az2024$SecureAdmin!`
- [ ] Нажать "Login"
- [ ] Должна открыться админ панель

### 14. Тест создания заказа (админ)
- [ ] В админ панели нажать "Add Order"
- [ ] Найти тестового пользователя (поиск по TEST)
- [ ] Заполнить форму заказа
- [ ] Сохранить
- [ ] Проверить Firestore → orders
- [ ] Заказ должен появиться

### 15. Тест уведомлений
- [ ] В админ панели выбрать заказ
- [ ] Изменить статус
- [ ] Сохранить
- [ ] Проверить Firestore → notifications
- [ ] Уведомление должно быть создано
- [ ] Выйти из админки, войти как пользователь
- [ ] Уведомление должно отобразиться

## 🚀 Деплой (опционально)

### 16. Установка Firebase CLI
```bash
npm install -g firebase-tools
```
- [ ] CLI установлен
- [ ] Выполнить `firebase --version` для проверки

### 17. Логин в Firebase
```bash
firebase login
```
- [ ] Браузер открылся для авторизации
- [ ] Авторизация прошла успешно

### 18. Инициализация Firebase Hosting
```bash
firebase init hosting
```
- [ ] Выбрать существующий проект
- [ ] Public directory: `dist`
- [ ] Single-page app: `Yes`
- [ ] Overwrite index.html: `No`

### 19. Build и Deploy
```bash
npm run build
firebase deploy
```
- [ ] Build завершился успешно
- [ ] Deploy завершился успешно
- [ ] Firebase показал URL приложения
- [ ] Открыть URL в браузере
- [ ] Приложение работает

## ✅ Финальная проверка

- [ ] Регистрация пользователей работает
- [ ] Вход пользователей работает
- [ ] Админ вход работает
- [ ] Заказы создаются и отображаются
- [ ] Статусы обновляются
- [ ] Уведомления приходят
- [ ] Support сообщения работают
- [ ] Поиск пользователей работает (админ)
- [ ] Данные сохраняются после перезагрузки
- [ ] Security Rules защищают данные

## 📚 Документация

Если что-то не работает, проверьте:
- [ ] [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - детальная настройка
- [ ] [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - интеграция в код
- [ ] [README_FIREBASE.md](./README_FIREBASE.md) - обзор и API
- [ ] [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) - деплой на production

## 🆘 Troubleshooting

### Ошибка: "Firebase: Error (auth/configuration-not-found)"
- [ ] Проверить `.env` файл существует
- [ ] Проверить все переменные заполнены
- [ ] Перезапустить dev сервер: `npm run dev`

### Ошибка: "Missing or insufficient permissions"
- [ ] Проверить Security Rules опубликованы
- [ ] Проверить пользователь аутентифицирован
- [ ] Проверить `isAdmin` поле у админа

### Ошибка: "Index required"
- [ ] Firebase Console → Firestore → Indexes
- [ ] Нажать на ссылку из ошибки для auto-создания
- [ ] Подождать 2-3 минуты

### Данные не сохраняются
- [ ] Проверить консоль браузера (F12)
- [ ] Проверить Firebase credentials в `.env`
- [ ] Проверить Firestore Database создана
- [ ] Проверить Security Rules

## 🎉 Готово!

Если все пункты отмечены ✅, ваш проект NextCargo полностью интегрирован с Firebase!

**Следующие шаги:**
- Добавить real-time обновления (`onSnapshot`)
- Настроить Cloud Functions для автоматизации
- Добавить Firebase Analytics
- Настроить Push-уведомления (FCM)
- Добавить загрузку файлов (Storage)

**Полезные ссылки:**
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)
- [Firebase Auth](https://firebase.google.com/docs/auth)
