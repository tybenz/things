var socket = require( '../socket' );
var Reflux = require( 'reflux' );

var events = [
    'loungeShowed',
    'listShowed',
    'summaryShowed',
    'gameShowed',
    'userAdded',
    'removedUserAdded',
    'userRemoved',
    'thingAdded',
    'thingRemoved',
    'cardAdded',
    'scoreAdded',
    'readerOn',
    'readerOff',
    'socketId'
];

var SocketActions = module.exports = Reflux.createActions( events.map( function( e ) { return e; } ) );

events.forEach( function( evt ) {
    socket.on( evt, function() {
        var action = SocketActions[ evt ];
        action.trigger.apply( action, arguments );
    });
});
