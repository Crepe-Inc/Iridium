const fs = require('fs');
const frontend = require('./frontend-server');

if(process.argv[2] == 'main') {
	frontend.execute();
	if (!fs.existsSync('captures')) {
		fs.mkdirSync('captures', {
			recursive: true
		});
	}

	async function cleanup() {
		console.log('Exiting...')
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