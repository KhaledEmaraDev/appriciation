import withFirebase from "../../../../middlewares/withFirebase";

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
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withFirebase(handler);

