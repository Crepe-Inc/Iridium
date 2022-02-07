const dns = require("dns");
dns.setServers(['1.1.1.1']);
const url = require("url");
const https = require("https");
const util = require('util');
const resolve4 = util.promisify(dns.resolve4);
const get = util.promisify(https.get);

const forceDNS = async (urlString) => {
	const parsedUrl = url.parse(urlString);
	const hostname = parsedUrl.hostname;
	let res = await resolve4(hostname);
	// console.log(`The real IP address of ${hostname} is: ${res[0]}`);
	const newUrl = urlString.replace(`${parsedUrl.protocol}//${hostname}`, `${parsedUrl.protocol}//${res[0]}`);

	let data = '';
	await new Promise((resolve, reject) => {
		https.get(
			newUrl, {
				headers: {
					host: hostname
				},
				servername: hostname
			}, res => {
				res.on("data", chunk => {
					data += chunk;
				});
				res.on("end", resolve);
			}
		)
	})
	return data;

};

module.exports = {
	forceDNS
}