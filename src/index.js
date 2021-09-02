const app = require("./app")
require("dotenv").config()

const port = process.env.PORT

app.listen(port, async () => {
  console.log(`listening on port ${port} `)
 
});
