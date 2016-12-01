const minimist = require("minimist")
const express = require("express")
const app = express()

// get port from passed in args from scripts/start.js
const port = minimist(process.argv.slice(2)).port

const data = {
  env: "development",
  api: "https://api.company.com"
}

app.set("views", __dirname)
app.set("view engine", "hbs")

app.get("/bootstrap.html", (req, res) => {
  res.render("./bootstrap.hbs", {
    data: JSON.stringify(data)
  })
})

app.get("/xhr.html", (req, res) => {
  res.render("./xhr.hbs")
})

app.get("/data.json", (req, res) => {
  res.json(data)
})

app.listen(port, () => {

})