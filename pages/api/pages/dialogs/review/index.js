import withDatabase from "../../../../../middlewares/withDatabase";

const handler = (req, res) => {
  const {
    query: { brand, product },
    method,
    db
  } = req;

  switch (method) {
    case "GET": {
      db.collection("products")
        .findOne({ brand, product })
        .then(result =>
          res.json({
            status: true,
            specs: result.specs,
            ratings_buckets: result.ratings_buckets
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
