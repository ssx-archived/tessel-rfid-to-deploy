// Build tessel env
var http		= require('http');
var tessel 		= require('tessel');
var rfidlib		= require('rfid-pn532');
var rfid 		= rfidlib.use(tessel.port["A"]); 
var led 		= require('tessel-led');

// Listen for RFID touches
rfid.on('ready', function (version) {
	console.log('Ready to read RFID card');

	rfid.on('data', function(card) {
		// Convert the card ID to hex
		var cardId = card.uid.toString('hex');
		console.log('RFID card has ID:' + cardId);

		http.get("http://requestb.in/1m2ti4h1?cardId=" + cardId, function (res) {
			var body = '';
			res.on('data', function (data) {
				body += data;
			})
			res.on('end', function () {
				console.log(body);
				led.green.blink(500);
			})
		}).on('error', function (e) {
			console.log('not ok -', e.message, 'error event')
			led.red.blink(500);
		});
	});
});

rfid.on('error', function (err) {
	console.log("Error reading RFID Card: " + err);
	led.red.blink(500);
});
