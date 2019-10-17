import withDatabase from "../../../../middlewares/withDatabase";

const handler = (req, res) => {
  const { method, db } = req;

  switch (method) {
    case "GET": {
      const reviewsPromise = db
        .collection("reviews")
        .aggregate([
          {
            $match: { user: { $exists: true, $ne: null } }
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
        .toArray();

      reviewsPromise
        .then(result =>
          res.status(200).json({
            reviews: result
          })
        )
        .catch(err => {
          console.log(err);
          res.status(404).json(err);
        });
      break;
    }
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withDatabase(handler);
