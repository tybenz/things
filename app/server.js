var express = require( 'express' );
var logger = require( 'morgan' );
var path = require( 'path' );
var browserify = require( 'browserify-middleware' );
var multer = require( 'multer' );
var app = express();
var stateMachine = require( './state_machine' );

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use( allowCrossDomain );

browserify.settings({
    insertGlobals: true,
    extensions: [ '.jsx' ],
    transform: ['reactify']
});
// app.use( '/scripts', browserify( path.join( __dirname, 'scripts' ) ) );
app.use( '/images', express.static( __dirname + '/../tmp/images' ) );
app.use( '/', express.static( __dirname ) );
app.use( multer( { dest: __dirname + '/../tmp/images' } ) );

app.get( '/restart', function( req, res, next ) {
    stateMachine.restart();
    res.status( 200 ).end( 'RESTARTED' );
});

app.get( '/*', function( req, res, next ) {
    res.sendFile( __dirname + '/index.html' );
});

app.post( '/user_image', function( req, res, next ) {
    console.log( req.query );
    console.log( req.files[ 'files[]' ].path, req.query.socketId );
    stateMachine.handle( 'addUser', req.files[ 'files[]' ].path, req.query.socketId );
    res.status( 200 ).end();
});

var server = app.listen( process.env.PORT || 8000, function() {
    console.log( 'Listening on *:8000' );
});

stateMachine.init( server );
