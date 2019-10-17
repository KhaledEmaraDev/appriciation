import { MongoClient } from "mongodb";

const user = encodeURIComponent("urrevs");
const password = encodeURIComponent(process.env.DB_PASSWORD);
const authMechanism = "SCRAM-SHA-1";
const dbName = "urrevs";

const url = `mongodb://${user}:${password}@urrevs.com:27017/?authMechanism=${authMechanism}&authSource=${dbName}`;

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const withDatabase = handler => (req, res) => {
  if (!client.isConnected()) {
    return client.connect().then(() => {
      req.db = client.db(dbName);
      return handler(req, res);
    });
  }
  req.db = client.db(dbName);
  return handler(req, res);
};

export default withDatabase;
