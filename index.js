var Primedice = require('Primedice');
var Hapi = require('hapi');

var Zé = new Primedice(require('fs').readFileSync('key'));
var user, balance;

var server = new Hapi.Server();
server.connection({ port: 4000 });

var io = require('socket.io')(server.listener);

io.on('connection', function (socket) {

  if (!user) {
    Zé.users(function (err, result) {
      if (err) console.log(err);
      else {
        user = result.user;
        balance = user.balance;
        io.sockets.emit('user', user);
        params();
      }
    });
  }

  socket.emit('meep');
  socket.on('morp', function() {
    console.log('MEEP MORP');
  });

});

var limit = 0;
var amnt = 0;

function params() {
  amnt = (balance/Math.pow(2,13) | 0);
  limit = balance/Math.pow(2,8);
}

function bet() {
  if (losses + wins === 100) process.exit(1);
  if (amnt > limit) {
    params();
  }
  Zé.bet(amnt, 49.5, '<', function(err, result) {
    if (err) console.log(err.text);
    else {
      stats(result);
      io.sockets.emit('bet', result);
    }
  });
};


var losses = 0;
var wins = 0;
var row = 0;
var tpro = 0;
var statistics = {row:{}};

function stats(bet) {
  balance += bet.bet.profit;
  tpro += bet.bet.profit;
  params();
  if (bet.bet.win){
    if (row > 0) {
      if ( row in statistics.row )
        statistics.row[row]++;
      else
        statistics.row[row] = 1;
    }
    row = 0;
    wins++;
  }
  else{
    row++;
    losses++;
    amnt = amnt * Math.pow(2,row);
  }
  statistics.wins = wins;
  statistics.losses = losses;
  statistics.profit = tpro;
  io.sockets.emit('stats', statistics);
}

setInterval(bet, 6000);

server.route({
  method: 'GET',
  path: '/',
  handler: { file: 'index.html'}
});

server.route({
  method: 'GET',
  path: '/style.css',
  handler: { file: 'style.css'}
});

server.start();

