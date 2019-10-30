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
      const uid = session.decodedToken && session.decodedToken.uid;
      if (uid) review.user = uid;

      db.collection("reviews")
        .find({ user: uid })
        .count()
        .then(count => {
          if (count < 2) {
            db.collection("reviews")
              .insertOne(review)
              .then(() =>
                res.json({
                  status: true,
                  message: "وصلت المراجعة! سيتم النشر بعد قبولها."
                })
              )
              .catch(error => {
                console.log(error);
                res.json({ error });
              });
          } else {
            res.json({
              status: false,
              message: "لا يمكن نشر أكثر من مراجعتين"
            });
          }
        })
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
