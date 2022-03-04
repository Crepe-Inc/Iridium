<script>
let sessionType = '';
let sessionStarted = false;
let currentPacket;
let tableHost;
let fileForm;
let Packets = [];
let filter = '';
let JSONfilter = '';
var wsTimer;
let ws;
let scrollToIndex = () => {};
let endIndex;
import VirtualList from 'svelte-virtual-list-ce';
import Packet from './Packet.svelte';
import { tick, onMount } from 'svelte';
import Highlight from "svelte-highlight";
import json from "svelte-highlight/src/languages/json";
import materialDarker from "svelte-highlight/src/styles/material-darker";

class WSMessage {
	constructor(cmd, data) {
		this.cmd = cmd;
		this.data = data;
	}
	send() {
		ws.send(JSON.stringify(this));
	}
}

function connect() {
// event emmited when connected
	ws = new WebSocket('ws://localhost:40510');
	ws.onopen = () => {
		console.log('[DEBUG] ws://localhost:40510 connected @ ' + new Date());
		// sending a send event to websocket server
		ws.send('{"cmd":"ConnectReq","data":""}')
		clearTimeout(wsTimer);
		ws.onclose = (e) => {
			console.log('Socket is closed. Reconnect will be attempted in half a second.', e.reason);
			clearTimeout(wsTimer);
			wsTimer = setTimeout(connect, 500);
		};
	}
	ws.onerror = () => {
		clearTimeout(wsTimer);
		wsTimer = setTimeout(connect, 500);
		ws.close();
	};
	// event emmited when receiving message 
	ws.onmessage = (e) => {
		let packet;
		try{
			packet = JSON.parse(e.data);
		}catch(e){
			return console.log(e.data);
		}
		console.log(packet);
		switch (packet.cmd) {
			case 'ConnectRsp':
				sessionStarted = packet.data.sessionStarted;
				break;
			case 'PacketNotify':
				let lastIndex = Packets[Packets.length - 1]?.index || 0;
				let data = packet.data.map((packet, idx) => {packet.index = idx + 1 + lastIndex; return packet});
				Packets = Packets.concat(data);
				console.log('Packets so far:', Packets);
				break;
			case 'StartProxyRsp':
				sessionStarted = true;
				break;
			case 'StopProxyRsp':
				sessionStarted = false;
				break;
		}
	}
}
function startSession() {
	new WSMessage('StartProxyReq', '').send();
}
function stopSession() {
	new WSMessage('StopProxyReq', '').send();
}

function uploadFile() {
	fileForm.click();
}
function sendFile(e) {
	const file = this.files[0];
	const reader = new FileReader();
	reader.onload = e => {
		let data = e.target.result;
		new WSMessage('ProcessFileReq',{
			ext: file.name.split('.')[1],
			name: file.name,
			data: btoa(data)
		}).send()
		fileForm.value = "";
	}
	reader.readAsBinaryString(file);
}
function showPacketDetails(packet) {
	currentPacket = packet;
}
function scrollToEnd() {
	scrollToIndex(FilteredPackets.length - 1, {behavior: 'auto'});
	// tableHost.scrollTop = 10000000;
}
function packetFilter(packet) {
	if(!filter.length && !JSONfilter.length) return true;
	if(filter.length && packet.protoName.includes && packet.protoName.toLowerCase().includes(filter.toLowerCase())) return true;
	if(filter.length && ('' + packet.packetID).includes(filter)) return true;
	if(JSONfilter.length && packet.object && JSON.stringify(packet.object).toLowerCase().includes(JSONfilter.toLowerCase())) return true;
	return false;
}

function downloadAll() {
	const saveTemplateAsFile = (filename, dataObjToWrite) => {
		const blob = new Blob([JSON.stringify(dataObjToWrite)], { type: "text/json" });
		const link = document.createElement("a");

		link.download = filename;
		link.href = window.URL.createObjectURL(blob);
		link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

		const evt = new MouseEvent("click", {
			view: window,
			bubbles: true,
			cancelable: true,
		});

		link.dispatchEvent(evt);
		link.remove()
	};
	saveTemplateAsFile('capture.json', FilteredPackets)
}
function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);

    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return prompt("Copy to clipboard: Ctrl+C, Enter", text);
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}
function copyCurrentPacket() {
	copyToClipboard(JSON.stringify(currentPacket))
}
function copyCurrentBin() {
	copyToClipboard(currentPacket.packet)
}

function clear() {
	Packets = [];
}
let stick;

$: FilteredPackets = Packets.filter(packetFilter, filter, JSONfilter);
$: {
	tick().then(() => scrollToEnd(filter, JSONfilter));
}
$: {
	if(stick) tick().then(() => scrollToEnd(Packets));
}

onMount(() => {
	fileForm.addEventListener("change", sendFile, false);
	connect();
});
</script>

<svelte:head>
	{@html materialDarker}
</svelte:head>

<aside>
	{#if sessionStarted}
		<button title="Stop UDP" data-icon="network-off-outline" on:click={stopSession} class="red"></button>
	{:else}
		<button title="Start UDP" data-icon="play-network-outline" on:click={startSession} class="green"></button>
	{/if}
	<button title="Upload PCAP/GCAP" data-icon="open-in-app" on:click={uploadFile}></button>
	<input hidden type="file" bind:this={fileForm} accept=".gcap,.pcap" />
	<button title="Clear" data-icon="clear" class="red" on:click={clear}></button>
	<button title="Lock scroll at the bottom" data-icon="keyboard_arrow_down" style="margin-top: auto;" class:green={stick} on:click={() => stick = !stick}></button>
	{#if currentPacket}
		<button title="Copy current bin" data-icon="insert_drive_file" style="margin-top: auto;" on:click={copyCurrentBin}></button>
		<button title="Copy current packet" data-icon="collections_bookmark" on:click={copyCurrentPacket}></button>
	{:else}
		<button title="Copy current packet" data-icon="insert_drive_file" style="margin-top: auto; opacity: 0.5"></button>
		<button title="Copy current packet" data-icon="collections_bookmark" style="opacity: 0.5"></button>
	{/if}
	{#if FilteredPackets && FilteredPackets.length > 0}
		<button title="Export all filtered" data-icon="download" on:click={downloadAll}></button>
	{:else}
		<button title="Export all filtered" data-icon="download" style="opacity: 0.5"></button>
	{/if}
</aside>
<main>
	<div class="filter-host">
		<input type="text" bind:value={filter} placeholder=" PACKET" />
		<input type="text" bind:value={JSONfilter} placeholder=" JSON" />
	</div>
	<div class="table-host">
		<div class="table">
			<div class="tr thead">
				<div>#</div>
				<div>Sender</div>
				<div>ID</div>
				<div>Proto Name</div>
				<div>Length</div>
				<div>JSON</div>
			</div>
			<div class="tbody" bind:this={tableHost}>
			<VirtualList items={FilteredPackets} let:item={packet} bind:scrollToIndex bind:end={endIndex}>
				<!-- this will be rendered for each currently visible item -->
				<Packet packet={packet} idx={packet.index} current={packet == currentPacket} on:click={() => showPacketDetails(packet)}/>
			</VirtualList>
			</div>
		</div>
	</div>
	<div class="details-host">
		{#if currentPacket && currentPacket.object}
			<Highlight code={JSON.stringify(currentPacket.object, undefined, '  ')} language={json}/>
		{/if}
	</div>
</main>

<style>
aside {
	background: rgba(0,0,10,0.4);
	flex-grow: 0;
	display: flex;
	flex-direction: column;
}

aside button {
	margin-bottom: 0.3em;
}

main {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow: hidden;
}

input::placeholder {
	font-family: 'shicon', Open Sans, sans-serif;
	color: white;
	letter-spacing: 2px;
}
input[type="text"] {
	background: black;
	color: white;
	height: 3rem;
	border: none;
	border-bottom: 1px solid rgba(255,255,255,0.2);
	padding: 0 1em;
	flex-grow: 1;
}
.filter-host {
	width: 100%;
	display: flex;
}
.table-host {
	flex-basis: 60%;
	overflow: hidden;
	background: rgba(0,0,10,0.6);
}
.table-host .table {
	width: 100%;
	min-width: 100%;
	cursor: default;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	height: 100%;
}
.table-host .table :global(:nth-child(odd) > .tr > div) {
	background: rgba(255,255,255,0.07);
}
.table-host .table :global(.tr) {
	display: flex;
}

.table-host .table :global(.tr > *:nth-child(1)) {
	flex-basis: 2.5rem;
	display: flex;
	justify-content: center;
}

.table-host .table :global(.tr > *:nth-child(2)) {
	flex-basis: 4rem;
	display: flex;
	justify-content: center;
}

.table-host .table :global(.tr > *:nth-child(3)) {
	flex-basis: 3rem;
	justify-content: center;
}
.table-host .table :global(.tr > *:nth-child(4)) {
	flex-basis: 20rem;
}
.table-host .table :global(.tr > *:nth-child(5)) {
	flex-basis: 3rem;
}
.table-host .table :global(.tr > *:nth-child(6)) {
	flex-grow: 1;
}

.table-host .table .thead > * {
	text-align: left;
	background: rgba(0,0,0,0.4);
	border-right: 1px solid rgba(255,255,255,0.1);
	font-size: 0.8em;
}

.table-host .table .tbody {
	flex-grow: 1;
	flex-shrink: 1;
	overflow: auto;
}

.table-host .table :global(.tr > *) {
	padding: 0.5rem 0.6rem;
	cursor: pointer;
	display: flex;
	align-items: center;
	flex-shrink: 0;
}
.table-host .table :global(.tr:hover > *) {
	background: rgba(100,130,255,0.2)
}
.details-host {
	flex-basis: 40%;
	flex-grow: 1;
	background: rgba(0,0,0,0.2);
	border-top: 2px solid rgba(255,255,255,0.2);
	overflow-y: auto;
	overflow-x: hidden;
}
.details-host :global(pre) {
	white-space: pre-wrap !important;
	font-family: monospace;
	line-height: 1.5;
	font-weight: 1000;
	font-size: 1.2em !important;
	background: none !important;
	max-width: 100%;
	overflow: hidden !important;
}

</style>