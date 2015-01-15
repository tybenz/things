var React = require( 'react' );
var Navigation = require( 'react-router' ).Navigation;
var Router = require( '../router' );
var Reflux = require( 'reflux' );
var userStore = require( '../stores/user' );
var cardStore = require( '../stores/card' );
var UserActions = require( '../actions/user' );

var Welcome = React.createClass({
    mixins: [
        Navigation,
        Reflux.connect( userStore, 'users' ),
        Reflux.connect( cardStore, 'cards' )
    ],

    getInitialState: function() {
        return {
            users: [],
            cards: []
        };
    },

    photoSelected: function( evt ) {
        var file = evt.target.files[ 0 ];
        var reader = new FileReader();
        var self = this;

        reader.onloadend = function() {
            // console.log( reader.result );
            UserActions.signedIn( reader.result );
            self.transitionTo( '/lounge' );
        };

        if ( file ) {
            reader.readAsDataURL( file );
        }
    },

    render: function() {
        return (
            <div className="hero-unit">
                <h1>Welcome</h1>
                <input type="file" onChange={this.photoSelected} />
            </div>
        );
    }
});

module.exports = Welcome;
