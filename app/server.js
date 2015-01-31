var express = require( 'express' );
var logger = require( 'morgan' );
var path = require( 'path' );
var browserify = require( 'browserify-middleware' );
var app = express();

browserify.settings({
    insertGlobals: true,
    extensions: [ '.jsx' ],
    transform: ['reactify']
});
app.use( '/scripts', browserify( path.join( __dirname, 'scripts' ) ) );
app.use( '/images', express.static( __dirname + '/../tmp/images' ) );
app.use( '/', express.static( __dirname ) );

app.get( '/*', function( req, res, next ) {
    res.sendFile( __dirname + '/index.html' );
});

var server = app.listen( process.env.PORT || 8000, function() {
    console.log( 'Listening on *:8000' );
});

var stateMachine = require( './state_machine' );
stateMachine( server );
