#!/usr/bin/env node
// Runs apps/api's Django dev server using its venv, regardless of OS —
// pnpm scripts can't branch on process.platform themselves, so this small
// wrapper picks the right venv interpreter path (Scripts/python.exe on
// Windows, bin/python everywhere else) and spawns manage.py runserver.

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const apiDir = path.join(repoRoot, "apps", "api");

const venvPython =
  process.platform === "win32"
    ? path.join(apiDir, ".venv", "Scripts", "python.exe")
    : path.join(apiDir, ".venv", "bin", "python");

if (!existsSync(venvPython)) {
  console.error(
    `[dev-api] No venv found at ${venvPython}.\n` +
      `Set one up first:\n` +
      `  cd apps/api && python -m venv .venv && ` +
      `.venv/${process.platform === "win32" ? "Scripts/python.exe" : "bin/python"} -m pip install -r requirements/dev.txt`
  );
  process.exit(1);
}

const child = spawn(venvPython, ["manage.py", "runserver", "127.0.0.1:8000"], {
  cwd: apiDir,
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));
