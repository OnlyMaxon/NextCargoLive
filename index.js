// Cloudflare Worker: отдаёт собранный SPA из ./dist
//
// Статику Cloudflare отдаёт сама, воркер запускается ТОЛЬКО когда файл не найден.
// env.ASSETS появляется благодаря "binding": "ASSETS" в wrangler.jsonc — без него
// здесь был TypeError на каждый несуществующий путь.
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request)
  }
}
