// Этот код должен быть в файле index.js в корне проекта
const CANONICAL_HOST = 'nextcargo.eu'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // SEO: держим один канонический хост. Без этого поисковики видят две копии
    // сайта (www и без www) и делят между ними вес ссылок.
    // Срабатывает только на точном совпадении, превью на *.workers.dev не трогаем.
    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST
      return Response.redirect(url.toString(), 301)
    }

    // env.ASSETS — это специальная переменная, которая знает, где лежат ваши статические файлы.
    // Вы можете добавить сюда любую другую логику или использовать ваши переменные env.VITE_...
    return env.ASSETS.fetch(request)
  }
}
