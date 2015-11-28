var React = require( 'react' );
var UserActions = require( '../actions/user' );
var socket = require( '../socket' );
var toBlob = require( 'canvas-to-blob' );

var LoungForm = module.exports = React.createClass({
    render: function() {
        var removedUsers = this.state.removedUsers.map( function( user ) {
            var style = { backgroundImage: 'url(' + user.avatar + ')' };
            return <div className="avatar>" style={style}></div>
        });

        return (
            <div>
                <h1 className="center">Welcome</h1>
                <p>Were you disconnected? Tap your face to jump back in the game</p>
                {removedUsers}
            </div>
        );
    }
});
