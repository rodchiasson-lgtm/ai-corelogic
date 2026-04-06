import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { handleTelegramMessage, handleTelegramCallback } from "../shared/telegram-bot.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Telegram webhook endpoint
  app.post("/api/telegram/webhook", async (req, res) => {
    try {
      const { message, callback_query } = req.body;

      if (message) {
        await handleTelegramMessage(message);
      } else if (callback_query) {
        await handleTelegramCallback(callback_query);
      }

      res.json({ ok: true });
    } catch (error) {
      console.error("Telegram webhook error:", error);
      res.status(500).json({ ok: false, error: "Internal server error" });
    }
  });

  // Email sending endpoint
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, name, email, company, service, message } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Log the email submission
      console.log("Email received:", {
        to,
        from: email,
        name,
        company,
        service,
        message,
        timestamp: new Date().toISOString(),
      });

      // Return success response
      res.json({ success: true, message: "Email received successfully" });
    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`Telegram webhook available at /api/telegram/webhook`);
    console.log(`Email endpoint available at /api/send-email`);
  });
}

startServer().catch(console.error);
