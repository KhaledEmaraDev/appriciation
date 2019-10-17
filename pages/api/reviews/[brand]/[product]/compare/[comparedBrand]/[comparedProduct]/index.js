import withDatabase from "../../../../../../../../middlewares/withDatabase";

const handler = (req, res) => {
  const {
    query: { brand, product, comparedBrand, comparedProduct },
    method,
    db
  } = req;

  switch (method) {
    case "GET": {
      const specsPromise = db.collection("specs").findOne({ brand, product });
      const comparedSpecsPromise = db
        .collection("specs")
        .findOne({ brand: comparedBrand, product: comparedProduct });

      Promise.all([specsPromise, comparedSpecsPromise])
        .then(results =>
          res.status(200).json({
            specs: results[0],
            comparedSpecs: results[1]
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
