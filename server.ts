import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Вставь сюда свой реальный URL из Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwlQYCm0Av1DJD1Pn7hSjXxHx0asuJeVWPp9gKHeY_HHlYQ8XW_NJilG0sD5mn5ZBpo/exec";

serve(async (req) => {
  const url = new URL(req.url);

  // При заходе на "/" отдаем HTML-страницу
  if (req.method === "GET" && url.pathname === "/") {
    const html = await Deno.readTextFile("./index.html");
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // При POST-запросе на "/submit" отправляем данные в Google Apps Script
  if (req.method === "POST" && url.pathname === "/submit") {
    try {
      const data = await req.json();
      console.log("Получены данные от клиента:", data);

      // Отправляем данные в Google Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      console.log("Ответ от Google Apps Script:", result);

      return new Response(result, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Ошибка на сервере Deno:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  // Если маршрут не найден — возвращаем 404
  return new Response("Not Found", { status: 404 });
});

console.log("Сервер запущен на Deno Deploy...");
