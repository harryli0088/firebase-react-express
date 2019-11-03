//set up express
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
const port = 5000



//set up environment variables
const dotenv = require('dotenv');
dotenv.config();
console.log("process.env.FIREBASE_DATABASE_URL",process.env.FIREBASE_DATABASE_URL);



//set up firebase
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});



//set up express endpoints
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
