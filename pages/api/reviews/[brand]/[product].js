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

      const ratingsCursor = db.collection("reviews").aggregate([
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
      ]);

      Promise.all([
        specsPromise,
        ratingsCursor.hasNext() ? ratingsCursor.next() : null
      ])
        .then(results =>
          res.status(200).json({
            specs: results[0],
            rating: results[1] ? results[1].rating : null,
            ratings: results[1] ? results[1].ratings : null
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
