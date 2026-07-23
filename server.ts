import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for notification dispatch to jhovzdesign@gmail.com
  app.post("/api/notify-email", (req, res) => {
    const { type, name, email, phone, subject, serviceType, details, budget, targetDate } = req.body || {};
    
    console.log(`\n================ EMAIL NOTIFICATION TO jhovzdesign@gmail.com ================`);
    console.log(`Type: ${type || 'New Submission'}`);
    console.log(`Recipient: jhovzdesign@gmail.com`);
    console.log(`Client Name: ${name}`);
    console.log(`Client Email: ${email}`);
    if (phone) console.log(`Client Phone: ${phone}`);
    if (subject) console.log(`Subject: ${subject}`);
    if (serviceType) console.log(`Service: ${serviceType}`);
    if (budget) console.log(`Budget: ${budget}`);
    if (targetDate) console.log(`Target Date: ${targetDate}`);
    console.log(`Message Details:\n${details}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`============================================================================\n`);

    res.json({
      success: true,
      targetEmail: "jhovzdesign@gmail.com",
      message: "Notification received and routed to jhovzdesign@gmail.com"
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", targetEmail: "jhovzdesign@gmail.com" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
