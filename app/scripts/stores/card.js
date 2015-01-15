var Reflux = require( 'reflux' );
var CardActions = require( '../actions/card' );
var SocketActions = require( '../actions/socket' );
var socket = require( '../socket' );

var cardStore = module.exports = Reflux.createStore({
    listenables: [ CardActions, SocketActions ],

    onGameStart: function() {
        socket.emit( 'gameStart' );
    },

    onCardAdded: function( card ) {
        console.log( 'CARD', card );
        this.cards = this.cards || [];
        this.updateCards( this.cards.concat( [ { text: card } ] ) );
    },

    updateCards: function( cards ) {
        this.cards = cards;
        this.trigger( cards );
    },

    getDefaultData: function() {
        this.cards = this.cards || [];

        return this.cards;
    }
});
