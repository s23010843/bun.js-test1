
const server = Bun.serve({
  port: 3000,
  routes: {
    "/static/*": Bun.file("./docs")
  },
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response("Home");
    }

    if (url.pathname === "/health") {
      return new Response("OK");
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🚀 Bun server running on http://localhost:${server.port}`);
