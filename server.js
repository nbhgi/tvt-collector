// server.js —— node >= 18，零外部依赖
const http  = require("node:http");
const fs    = require("node:fs/promises");
const path  = require("node:path");

const MT_DIR = path.join(__dirname, "MT");
const PORT   = process.env.PORT || 3000;

async function ensureDir() {
  await fs.mkdir(MT_DIR, { recursive: true });
}

function safeName(ts) {
  return `tvt-${ts}.tvt`;
}

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/collect") {
    let raw = "";
    req.on("data", c => { raw += c; });
    req.on("end", async () => {
      try {
        const json = decodeURIComponent(escape(atob(raw.trim())));
        const obj  = JSON.parse(json);

        await ensureDir();
        const ts   = obj.t || Date.now();
        const file = path.join(MT_DIR, safeName(ts));

        await fs.writeFile(
          file,
          JSON.stringify(obj, null, 2),
          { encoding: "utf8", flag: "w" }
        );

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("ok");
      } catch (e) {
        res.writeHead(400);
        res.end("bad");
      }
    });
  } else if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("collector alive");
  } else {
    res.writeHead(404); res.end();
  }
});

ensureDir().then(() => server.listen(PORT, () => {
  console.log(`collector on :${PORT}`);
}));
