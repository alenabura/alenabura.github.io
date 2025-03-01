import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Вставь сюда свой реальный URL из Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxidu0vgi2eK0yMme0g6Gsak1HBykCnp4k7zSsdlw--eUMHn_rtKFhPhm3j3G1Pe7BkDA/exec";

serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === "GET" && url.pathname === "/") {
    const html = await Deno.readTextFile("./index.html");
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (req.method === "POST" && url.pathname === "/submit") {
    try {
      const data = await req.json();
      console.log("Получены данные от клиента:", data); // Логируем данные

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      console.log("Ответ от Google Apps Script:", result); // Логируем ответ

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

  return new Response("Not Found", { status: 404 });
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
