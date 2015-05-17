var Primedice = require('Primedice');

var Zé = new Primedice(require('fs').readFileSync('key'));

function bet() {
  Zé.bet(1, 49.5, '<', function(err, result) {
    if (err) console.log(err);
    else console.log("Win: "+result.bet.win+" "+result.user.balance);
  });
}

setInterval(bet, 2000);

