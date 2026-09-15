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
    const { id, name } = useParams(); // Target user ID from route

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localStream = useRef(null);
    const peerConnection = useRef(null);
    const iceCandidatesQueue = useRef([]);
    const [remoteVideoOff, setRemoteVideoOff] = useState(false)
    const remoteStreamRef = useRef(null);

    const offerFromRouter = location.state?.offer;
    const callerInfo = location.state?.from;
    const avatar = location.state?.avatar
    const targetId = id || callerInfo?.id;

    const currentUserId = userInfo?.id || userInfo?._id;

    const [CallStatus, setCallStatus] = useState(offerFromRouter ? 'Incoming' : 'Calling');
    const callInitialized = useRef(false);
    const hasNavigatedBack = useRef(false);
    const ringtoneRef = useRef(null)

    const userInfoRef = useRef(userInfo);
    useEffect(() => {
        userInfoRef.current = userInfo;
    }, [userInfo]);

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);



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

        remoteStreamRef.current = null;
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
            if (event.streams[0]) {
                remoteStreamRef.current = event.streams[0];
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
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





        return () => {
            cancelled = true;
            teardownConnections();
            callInitialized.current = false;
        };



    }, [CreatePeerConnection, offerFromRouter, id, targetId, currentUserId, processQueuedIceCandidates, cleanupCall, teardownConnections]);



    useEffect(() => {

        if (CallStatus === 'Calling') {
            ringtoneRef.current = new Audio('/ring.mp3');
            ringtoneRef.current.loop = true;
            ringtoneRef.current?.play().catch((err) => console.log('Autoplay blocked:', err));
        }


        if (CallStatus === 'Answered' || CallStatus === 'Ended' || CallStatus === 'Idle') {
            if (ringtoneRef.current) {
                ringtoneRef.current?.pause();
                ringtoneRef.current.currentTime = 0;
            }
        }

        return () => {
            if (ringtoneRef.current) {
                ringtoneRef.current?.pause();
                ringtoneRef.current.currentTime = 0;
            }
        };
    }, [CallStatus]);

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


    const audioToggle = () => {
        if (!localStream.current) return;
        const audioTrack = localStream.current.getAudioTracks()[0];

        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
            console.log(!audioTrack.enabled);
        }

    }

    const videoToggle = () => {
        if (!localStream.current) return;
        const videoTrack = localStream.current.getVideoTracks()[0];

        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoOff(!videoTrack.enabled);
            console.log(!videoTrack.enabled);


            if (targetId) {
                socket.emit('video_toggle', {
                    targetUserId: targetId,
                    videoOff: !videoTrack.enabled
                })
            }
        }

    }

    useEffect(() => {
        if (!remoteVideoOff && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
            remoteVideoRef.current.srcObject = remoteStreamRef.current;
            remoteVideoRef.current.play().catch((err) => {
                console.log('error in resuming', err);
            })
        }
        if (!isVideoOff && localVideoRef.current && localStream.current) {
            localVideoRef.current.srcObject = null;
            localVideoRef.current.srcObject = localStream.current;
            localVideoRef.current.play().catch((err) => {
                console.log('error in resuming', err);
            })
        }
    }, [isVideoOff, remoteVideoOff])


    useEffect(() => {
        if (!socket) return;

        const handleVideoToggle = (({ videoOff }) => {
            setRemoteVideoOff(videoOff)
        })
        socket.on('video_toggle', handleVideoToggle)

        return () => socket.off('video_toggle', handleVideoToggle);
    }, [])












    return (
        <div className=" fixed inset-0 z-[110] h-screen w-screen bg-zinc-500 ">
            <div className="relative w-screen h-screen bg-zinc-900">
                <div className="text-center mt-4 absolute left-1/2 -translate-x-1/2 z-30 bg-zinc-800/20 backdrop-blur p-2 px-4 rounded-2xl">
                    <h1 className="text-xl">{name}</h1>
                </div>


                <div>
                    {/* <h4>My Video</h4> */}
                    <video ref={localVideoRef} autoPlay playsInline muted className={`absolute bottom-4 right-4 rounded-xl bg-black h-49 w-65 z-[21] ${isVideoOff ? 'invisible' : 'visible'}`}/>
                    {isVideoOff && <div className="absolute bottom-4 right-4 rounded-xl bg-black h-49 w-65 z-[21] flex justify-center items-center"><img src={userInfo?.avatar} className=" w-30 h-30 rounded-full" /></div>
                    }
                </div>
                <div className="w-full h-full relative ">
                    {/* <h4>Remote Video</h4> */}
                    <video ref={remoteVideoRef} autoPlay playsInline className={` absolute w-full h-full object-contain z-10 ${remoteVideoOff ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
                    {remoteVideoOff && (<div className="absolute z-20 bg-black h-full w-full flex justify-center items-center "><img src={avatar} className=" h-50 w-50 rounded-full z-20 " /></div>)

                    }

                </div>




                {CallStatus === 'Calling' && (
                    <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 flex flex-col justify-center items-center ">
                        <p className="animate-pulse">Calling {id}...</p>
                        <button onClick={endCall} className="cursor-pointer rounded-full bg-red-500 px-8 py-3 font-semibold text-white shadow-xl transition hover:bg-red-600 active:scale-95 ">
                            Cancel Call
                        </button>
                    </div>
                )}



                {CallStatus === 'Answered' && (
                    <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 ">
                        <button onClick={endCall} className="cursor-pointer rounded-full bg-red-500 px-8 py-3 font-semibold text-white shadow-xl transition hover:bg-red-600 active:scale-95 ">
                            End Call
                        </button>
                        <button type="button" onClick={audioToggle} className="cursor-pointer rounded-full bg-red-500 px-8 py-3 font-semibold text-white shadow-xl transition hover:bg-red-600 active:scale-95 ">
                            {!isMuted ? (<div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="2" width="6" height="11" rx="3" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="22" />
                                <line x1="8" y1="22" x2="16" y2="22" />
                            </svg>
                            </div>) : (<div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <rect x="9" y="2" width="6" height="11" rx="3" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="22" />
                                <line x1="8" y1="22" x2="16" y2="22" />
                                <line x1="2" y1="2" x2="22" y2="22" stroke-width="2.5" />
                            </svg> </div>
                            )}
                        </button>
                        <button type="button" onClick={videoToggle} className="cursor-pointer rounded-full bg-red-500 px-8 py-3 font-semibold text-white shadow-xl transition hover:bg-red-600 active:scale-95 ">
                            {isVideoOff ? 'Video On' : 'Video Off'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}