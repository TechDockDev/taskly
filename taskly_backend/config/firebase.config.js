import serviceAccount from "../apebuzz1-firebase-adminsdk-hay9p-da5e8398f1.json"assert { type: "json" };
import admin from "firebase-admin";
//Initialize firebase admin
const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default firebaseAdmin;