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

/**
 * [given the firebase idToken and uid from a post reqest, verify whether or not the user is registered
 * @param  {[string]} firebaseIdToken [firebase idToken from the client]
 * @param  {[string]} firebaseUid     [firebase uid from the client]
 * @return {[boolean]}                 [true if user, false if not]
 */
async function verifyFirebaseUser(firebaseIdToken, firebaseUid) {
  try {
    //if firebaseIdToken is not provided, throw an error
    if(typeof firebaseIdToken !== "string") {
      throw "client did not provide firebaseIdToken";
    }
    //if firebaseUid is not provided, throw an error
    if(typeof firebaseUid !== "string") {
      throw "client did not provide firebaseIdToken";
    }

    //verify this user
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    console.log("decoded uid of provided token", decodedToken.uid, "vs uid of requesting client",firebaseUid);
    //at this point we know that the token belonged to a valid user

    //check that the uid of the decoded token matches that of this request
    if(decodedToken.uid !== firebaseUid) {
      throw "the uid's of the decoded token and this request did not match";
    }

    return true;
  }
  catch(error) {
    console.log("error", error);
    return false;
  }
}

/*
 * [given a firebase user id, return a Promise for the array of rows associated with the user]
 * @param  {[string]} userId [firebase user id]
 * @return {[array]}        [returns the array of roles associated with this user, or an empty array if the user or user's roles are not in the database]
 */
async function getUserRoles(userId) {
  try {
    const snapshot = await admin.database().ref('/users/' + userId).once('value');
    const roles = await snapshot.val() && snapshot.val().roles;
    return roles || [];
  }
  catch(err) {
    console.log(err);
    return [];
  }
}

/**
 * [given the firebase uid and an array of roles that we want the user to be in, return true or false whether the user has one of the desired roles]
 * @param  {[string]}  userId       [firebase uid]
 * @param  {[array]}  desiredRoles [array of role strings that we would like the user to have at least one of]
 * @return {Boolean}              [whether the user has one of the desired roles]
 */
async function hasAtLeastOneRole(userId, desiredRoles) {
  const userRoles = await getUserRoles(userId); //get user roles from firebase
  //returns true if user has at least one role, false otherwise
  return !userRoles.every(function(r) {
    return !desiredRoles.includes(r); //this every returns true if NONE of the userRoles are included for all desiredRoles
  });
}




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

  const verified = await verifyFirebaseUser(req.body.firebaseIdToken, req.body.firebaseUid);
  if(verified) {
    res.send(JSON.stringify('Success! Only logged in users can access this data'))
  }
  else {
    res.send(JSON.stringify("Error! You must be logged in to access this data"))
  }
})

app.post('/roleA', async (req, res) => {
  console.log("/roleA request received", req.body.firebaseIdToken, req.body.firebaseUid);

  const verified = await verifyFirebaseUser(req.body.firebaseIdToken, req.body.firebaseUid);
  const hasRoles = await hasAtLeastOneRole(req.body.firebaseUid, ["roleA"]);
  if(verified && hasRoles) {
    res.send(JSON.stringify('Success! Only roleA users can access this data'))
  }
  else {
    res.send(JSON.stringify("Error! You must be a roleA user to access this data"))
  }
})

app.post('/roleB', async (req, res) => {
  console.log("/roleB request received", req.body.firebaseIdToken, req.body.firebaseUid);

  const verified = await verifyFirebaseUser(req.body.firebaseIdToken, req.body.firebaseUid);
  const hasRoles = await hasAtLeastOneRole(req.body.firebaseUid, ["roleB"]);
  if(verified && hasRoles) {
    res.send(JSON.stringify('Success! Only roleB users can access this data'))
  }
  else {
    res.send(JSON.stringify("Error! You must be a roleB user to access this data"))
  }
})

app.post('/roleAorB', async (req, res) => {
  console.log("/roleAorB request received", req.body.firebaseIdToken, req.body.firebaseUid);

  const verified = await verifyFirebaseUser(req.body.firebaseIdToken, req.body.firebaseUid);
  const hasRoles = await hasAtLeastOneRole(req.body.firebaseUid, ["roleA","roleB"]);
  if(verified && hasRoles) {
    res.send(JSON.stringify('Success! Only roleA or roleB (inclusive) users can access this data'))
  }
  else {
    res.send(JSON.stringify("Error! You must be a roleA or roleB (inclusive) user to access this data"))
  }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
