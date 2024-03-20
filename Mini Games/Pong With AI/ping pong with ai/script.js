// Global Variables
var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

var rounds = [1, 1, 1, 1, 1];
var colors = ['#1abc9c', '#2ecc71', '#3498db', '#8c52ff', '#9b59b6'];

const socketUrl = 'wss://localhost:6868'
let com = "neutral",
    pow = 1;
let streams = ['com'];
let user = {
    "license": "",
    "clientId": "97LUk91NH5vW1Wul5dcyWOWfcJ4tDvX28frCx5pC",
    "clientSecret": "GH0A2vlp52by1zRil1INUP5vg9oLIPFBaCzMuwN1vXdA1qPrYt9ARcNse3kc9ZsRI7SfPUwCBWccB7RcGEngs6fJLhmaV1r7jKxpyqltvWXIxWAyM4LdMj3NOTSRF9nT",
    "debit": 1
}


// The ball object (The cube that bounces back and forth)
var Ball = {
    new: function (incrementedSpeed) {
        return {
            width: 18,
            height: 18,
            x: (this.canvas.width / 2) - 9,
            y: (this.canvas.height / 2) - 9,
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
            speed: incrementedSpeed || 2.5
        };
    }
};

const WARNING_CODE_HEADSET_DISCOVERY_COMPLETE = 142;
const WARNING_CODE_HEADSET_CONNECTED = 104;

// The ai object (The two lines that move up and down)
var Ai = {
    new: function (side) {
        return {
            width: 18,
            height: 180,
            x: side === 'left' ? 150 : this.canvas.width - 150,
            y: (this.canvas.height / 2) - 35,
            score: 0,
            move: DIRECTION.IDLE,
            speed: 8
        };
    }
};

var Game = {


    initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.width = 1400;
        this.canvas.height = 1000;

        this.canvas.style.width = (this.canvas.width / 2) + 'px';
        this.canvas.style.height = (this.canvas.height / 2) + 'px';

        this.player = Ai.new.call(this, 'left');
        this.ai = Ai.new.call(this, 'right');
        this.ball = Ball.new.call(this);

        this.player.speed = 5
        this.ai.speed = 15;
        this.running = this.over = false;
        this.turn = this.ai;
        this.timer = this.round = 0;
        this.color = '#8c52ff';

        Pong.menu();
        Pong.listen();
    },

    endGameMenu: function (text) {
        // Change the canvas font size and color
        Pong.context.font = '45px Courier New';
        Pong.context.fillStyle = this.color;

        // Draw the rectangle behind the 'Press any key to begin' text.
        Pong.context.fillRect(
            Pong.canvas.width / 2 - 350,
            Pong.canvas.height / 2 - 48,
            700,
            100
        );

        // Change the canvas color;
        Pong.context.fillStyle = '#ffffff';

        // Draw the end game menu text ('Game Over' and 'Winner')
        Pong.context.fillText(text,
            Pong.canvas.width / 2,
            Pong.canvas.height / 2 + 15
        );

        setTimeout(function () {
            Pong = Object.assign({}, Game);
            Pong.initialize();
        }, 3000);
    },

    menu: function () {
        // Draw all the Pong objects in their current state
        Pong.draw();

        // Change the canvas font size and color
        this.context.font = '50px Courier New';
        this.context.fillStyle = this.color;

        // Draw the rectangle behind the 'Press any key to begin' text.
        this.context.fillRect(
            this.canvas.width / 2 - 350,
            this.canvas.height / 2 - 48,
            700,
            100
        );

        // Change the canvas color;
        this.context.fillStyle = '#ffffff';

        // Draw the 'press any key to begin' text
        this.context.fillText('Press any key to begin',
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );
    },

    // Update all objects (move the player, ai, ball, increment the score, etc.)
    update: function () {
        if (!this.over) {

            // If the ball collides with the bound limits - correct the x and y coords.
            if (this.ball.x <= 0) Pong._resetTurn.call(this, this.ai, this.player);
            if (this.ball.x >= this.canvas.width - this.ball.width) Pong._resetTurn.call(this, this.player, this.ai);
            if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
            if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

            // Move player if they player.move value was updated by a keyboard event
            if (this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
            else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

            // On new serve (start of each turn) move the ball to the correct side
            // and randomize the direction to add some challenge.
            if (Pong._turnDelayIsOver.call(this) && this.turn) {
                this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
                this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
                this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
                this.turn = null;
            }

            // If the player collides with the bound limits, update the x and y coords.
            if (this.player.y <= 0) this.player.y = 0;
            else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

            // Move ball in intended direction based on moveY and moveX values
            if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
            else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
            if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
            else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

            // Handle ai (AI) UP and DOWN movement
            if (this.ai.y > this.ball.y - (this.ai.height / 2)) {
                if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y -= this.ai.speed / 1.5;
                else this.ai.y -= this.ai.speed / 4;
            }
            if (this.ai.y < this.ball.y - (this.ai.height / 2)) {
                if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y += this.ai.speed / 1.5;
                else this.ai.y += this.ai.speed / 4;
            }

            // Handle ai (AI) wall collision
            if (this.ai.y >= this.canvas.height - this.ai.height) this.ai.y = this.canvas.height - this.ai.height;
            else if (this.ai.y <= 0) this.ai.y = 0;

            // Handle Player-Ball collisions
            if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
                if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
                    this.ball.x = (this.player.x + this.ball.width);
                    this.ball.moveX = DIRECTION.RIGHT;

                }
            }

            // Handle ai-ball collision
            if (this.ball.x - this.ball.width <= this.ai.x && this.ball.x >= this.ai.x - this.ai.width) {
                if (this.ball.y <= this.ai.y + this.ai.height && this.ball.y + this.ball.height >= this.ai.y) {
                    this.ball.x = (this.ai.x - this.ball.width);
                    this.ball.moveX = DIRECTION.LEFT;

                }
            }
        }

        // Handle the end of round transition
        // Check to see if the player won the round.
        if (this.player.score === rounds[this.round]) {
            // Check to see if there are any more rounds/levels left and display the victory screen if
            // there are not.
            if (!rounds[this.round + 1]) {
                this.over = true;
                setTimeout(function () { Pong.endGameMenu('Winner!'); }, 1000);
            } else {
                // If there is another round, reset all the values and increment the round number.
                this.color = this._generateRoundColor();
                this.player.score = this.ai.score = 0;
                this.player.speed += 2;
                this.ai.speed += 2;
                this.ball.speed += 0;
                this.round += 1;

            }
        }
        // Check to see if the ai/AI has won the round.
        else if (this.ai.score === rounds[this.round]) {
            this.over = true;
            setTimeout(function () { Pong.endGameMenu('Game Over!'); }, 1000);
        }
    },

    // Draw the objects to the canvas element
    draw: function () {
        // Clear the Canvas
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        // Set the fill style to black
        this.context.fillStyle = this.color;

        // Draw the background
        this.context.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        // Set the fill style to white (For the paddles and the ball)
        this.context.fillStyle = '#ffffff';

        // Draw the Player
        this.context.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );

        // Draw the Ai
        this.context.fillRect(
            this.ai.x,
            this.ai.y,
            this.ai.width,
            this.ai.height
        );

        // Draw the Ball
        if (Pong._turnDelayIsOver.call(this)) {
            this.context.fillRect(
                this.ball.x,
                this.ball.y,
                this.ball.width,
                this.ball.height
            );
        }

        // Draw the net (Line in the middle)
        this.context.beginPath();
        this.context.setLineDash([7, 15]);
        this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140);
        this.context.lineTo((this.canvas.width / 2), 140);
        this.context.lineWidth = 10;
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();

        // Set the default canvas font and align it to the center
        this.context.font = '100px Courier New';
        this.context.textAlign = 'center';

        // Draw the players score (left)
        this.context.fillText(
            this.player.score.toString(),
            (this.canvas.width / 2) - 300,
            200
        );

        // Draw the paddles score (right)
        this.context.fillText(
            this.ai.score.toString(),
            (this.canvas.width / 2) + 300,
            200
        );

        // Change the font size for the center score text
        this.context.font = '30px Courier New';

        // Draw the winning score (center)
        this.context.fillText(
            'Round ' + (Pong.round + 1),
            (this.canvas.width / 2),
            35
        );

        // Change the font size for the center score value
        this.context.font = '40px Courier';

        // Draw the current round number
        this.context.fillText(
            rounds[Pong.round] ? rounds[Pong.round] : rounds[Pong.round - 1],
            (this.canvas.width / 2),
            100
        );
    },

    loop: function () {
        Pong.update();
        Pong.draw();

        // If the game is not over, draw the next frame.
        if (!Pong.over) requestAnimationFrame(Pong.loop);
    },

    // Integration part
    listen: function () {

        if (Pong.running === false) {
            Pong.running = true;
            window.requestAnimationFrame(Pong.loop);
        }

        class Cortex {
            constructor(user, socketUrl) {
                // create socket
                // this.process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
                this.socket = new WebSocket(socketUrl)

                // read user infor
                this.user = user
                this.isHeadsetConnected = false

            }

            queryHeadsetId() {
                console.log("queryHeadsetId")
                return new Promise((resolve, reject) => {
                    const QUERY_HEADSET_ID = 2;
                    let socket = this.socket;
                    let queryHeadsetRequest = {
                        "jsonrpc": "2.0",
                        "id": QUERY_HEADSET_ID,
                        "method": "queryHeadsets",
                        "params": {}
                    };
                    const sendQueryRequest = () => {
                        console.log('queryHeadsetRequest');
                        socket.send(JSON.stringify(queryHeadsetRequest));
                    };

                    sendQueryRequest();

                    socket.addEventListener('message', (event) => {
                        try {
                            if (JSON.parse(event.data)['id'] == QUERY_HEADSET_ID) {
                                // console.log(data)
                                // console.log(JSON.parse(data)['result'].length)
                                if (JSON.parse(event.data)['result'].length > 0) {
                                    JSON.parse(event.data)['result'].forEach(headset => {
                                        if (headset['status'] === 'connected') {
                                            this.isHeadsetConnected = true;
                                        }
                                    });
                                    resolve(JSON.parse(event.data))
                                } else {
                                    console.log('No have any headset, please connect headset with your pc.')
                                    this.isHeadsetConnected = false
                                }
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    });

                    // Schedule subsequent requests every 1 minute
                    setInterval(sendQueryRequest, 60000);
                });
            }

            requestAccess() {
                console.log("RequestAccess")
                let socket = this.socket
                let user = this.user
                return new Promise(function (resolve, reject) {
                    const REQUEST_ACCESS_ID = 1
                    let requestAccessRequest = {
                        "jsonrpc": "2.0",
                        "method": "requestAccess",
                        "params": {
                            "clientId": user.clientId,
                            "clientSecret": user.clientSecret
                        },
                        "id": REQUEST_ACCESS_ID
                    }

                    // console.log('start send request: ',requestAccessRequest)
                    socket.send(JSON.stringify(requestAccessRequest));

                    socket.addEventListener('message', (event) => {
                        try {
                            if (JSON.parse(event.data)['id'] == REQUEST_ACCESS_ID) {
                                resolve(event)
                            }

                        } catch (error) { }
                    })
                })
            }

            authorize() {
                console.log("Authorize")
                let socket = this.socket
                let user = this.user
                return new Promise(function (resolve, reject) {
                    const AUTHORIZE_ID = 4
                    let authorizeRequest = {
                        "jsonrpc": "2.0", "method": "authorize",
                        "params": {
                            "clientId": user.clientId,
                            "clientSecret": user.clientSecret,
                            "license": user.license,
                            "debit": user.debit
                        },
                        "id": AUTHORIZE_ID
                    }
                    socket.send(JSON.stringify(authorizeRequest))
                    socket.addEventListener('message', (event) => {
                        try {
                            if (JSON.parse(event.data)['id'] == AUTHORIZE_ID) {
                                let cortexToken = JSON.parse(event.data)['result']['cortexToken']
                                resolve(cortexToken)
                                // Call controlDevice("refresh") when authorization is successful
                                this.refreshHeadsetList();
                            }
                        } catch (error) { }
                    })
                })
            }

            controlDevice(headsetId) {
                console.log("controlDevice")
                let socket = this.socket
                const CONTROL_DEVICE_ID = 3
                let controlDeviceRequest = {
                    "jsonrpc": "2.0",
                    "id": CONTROL_DEVICE_ID,
                    "method": "controlDevice",
                    "params": {
                        "command": "connect",
                        "headset": headsetId
                    }
                }
                return new Promise(function (resolve, reject) {
                    socket.send(JSON.stringify(controlDeviceRequest));
                    console.log('control device request: ', controlDeviceRequest)
                    socket.addEventListener('message', (event) => {
                        try {
                            let response = JSON.parse(event.data);
                            if (response['id'] == CONTROL_DEVICE_ID) {
                                if (response.error) {
                                    console.log(response.error.message);
                                    setTimeout(() => {
                                        socket.send(JSON.stringify(controlDeviceRequest));
                                    }, 10000);
                                } else {
                                    resolve(response);
                                }
                            }
                        } catch (error) { }
                    })
                })
            }

            createSession(authToken, headsetId) {
                console.log("createSession")
                return new Promise(async (resolve, reject) => {
                    let socket = this.socket;
                    const CREATE_SESSION_ID = 5;
                    let sessionId;
                    const checkHeadsetId = async () => {
                        const response = await this.queryHeadsetId();
                        const found = response["result"].find(item => String(item["id"]) === String(headsetId) && item["status"] === "connected");
                        if (found) {
                            clearInterval(queryInterval);
                            let createSessionRequest = {
                                "jsonrpc": "2.0",
                                "id": CREATE_SESSION_ID,
                                "method": "createSession",
                                "params": {
                                    "cortexToken": authToken,
                                    "headset": headsetId,
                                    "status": "active"
                                }
                            };
                            socket.send(JSON.stringify(createSessionRequest));

                            socket.addEventListener('message', (event) => {
                                let parsedData = JSON.parse(event.data);
                                if (parsedData.id === CREATE_SESSION_ID) {
                                    sessionId = parsedData['result']['id'];
                                    resolve(sessionId);
                                }
                            });
                        }
                    };
                    const queryInterval = setInterval(checkHeadsetId, 30000);
                    checkHeadsetId();
                });
            }

            subRequest(stream, authToken, sessionId) {
                console.log("subRequest")
                let socket = this.socket
                const SUB_REQUEST_ID = 6
                let subRequest = {
                    "jsonrpc": "2.0",
                    "method": "subscribe",
                    "params": {
                        "cortexToken": authToken,
                        "session": sessionId,
                        "streams": stream
                    },
                    "id": SUB_REQUEST_ID
                }
                socket.send(JSON.stringify(subRequest))

                socket.addEventListener('message', (event) => {
                    try {

                        com = JSON.parse(event.data)['com'][0]
                        pow = JSON.parse(event.data)['com'][1]

                        console.log(JSON.parse(event.data)['com'][0])

                        if (com == "push") {
                            Pong.player.move = DIRECTION.UP;
                        }

                        // Handle down arrow and s key events
                        if (com == "pull") {
                            Pong.player.move = DIRECTION.DOWN;
                        }
                        console.log("\r\n")

                    } catch (error) { }
                })
            }

            async querySessionInfo() {
                console.log("querySessionInfo")
                let qhResult = ""
                let headsetId = ""
                await this.queryHeadsetId().then((result) => { qhResult = result })
                this.qhResult = qhResult
                this.headsetId = qhResult['result'][0]['id']
                let ctResult = ""
                await this.controlDevice(this.headsetId).then((result) => { ctResult = result })
                this.ctResult = ctResult
                console.log(ctResult)

                let authToken = ""
                await this.authorize().then((auth) => { authToken = auth })
                this.authToken = authToken

                let sessionId = ""
                await this.createSession(authToken, this.headsetId).then((result) => { sessionId = result })
                this.sessionId = sessionId

                console.log('HEADSET ID -----------------------------------')
                console.log(this.headsetId)
                console.log('\r\n')
                console.log('CONNECT STATUS -------------------------------')
                console.log(this.ctResult)
                console.log('\r\n')
                console.log('AUTH TOKEN -----------------------------------')
                console.log(this.authToken)
                console.log('\r\n')
                console.log('SESSION ID -----------------------------------')
                console.log(this.sessionId)
                console.log('\r\n')
            }

            async checkGrantAccessAndQuerySessionInfo() {
                console.log("CGAQSI")
                let requestAccessResult = ""
                await this.requestAccess().then((result) => { requestAccessResult = result })

                // console.log(JSON.parse(requestAccessResult.data))

                let accessGranted = JSON.parse(requestAccessResult.data)

                // check if user is logged in CortexUI
                if ("error" in accessGranted) {
                    console.log('You must login on CortexUI before request for grant access then rerun')
                    throw new Error('You must login on CortexUI before request for grant access')
                } else {
                    console.log(accessGranted['result']['message'])
                    // console.log(accessGranted['result'])
                    if (accessGranted['result']['accessGranted']) {
                        await this.querySessionInfo()
                    }
                    else {
                        console.log('You must accept access request from this app on CortexUI then rerun')
                        throw new Error('You must accept access request from this app on CortexUI')
                    }
                }
            }

            sub(streams) {
                console.log("sub")
                this.socket.addEventListener('open', async () => {
                    await this.checkGrantAccessAndQuerySessionInfo()
                    this.subRequest(streams, this.authToken, this.sessionId)
                    this.socket.addEventListener('message', (event) => {
                        // log stream data to file or console here
                        // console.log(data)
                    })
                })
            }

            queryProfileRequest(authToken) {
                console.log("qPR")
                const QUERY_PROFILE_ID = 9
                let queryProfileRequest = {
                    "jsonrpc": "2.0",
                    "method": "queryProfile",
                    "params": {
                        "cortexToken": authToken
                    },
                    "id": QUERY_PROFILE_ID
                }

                let socket = this.socket
                return new Promise(function (resolve, reject) {
                    socket.send(JSON.stringify(queryProfileRequest))
                    socket.addEventListener('message', (event) => {
                        try {
                            if (JSON.parse(event.data)['id'] == QUERY_PROFILE_ID) {
                                // console.log(data)
                                resolve(event.data)
                            }
                        } catch (error) {

                        }
                    })
                })
            }

            listenForWarnings() {
                console.log("loW")
                this.socket.addEventListener('message', (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        if (message.warning) {
                            console.log('Warning Received Code:', message.warning.code);
                            console.log('Message:', message.warning.message);
                            console.log('--------------------------------------');

                            if (message.warning.code === WARNING_CODE_HEADSET_CONNECTED) {
                                this.isHeadsetConnected = true;
                            }
                            // After headset scanning finishes, if no headset is connected yet, the app should call the controlDevice("refresh") again
                            if (message.warning.code === WARNING_CODE_HEADSET_DISCOVERY_COMPLETE && !this.isHeadsetConnected) {
                                this.refreshHeadsetList();
                            }
                        }
                    } catch (error) { }
                });
            }

        }


        let c = new Cortex(user, socketUrl)
        c.sub(streams)

        /*
                document.addEventListener('keydown', function (key) {
                    // Handle the 'Press any key to begin' function and start the game.
        
        
                    // Handle up arrow and w key events
                    if (key.keyCode === 38 || key.keyCode === 87) Pong.player.move = DIRECTION.UP;
        
                    // Handle down arrow and s key events
                    if (key.keyCode === 40 || key.keyCode === 83) Pong.player.move = DIRECTION.DOWN
        
                });
        
                // Stop the player from moving when there are no keys being pressed.
                document.addEventListener('keyup', function (key) { Pong.player.move = DIRECTION.IDLE; });
        
        */

    },

    // Reset the ball location, the player turns and set a delay before the next round begins.
    _resetTurn: function (victor, loser) {
        this.ball = Ball.new.call(this, this.ball.speed);
        this.turn = loser;
        this.timer = (new Date()).getTime();

        victor.score++;
    },

    // Wait for a delay to have passed after each turn.
    _turnDelayIsOver: function () {
        return ((new Date()).getTime() - this.timer >= 1000);
    },

    // Select a random color as the background of each level/round.
    _generateRoundColor: function () {
        var newColor = colors[Math.floor(Math.random() * colors.length)];
        if (newColor === this.color) return Pong._generateRoundColor();
        return newColor;
    }
};

var Pong = Object.assign({}, Game);
Pong.initialize();