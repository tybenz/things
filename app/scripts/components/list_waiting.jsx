var React = require( 'react' );
var socket = require( '../socket' );
var CardActions = require( '../actions/card' );

var ListWaiting = module.exports = React.createClass({
    lastCard: function() {
        return this.props.cards[ this.props.cards.length - 1 ];
    },

    startRound: function() {
        CardActions.startRound();
    },

    render: function() {
        var reader = this.props.reader;

        if ( reader ) {
            var card = this.lastCard();
            var userCount = this.props.users.length;
            var thingCount = 0;
            var things = [];

            if ( card ) {
                thingCount = card.things.length;
                things = card.things.map( function( thing ) {
                    return <li className="thing">{thing.text}</li>
                });
            }

            return (
                <div>
                    <h3 className="center">{thingCount}/{userCount} things submitted</h3>
                    <ul className="thing-list">
                        {things}
                    </ul>
                    <button className="button" onClick={this.startRound}>Start round!</button>
                </div>
            );
        } else {
            return (
                <div>
                    <h3 className="center">Waiting for everyone's answers...</h3>
                </div>
            )
        }
    }
});
