import Cors from "micro-cors";
import withFirebase from "../../../../middlewares/withFirebase";

const cors = Cors({
  allowedMethods: ["HEAD", "OPTIONS", "POST"]
});

const handler = (req, res) => {
  const { firebase, body, method } = req;

  switch (method) {
    case "POST": {
      if (!body) return res.sendStatus(400);

      const token = req.body.token;

      firebase
        .auth()
        .verifyIdToken(token)
        .then(decodedToken => {
          req.session.decodedToken = decodedToken;
          return decodedToken;
        })
        .then(decodedToken => res.json({ status: true, decodedToken }))
        .catch(error => {
          console.log(error);
          res.json({ error });
        });
      break;
    }
    case "HEAD":
    case "OPTIONS":
      res.send(res, 200, "ok!");
      break;
    default:
      res.setHeader("Allow", ["HEAD", "OPTIONS", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withFirebase(handler);
