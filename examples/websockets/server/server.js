const app = require('./app')

app.set('port', process.env.PORT || 1337)

const server = app.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${server.address().port}`)
})

let io = require('socket.io')(server)

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', `${socket.id} ${msg}`)
  })
})
