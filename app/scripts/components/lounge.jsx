var React = require( 'react' );
var Navigation = require( 'react-router' ).Navigation;
var Reflux = require( 'reflux' );
var userStore = require( '../stores/user' );
var cardStore = require( '../stores/card' );
var hostStore = require( '../stores/host' );
var CardActions = require( '../actions/card' );

var Lounge = React.createClass({
    mixins: [
        Navigation,
        Reflux.connect( userStore, 'users' ),
        Reflux.connect( cardStore, 'cards' ),
        Reflux.connect( hostStore, 'host' )
    ],

    getInitialState: function() {
        return {
            users: [],
            cards: [],
            host: false
        };
    },

    onStart: function() {
        CardActions.gameStart();
        this.transitionTo( '/new_thing' );
    },

    render: function() {
        console.log( 'CARDS', this.state.cards );
        if ( this.state.cards.length ) {
            this.transitionTo( '/new_thing' );
            return <div></div>;
        }

        var users = this.state.users;
        var host = this.state.host;

        var style = { width: '40px' };
        var listItems = users.map( function( user ) {
            return (
                <li>
                    <img style={style} src={user.avatar}></img>
                </li>
            );
        });
        var goButton;
        if ( host ) {
            goButton = <button onClick={this.onStart}>Start!</button>;
        }

        return (
            <div className="hero-unit">
                <h1>Lounge</h1>
                <ul>{listItems}</ul>
                {goButton}
            </div>
        );
    }
});

module.exports = Lounge;
