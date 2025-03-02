import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Вставьте сюда ваш реальный URL из Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxTcH7xi5u8C_x2mUL2VSBB23Qzh7Q1nEeBmy2ShaRycFQXdsmRKGEcXK-_T3RqaHWfsg/exec";

serve(async (req) => {
  const url = new URL(req.url);

  console.log(`Запрос: ${req.method} ${url.pathname}`); // Логируем метод и путь запроса

  // Разрешаем CORS для всех запросов
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*", // Разрешаем доступ с любого домена
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Разрешаем методы
    "Access-Control-Allow-Headers": "Content-Type", // Разрешаем заголовки
  });

  // Обрабатываем предварительный запрос (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  // При заходе на "/" отдаем HTML-страницу
  if (req.method === "GET" && url.pathname === "/") {
    console.log("Запрос на главную страницу"); // Логируем запрос на главную страницу
    try {
      const html = await Deno.readTextFile("./index.html");
      return new Response(html, {
        headers: { ...headers, "Content-Type": "text/html" },
      });
    } catch (error) {
      console.error("Ошибка при чтении index.html:", error); // Логируем ошибку
      return new Response("Internal Server Error", { status: 500, headers });
    }
  }

  // При POST-запросе на "/submit" отправляем данные в Google Apps Script
  if (req.method === "POST" && url.pathname === "/submit") {
    console.log("Получен POST-запрос на /submit"); // Логируем POST-запрос
    try {
      // Читаем данные из тела запроса
      const body = await req.text();
      console.log("Получены данные от клиента:", body); // Логируем данные от клиента

      // Отправляем данные в Google Apps Script
      console.log("Отправка данных в Google Apps Script...");
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" }, // Устанавливаем тип контента
        body: body, // Передаём данные как текст
      });

      const result = await response.text();
      console.log("Ответ от Google Apps Script:", result); // Логируем ответ от Google Apps Script

      // Возвращаем ответ клиенту
      return new Response(result, {
        headers: { ...headers, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Ошибка на сервере Deno:", error); // Логируем ошибку
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500, headers: { ...headers, "Content-Type": "application/json" } },
      );
    }
  }

  // Если маршрут не найден — возвращаем 404
  console.log("Маршрут не найден:", url.pathname); // Логируем 404
  return new Response("Not Found", { status: 404, headers });
});

console.log("Сервер запущен на Deno Deploy...");
