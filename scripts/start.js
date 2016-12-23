const cp    = require('child_process')
const chalk = require('chalk')

// get the args passed into this process
const argv = process.argv.slice(2)

// give us a bunch of asterisks
const dividers = chalk.blue(Array(100).join("*"))

console.log(dividers, "\n")

const processes = [
  {
    cmd:  "http-server . -p 8080 -c-c1",
    msg:  `Running Static File Server for all recipes: ${chalk.cyan('(port 8080)')}`
  },
  {
    cmd:  "node ./examples/bootstrapping_app_test_data/server.js --port 8081",
    msg:  `Running Node Server for recipe: ${chalk.cyan('examples/bootstrapping_app_test_data')} on ${chalk.cyan('(port 8081)')}`
  },
  {
    cmd:  "node ./examples/logging_in_html_web_form/server.js --port 8082",
    msg:  `Running Node Server for recipe: ${chalk.cyan('examples/logging_in_html_web_form')} on ${chalk.cyan('(port 8082)')}`
  },
  {
    cmd:  "node ./examples/logging_in_xhr_web_form/server.js --port 8083",
    msg:  `Running Node Server for recipe: ${chalk.cyan('examples/logging_in_xhr_web_form')} on ${chalk.cyan('(port 8083)')}`
  }
]

processes.map((proc) =>{
  const log = (data) => {
    console.log(data.toString())
  }

  // convert to an array
  const cmd  = proc.cmd.split(" ")

  // slice out the args from the bin
  const args = cmd.slice(1).concat(argv)

  // spawn the process
  const sp   = cp.spawn(cmd[0], args)

  sp.stdout.on("data", log)
  sp.stderr.on("data", log)

  if (proc.msg) {
    console.log(chalk.yellow(proc.msg) + "\n")
  }
})

console.log(dividers, "\n")
