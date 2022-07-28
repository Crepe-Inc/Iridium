const fs = require('fs');

const httpDispatch = require('./backend/http-dispatch');
const frontend = require('./backend/frontend-server');
const sniffer = require('./backend/sniffer');
const { exec } = require('child_process');

if(process.argv[2] == 'main') {
	// sniffer.execute();
	// httpDispatch.execute();
	frontend.execute();
	try{
		const E = require('./backend/excelPivot');
	}catch(e) {
		console.error('                 Excels missing; skipping');
	}
	// exec('start http://localhost:1984/index.html');

	if (!fs.existsSync('captures')) {
		fs.mkdirSync('captures', {
			recursive: true
		});
	}

	async function cleanup() {
		console.log('Exiting cleanly...')
		await sniffer.stopProxySession();
	}

	process.on('exit', cleanup);
	process.on('SIGUSR1', cleanup);
	process.on('SIGUSR2', cleanup);
	process.on('SIGTERM', cleanup);
	// process.on('uncaughtException', cleanup);
	process.on('SIGINT', () => {
		// cleanup();
		process.exit();
	});
}
if(process.argv[2] == 'old') {
	sniffer.execute();
	httpDispatch.execute();
	frontend.execute();
	try{
		const E = require('./backend/excelPivot');
	}catch(e) {
		console.error('                 Excels missing; skipping');
	}
	// exec('start http://localhost:1984/index.html');

	if (!fs.existsSync('captures')) {
		fs.mkdirSync('captures', {
			recursive: true
		});
	}

	async function cleanup() {
		console.log('Exiting cleanly...')
		await sniffer.stopProxySession();
		await sniffer.stopPacketCapture();
	}

	process.on('exit', cleanup);
	process.on('SIGUSR1', cleanup);
	process.on('SIGUSR2', cleanup);
	process.on('SIGTERM', cleanup);
	// process.on('uncaughtException', cleanup);
	process.on('SIGINT', () => {
		// cleanup();
		process.exit();
	});
}


module.exports = {
	startFrontend: () => {
		frontend.execute();
		sniffer.execute();
	},
	displayPacket: frontend.queuePacket,
	decodePacket: sniffer.queuePacket,
	updateProxyIP: sniffer.updateProxyIP
}


/*
startFrontend: launches the frontend on http://localhost:1984/index.html
displayPacket: sends an abstract packet to frontend
	iridium.displayPacket({
		source: 0=server, 1=client
		packetID: numerical ID,
		protoName: name of the proto,
		object: decoded packet contents/any info to display in the frontend
	})
decodePacket: queues a packet to be decoded by mtxor -> protobuf
	iridium.decodePacket({
		ip: {
			address: src_addr,
			address_dst: dst_addr,
			port: port_src,
			port_dst: port_dst
		} - this is used to construct the kcp ingest object and determine direction
		crypt: if "uncrypt" is missing: the buffer containing only the data bytes of the raw udp packet (usually offset 28),
		overrideKey: if crypt is used, you can supply your own key to XOR with, per-packet. 
		uncrypt: if "crypt" is missing: a buffer containing the already-dexored datagram to feed into protobuf decoder, must start with packet id at offset 2,
	})
	if "uncrypt" is supplied, ip object only needs either port or port_dst set to 22101 to determine direction.

updateProxyIP(ip, port):
Set remote IP and port of the server the proxy should connect to. This is usually determined automatically when the client makes the request to the cur.
*/