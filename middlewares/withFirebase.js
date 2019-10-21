const firebaseAdmin = require("firebase-admin");

const withFirebase = handler => (req, res) => {
  if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(
        require("../credentials/server")
      )
    });
  }
  req.firebase = firebaseAdmin;
  return handler(req, res);
};

export default withFirebase;
