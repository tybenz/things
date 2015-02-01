var fs = require( 'fs' );
var path = require( 'path' );
var things = require( './things' );

var machina = require( 'machina' );

var fsm;
var io;
var expressServer;
var connections = [];
var users = [];
var cards = [];
var reader;
var isReader = function( socket ) {
    return reader.id == socket.id;
};

module.exports = {
    init: function( server ) {
        expressServer = server;
        io = require( 'socket.io' )( server );

        newFsm = function() {
            return new machina.Fsm({
                initialState: 'lounge',

                addConnection: function( socket ) {
                    connections.push( socket );

                    users.forEach( function( user ) {
                        socket.emit( 'userAdded', user );
                    });

                    var lastCard = cards[ cards.length - 1 ];
                    if ( lastCard ) {
                        socket.emit( 'cardAdded', lastCard );
                    }

                    socket.emit( 'loungeShowed' );
                },

                addUser: function( image, socket ) {
                    var regex = /^data:.+\/(.+);base64,(.*)$/;

                    var matches = image.match( regex );
                    var ext = matches[ 1 ];
                    var data = matches[ 2 ];
                    var buffer = new Buffer( data, 'base64' );
                    var newPath = path.join( __dirname, '..', 'tmp', 'images', socket.id + '.' + ext );
                    fs.writeFile( newPath, buffer, function( err ) {
                        if ( err ) {
                            console.error( err );
                            return;
                        }

                        var user = {
                            score: 0,
                            id: socket.id,
                            avatar: '/images/' + socket.id + '.' + ext
                        };

                        if ( users.length == 0 ) {
                            reader = socket;
                            socket.emit( 'readerOn' );
                        }

                        users.push( user );
                        io.emit( 'userAdded', user );
                    });
                },

                addCard: function() {
                    var readerIndex;
                    connections.forEach( function( client, i ) {
                        if ( client.id == reader.id ) {
                            readerIndex = i;
                            return false;
                        }
                    });

                    if ( reader ) {
                        reader.emit( 'readerOff' );
                    }
                    if ( readerIndex + 1 < connections.length ) {
                        reader = connections[ readerIndex + 1 ];
                        reader.emit( 'readerOn' );
                    } else {
                        reader = connections[ 0 ];
                        reader.emit( 'readerOn' );
                    }

                    var card = {
                        text: things.random(),
                        things: []
                    };

                    cards.push( card );

                    io.emit( 'cardAdded', card );
                    this.transition( 'list' );
                },

                addThing: function( card, thing, socket ) {
                    thing = {
                        userId: socket.id,
                        text: thing
                    };

                    var editCard = cards.reduce( function( memo, c ) {
                        if (memo) {
                            return memo;
                        } else if ( c.text == card.text ) {
                            return c;
                        }
                    }, undefined );

                    editCard.things.push( thing );
                    io.emit( 'thingAdded', card, thing );
                },

                removeThing: function( card, thing ) {
                    var editCard = cards.reduce( function( memo, c ) {
                        if (memo) {
                            return memo;
                        } else if ( c.text == card.text ) {
                            return c;
                        }
                    }, undefined );

                    var index;
                    editCard.things.forEach( function( t, i ) {
                        if ( t.text == thing ) {
                            index = i;
                            return false;
                        }
                    });

                    editCard.things.splice( index, 1 );
                    io.emit( 'thingRemoved', card, thing );

                    if ( editCard.things.length < 3 ) {
                        fsm.handle( 'addCard' );
                    }
                },

                addScore: function( userId, score ) {
                    var user = users.reduce( function( memo, u, i ) {
                        if ( memo ) {
                            return memo;
                        } else if ( userId == u.id ) {
                            return u;
                        }
                    }, undefined );

                    user.score += score;
                    io.emit( 'scoreAdded', userId, score );
                },

                states: {
                    lounge: {
                        _onEnter: function() {
                            io.emit( 'loungeShowed' );
                        },

                        addConnection: function( socket ) {
                            this.addConnection( socket );
                        },

                        addUser: function( image, socket ) {
                            this.addUser( image, socket );
                        }
                    },

                    list: {
                        _onEnter: function() {
                            io.emit( 'listShowed' );
                        },

                        addConnection: function( socket ) {
                            this.addConnection( socket );
                        },

                        addUser: function( image, socket ) {
                            this.addUser( image, socket );
                        },

                        addCard: function() {
                            this.addCard();
                        },

                        addThing: function( card, thing, socket ) {
                            this.addThing( card, thing, socket );
                        },

                        removeThing: function( card, thing ) {
                            this.removeThing( card, thing );
                        },

                        addScore: function( userId, score ) {
                            this.addScore( userId, score );
                        }
                    },

                    game: {
                        _onEnter: function() {
                            io.emit( 'gameShowed' );
                        },

                        addConnection: function( socket ) {
                            this.addConnection( socket );
                        },

                        addUser: function( image, socket ) {
                            this.addUser( image, socket );
                        },

                        addCard: function() {
                            this.addCard();
                        },

                        addThing: function( card, thing, socket ) {
                            this.addThing( card, thing, socket );
                        },

                        removeThing: function( card, thing ) {
                            this.removeThing( card, thing );
                        },

                        addScore: function( userId, score ) {
                            this.addScore( userId, score );
                        }
                    }
                }
            });
        };

        fsm = newFsm();

        io.on( 'connection', function( socket ) {
            console.log( 'NEW CONNECTION' );
            socket.emit( 'socketId', socket.id );

            fsm.handle( 'addConnection', socket );

            socket.on( 'startRound', function() {
                fsm.transition( 'game' );
            });

            socket.on( 'addCard', function() {
                fsm.handle( 'addCard' );
            });

            socket.on( 'addThing', function( card, thing ) {
                fsm.handle( 'addThing', card, thing, socket );
            });

            socket.on( 'addScore', function( userId, score ) {
                fsm.handle( 'addScore', userId, score );
            });

            socket.on( 'removeThing', function( card, thing ) {
                fsm.handle( 'removeThing', card, thing, socket );
            });

            socket.on( 'startGame', function() {
                fsm.transition( 'list' );
            });

            socket.on( 'addUser', function( image ) {
                fsm.handle( 'addUser', image, socket );
            });
        });
    },

    restart: function() {
        console.log( 'RESTART!' );
        connections = [];
        users = [];
        cards = [];
        reader = undefined;
        // io = require( 'socket.io' )( expressServer );
        fsm = newFsm();
    }
};
