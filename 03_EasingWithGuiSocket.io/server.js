// server.js — Socket.io relay + static file server
// Install: npm install
// Run locally:  node server.js
// Deploy:       push to GitHub, connect repo to Render as a Web Service

const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;

// ── Static file server ───────────────────────────────────────────────────────
// Needed on Render (no Live Server). Serves everything in the project folder.
const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const httpServer = createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || "text/plain";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
});

// ── Socket.io relay ──────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log(`[+] connected  (total: ${io.engine.clientsCount})`);

  socket.onAny((event, value) => {
    socket.broadcast.emit(event, value);
  });

  socket.on("disconnect", () => {
    console.log(`[-] disconnected (total: ${io.engine.clientsCount})`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`   Local: http://localhost:${PORT}`);
});
