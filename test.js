let iridium = require('./index.js');

iridium.startFrontend();
iridium.displayPacket({
	source: 1,
	packetID: 0,
	protoName: 'Testing',
	object: 'Testing'
})