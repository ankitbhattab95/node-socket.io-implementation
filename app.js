const express = require('express');
var app = express()
const path = require('path')
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 8080
const cors = require('cors')

app.use(cors())
console.log('process.env.NODE_ENV----', process.env.NODE_ENV)
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  })
}


// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });
io.on('connection', (socket) => {
  console.log('connected------------------')

  socket.on('disconnect', () => {
    console.log('diconnected-------------')
  });

  socket.on('chat message', (msg) => {
    console.log('message  ', msg)
    // socket.broadcast.emit('chat message', msg);
    io.emit('chat message', msg);
  });

  // socket.on('chat message', (msg) => {
  //   console.log('message: ' + msg);
  // });
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});