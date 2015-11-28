var React = require( 'react' );
var Reflux = require( 'reflux' );
var LoungeForm = require( './lounge_form' );
var LoungeList = require( './lounge_list' );

var Lounge = React.createClass({
    render: function() {
        if ( this.props.signedIn ) {
            return <LoungeList users={this.props.users} reader={this.props.reader}/>;
        } else {
            return <LoungeForm removedUsers={this.props.removedUsers}/>;
        }
    }
});

module.exports = Lounge;
