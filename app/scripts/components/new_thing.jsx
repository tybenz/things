var React = require( 'react' );
var Addons = require( 'react-addons' );
var Navigation = require( 'react-router' ).Navigation;
var Reflux = require( 'reflux' );
var userStore = require( '../stores/user' );
var cardStore = require( '../stores/card' );
var hostStore = require( '../stores/host' );

var NewThing = React.createClass({
    mixins: [
        Navigation,
        Addons.LinkedStateMixin,
        Reflux.connect( userStore, 'users' ),
        Reflux.connect( cardStore, 'cards' ),
        Reflux.connect( hostStore, 'host' )
    ],

    getInitialState: function() {
        return {
            users: [],
            cards: [],
            host: false
        }
    },

    getCurrentCard: function() {
        var cards = this.state.cards;
        return cards[ cards.length - 1 ] || {
            text: ''
        };
    },

    onNewThing: function( evt ) {
        var text = this.state.editValue;
        if ( evt.which === 13 && text ) {
            evt.preventDefault();
            console.log( 'NEW THING', text );
        }
    },

    render: function() {
        return (
            <div>
                <h1>New Thing</h1>
                <p><strong>{this.getCurrentCard().text}</strong></p>
                <textarea onKeyUp={this.onNewThing} valueLink={this.linkState('editValue')}></textarea>
            </div>
        );
    }
});

module.exports = NewThing;
