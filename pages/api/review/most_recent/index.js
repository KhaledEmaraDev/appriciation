import Cors from "micro-cors";
import withDatabase from "../../../../middlewares/withDatabase";

const cors = Cors({
  allowedMethods: ["HEAD", "OPTIONS", "GET"]
});

const handler = (req, res) => {
  const { method, db } = req;

  switch (method) {
    case "GET": {
      db.collection("reviews")
        .aggregate([
          {
            $match: { approved: true, user: { $exists: true } }
          },
          { $sort: { date_rev: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "userData"
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [{ $arrayElemAt: ["$userData", 0] }, "$$ROOT"]
              }
            }
          },
          { $project: { userData: false } }
        ])
        .toArray()
        .then(reviews =>
          res.status(200).json({
            status: true,
            reviews
          })
        )
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
      res.setHeader("Allow", ["HEAD", "OPTIONS", "GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default cors(withDatabase(handler));
