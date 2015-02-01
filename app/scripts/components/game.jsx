var React = require( 'react' );
var Avatar = require( './avatar' );
var Score = require( './score' );
var UserActions = require( '../actions/user' );
var CardActions = require( '../actions/card' );
var socket = require( '../socket' );

var Game = module.exports = React.createClass({
    lastCard: function() {
        return this.props.cards[ this.props.cards.length - 1 ];
    },

    getInitialState: function() {
        return {
            scoring: undefined,
            showScore: false
        };
    },

    toggleScore: function() {
        if ( this.state.showScore ) {
            this.setState( { showScore: false } );
        } else {
            this.setState( { showScore: true } );
        }
    },

    scoring: function( evt ) {
        evt.preventDefault();
        if ( evt.currentTarget.dataset.disabled == 'false' ) {
            var value = evt.currentTarget.dataset.value;
            this.setState( { scoring: value } );
        }
    },

    scoreUser: function( evt ) {
        console.log( 'SCORE USER!' );
        evt.preventDefault();
        evt.stopPropagation();

        var score = 1;
        var lastCard = this.lastCard();
        if ( lastCard && lastCard.things.length < 4 ) {
            score = 2;
        }

        UserActions.addScore( evt.currentTarget.dataset.id, score );
        CardActions.removeThing( this.lastCard(), this.state.scoring );

        this.setState( { scoring: undefined } );
    },

    closeOverlay: function( evt ) {
        if ( evt ) {
            evt.preventDefault();
        }
        console.log( 'CLOSE OVERLAY' );
        if ( evt.currentTarget.className == 'overlay' || evt.currentTarget.className == 'close-button' ) {
            if ( this.state.scoring ) {
                this.setState( { scoring: undefined } );
            } else if ( this.state.showScore ) {
                this.setState( { showScore: false } );
            }
        }
    },

    render: function() {
        var scores;
        var view = this;

        if ( this.state.scoring && this.props.reader ) {
            scores = this.props.users.map( function( user ) {
                return (
                    <Score onClick={view.scoreUser} userId={user.id} src={user.avatar} score={user.score} />
                );
            });
            scores = (
                <div onClick={view.closeOverlay} className="overlay">
                    <div className="popup">
                        <button onClick={view.closeOverlay} className="close-button"></button>
                        <p className="prompt">Who gets the point?</p>
                        <div className="avatar-grid">{scores}</div>
                    </div>
                </div>
            );
        }

        if ( this.state.showScore ) {
            scores = this.props.users.map( function( user ) {
                return (
                    <Score src={user.avatar} score={user.score} />
                );
            });
            scores = (
                <div onClick={view.closeOverlay} className="overlay">
                    <div className="popup">
                        <button onClick={view.closeOverlay} className="close-button"></button>
                        <div className="avatar-grid">{scores}</div>
                    </div>
                </div>
            );
        }

        if ( this.state.showScore || this.state.scoring ) {
            var showScoreClass = 'show-score';
        }

        if ( this.props.reader ) {
            var things = this.lastCard().things.map( function( thing, i ) {
                return <li className="thing" data-disabled={thing.userId == socket.id ? 'true' : 'false'} onClick={view.scoring} data-value={thing.text}>{thing.text}</li>
            });
        } else {
            var things = this.lastCard().things.map( function( thing, i ) {
                return <li className="thing" data-value={thing.text}>{thing.text}</li>
            });
        }

        return (
            <div className={showScoreClass}>
                <h4 className="game-heading">
                    <button className="score-button" onClick={this.toggleScore}></button>
                    {this.lastCard() ? this.lastCard().text + '...' : ' '}
                </h4>
                {scores}
                <ul className="thing-list">
                    {things}
                </ul>
            </div>
        );
    }
});
