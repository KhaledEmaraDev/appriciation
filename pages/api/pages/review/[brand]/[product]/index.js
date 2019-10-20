import withDatabase from "../../../../../../middlewares/withDatabase";

const handler = (req, res) => {
  const {
    query: { brand, product },
    method,
    db
  } = req;

  switch (method) {
    case "GET": {
      const specsPromise = db
        .collection("products")
        .findOne({ brand, product });

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
          res.json({
            status: true,
            specs: results[0].specs,
            ratings_buckets: results[0].ratings_buckets,
            rating: results[1] ? results[1].rating : null,
            ratings: results[1] ? results[1].ratings : null,
            reviews: results[2]
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
