var Reflux = require( 'reflux' );
var SocketActions = require( '../actions/socket' );

var pageStore = module.exports = Reflux.createStore({
    listenables: [ SocketActions ],

    onListShowed: function() {
        this.update( 'list' );
    },

    onLoungeShowed: function() {
        this.update( 'lounge' );
    },

    onGameShowed: function() {
        this.update( 'game' );
    },

    onSummaryShowed: function() {
        this.update( 'summary' );
    },

    update: function( val ) {
        this.page = val;
        this.trigger( val );
    },

    getDefaultData: function() {
        this.page = this.page || 'lounge';
        return this.page;
    }
});
