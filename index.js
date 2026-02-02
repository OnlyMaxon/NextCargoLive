export default {
  async fetch(request, env) {
    // Получаем статический HTML-файл из папки dist
    const response = await env.ASSETS.fetch(request);
    
    // Перехватываем ответ и используем HTMLRewriter
    return new HTMLRewriter()
      .on('head', {
        element(element) {
          // Вставляем скрипт в <head> с вашими ключами
          element.append(
            `<script>
              window.FIREBASE_CONFIG = {
                apiKey: "${env.VITE_FIREBASE_API_KEY}",
                authDomain: "${env.VITE_FIREBASE_AUTH_DOMAIN}",
                projectId: "${env.VITE_FIREBASE_PROJECT_ID}",
                storageBucket: "${env.VITE_FIREBASE_STORAGE_BUCKET}",
                messagingSenderId: "${env.VITE_FIREBASE_MESSAGING_SENDER_ID}",
                appId: "${env.VITE_FIREBASE_APP_ID}"
              };
            </script>`,
            { html: true }
          );
        }
      })
      .transform(response); // Применяем изменения
  }
};
