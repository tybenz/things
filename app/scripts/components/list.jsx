var React = require( 'react' );
var socket = require( '../socket' );
var ListWaiting = require( './list_waiting' );
var ListForm = require( './list_form' );

var List = module.exports = React.createClass({
    lastCard: function() {
        return this.props.cards[ this.props.cards.length - 1 ];
    },

    thingSubmitted: function() {
        var lastCard = this.lastCard();
        if ( lastCard && lastCard.things.length ) {
            return lastCard.things.reduce( function( memo, thing ) {
                if ( memo ) {
                    return memo;
                } else if ( thing.userId == socket.id ) {
                    return thing;
                }
            }, undefined );
        }
    },

    render: function() {
        if ( this.thingSubmitted() ) {
            return <ListWaiting users={this.props.users} cards={this.props.cards} reader={this.props.reader}/>
        } else {
            return <ListForm users={this.props.users} cards={this.props.cards}/>
        }
    }
});
