var React = require( 'react' );
var Addons = require( 'react-addons' );
var CardActions = require( '../actions/card' );

var ListForm = module.exports = React.createClass({
    mixins: [ Addons.LinkedStateMixin ],

    addThing: function( evt ) {
        evt.preventDefault();
        CardActions.addThing( this.lastCard(), this.state.myThing );
    },

    getInitialState: function() {
        return { myThing: '' };
    },

    lastCard: function() {
        return this.props.cards[ this.props.cards.length - 1 ];
    },

    render: function() {
        var lastCard = this.lastCard();
        var card;
        if ( lastCard ) {
            card = <p className="card">{lastCard.text}...</p>
        }

        return (
            <div>
                <h1 className="center">Let's play!</h1>
                <form className="thing-form" onSubmit={this.addThing}>
                    {card}
                    <textarea placeholder="Tap here to type your answer" valueLink={this.linkState('myThing')}></textarea>
                    <input type="submit" value="Submit" className="button"></input>
                </form>
            </div>
        );
    }
});
