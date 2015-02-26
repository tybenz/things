var $ = require( 'jquery' );
var fileupload = require( 'blueimp-file-upload' );
var React = require( 'react' );
var UserActions = require( '../actions/user' );
var socket = require( '../socket' );
var toBlob = require( 'canvas-to-blob' );

var LoungForm = module.exports = React.createClass({
    componentDidMount: function() {
        setTimeout( function() {
            console.log( socket.id );
            $( '#avatar-select-file' ).fileupload({
                url: '/user_image?socketId=' + socket.id,
                multipart: true,
                dataType: 'json',
                done: function( evt, data ) {
                    console.log( evt, data );
                }
            });
        }, 3000 );
    },

    photoSelected: function( evt ) {
        var file = evt.currentTarget.files[ 0 ];

        var uploadImage = function( blob ) {
            $( '#avatar-select-file' ).fileupload( 'add', { files: [ blob ] } );
        };

        loadImage.parseMetaData( file, function( data ) {
            var options = {
                contain: 300,
                canvas: true
            };

            if ( data.exif ) {
                options.orientation = data.exif.get( 'Orientation' );
            }

            loadImage(
                file,
                function( canvas ) {
                    uploadImage( toBlob( canvas.toDataURL( 'image/png' ) ) );
                },
                options
            );
        });
    },

    render: function() {
        return (
            <div>
                <h1 className="center">The Game of Things</h1>
                <div className="avatar-select-wrapper">
                    <div className="avatar-select">
                        <div className="avatar-select-head"></div>
                        <div className="avatar-select-body"></div>
                        <p className="avatar-select-description">Tap to take a photo</p>
                        <input type="file" onChange={this.photoSelected} />
                        <input id="avatar-select-file" type="file" style={{display: 'none'}} />
                    </div>
                </div>
            </div>
        );
    }
});
