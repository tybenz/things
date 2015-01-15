var Reflux = require( 'reflux' );
var SocketActions = require( '../actions/socket' );

var hostStore = module.exports = Reflux.createStore({
    listenables: [ SocketActions ],

    onHost: function() {
        this.update( true );
    },

    update: function( bool ) {
        this.host = bool;
        this.trigger( bool );
    },

    getDefaultData: function() {
        this.host = this.host || false;
        return this.host;
    }
});
