import * as firebase from "firebase/app";
import "firebase/auth";
import clientCredentials from "./credentials/client";

export default !firebase.apps.length
  ? firebase.initializeApp(clientCredentials).auth()
  : firebase.app().auth();
