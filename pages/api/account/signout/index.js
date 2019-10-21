const handler = (req, res) => {
  const { method } = req;

  switch (method) {
    case "POST": {
      req.session.decodedToken = null;
      res.json({ status: true });
      break;
    }
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;

