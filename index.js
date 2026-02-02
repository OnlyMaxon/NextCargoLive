export default {
  async fetch(request, env) {
    // Этот код позволяет воркеру видеть переменные из env
    // и одновременно отдавать статические файлы
    return env.ASSETS.fetch(request);
  }
};
