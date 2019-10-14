import { MongoClient } from "mongodb";

const user = encodeURIComponent("urrevs");
const password = encodeURIComponent(process.env.DB_PASSWORD);
const authMechanism = "SCRAM-SHA-1";

const url = `mongodb://${user}:${password}@urrevs.com:27017/?authMechanism=${authMechanism}&authSource=urrevs`;
const dbName = "urrevs";

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const useDatabase = handler => (req, res) => {
  if (!client.isConnected()) {
    return client.connect().then(() => {
      req.db = client.db(dbName);
      return handler(req, res);
    });
  }
  req.db = client.db(dbName);
  return handler(req, res);
};

export default useDatabase;
