const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const next = require("next");
const admin = require("firebase-admin");
const MongoClient = require("mongodb").MongoClient;
const { join } = require("path");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const firebase = admin.initializeApp(
  {
    credential: admin.credential.cert(require("./credentials/server"))
  },
  "server"
);

const user = encodeURIComponent("urrevs");
const password = encodeURIComponent(process.env.DB_PASSWORD);
const authMechanism = "SCRAM-SHA-1";
const dbName = "urrevs";

const url = `mongodb://${user}:${password}@urrevs.com:27017/?authMechanism=${authMechanism}&authSource=${dbName}`;

const mongo = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());
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

  server.use((req, res, next) => {
    req.firebaseServer = firebase;
    if (!mongo.isConnected()) {
      mongo.connect().then(() => {
        req.db = mongo.db(dbName);
      });
    }
    req.db = mongo.db(dbName);
    next();
  });

  server.post("/api/login", (req, res) => {
    if (!req.body) return res.sendStatus(400);

    const token = req.body.token;
    firebase
      .auth()
      .verifyIdToken(token)
      .then(decodedToken => {
        req.session.decodedToken = decodedToken;
        return decodedToken;
      })
      .then(decodedToken => res.json({ status: true, decodedToken }))
      .catch(error => res.json({ error }));
  });

  server.post("/api/logout", (req, res) => {
    req.session.decodedToken = null;
    res.json({ status: true });
  });

  server.post("/api/review", (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const review = { ...req.body, date_rev: new Date() };
    if (session.decodedToken) review.user = session.decodedToken.uid;
    req.db
      .collection("reviews")
      .insertOne(review)
      .then(() =>
        res.json({
          message: "تم النشر بنجاح"
        })
      )
      .catch(err => {
        console.log(err);
        res.sendStatus(404);
      });
  });

  server.get("/service-worker.js", (req, res) => {
    const filePath = join(__dirname, ".next", "/service-worker.js");
    app.serveStatic(req, res, filePath);
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
