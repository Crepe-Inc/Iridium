<script>
	export let packet;
	export let current;
	export let idx;
	// console.log(packet);
	let packetLength;
	$: packetString = JSON.stringify(packet.object || '').substr(0,200);
	$: if(packet.packet) packetLength = packet.packet.length;
</script>

<div class="tr" class:current on:click class:o={idx % 2}>
	<div class="time">{#if packet.reltime}{packet.reltime.toFixed(3)}{/if}</div>
	<div class="idx">{idx}</div>
	<div class="src"><span class="{packet.source?'client':'server'}">{packet.source?'CLIENT':'SERVER'}</span></div>
	<div class="id">{packet.packetID}</div>
	<div class="name">{packet.protoName}</div>
	<div class="len">{packetLength || ''}</div>
	<div class="json"><span>{packetString}</span></div>
</div>

<style>
.tr.o > div {
	background: rgba(255,255,255,0.07);
}
.tr > div {
	border-right: 1px solid rgba(255,255,255,0.1);
	font-size: 0.9em;
}
.tr > .time {
	font-size: 0.8em;
}
.tr > .idx {
	font-size: 0.8em;
}
.tr > .src {
	font-size: 0.8em;
	text-align: center;
}
.tr > .src span {
	border: 1px solid rgba(255,255,255,0.2);
	display: inline-block;
	border-radius: 2px;
	padding: 0.1em 0.2em;
}
.tr > .src span.client {
	background: #2E79A0;
}
.tr > .src span.server {
	background: #976115;
}
.tr > .id {
	font-family: monospace;
	font-weight: 1000;
	width: 0;
}
.tr > .len {
	font-family: monospace;
	font-weight: 1000;
	width: 0;
}
.tr > .json {
	width: 0;
}
.tr > .json span {
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