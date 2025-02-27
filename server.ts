import { serve } from "https://deno.land/std/http/server.ts";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuLbIgWLR2328kCjmczAHYF1-ef5lNvGwdUHLSZCou1YAXXOnKJVmalwbaBTluPCU7oQ/exec";

serve(async (req) => {
  if (req.method === "POST") {
    const data = await req.json();
    console.log("Received data:", data); // Логируем полученные данные

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    console.log("Google Script response:", await response.text()); // Логируем ответ от Google Apps Script
    return new Response(await response.text(), { headers: { "Content-Type": "application/json" } });
  }

  return new Response("OK", { status: 200 });
});

console.log("Server running on Deno Deploy...");
