const http = require('http');
const fs = require('fs');
const index = fs.readFileSync('index.html');

const SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: '\r\n',
});

const port = new SerialPort('COM3', {
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false,
});

port.pipe(parser);

const app = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(index);
});

const io = require('socket.io').listen(app);

io.on('connection', function (data) {
  console.log('Node.js is listening');
});

parser.on('data', function (data) {
  console.log(data);
  io.emit('data', data);
});

app.listen(3000);
