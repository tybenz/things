var React = require( 'react' );
var UserActions = require( '../actions/user' );

var LoungForm = module.exports = React.createClass({
    photoSelected: function( evt ) {
        var file = evt.currentTarget.files[ 0 ];

        var reader = new FileReader();
        var self = this;

        reader.onloadend = function() {
            UserActions.addUser( reader.result );
        };

        if ( file ) {
            reader.readAsDataURL( file );
        }
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
                        <input id="avatar-select-file" type="file" onChange={this.photoSelected} />
                    </div>
                </div>
            </div>
        );
    }
});
