import pkg from "./package.json" assert { type: "json" };

const PORT = parseInt(process.env.PORT || "3000");

let basePath = "";
if (pkg && pkg.homepage) {
  try {
    basePath = new URL(pkg.homepage).pathname.replace(/\/$/, "");
  } catch {}
}

const routes: Record<string, any> = {};
if (basePath) {
  routes[`${basePath}/*`] = Bun.file("./docs");
  routes[basePath] = Bun.file("./docs/index.html");
} else {
  routes["/*"] = Bun.file("./docs");
}

const server = Bun.serve({
  port: PORT,
  routes,
  fetch(req) {
    const url = new URL(req.url);

    // health check (support both root and basePath/health)
    if (url.pathname === "/health" || url.pathname === `${basePath}/health`) {
      return new Response("OK");
    }

    // redirect root to basePath when basePath is configured (mimic GitHub Pages path)
    if (url.pathname === "/" && basePath) {
      return new Response(null, { status: 302, headers: { Location: `${basePath}/` } });
    }

    // let the static `routes` mapping handle files; fallback to docs/index.html for SPA
    return Bun.file("./docs/index.html");
  },
});

console.log(`🚀 Bun server running on http://localhost:${server.port}${basePath || ""}/`);
