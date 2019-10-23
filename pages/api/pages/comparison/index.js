import Cors from "micro-cors";
import withDatabase from "../../../../middlewares/withDatabase";

const cors = Cors({
  allowedMethods: ["HEAD", "OPTIONS", "GET"]
});

const handler = (req, res) => {
  const {
    query: { brand, product, comparedBrand, comparedProduct },
    method,
    db
  } = req;

  switch (method) {
    case "GET": {
      const specsPromise = db
        .collection("products")
        .findOne({ brand, product });

      const comparedSpecsPromise = db
        .collection("products")
        .findOne({ brand: comparedBrand, product: comparedProduct });

      Promise.all([specsPromise, comparedSpecsPromise])
        .then(results =>
          res.json({
            status: true,
            specs: results[0] && results[0].specs,
            comparedSpecs: results[1] && results[1].specs
          })
        )
        .catch(error => {
          console.log(error);
          res.status(404).json({ error });
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
