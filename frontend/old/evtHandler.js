async function evtHandler(ev) {
    const msg = JSON.parse(ev.data);
    console.log(msg)
    switch(msg.cmd) {
        case 'ws_connect_rsp':
            console.log('test');
            break;
        case 'evt_new_packet':
            console.log(msg.data);
            break;
    }
}