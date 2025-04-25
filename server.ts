import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { extname, join } from "https://deno.land/std@0.224.0/path/mod.ts";

// Вставь сюда свой реальный URL из Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbymcwZ1RHjuAUVTi9lRMA-PEktBVCaLW4PEM6dwb-EHIn0-lUpm1QkIMqITyamYlDQpdw/exec";

const mimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

serve(async (req) => {
  const url = new URL(req.url);

  // При заходе на "/" отдаем HTML-страницу
    if (req.method === "GET" && url.pathname === "/") {
        const html = await Deno.readTextFile("./index.html");
        return new Response(html, {
            headers: { "Content-Type": "text/html" },
        });
    }
        
 if (req.method === "GET" && url.pathname.startsWith("/images/")) {
    // Убираем начальный слэш, предотвращаем выход за пределы директории
    const filePath = join("./images", url.pathname.replace(/^\/images\//, ""));
    
    try {
      // Проверяем существование файла
      await Deno.stat(filePath);

      // Определяем MIME-тип по расширению
      const ext = extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext];

      if (contentType) {
        const file = await Deno.readFile(filePath);
        return new Response(file, {
          headers: { "Content-Type": contentType },
        });
      } else {
        return new Response("Unsupported file type", { status: 415 });
      }
    } catch (error) {
      console.error("Ошибка при обработке изображения:", error);
      return new Response("File not found", { status: 404 });
    }
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

