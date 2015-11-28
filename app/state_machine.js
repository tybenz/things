var fs = require( 'fs' );
var path = require( 'path' );
var things = require( './things' );

var machina = require( 'machina' );

var fsm;
var io;
var expressServer;
var connections = [];
var users = [];
var removedUsers = [];
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

                reenterUser: function( data ) {
                    var id = data.id;
                    var avatarPath = data.avatar;
                    var reenteringUser;
                    var index = removedUsers.reduce( function( memo, user, i ) {
                        if ( user.avatar == avatarPath ) {
                            reenteringUser = user;
                            memo = i;
                        }

                        return memo;
                    }, undefined);

                    if ( user && index ) {
                        removedUser.splice( index, 1 );
                        users.push( user );
                        // update all clients with id
                        console.log( 'USER REENTERED' );
                        io.emit( 'userReentered', user, id );
                        user.id = id;
                    }
                },

                addConnection: function( socket ) {
                    connections.push( socket );

                    users.forEach( function( user ) {
                        socket.emit( 'userAdded', user );
                    });

                    removedUsers.forEach( function( user ) {
                        socket.emit( 'removedUserAdded', user );
                    });

                    var lastCard = cards[ cards.length - 1 ];
                    if ( lastCard ) {
                        socket.emit( 'cardAdded', lastCard );
                    }

                    socket.emit( 'loungeShowed' );
                },

                removeConnection: function( socketId ) {
                    var index = connections.reduce( function( memo, client, i ) {
                        if ( memo ) {
                            return memo;
                        } else if ( client.id == socketId ) {
                            return i;
                        }
                    }, undefined );
                    connections.splice( index, 1 );

                    index = users.reduce( function( memo, client, i ) {
                        if ( memo ) {
                            return memo;
                        } else if ( client.id == socketId ) {
                            return i;
                        }
                    }, undefined );
                    // remove the user and add it to the removed list
                    if ( index ) {
                        var user = users.splice( index, 1 )[ 0 ];
                        removedUsers.push( user );
                    }

                    console.log( 'CARDS', cards );
                    for ( var i = cards.length - 1; i >= 0; i-- ) {
                        var card = cards[ i ];
                        console.log( 'CARD', card );
                        for ( var j = card.things.length - 1; j >= 0; j-- ) {
                            var thing = card.things[ j ];
                            if ( thing.userId == socketId ) {
                                card.things.splice( j, 1 );
                                io.emit( 'thingRemoved', card, thing );
                            }
                        }
                    }

                    io.emit( 'userRemoved', user );
                },

                addUser: function( image, socketId ) {
                    var socket = connections.reduce( function( memo, client ) {
                        if ( memo ) {
                            return memo;
                        } else if ( client.id == socketId ) {
                            return client;
                        }
                    }, undefined );

                    var user = {
                        score: 0,
                        id: socketId,
                        avatar: '/images/' + path.basename( image )
                    };

                    if ( users.length == 0 ) {
                        reader = socket;
                        socket.emit( 'readerOn' );
                    }

                    users.push( user );
                    io.emit( 'userAdded', user );
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
                        fsm.transition( 'summary' );
                        setTimeout( function() {
                            fsm.handle( 'addCard' );
                        }, 6000 );
                        // fsm.handle( 'addCard' );
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

                        removeConnection: function( socket ) {
                            this.removeConnection( socket );
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

                        removeConnection: function( socket ) {
                            this.removeConnection( socket );
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

                        removeConnection: function( socket ) {
                            this.removeConnection( socket );
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

                    summary: {
                        _onEnter: function() {
                            io.emit( 'summaryShowed' );
                        },

                        addConnection: function( socket ) {
                            this.addConnection( socket );
                        },

                        removeConnection: function( socket ) {
                            this.removeConnection( socket );
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
            var socketId = socket.id;
            console.log( 'NEW CONNECTION', socket.id );
            socket.emit( 'socketId', socket.id );

            fsm.handle( 'addConnection', socket );

            socket.on( 'disconnect', function() {
                console.log( 'DISCONNECT', socketId );
                fsm.handle( 'removeConnection', socketId );
            });

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
    },

    handle: function() {
        fsm.handle.apply( fsm, arguments );
    }
};
