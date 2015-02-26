var Reflux = require( 'reflux' );
var _ = require( 'lodash' );
var UserActions = require( '../actions/user' );
var SocketActions = require( '../actions/socket' );
var socket = require( '../socket' );

var userStore = module.exports = Reflux.createStore({
    listenables: [ UserActions, SocketActions ],

    onSocketId: function( socketId ) {
        socket.id = socketId;
    },

    onAddUser: function( dataUrl ) {
        socket.emit( 'addUser', dataUrl );
    },

    onUserAdded: function( user ) {
        this.users = this.users || [];
        this.updateUsers( this.users.concat( [ user ] ) );
    },

    onUserRemoved: function( socketId ) {
        for ( var i = this.users.length - 1; i >= 0; i-- ) {
            var user = this.users[ i ];
            if ( user.id == socketId ) {
                this.users.splice( i, 1 );
            }
        }

        this.updateUsers( _.extend( [], this.users ) );
    },

    onAddScore: function( userId, score ) {
        console.log( 'ADD SCORE CLIENT' );
        socket.emit( 'addScore', userId, score );
    },

    onScoreAdded: function( userId, score ) {
        var user = this.users.reduce( function( memo, u ) {
            if ( memo ) {
                return memo;
            } else if ( u.id == userId ) {
                return u;
            }
        }, undefined );
        user.score += score;
        this.updateUsers( _.extend( [], this.users ) );
    },

    updateUsers: function( users ) {
        this.users = users;
        this.trigger( users );
    },

    getDefaultData: function() {
        this.users = this.users || [];

        return { list: this.users };
    }
});
