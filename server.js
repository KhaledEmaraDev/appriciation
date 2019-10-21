const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const next = require("next");
const { join } = require("path");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: true,
      store: new FileStore({ secret: process.env.SESSION_SECRET }),
      resave: false,
      rolling: true,
      httpOnly: true,
      cookie: { maxAge: 604800000 } // week
    })
  );

  server.get("/service-worker.js", (req, res) => {
    const filePath = join(__dirname, ".next", "/service-worker.js");
    app.serveStatic(req, res, filePath);
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
