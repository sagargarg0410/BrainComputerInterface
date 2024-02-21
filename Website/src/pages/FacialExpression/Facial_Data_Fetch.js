var WebSocket = require('isomorphic-ws').default;
    
let eyeAct, uAct, uPow, lAct, lPow 

class Cortex {
    constructor (user, socketUrl) {
        // create socket
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
        this.socket = new WebSocket(socketUrl)

        // read user infor
        this.user = user
        this.isHeadsetConnected = false

    }

    queryHeadsetId() {
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
    
            socket.on('message', (data) => {
                try {
                    if(JSON.parse(data)['id']==QUERY_HEADSET_ID){
                        if(JSON.parse(data)['result'].length > 0){
                            JSON.parse(data)['result'].forEach(headset => {
                                if (headset['status'] === 'connected') {
                                    this.isHeadsetConnected = true;
                                }
                            });
                            resolve(JSON.parse(data))
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

    requestAccess(){
        let socket = this.socket
        let user = this.user
        return new Promise(function(resolve, reject){
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

            socket.addEventListener('message', (data)=>{
                try {
                    if(JSON.parse(data)['id']==REQUEST_ACCESS_ID){
                        resolve(data)
                    }
                } catch (error) {}
            })
        })
    }

    authorize(){
        let socket = this.socket
        let user = this.user
        return new Promise(function(resolve, reject){
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
            socket.on('message', (data)=>{
                try {
                    if(JSON.parse(data)['id']==AUTHORIZE_ID){
                        let cortexToken = JSON.parse(data)['result']['cortexToken']
                        resolve(cortexToken)
                        // Call controlDevice("refresh") when authorization is successful
                        this.refreshHeadsetList();
                    }
                } catch (error) {}
            })
        })
    }

    controlDevice(headsetId){
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
        return new Promise(function(resolve, reject){
            socket.send(JSON.stringify(controlDeviceRequest));
            console.log('control device request: ', controlDeviceRequest)
            socket.on('message', (data)=>{
                try {
                    let response = JSON.parse(data);
                    if(response['id'] == CONTROL_DEVICE_ID){
                        if(response.error) {
                            console.log(response.error.message);
                            setTimeout(() => {
                                socket.send(JSON.stringify(controlDeviceRequest));
                            }, 10000);
                        } else {
                            resolve(response);
                        }
                    }
                } catch (error) {}
            })
        }) 
    }

    createSession(authToken, headsetId) {//Needed
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

                    socket.on('message', (data) => {
                        let parsedData = JSON.parse(data);
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

    subRequest(stream, authToken, sessionId){//Needed
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
        socket.on('message', (data)=>{
            try {
                   // console.log('\n\nData Fetched -------------------------------------------------------->')
                  //  console.log(JSON.parse(data)['fac'])
                    
                    eyeAct = JSON.parse(data)['fac'][0]
                    uAct = JSON.parse(data)['fac'][1]
                    uPow = JSON.parse(data)['fac'][2]
                    lAct = JSON.parse(data)['fac'][3]
                    lPow = JSON.parse(data)['fac'][4]
                    
     
            } catch (error) {}
        })
    }

    /**
     * - query headset infor
     * - connect to headset with control device request
     * - authentication and get back auth token
     * - create session and get back session id
     */
    async querySessionInfo(){//Needed
        let qhResult = ""
        let headsetId = ""
        await this.queryHeadsetId().then((result)=>{qhResult = result})
        this.qhResult = qhResult
        this.headsetId = qhResult['result'][0]['id']
        let ctResult=""
        await this.controlDevice(this.headsetId).then((result)=>{ctResult=result})
        this.ctResult = ctResult
        console.log(ctResult)

        let authToken=""
        await this.authorize().then((auth)=>{authToken = auth})
        this.authToken = authToken

        let sessionId = ""
        await this.createSession(authToken, this.headsetId).then((result)=>{sessionId=result})
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

    /**
     * - check if user logined
     * - check if app is granted for access
     * - query session info to prepare for sub and train
     */
    async checkGrantAccessAndQuerySessionInfo(){//Needed
        let requestAccessResult = ""
        await this.requestAccess().then((result)=>{requestAccessResult=result})

        let accessGranted = JSON.parse(requestAccessResult)
    
        // check if user is logged in CortexUI
        if ("error" in accessGranted){
            console.log('You must login on CortexUI before request for grant access then rerun')
            throw new Error('You must login on CortexUI before request for grant access')
        }else{
            console.log(accessGranted['result']['message'])
            // console.log(accessGranted['result'])
            if(accessGranted['result']['accessGranted']){
                await this.querySessionInfo()
            }
            else{
                console.log('You must accept access request from this app on CortexUI then rerun')
                throw new Error('You must accept access request from this app on CortexUI')
            }
        }   
    }


    /**
     * 
     * - check login and grant access
     * - subcribe for stream
     * - logout data stream to console or file
     */
    sub(streams){
        console.log("Logged");
        
        this.socket.addEventListener('open',async ()=>{
            await this.checkGrantAccessAndQuerySessionInfo()
            this.subRequest(streams, this.authToken, this.sessionId)
            this.socket.addEventListener('message', (data)=>{
                
                // log stream data to file or console here
                // Create Function To return Value
                console.log("Logged1");
                console.log("\n\n\n")
            })
        })
    }

    
    geteyeAction() {
        console.log("Eyes : ");
        return eyeAct;
    }

    getuAct() {
        console.log("UpperFace : ");
        return uAct;
    }

    getlAct() {
        console.log("LowerFace : ");
        return lAct;
    }

}

module.exports = Cortex;