import withDatabase from "../../../../middlewares/withDatabase";

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
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withDatabase(handler);
