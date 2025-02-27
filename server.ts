import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const html = await Deno.readTextFile("index.html");

serve(() => new Response(html, { headers: { "Content-Type": "text/html" } }), { port: 8000 });
