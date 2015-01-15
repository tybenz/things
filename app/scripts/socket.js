var socket = module.exports = io();

var connected = false;
socket.on( 'connect', function() {
    if ( !connected ) {
        connected = true;
    } else {
        socket.emit( 'appReady' );
    }
});


