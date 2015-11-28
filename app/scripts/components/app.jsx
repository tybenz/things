var React = require( 'react' );
var Reflux = require( 'reflux' );
var Lounge = require( './lounge' );
var List = require( './list' );
var Game = require( './game' );
var Summary = require( './summary' );
var userStore = require( '../stores/user' );
var cardStore = require( '../stores/card' );
var readerStore = require( '../stores/reader' );
var pageStore = require( '../stores/page' );
var SocketActions = require( '../actions/socket' );
var UserActions = require( '../actions/user' );
var socket = require( '../socket' );
var injectTapEventPlugin = require( 'react-tap-event-plugin' );
injectTapEventPlugin();

var ListForm = require( './list_form' );
var ListWaiting = require( './list_waiting' );
var LoungeForm = require( './lounge_form' );
var LoungeList = require( './lounge_list' );

var App = module.exports = React.createClass({
    mixins: [
        Reflux.connect( userStore, 'users' ),
        Reflux.connect( cardStore, 'cards' ),
        Reflux.connect( readerStore, 'reader' ),
        Reflux.connect( pageStore, 'page' )
    ],

    getInitialState: function() {
        return {
            users: {
                active: [],
                removed: []
            },
            cards: [],
            page: 'lounge',
            reader: false
        };
    },

    render: function() {
        var signedIn = false;
        var users = this.state.users;
        if ( users.active && users.active.length ) {
            signedIn = users.active.reduce( function( memo, user ) {
                if ( memo ) {
                    return memo;
                } else if ( user.id == socket.id ) {
                    return true;
                }
            }, false );
        }

        if ( this.state.page == 'lounge' ) {
            return <Lounge users={this.state.users.active} removedUsers={this.state.users.removed} cards={this.state.cards} signedIn={signedIn} reader={this.state.reader}/>
        } else if ( this.state.page == 'list' ) {
            return <List users={this.state.users.active} cards={this.state.cards} reader={this.state.reader} />
        } else if ( this.state.page == 'game' ) {
            return <Game users={this.state.users.active} cards={this.state.cards} reader={this.state.reader} />
        } else if ( this.state.page == 'summary' ) {
            return <Summary users={this.state.users.active} cards={this.state.cards} reader={this.state.reader} />
        } else {
            return <div>404</div>
        }
    }
});
