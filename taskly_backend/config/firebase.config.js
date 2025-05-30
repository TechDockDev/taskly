import serviceAccount from "../taskly-25fe9-firebase-adminsdk-fbsvc-4f579da8f7.json"assert { type: "json" };
import admin from "firebase-admin";
//Initialize firebase admin
const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default firebaseAdmin;