import { useEffect } from "react";

import firebaseAuth from "../../firebase";
import "firebase/auth";

export default function SignOut() {
  useEffect(() => {
    firebaseAuth.signOut();
  }, []);
  return null;
}
