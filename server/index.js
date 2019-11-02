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
  console.log("/ request received", req.body.firebaseIdToken);
  res.send(JSON.stringify('Success! Anyone can access this data'))
})

app.post('/loggedIn', async (req, res) => {
  console.log("/loggedIn request received", req.body.firebaseIdToken);

  try {
    //if firebaseIdToken is not provided, don't bother sending a request to firebase and throw an error instead
    if(typeof req.body.firebaseIdToken !== "string") {
      throw "client did not provide firebaseIdToken";
    }

    const decodedToken = await admin.auth().verifyIdToken(req.body.firebaseIdToken);
    const uid = decodedToken.uid;
    console.log("uid of requesting client", uid);
    res.send(JSON.stringify('Success! Only logged in users can access this data'))
  }
  catch(error) {
    console.log("error", error);
    res.send(JSON.stringify("Server encountered an error while trying to verify the client's identity"))
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
