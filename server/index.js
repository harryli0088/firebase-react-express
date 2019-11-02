const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const port = 5000

app.post('/', (req, res) => {
  console.log("/ request received", req.body.firebaseIdToken);
  res.send(JSON.stringify('Anyone can access this data'))
})

app.post('/loggedIn', (req, res) => {
  console.log("/loggedIn request received", req.body.firebaseIdToken);
  res.send(JSON.stringify('Only logged in users can access this data'))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
