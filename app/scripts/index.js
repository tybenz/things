var React = require( 'react' );
var app = require( './components/app' )();
var socket = require( './socket' );

React.renderComponent( app, document.body );
