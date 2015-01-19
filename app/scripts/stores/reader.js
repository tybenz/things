var Reflux = require( 'reflux' );
var SocketActions = require( '../actions/socket' );

var readerStore = module.exports = Reflux.createStore({
    listenables: [ SocketActions ],

    onReaderOn: function() {
        console.log( 'READER ON' );
        this.update( true );
    },

    onReaderOff: function() {
        console.log( 'READER OFF' );
        this.update( false );
    },

    update: function( bool ) {
        this.reader = bool;
        this.trigger( bool );
    },

    getDefaultData: function() {
        this.reader = this.reader || false;
        return this.reader;
    }
});
