import Cors from "micro-cors";
import withDatabase from "../../../../middlewares/withDatabase";

const cors = Cors({
  allowedMethods: ["HEAD", "OPTIONS", "GET"]
});

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

      const ratingPromise = db
        .collection("reviews")
        .aggregate([
          {
            $match: {
              brand: "Xiaomi",
              product: "Redmi Note 7",
              approved: true
            }
          },
          { $group: { _id: null, rating: { $avg: "$rating" } } }
        ])
        .next();

      const ratingsPromise = db
        .collection("reviews")
        .aggregate([
          {
            $match: { brand, product, approved: true }
          },
          {
            $project: { _id: false, ratings: { $objectToArray: "$ratings" } }
          },
          { $unwind: { path: "$ratings" } },
          {
            $group: {
              _id: "$ratings.k",
              avg_rating: { $avg: "$ratings.v" }
            }
          }
        ])
        .toArray();

      const reviewsPromise = db
        .collection("reviews")
        .aggregate([
          {
            $match: { brand, product, approved: true }
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

      Promise.all([specsPromise, ratingPromise, ratingsPromise, reviewsPromise])
        .then(results =>
          res.json({
            status: true,
            specs: results[0] && results[0].specs,
            rating: results[1] && results[1].rating,
            ratings: results[2],
            reviews: results[3]
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
