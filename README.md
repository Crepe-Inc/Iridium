# Iridium
A KCP packet sniffer + visualizer in one.

**No, pancake fiddler doesn't work anymore.**


# Usage

0. Bring your `packetIds.json` and `proto/` to the `data/` folder.

½. `npm i`

1. `node . main` or `npm run main`

2. http://localhost:1984/index.html

From there, you can either start a proxy or read a .pcap file filtered with `udp.port == 22101 or udp.port == 22102`.
Proxy captures will be saved to `captures` folder in a .gcap format and can also be read with this tool.


# config.js

	-ignoredProtos: //ignored packets
	-ProtosToDump: // add proto names hereto dump them
	-dumpAll : //false by default, will write all packets to json (recommended to not enable this unless you really need it)
# Node module API for your own packets

`startFrontend`: launches the frontend on http://localhost:1984/index.html

`displayPacket`: sends an abstract packet to frontend

```js
iridium.displayPacket({
	source: 0=server, 1=client
	packetID: numerical ID,
	protoName: name of the proto,
	object: decoded packet contents/any info to display in the frontend
})
```

`decodePacket`: queues a packet to be decoded by mtxor -> protobuf

```js
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
```

If `uncrypt` is supplied, `ip` object only needs either `port` or `port_dst` set to `22101` to determine direction.

`updateProxyIP(ip, port)`: Set remote IP and port of the server the proxy should connect to. This is usually determined automatically when the client makes the request to the cur.

# How the proxy works

While you can just drop in a sniffed pcap, the proxy allows you to see traffic realtime. You will need to reach logged-in state, point the dispatch hosts to localhost and activate the Iridium frontend along with the proxy. The dispatch will be running on localhost:80 and localhost:443 - make sure the ports are succesfully bound, you usually need admin access to do that and if there's svchost taking those up, it won't work and you need to kill it first.

After that, you click into the client and it should request the cur - the response cur will point the client to 127.0.0.1 in terms of UDP. If you are using Fiddler to redirect the hosts, you will have to put your own `cur.json` into `www` folder, as it becomes impossible to make a request for the real cur. It will work if you're just using the hosts file.

After you click again (the door), the UDP connection should start being monitored.

- Alg
