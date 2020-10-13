var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const port = process.env.PORT ||8080
const cors = require('cors')

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });
app.use(cors())
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