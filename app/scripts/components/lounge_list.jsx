var React = require( 'react' );
var Avatar = require( './avatar' );
var CardActions = require( '../actions/card' );

var LoungList = module.exports = React.createClass({
    startGame: function() {
        CardActions.startGame();
        CardActions.addCard();
    },

    render: function() {
        var users = this.props.users;
        var userListItems = users.map( function( user ) {
            return <Avatar src={user.avatar} />
        });

        var goButton;
        if ( this.props.reader ) {
            if ( users.length > 3 ) {
                goButton = <button className="button" onClick={this.startGame}>Start!</button>
            } else {
                goButton = <button disabled="true" className="button">Need 4 or more...</button>
            }
        }

        return (
            <div>
                <h3 className="center">Waiting for everone to join...</h3>
                <div className="avatar-grid">
                    {userListItems}
                    <div>
                        {goButton}
                    </div>
                </div>
            </div>
        );
    }
});
