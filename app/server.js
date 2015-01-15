var express = require( 'express' );
var logger = require( 'morgan' );
var fs = require( 'fs' );
var path = require( 'path' );
var things = require( './things' );
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

var server = app.listen( 8000, function() {
    console.log( 'Listening on *:8000' );
});

var io = require( 'socket.io' )( server );

var users = [];

io.on( 'connection', function( socket ) {
    console.log( socket.id );
    socket.on( 'appReady', function() {
        console.log( 'CLIENT READY' );
        users.forEach( function( user ) {
            socket.emit( 'userAdded', user );
        });
    });

    socket.on( 'gameStart', function() {
        io.emit( 'cardAdded', things.random() );
    });

    socket.on( 'userAdded', function( image ) {
        var regex = /^data:.+\/(.+);base64,(.*)$/;

        var matches = image.match( regex );
        var ext = matches[ 1 ];
        var data = matches[ 2 ];
        var buffer = new Buffer( data, 'base64' );
        var newPath = path.join( __dirname, '..', 'tmp', 'images', socket.id + '.' + ext );
        fs.writeFile( newPath, buffer, function( err ) {
            var user = {
                id: socket.id,
                avatar: '/images/' + socket.id + '.' + ext
            };
            if ( !users.length ) {
                socket.emit( 'host' );
            }
            users.push( user );
            io.emit( 'userAdded', user );
            if ( err ) {
                console.error( err );
            }
        });
    });
});
