// push.js —— 与 server.js 同跑，机器上要有 git
const { execSync } = require("node:child_process");
const path = require("node:path");

const REPO = path.join(__dirname);

setInterval(() => {
  try {
    execSync("git add MT/", { cwd: REPO, stdio: "ignore" });
    execSync(
      'git commit -m "tvt drop $(date -u +%FT%TZ)" || true',
      { cwd: REPO, shell: "/bin/sh", stdio: "ignore" }
    );
    execSync("git push origin main", { cwd: REPO, stdio: "ignore" });
  } catch (_) {}
}, 60_000);
