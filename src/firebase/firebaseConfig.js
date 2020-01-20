import * as admin from "firebase-admin";
import serviceAccount from "../credentials/bb-service-account.json";

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

export default admin;
