import serviceAccount from "../taskly-af117-firebase-adminsdk-fbsvc-94e79b2304.json"assert { type: "json" };
import admin from "firebase-admin";
//Initialize firebase admin
const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default firebaseAdmin;