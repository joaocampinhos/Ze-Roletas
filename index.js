var Primedice = require('Primedice');

var Zé = new Primedice(require('fs').readFileSync('key'));

/*
   function bet() {
   Zé.bet(1, 49.5, '<', function(err, result) {
   if (err) console.log(err);
   else console.log("Win: "+result.bet.win+" "+result.user.balance);
   });
   }

   setInterval(bet, 2000);
   */

var Hapi = require('hapi');
var user;

var server = new Hapi.Server();
server.connection({ port: 4000 });

var io = require('socket.io')(server.listener);

io.on('connection', function (socket) {

  Zé.users(function (err, result) {
    if (err) console.log(err);
    else {
      user = result.user;
      io.sockets.emit('user', user);
    }
  });

/*
  Zé.bet(1, 49.5, '<', function(err, result) {
    if (err) console.log(err);
    else io.sockets.emit('bet', result);
  });
*/

  socket.on('burp', function (data) {
    console.log(data);
    socket.emit('okok', data);
  });

});

function bet() {
  Zé.bet(1, 49.5, '<', function(err, result) {
    if (err) console.log(err);
    else io.sockets.emit('bet', result);
  });
};

//setInterval(bet, 2000);
//bet();

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

