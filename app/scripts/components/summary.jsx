var React = require( 'react' );
var Reflux = require( 'reflux' );
var Score = require( './score' );

var Summary = React.createClass({
    getMessage: function() {
        var seconds = 6 - Math.floor( ( Date.now() - this.state.startTime ) / 1000 );
        if ( seconds < 6 && seconds >= 0 ) {
            this.setState( { seconds: seconds } );
        }
    },

    componentDidMount: function() {
        this.state.startTime = Date.now();
        setInterval( this.getMessage.bind( this ), 300 );
    },

    getInitialState: function() {
        return {
            startTime: undefined,
            seconds: -1
        };
    },

    render: function() {
        scores = this.props.users.map( function( user ) {
            return <Score src={user.avatar} score={user.score} />
        });

        var message = 'Round\'s over!';
        if ( this.state.seconds != -1 ) {
            message = 'Next round starting in ' + this.state.seconds + '...';
        }

        return (
            <div>
                <h3 className="center">{message}</h3>
                <div className="avatar-grid standlone">{scores}</div>
            </div>
        );
    }
});

module.exports = Summary;
