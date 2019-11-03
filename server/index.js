//set up express
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json



//set up environment variables
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT



//set up firebase
const admin = require('firebase-admin');
// const serviceAccount = require("./serviceAccountKey.json");
console.log(process.env.FIREBASE_private_key);
const serviceAccount = {
  type: process.env.FIREBASE_type,
  project_id: process.env.FIREBASE_project_id,
  private_key_id: process.env.FIREBASE_private_key_id,
  private_key: process.env.FIREBASE_private_key.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_client_email,
  client_id: process.env.FIREBASE_client_id,
  auth_uri: process.env.FIREBASE_auth_uri,
  token_uri: process.env.FIREBASE_token_uri,
  auth_provider_x509_cert_url: process.env.FIREBASE_auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.FIREBASE_client_x509_cert_url,
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});



//set up express endpoints
app.get('/', (req, res) => {
  res.send(JSON.stringify('Test Server using Firebase to authenticate API requests'))
})

app.post('/', (req, res) => {
  console.log("/ request received", req.body.firebaseIdToken, req.body.firebaseUid);
  res.send(JSON.stringify('Success! Anyone can access this data'))
})

app.post('/loggedIn', async (req, res) => {
  console.log("/loggedIn request received", req.body.firebaseIdToken, req.body.firebaseUid);

  try {
    //if firebaseIdToken is not provided, throw an error
    if(typeof req.body.firebaseIdToken !== "string") {
      throw "client did not provide firebaseIdToken";
    }
    //if firebaseUid is not provided, throw an error
    if(typeof req.body.firebaseUid !== "string") {
      throw "client did not provide firebaseIdToken";
    }

    //verify this user
    const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseIdToken);
    console.log("decoded uid of provided token", decodedToken.uid, "vs uid of requesting client",req.body.firebaseUid);
    //at this point we know that the token belonged to a valid user

    //check that the uid of the decoded token matches that of this request
    if(decodedToken.uid === req.body.firebaseUid) {
      res.send(JSON.stringify('Success! Only logged in users can access this data'))
    }
    else {
      throw "the uid's of the decoded token and this request did not match";
    }
  }
  catch(error) {
    console.log("error", error);
    res.send(JSON.stringify("Error! You must be logged in to access this data"))
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
