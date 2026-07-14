import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const distDir = join(process.cwd(), "dist");
const indexPath = join(distDir, "index.html");
const notFoundPath = join(distDir, "404.html");

if (existsSync(indexPath)) {
  copyFileSync(indexPath, notFoundPath);
  console.log("Created dist/404.html for SPA routing.");
}
