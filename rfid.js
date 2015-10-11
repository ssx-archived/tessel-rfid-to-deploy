process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Build tessel env
var http		= require('http');
var tessel 		= require('tessel');
var rfidlib		= require('rfid-pn532');
var rfid 		= rfidlib.use(tessel.port["A"]); 
var led 		= require('tessel-led');
var needle		= require('needle');

var allowed		= [ '7c1e0508' ];

function request_deploy() {
	needle.get('<deploy url>', function(err, resp) {
		if (!err) {
			console.log(resp.body);
			led.green.blink(500);			
		} else {
			console.log('HTTP Request FAILED', err)
			led.red.blink(500);			
		}
	});
}

// Listen for RFID touches
rfid.on('ready', function (version) {
	console.log('Ready to read RFID card');

	rfid.on('data', function(card) {
		// Convert the card ID to hex
		var cardId = card.uid.toString('hex');
		console.log('RFID card has ID:' + cardId);

		if (allowed.indexOf(cardId) > -1) {
			console.log("Deploy request accepted for card: " + cardId);
			request_deploy();
			led.green.flash(1000);
		} else {
			console.log("Access denied for card: " + cardId);
			led.red.blink(500);			
		}
	});
});

rfid.on('error', function (err) {
	console.log("Error reading RFID Card: " + err);
	led.red.blink(500);
});
