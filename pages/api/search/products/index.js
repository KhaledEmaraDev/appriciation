import withDatabase from "../../../..middlewares/withDatabase";

const handler = (req, res) => {
  const {
    query: { query },
    method,
    db
  } = req;

  switch (method) {
    case "GET": {
      const collection = db.collection("products");
      collection
        .find({ $text: { $search: query } })
        .project({ score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .limit(5)
        .toArray()
        .then(products => res.json({ status: true, products }))
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
