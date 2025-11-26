# 🚀 Deploy Guide - NextCargo на Firebase Hosting

## Подготовка к деплою

### 1. Установите Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Войдите в Firebase

```bash
firebase login
```

Откроется браузер для авторизации через Google аккаунт.

### 3. Инициализируйте Firebase в проекте

```bash
firebase init
```

Выберите:
- **Hosting**: Configure files for Firebase Hosting
- Используйте существующий проект
- Выберите ваш Firebase проект (nextcargo-xxxxx)
- **Public directory**: `dist`
- **Configure as single-page app**: `Yes`
- **Set up automatic builds**: `No`
- **Overwrite index.html**: `No`

## Деплой приложения

### Шаг 1: Проверьте .env

Убедитесь, что `.env` файл содержит production credentials:

```env
VITE_FIREBASE_API_KEY=your_production_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Шаг 2: Соберите проект

```bash
npm run build
```

Эта команда создаст оптимизированную production сборку в папке `dist/`.

### Шаг 3: Задеплойте на Firebase

```bash
firebase deploy
```

Или деплой только hosting:

```bash
firebase deploy --only hosting
```

### Шаг 4: Деплой Security Rules и Indexes

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

Или все сразу:

```bash
firebase deploy --only hosting,firestore
```

## После деплоя

1. Firebase CLI покажет URL вашего приложения:
   ```
   Hosting URL: https://your-project.web.app
   ```

2. Откройте URL в браузере

3. Создайте первого админа (см. ниже)

## Создание первого админа

### Вариант 1: Через консоль Firebase

1. Зарегистрируйте пользователя через приложение
2. Откройте [Firebase Console](https://console.firebase.google.com/)
3. Выберите ваш проект → Firestore Database
4. Найдите пользователя в коллекции `users`
5. Добавьте поле: `isAdmin: true`

### Вариант 2: Вручную создать админа

1. Firebase Console → Firestore Database → Start Collection
2. Collection ID: `users`
3. Document ID: (auto-generate)
4. Добавьте поля:
   ```
   firstName: "Admin"
   lastName: "NextCargo"
   finCode: "ADMIN01"
   isAdmin: true
   createdAt: (timestamp) now
   ```
5. Firebase Console → Authentication → Add user
   - Email: `admin01@nextcargo.az`
   - Password: ваш сложный пароль
   - User UID: скопируйте UID из Authentication
6. Вернитесь в Firestore и измените Document ID на этот UID

## Обновление приложения

```bash
# 1. Внесите изменения в код
# 2. Соберите новую версию
npm run build

# 3. Задеплойте
firebase deploy
```

## Мониторинг

### Просмотр логов

```bash
firebase hosting:channel:list
```

### Откат к предыдущей версии

1. Firebase Console → Hosting
2. Выберите предыдущую версию
3. Нажмите "Rollback"

## Custom Domain (опционально)

### Добавление своего домена

1. Firebase Console → Hosting → Add custom domain
2. Введите ваш домен (например, nextcargo.az)
3. Следуйте инструкциям для добавления DNS записей
4. Подождите верификацию (до 24 часов)
5. Firebase автоматически выпустит SSL сертификат

### DNS настройки (пример)

Для `nextcargo.az`:
```
Type: A
Name: @
Value: 151.101.1.195
       151.101.65.195
```

Для `www.nextcargo.az`:
```
Type: CNAME
Name: www
Value: your-project.web.app.
```

## Environment Variables для Production

Firebase Hosting не поддерживает серверные environment variables для статических сайтов. Все переменные из `.env` встраиваются в build.

⚠️ **ВАЖНО**: 
- Firebase config (API keys) можно безопасно показывать в клиенте
- Firebase Security Rules защищают данные
- НЕ храните серверные секреты в `.env` для фронтенда

## Continuous Deployment (опционально)

### GitHub Actions

Создайте `.github/workflows/firebase-hosting-merge.yml`:

```yaml
name: Deploy to Firebase Hosting on merge
on:
  push:
    branches:
      - main
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

Добавьте secrets в GitHub:
1. Settings → Secrets → Actions
2. Добавьте все `VITE_FIREBASE_*` переменные

## Troubleshooting

### Build fails
```bash
# Очистите кеш
rm -rf node_modules dist
npm install
npm run build
```

### Deploy fails
```bash
# Проверьте авторизацию
firebase login --reauth

# Проверьте проект
firebase projects:list
firebase use your-project-id
```

### App не работает после деплоя
- Проверьте Firebase config в `.env`
- Проверьте Security Rules в Firestore
- Проверьте консоль браузера (F12)
- Убедитесь, что Authentication включен

### Firebase CLI outdated
```bash
npm update -g firebase-tools
```

## Полезные команды

```bash
# Список проектов
firebase projects:list

# Переключить проект
firebase use <project-id>

# Preview перед деплоем
firebase hosting:channel:deploy preview

# Просмотр текущих deployments
firebase hosting:sites:list

# Удалить канал
firebase hosting:channel:delete <channel-id>
```

## Оптимизация Performance

### 1. Включите CDN
Firebase Hosting автоматически использует CDN по всему миру.

### 2. Настройте caching
Файл `firebase.json` уже настроен для оптимального кеширования.

### 3. Сожмите assets
```bash
# Vite автоматически сжимает при production build
npm run build
```

### 4. Анализ bundle size
```bash
npm run build -- --report
```

## Мониторинг и Analytics

### Firebase Analytics
Добавьте в `src/lib/firebase.ts`:
```typescript
import { getAnalytics } from 'firebase/analytics'

export const analytics = getAnalytics(app)
```

### Performance Monitoring
```bash
npm install firebase/performance
```

```typescript
import { getPerformance } from 'firebase/performance'

export const perf = getPerformance(app)
```

## Стоимость

Firebase Hosting - **бесплатно** на Spark plan:
- 10 GB хранилище
- 360 MB/day bandwidth
- Custom domain
- SSL сертификат

Для больших нагрузок переходите на Blaze (pay-as-you-go).

## Резервное копирование

```bash
# Экспорт Firestore
gcloud firestore export gs://your-bucket/backup

# Или используйте Firebase Console → Firestore → Import/Export
```

## Support

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firebase Status](https://status.firebase.google.com/)

---

**Готово! Ваше приложение NextCargo теперь в production! 🚀**
