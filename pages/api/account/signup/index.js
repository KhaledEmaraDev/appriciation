import Cors from "micro-cors";
import withDatabase from "../../../../middlewares/withDatabase";

const cors = Cors({
  allowedMethods: ["HEAD", "OPTIONS", "POST"]
});

const handler = (req, res) => {
  const { body, method, db } = req;

  switch (method) {
    case "POST": {
      if (!body) return res.sendStatus(400);

      const user = {
        _id: body.user.uid,
        name: body.user.name,
        avatar: body.user.avatar
      };
      if (body.user.email) user.email = body.user.email;
      if (body.user.youtube) user.youtube = body.user.youtube;
      if (body.user.twitter) user.twitter = body.user.twitter;
      if (body.user.facebook) user.facebook = body.user.facebook;

      db.collection("users")
        .insertOne(user)
        .then(() => res.json({ status: true }))
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

export default withDatabase(handler);
