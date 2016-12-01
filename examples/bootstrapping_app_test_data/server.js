const minimist = require("minimist")
const express = require("express")
const app = express()

// get port from passed in args from scripts/start.sh
const port = minimist(process.argv.slice(2)).port

const data = {
  env: "development",
  api: "https://api.company.com"
}

app.set("views", __dirname)
app.set("view engine", "hbs")

app.get("/bootstrap", (req, res) => {
  res.render("./bootstrap.hbs", {
    data: JSON.stringify(data)
  })
})

app.get("/xhr", (req, res) => {
  res.render("./xhr.hbs")
})

app.get("/data.json", (req, res) => {
  res.json(data)
})

app.listen(port, () => {

})