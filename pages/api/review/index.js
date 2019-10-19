import withDatabase from "../../../middlewares/withDatabase";

const handler = (req, res) => {
  const { body, method, db, session } = req;

  switch (method) {
    case "POST": {
      if (!body) return res.status(404).end("Can't find the body");
      const review = { ...body, date_rev: new Date() };
      if (session.decodedToken) review.user = session.decodedToken.uid;
      db.collection("reviews")
        .insertOne(body)
        .then(() =>
          res.status(200).json({
            message: "تم النشر بنجاح"
          })
        )
        .catch(err => {
          console.log(err);
          res.status(404).json(err);
        });
      break;
    }
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default withDatabase(handler);
