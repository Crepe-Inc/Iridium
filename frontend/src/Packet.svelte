<script>
	export let packet;
	export let current;
	export let idx;
	// console.log(packet);
	$: packetString = JSON.stringify(packet.object || '');
	$: packetLength = packetString.length;
</script>

<div class="tr" class:current on:click>
	<div>{idx}</div>
	<div><span class="{packet.source?'client':'server'}">{packet.source?'CLIENT':'SERVER'}</span></div>
	<div>{packet.packetID}</div>
	<div>{packet.protoName}</div>
	<div>{packetLength}</div>
	<div><span>{packetString.substr(0,200)}</span></div>
</div>

<style>
.tr > div {
	border-right: 1px solid rgba(255,255,255,0.1);
	font-size: 0.9em;
}
.tr > div:nth-child(1) {
	font-size: 0.8em;
}
.tr > div:nth-child(2) {
	font-size: 0.8em;
	text-align: center;
}
.tr > div:nth-child(2) span {
	border: 1px solid rgba(255,255,255,0.2);
	display: inline-block;
	border-radius: 2px;
	padding: 0.1em 0.2em;
}
.tr > div:nth-child(2) span.client {
	background: #2E79A0;
}
.tr > div:nth-child(2) span.server {
	background: #976115;
}
.tr > div:nth-child(3) {
	font-family: monospace;
	font-weight: 1000;
	width: 0;
}
.tr > div:nth-child(5) {
	font-family: monospace;
	font-weight: 1000;
	width: 0;
}
.tr > div:nth-child(6) {
	width: 0;
}
.tr > div:nth-child(6) span {
	display: block;
	max-width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	line-height: 1.2;
	opacity: 0.7;
}

.current {
	background: #204e8a;
}
</style>