const server = Bun.serve({
  port: 5000,
  fetch(req) {
    return new Response("Hello from Bun server!");
  },
});

console.log(`🚀 Bun server running on http://localhost:${server.port}`);
