import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuLbIgWLR2328kCjmczAHYF1-ef5lNvGwdUHLSZCou1YAXXOnKJVmalwbaBTluPCU7oQ/exec";

async function handler(req: Request): Promise<Response> {
  if (req.method === "GET") {
    // Раздаём HTML-файл с тестом
    const html = await Deno.readTextFile("index.html");
    return new Response(html, { headers: { "Content-Type": "text/html" } });
  }

  if (req.method === "POST") {
    try {
      const data = await req.json();
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      return new Response(await response.text(), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Ошибка при отправке данных" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
}

serve(handler, { port: 8000 });

console.log("Server running on Deno Deploy...");
