var React = require( 'react' );
var Router = require( 'react-router' );
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var Layout = require( './components/layout' );
var Welcome = require( './components/welcome' );
var Lounge = require( './components/lounge' );
var NewThing = require( './components/new_thing' );
var List = require( './components/list' );
var Scored = require( './components/scored' );
var ScoredUser = require( './components/scored_user' );

var socket = require( './socket' );

var routes = (
    <Route name="layout" path="/" handler={Layout}>
        <Route name="/scored/:user" handler={ScoredUser} />
        <Route name="/scored" handler={Scored} />
        <Route name="/list" handler={List} />
        <Route name="/new_thing" handler={NewThing} />
        <Route name="/lounge" handler={Lounge} />
        <DefaultRoute handler={Welcome} />
    </Route>
);

exports.start = function() {
    Router.run( routes, Router.HistoryLocation, function ( Handler ) {
        React.render( <Handler />, document.getElementById( 'content' ) );
    });
    console.log( 'READY' );
    socket.emit( 'appReady' );
};
