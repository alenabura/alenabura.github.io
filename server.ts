import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);

  // Разрешаем CORS для всех запросов
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  // Обрабатываем предварительный запрос (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  // При заходе на "/" отдаем HTML-страницу
  if (req.method === "GET" && url.pathname === "/") {
    try {
      const html = await Deno.readTextFile("./index.html");
      return new Response(html, {
        headers: { ...headers, "Content-Type": "text/html" },
      });
    } catch (error) {
      console.error("Ошибка при чтении index.html:", error);
      return new Response("Internal Server Error", { status: 500, headers });
    }
  }

  // При POST-запросе на "/submit" отправляем данные в Google Apps Script
  if (req.method === "POST" && url.pathname === "/submit") {
    try {
      const data = await req.json();
      console.log("Получены данные от клиента:", data);

      // Возвращаем данные в формате JSONP
      const callback = url.searchParams.get("callback");
      if (callback) {
        return new Response(
          `${callback}(${JSON.stringify({ success: true, data })})`,
          { headers: { ...headers, "Content-Type": "application/javascript" } },
        );
      } else {
        return new Response(JSON.stringify({ success: true, data }), {
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
    } catch (error) {
      console.error("Ошибка на сервере Deno:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500, headers: { ...headers, "Content-Type": "application/json" } },
      );
    }
  }

  // Если маршрут не найден — возвращаем 404
  return new Response("Not Found", { status: 404, headers });
});

console.log("Сервер запущен на Deno Deploy...");
