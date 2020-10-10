var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const port = 8080

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    console.log('diconnected')
  });

  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);
  });

  // socket.on('chat message', (msg) => {
  //   console.log('message: ' + msg);
  //   io.emit('chat message', msg);
  // });
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});