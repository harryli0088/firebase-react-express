const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

const port = 5000

app.get('/', (req, res) => {
  console.log("received request");
  res.send(JSON.stringify('Anyone can access this data'))
})

app.get('/loggedIn', (req, res) => res.send('Only logged in users can access this data'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
