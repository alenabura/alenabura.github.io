import { serve } from "https://deno.land/std/http/server.ts";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwlU-O0aZfTBkX9wosj7cLKpNodNL4i4V0iO27dbwuWdIZXgGZ_aZJ0ShMfoIjeJqQBYg/exec";

serve(async (req) => {
  const url = new URL(req.url);

  // Возвращаем HTML-страницу при GET-запросе на корневой путь
  if (req.method === "GET" && url.pathname === "/") {
    const html = await Deno.readTextFile("./index.html");
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Обрабатываем POST-запросы на /submit
  if (req.method === "POST" && url.pathname === "/submit") {
    try {
      const data = await req.json();
      console.log("Received data:", data); // Логируем полученные данные

      // Отправляем данные в Google Apps Script
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      console.log("Google Script response:", result); // Логируем ответ от Google Apps Script

      return new Response(result, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Возвращаем 404 для всех остальных запросов
  return new Response("Not Found", { status: 404 });
});

console.log("Server running on Deno Deploy...");
