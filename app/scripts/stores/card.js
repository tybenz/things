var Reflux = require( 'reflux' );
var _ = require( 'lodash' );
var CardActions = require( '../actions/card' );
var SocketActions = require( '../actions/socket' );
var socket = require( '../socket' );

var cardStore = module.exports = Reflux.createStore({
    listenables: [ CardActions, SocketActions ],

    onStartGame: function() {
        socket.emit( 'startGame' );
    },

    onAddCard: function() {
        socket.emit( 'addCard' );
    },

    onCardAdded: function( card ) {
        this.cards = this.cards || [];
        this.updateCards( this.cards.concat( [ card ] ) );
    },

    onAddThing: function( card, thing ) {
        socket.emit( 'addThing', card, thing );
    },

    onStartRound: function() {
        socket.emit( 'startRound' );
    },

    onThingAdded: function( card, thing ) {
        var editCard = this.cards.reduce( function( memo, c ) {
            if (memo) {
                return memo;
            } else if ( c.text == card.text ) {
                return c;
            }
        }, undefined );

        editCard.things.push( thing );

        this.updateCards( _.extend( [], this.cards ) );
    },

    onRemoveThing: function( card, index ) {
        socket.emit( 'removeThing', card, index );
    },

    onThingRemoved: function( card, thing ) {
        var editCard = this.cards.reduce( function( memo, c ) {
            if (memo) {
                return memo;
            } else if ( c.text == card.text ) {
                return c;
            }
        }, undefined );

        var index;
        editCard.things.forEach( function( t, i ) {
            if ( t.text == thing ) {
                index = i;
                return false;
            }
        });

        editCard.things.splice( index, 1 );

        this.updateCards( _.extend( [], this.cards ) );
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
