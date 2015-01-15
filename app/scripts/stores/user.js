var Reflux = require( 'reflux' );
var UserActions = require( '../actions/user' );
var SocketActions = require( '../actions/socket' );
var socket = require( '../socket' );

var userStore = module.exports = Reflux.createStore({
    listenables: [ UserActions, SocketActions ],

    onUserAdded: function( user ) {
        console.log( 'ADDED', user );
        this.users = this.users || [];
        this.updateUsers( this.users.concat( [ user ] ) );
    },

    onSignedIn: function( dataUrl ) {
        socket.emit( 'userAdded', dataUrl );
    },

    updateUsers: function( users ) {
        this.users = users;
        this.trigger( users );
    },

    isHost: function() {
        this.users = this.users || [];

        var host = this.users.reduce( function( memo, user ) {
            return user.host ? user : memo;
        });
        return host && host.id == 1;//socket.io.engine.id;
    },

    getDefaultData: function() {
        this.users = this.users || [];

        return { list: this.users };
    }
});
