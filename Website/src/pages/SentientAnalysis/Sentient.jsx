import React, { useState, useEffect, useRef } from 'react';
import './Sentient.css';



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

class HorizontalBar extends React.Component {
    render() {
        const { label, value, maxValue, color, emoji } = this.props;
        const barWidth = (value / maxValue) * 100 + "%";
        const percentage = (value / maxValue) * 100 + "%";

        console.log(this.props)
        return (
            <div className="horizontal-bar">
                <span className="label">{label}</span>
                <div className="bar" style={{ width: barWidth, backgroundColor: color }}>
                    <span className='percentage'>{percentage}</span>
                </div>
                <span className="emoji">{emoji}</span>
            </div>
        );
    }
}

class Cortex {
    constructor(user, socketUrl, setEng, setRel, setexc, setStr, setFoc) {
        // create socket
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
        this.socket = new WebSocket(socketUrl)

        // read user infor
        this.user = user
        this.setEng = setEng
        this.setexc = setexc
        this.setRel = setRel
        this.setStr = setStr
        this.setFoc = setFoc

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
                //console.log("Data is Streaming Successfully")

                //if (JSON.parse(event.data)['met'][0])
                this.setEng(JSON.parse(event.data)['met'][3])
                console.log("Engagement : ")
                console.log(JSON.parse(event.data)['met'][3])

                //if (JSON.parse(event.data)['met'][2])
                this.setexc(JSON.parse(event.data)['met'][5])
                console.log("Excitement : ")
                console.log(JSON.parse(event.data)['met'][5])

                //if (JSON.parse(event.data)['met'][5])
                this.setStr(JSON.parse(event.data)['met'][8])
                console.log("Stress : ")
                console.log(JSON.parse(event.data)['met'][8])

                //if (JSON.parse(event.data)['met'][7])
                this.setRel(JSON.parse(event.data)['met'][10])
                console.log("Relaxation : ")
                console.log(JSON.parse(event.data)['met'][10])

                //if (JSON.parse(event.data)['met'][11])
                this.setFoc(JSON.parse(event.data)['met'][12])
                console.log("Focus/Interest : ")
                console.log(JSON.parse(event.data)['met'][12])

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

const SentientData = () => {
    const [exc, setexc] = useState(0), // Excitement
        [str, setStr] = useState(0), // Stress
        [foc, setFoc] = useState(0), // Focus
        [eng, setEng] = useState(0), // Engagement
        [rel, setRel] = useState(0),  // Relaxed
        cortex = useRef(),
        streams = useRef(['met'])

    useEffect(() => {
        cortex.current = new Cortex(user, socketUrl, setEng, setRel, setexc, setStr, setFoc)

        cortex.current.sub(streams.current)
    }, [])


    return (
        <div className="App">
            <h1> Sentient Analysis: Understanding Emotions </h1> <br />
            { /*<h3>Exploring the depth of human emotions through sentiment analysis offers valuable insights into Prosthetics behavior and social responses. Dive deep into the subtleties of feeling.</h3> */}
            <div>
                <HorizontalBar label="Focus" value={Math.round(foc * 100)} maxValue={100} color="OrangeRed" emoji="🧐" />
                <HorizontalBar label="Engagement" value={Math.round(eng * 100)} maxValue={100} color="Fuchsia" emoji="😃" />
                <HorizontalBar label="Relaxed" value={Math.round(rel * 100)} maxValue={100} color="#ffff66" emoji="😎" />
                <HorizontalBar label="Excitement" value={Math.round(exc * 100)} maxValue={100} color="#66ff33" emoji="🤩" />
                <HorizontalBar label="Stress" value={Math.round(str * 100)} maxValue={100} color="Crimson" emoji="🥵" />
            </div>
        </div>
    );

}



export default SentientData;