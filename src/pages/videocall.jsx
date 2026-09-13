import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

export default function Call() {
    const { userInfo } = useOutletContext();
    const location = useLocation();
    // const [incomingCaller, setIncomingCaller] = useState(null);
    // const [PendingOffer, setPendingOffer] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams(); // Target user ID from route

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localStream = useRef(null);
    const peerConnection = useRef(null);
    const iceCandidatesQueue = useRef([]);

    const offerFromRouter = location.state?.offer;
    const callerInfo = location.state?.from;
    const targetId = id || callerInfo?.id;

    const currentUserId = userInfo?.id || userInfo?._id;

    const [CallStatus, setCallStatus] = useState(offerFromRouter ? 'Incoming' : 'Calling');
    const callInitialized = useRef(false);
    const hasNavigatedBack = useRef(false);
    const userInfoRef = useRef(userInfo);
    useEffect(() => {
        userInfoRef.current = userInfo;
    }, [userInfo]);



    const StartCamera = async () => {
        if (localStream.current) return localStream.current;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStream.current = stream;

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            return stream;
        } catch (error) {
            console.error('Camera access error:', error);
            alert('Failed to access camera/microphone');
        }
    };

    const teardownConnections = useCallback(() => {
        if (peerConnection.current) {
            peerConnection.current.ontrack = null;
            peerConnection.current.onicecandidate = null;
            peerConnection.current.oniceconnectionstatechange = null;
            peerConnection.current.close();
            peerConnection.current = null;
        }

        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => track.stop());
            localStream.current = null;
        }

        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

        iceCandidatesQueue.current = [];
    }, []);

    const cleanupCall = useCallback(() => {
        teardownConnections();
        setCallStatus('idle');

        if (!hasNavigatedBack.current) {
            hasNavigatedBack.current = true;
            navigate(-1);
        }
    }, [navigate, teardownConnections]);



    const processQueuedIceCandidates = useCallback(async () => {
        if (!peerConnection.current || !peerConnection.current.remoteDescription) return;

        while (iceCandidatesQueue.current.length > 0) {
            const candidate = iceCandidatesQueue.current.shift();
            try {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error('Error processing queued ICE candidate:', error);
            }
        }


    }, [])

    const CreatePeerConnection = useCallback((targetUserId, stream) => {
        if (peerConnection.current) return peerConnection.current;
        const pc = new RTCPeerConnection(ICE_SERVERS);

        if (stream) {
            stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream);
            });
        }

        pc.ontrack = (event) => {
            if (remoteVideoRef.current && event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        pc.onicecandidate = (event) => {
            if (event.candidate && targetUserId) {
                socket.emit('ice_candidate', {
                    targetUserId: String(targetUserId),
                    candidate: event.candidate
                });
            }
        };

        pc.oniceconnectionstatechange = () => {
            if (pc.iceConnectionState === 'failed') {
                if (targetId) socket.emit('end_call', { targetUserId: String(targetId) });
                cleanupCall();
            } else if (pc.iceConnectionState === 'disconnected') {
                setTimeout(() => {
                    if (pc.iceConnectionState === 'disconnected') {
                        if (targetId) socket.emit('end_call', { targetUserId: String(targetId) });
                        cleanupCall();
                    }
                }, 5000);
            }
        };

        peerConnection.current = pc;
        return pc;
    }, [cleanupCall, targetId])



    useEffect(() => {
        if (!socket) return;

        const handleCallAnswered = async ({ answer }) => {
            if (!peerConnection.current) return;
            console.log("Call Answered Event Received");
            if (peerConnection.current.signalingState === 'have-local-offer') {
                try {
                    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
                    await processQueuedIceCandidates();
                    setCallStatus('Answered');
                } catch (err) {
                    console.error("Failed to set remote description:", err);
                }
            } else {
                console.warn(`Cannot set remote answer in state: ${peerConnection.current.signalingState}`);
            }
        }


        const handleIceCandidate = async ({ candidate }) => {
            if (peerConnection.current && peerConnection.current.remoteDescription) {
                try {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (error) {
                    console.error('ICE candidate error:', error);
                }
            } else {
                iceCandidatesQueue.current.push(candidate);
            }
        };

        const handleCallEnded = () => {
            cleanupCall();

        };

        socket.on('call_answered', handleCallAnswered);
        socket.on('ice_candidate', handleIceCandidate);
        socket.on('call_ended', handleCallEnded);

        return () => {
            socket.off('call_answered', handleCallAnswered);
            socket.off('ice_candidate', handleIceCandidate);
            socket.off('call_ended', handleCallEnded);
        }


    }, [cleanupCall, navigate, processQueuedIceCandidates])

    useEffect(() => {

        if (callInitialized.current) return;
        callInitialized.current = true;
        let cancelled = false;

        const call = async () => {
            const stream = await StartCamera();
            if (!stream) return;


            if (cancelled) {

                stream.getTracks().forEach((track) => track.stop());
                if (localStream.current === stream) localStream.current = null;
                if (localVideoRef.current) localVideoRef.current.srcObject = null;
                return;
            }

            if (offerFromRouter) {


                const AnswerCall = async () => {

                    if (!targetId || !offerFromRouter) return;

                    setCallStatus('Answered');



                    const pc = CreatePeerConnection(targetId, stream);

                    await pc.setRemoteDescription(new RTCSessionDescription(offerFromRouter));

                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);

                    await processQueuedIceCandidates();

                    socket.emit('answer_call', {
                        targetUserId: String(targetId),
                        answer
                    });
                };
                AnswerCall();

            }
            else {


                const makeCall = async () => {
                    if (!id) {
                        alert("No recipient ID provided in route params.");
                        return;
                    }
                    setCallStatus('Calling');


                    const pc = CreatePeerConnection(id, stream);
                    const offer = await pc.createOffer();

                    await pc.setLocalDescription(offer);

                    socket.emit('call_user', {
                        receiverId: String(id),
                        offer,
                        callerInfo: {
                            id: currentUserId,
                            username: userInfoRef.current?.username || 'Unknown User',
                            avatar: userInfoRef.current?.avatar
                        }
                    });
                };
                makeCall();


            }



        }

        call();


        // return () => {

        //             cleanupCall();
        //         };
        return () => {
            cancelled = true;
            teardownConnections();
            callInitialized.current = false;
        };



    }, [CreatePeerConnection, offerFromRouter, id, targetId, currentUserId, processQueuedIceCandidates, cleanupCall, teardownConnections]);



    // const makeCall = async () => {
    //     if (!id) {
    //         alert("No recipient ID provided in route params.");
    //         return;
    //     }
    //     setCallStatus('Calling');

    //     await StartCamera();

    //     const pc = CreatePeerConnection(id);
    //     const offer = await pc.createOffer();

    //     await pc.setLocalDescription(offer);

    //     socket.emit('call_user', {
    //         receiverId: String(id),
    //         offer,
    //         callerInfo: {
    //             id: currentUserId,
    //             username: userInfo?.username || userInfo?.name || 'Unknown User',
    //             avatar: userInfo?.avatar
    //         }
    //     });
    // };

    // const AnswerCall = async () => {
    //     const targetId = id || incomingCaller?.id || incomingCaller?._id || incomingCaller?.userId;
    //     if (!targetId || !PendingOffer) return;

    //     setCallStatus('Answered');

    //     await StartCamera();

    //     const pc = CreatePeerConnection(targetId);

    //     await pc.setRemoteDescription(new RTCSessionDescription(PendingOffer));

    //     const answer = await pc.createAnswer();
    //     await pc.setLocalDescription(answer);

    //     await processQueuedIceCandidates();

    //     socket.emit('answer_call', {
    //         targetUserId: String(targetId),
    //         answer
    //     });
    // };


    const endCall = () => {

        if (targetId) {
            socket.emit('end_call', { targetUserId: String(targetId) });
        }
        cleanupCall();
    };















    return (
        <div className=" fixed inset-0 z-[110] h-screen w-screen bg-zinc-500">
         <div className="relative w-screen h-screen bg-zinc-900">
             <div className="text-center mt-4 absolute left-1/2 -translate-x-1/2 z-30 bg-zinc-800/20 backdrop-blur p-2 px-4 rounded-2xl"> 
             <h1 className="text-xl">{userInfo?.username}</h1>
          </div>

            
                <div>
                    {/* <h4>My Video</h4> */}
                    <video ref={localVideoRef} autoPlay playsInline muted  className="absolute bottom-4 right-4 rounded-xl bg-black h-49 w-65 z-20" />
                </div>
                <div className="w-full h-full">
                    {/* <h4>Remote Video</h4> */}
                    <video ref={remoteVideoRef} autoPlay playsInline  className="w-full h-full object-contain z-10" />
                </div>
        



            {CallStatus === 'Calling' && (
                <div  className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 flex flex-col justify-center items-center ">
                    <p className="animate-pulse">Calling {id}...</p>
                    <button onClick={endCall}  className="cursor-pointer rounded-full bg-red-500 px-8 py-3 font-semibold text-white shadow-xl transition hover:bg-red-600 active:scale-95 ">
                        Cancel Call
                    </button>
                </div>
            )}



            {CallStatus === 'Answered' && (
                <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 ">
                    <button onClick={endCall} className="cursor-pointer rounded-full bg-red-500 px-8 py-3 font-semibold text-white shadow-xl transition hover:bg-red-600 active:scale-95 ">
                        End Call
                    </button>
                </div>
            )}
         </div>
        </div>
    );
}