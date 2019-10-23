import Cors from "micro-cors";
import withDatabase from "../../../middlewares/withDatabase";

const cors = Cors({
  allowedMethods: ["HEAD", "OPTIONS", "POST"]
});

const handler = (req, res) => {
  const { body, method, db, session } = req;

  switch (method) {
    case "POST": {
      if (!body) return res.sendStatus(400);

      const review = {
        ...body.review,
        date_buy: new Date(body.review.date_buy),
        date_rev: new Date()
      };
      if (session.decodedToken) review.user = session.decodedToken.uid;

      db.collection("reviews")
        .insertOne(review)
        .then(() => res.json({ status: true, message: "تم النشر بنجاح" }))
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

export default cors(withDatabase(handler));
