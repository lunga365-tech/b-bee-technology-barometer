import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { seedDemoData } from "../seed";

async function runMigrations() {
  if (!process.env.DATABASE_URL) return;
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
    const client = await pool.connect();
    // Find all migration SQL files and run them in order
    const migrationDirs = [
      path.join(process.cwd(), "drizzle"),
      path.join(__dirname, "../../drizzle"),
    ];
    let migrationDir = "";
    for (const dir of migrationDirs) {
      try {
        if (fs.existsSync(dir)) { migrationDir = dir; break; }
      } catch (_) {}
    }
    if (!migrationDir) { client.release(); await pool.end(); return; }
    const sqlFiles = fs.readdirSync(migrationDir)
      .filter(f => f.endsWith(".sql"))
      .sort();
    let totalStatements = 0;
    for (const sqlFile of sqlFiles) {
      const migrationSql = fs.readFileSync(path.join(migrationDir, sqlFile), "utf-8");
      const statements = migrationSql.split("--> statement-breakpoint").map(s => s.trim()).filter(Boolean);
      for (const stmt of statements) {
        try {
          await client.query(stmt);
          totalStatements++;
        } catch (err: any) {
          // Log non-trivial errors (not "already exists")
          const msg = err?.message || "";
          if (!msg.includes("already exists") && !msg.includes("duplicate")) {
            console.warn(`[Migration] Statement failed (${sqlFile}):`, msg.slice(0, 200));
          }
        }
      }
    }
    client.release();
    await pool.end();
    console.log(`[Migration] Database schema applied successfully (${sqlFiles.length} files, ${totalStatements} statements)`);
  } catch (err) {
    console.warn("[Migration] Could not run migrations:", err);
  }
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  await runMigrations();
  await seedDemoData();
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
