const cacheableResponse = require("cacheable-response");
const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const next = require("next");
const { join } = require("path");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const ssrCache = cacheableResponse({
  ttl: 1 * 60 * 1000,
  get: async ({ req, res, pagePath, queryParams }) => ({
    data: await app.renderToHTML(req, res, pagePath, queryParams)
  }),
  send: ({ data, res }) => res.send(data)
});

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
      cookie: { maxAge: 604800000 }
    })
  );

  server.get("/", (req, res) => ssrCache({ req, res, pagePath: "/" }));

  server.get("/reviews/:brand/:product", (req, res) => {
    const queryParams = {
      brand: req.params.brand,
      product: req.params.product
    };
    const pagePath = "/reviews";
    return ssrCache({ req, res, pagePath, queryParams });
  });

  server.get(
    "/comparison/:brand/:product/:comparedBrand/:comparedProduct",
    (req, res) => {
      const queryParams = {
        brand: req.params.brand,
        product: req.params.product,
        comparedBrand: req.params.comparedBrand,
        comparedProduct: req.params.comparedProduct
      };
      const pagePath = "/comparison";
      return ssrCache({ req, res, pagePath, queryParams });
    }
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
