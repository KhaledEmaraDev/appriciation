import useDatabase from "../../../../middlewares/useDatabase";

const handler = (req, res) => {
  const {
    query: { brand, product },
    method,
    db
  } = req;

  switch (method) {
    case "GET": {
      const specsPromise = db.collection("specs").findOne({ brand, product });

      const ratingsPromise = db
        .collection("reviews")
        .aggregate([
          {
            $match: {
              brand,
              product
            }
          },
          { $project: { _id: false, ratings: true } },
          { $unwind: { path: "$ratings", includeArrayIndex: "index" } },
          {
            $group: {
              _id: "$index",
              avg_rating: { $avg: "$ratings" }
            }
          },
          { $sort: { _id: 1 } },
          {
            $group: {
              _id: null,
              rating: { $avg: "$avg_rating" },
              ratings: { $push: "$avg_rating" }
            }
          },
          {
            $project: { _id: false }
          }
        ])
        .next();

      const reviewsPromise = db
        .collection("reviews")
        .aggregate([
          {
            $match: { brand, product }
          },
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
          { $project: { userData: false } },
          { $sort: { user: -1 } }
        ])
        .toArray();

      Promise.all([specsPromise, ratingsPromise, reviewsPromise])
        .then(results =>
          res.status(200).json({
            specs: results[0],
            rating: results[1] ? results[1].rating : null,
            ratings: results[1] ? results[1].ratings : null,
            reviews: results[2]
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

export default useDatabase(handler);
