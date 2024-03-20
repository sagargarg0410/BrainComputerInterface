import React, { useEffect, useState, useRef } from 'react';
import './Face.css';
import smile from '../../assets/smile.png'
import wink from '../../assets/blink.png'
import blinksmile from '../../assets/blinkandsmile.png'
import neutral from '../../assets/neutral.png'

let eyeAct, uAct, uPow, lAct, lPow
var text = " "

const socketUrl = 'wss://localhost:6868'
let user =
{
    "license": "",
    "clientId": "97LUk91NH5vW1Wul5dcyWOWfcJ4tDvX28frCx5pC",
    "clientSecret": "GH0A2vlp52by1zRil1INUP5vg9oLIPFBaCzMuwN1vXdA1qPrYt9ARcNse3kc9ZsRI7SfPUwCBWccB7RcGEngs6fJLhmaV1r7jKxpyqltvWXIxWAyM4LdMj3NOTSRF9nT",
    "debit": 1
}

const WARNING_CODE_HEADSET_DISCOVERY_COMPLETE = 142;
const WARNING_CODE_HEADSET_CONNECTED = 104;

// Determine which image to display based on the fetched emotion string
class Cortex {
    constructor(user, socketUrl, setEyeact, setuAct, setuPow, setlAct, setlPow) {
        // create socket
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
        this.socket = new WebSocket(socketUrl)
        this.setEyeact = setEyeact
        this.setuAct = setuAct
        this.setuPow = setuPow
        this.setlAct = setlAct
        this.setlPow = setlPow

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

                this.setEyeact(JSON.parse(event.data)['fac'][0])
                this.setuAct(JSON.parse(event.data)['fac'][1])
                this.setuPow(JSON.parse(event.data)['fac'][2])
                this.setlAct(JSON.parse(event.data)['fac'][3])
                this.setlPow(JSON.parse(event.data)['fac'][4])


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

const ImageComponent = () => {

    const [eyeAct, setEyeact] = useState("neutral"), // Excitement
        [uAct, setuAct] = useState("neutral"), // Stress
        [lAct, setlAct] = useState("neutral"), // Focus
        [uPow, setuPow] = useState(0.1), // Engagement
        [lPow, setlPow] = useState(0.1),  // Relaxed

        cortex = useRef(),
        streams = useRef(['fac'])

    const GetImageSource = () => {

        useEffect(() => {

            cortex.current = new Cortex(user, socketUrl, setEyeact, setuAct, setuPow, setlAct, setlPow)

            cortex.current.sub(streams.current)
        }, [])

        if (eyeAct === "blink" && lAct !== "smile") {
            console.log("EYES BLINKED")
            text = "Blink"
            return wink;
        }

        else if (lAct === "smile" && eyeAct !== "blink") {
            console.log("SMILED")
            text = "Smile"
            return smile;
        }

        else if (lAct === "smile" && eyeAct === "blink") {
            console.log("Blink & SMILED")
            text = "Blinked and Smile"
            return blinksmile;
        }

        else {
            console.log("Neutral")
            text = "Neutral"
            return neutral;
        }

    };

    return (<div className="image-container">
        <h1 className="gradient__text">Facial Expressions</h1>
        <div className="image-wrapper" >
            <img src={GetImageSource()} alt="Emotion Image" className="emotion-image" />
        </div>
        <h2 className="text">{text}</h2>
    </div>
    );

};

export default ImageComponent;