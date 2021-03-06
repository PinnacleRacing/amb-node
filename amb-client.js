var
sys = require("sys"),
net = require("net");

//
// Connect to AMB Box
//
var client = net.createConnection(5100, '192.168.0.240');

// Object holding previous ticks
var ptck = {};

client.setEncoding("UTF8");

client.addListener("connect", function() {
	// start server
	sys.puts("Connected to AMB box.");
});

client.addListener("close", function(data) {
	sys.puts("Disconnected from AMB box.");
});

client.addListener("data", function(data) {
	data = data.replace('\u0001', '');
	data = data.split('\t')

	var
	delta = 0,
	trsp = data[3],
	tick = data[4];
	
	if (data[0] == '@') {
		if (ptck[trsp]) {
			delta = tick - ptck[trsp];
			
			console.log(trsp+'\t'+tick+'\t'+delta);
		}
		
		ptck[trsp] = tick;
	}
	
	if (data == "close")
		client.end();
});	
