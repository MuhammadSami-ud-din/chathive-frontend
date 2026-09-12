import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

export default function Call() {
    const { userInfo , CallStatus , setCallStatus , incomingCaller, setIncomingCaller , PendingOffer, setPendingOffer } = useOutletContext();


    // const [CallStatus, setCallStatus] = useState('idle');
    
    const navigate = useNavigate();
    const { id } = useParams(); // Target user ID from route

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const localStream = useRef(null);
    const peerConnnection = useRef(null);
    const iceCandidatesQueue = useRef([]);

    const currentUserId = userInfo?.id || userInfo?._id;

    const StartCamera = async () => {
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

    const CreatePeerConnection = (targetUserId) => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStream.current);
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

        peerConnnection.current = pc;
        return pc;
    };

    const processQueuedIceCandidates = async () => {
        if (!peerConnnection.current) return;
        while (iceCandidatesQueue.current.length > 0) {
            const candidate = iceCandidatesQueue.current.shift();
            try {
                await peerConnnection.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (error) {
                console.error('Error processing queued ICE candidate:', error);
            }
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleIncomingCall = ({ offer, from }) => {
            console.log("Incoming Call Event Received from:", from);
            setIncomingCaller(from);
            setPendingOffer(offer);
            setCallStatus('Incoming');
        };

        const handleCallAnswered = async ({ answer }) => {
            console.log("Call Answered Event Received");
            if (peerConnnection.current) {
                await peerConnnection.current.setRemoteDescription(new RTCSessionDescription(answer));
                await processQueuedIceCandidates();
                setCallStatus('Answered');
            }
        };

        const handleIceCandidate = async ({ candidate }) => {
            if (peerConnnection.current && peerConnnection.current.remoteDescription) {
                try {
                    await peerConnnection.current.addIceCandidate(new RTCIceCandidate(candidate));
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

        socket.on('incoming_call', handleIncomingCall);
        socket.on('call_answered', handleCallAnswered);
        socket.on('ice_candidate', handleIceCandidate);
        socket.on('call_ended', handleCallEnded);

        return () => {
            socket.off('incoming_call', handleIncomingCall);
            socket.off('call_answered', handleCallAnswered);
            socket.off('ice_candidate', handleIceCandidate);
            socket.off('call_ended', handleCallEnded);
        };
    }, []);

    useEffect(()=>{
 const makeCall = async () => {
        if (!id) {
            alert("No recipient ID provided in route params.");
            return;
        }
        setCallStatus('Calling');

        await StartCamera();

        const pc = CreatePeerConnection(id);
        const offer = await pc.createOffer();

        await pc.setLocalDescription(offer);

        socket.emit('call_user', {
            receiverId: String(id),
            offer,
            callerInfo: {
                id: currentUserId,
                username: userInfo?.username || userInfo?.name || 'Unknown User',
                avatar : userInfo?.avatar
            }
        });
    };
    makeCall();
    })

   

    const AnswerCall = async () => {
        const targetId = id || incomingCaller?.id || incomingCaller?._id || incomingCaller?.userId;
        if (!targetId || !PendingOffer) return;

        setCallStatus('Answered');

        await StartCamera();

        const pc = CreatePeerConnection(targetId);

        await pc.setRemoteDescription(new RTCSessionDescription(PendingOffer));
        
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        await processQueuedIceCandidates();

        socket.emit('answer_call', {
            targetUserId: String(targetId),
            answer
        });
    };

    const endCall = () => {
        const targetId = id || incomingCaller?.id || incomingCaller?._id || incomingCaller?.userId;
        if (targetId) {
            socket.emit('end_call', { targetUserId: String(targetId) });
        }
        cleanupCall();
    };

    const cleanupCall = () => {
        if (peerConnnection.current) {
            peerConnnection.current.close();
            peerConnnection.current = null;
        }

        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => track.stop());
            localStream.current = null;
        }

        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

        iceCandidatesQueue.current = [];
        setCallStatus('idle');
        setIncomingCaller(null);
        setPendingOffer(null);
    };

    
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>WebRTC Video Call</h2>
            <p>Your User ID: <strong>{currentUserId}</strong></p>

            <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <div>
                    <h4>My Video</h4>
                    <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '300px', height: '200px', backgroundColor: '#000', borderRadius: '8px' }} />
                </div>
                <div>
                    <h4>Remote Video</h4>
                    <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px', height: '200px', backgroundColor: '#000', borderRadius: '8px' }} />
                </div>
            </div>

            {/* {CallStatus === 'idle' && (
                <button onClick={makeCall} style={{ padding: '8px 15px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Start Call
                </button>
            )} */}

            {CallStatus === 'Calling' && (
                <div>
                    <p>Calling {id}...</p>
                    <button onClick={endCall} style={{ padding: '8px 15px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Cancel Call
                    </button>
                </div>
            )}

            {CallStatus === 'Incoming' && (
                <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', maxWidth: '350px' }}>
                    <p style={{ margin: '0 0 10px 0' }}>Incoming call from: <strong>{incomingCaller?.username || incomingCaller?.id}</strong></p>
                    <button onClick={AnswerCall} style={{ padding: '8px 15px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', marginRight: '10px', cursor: 'pointer' }}>
                        Accept
                    </button>
                    <button onClick={endCall} style={{ padding: '8px 15px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Reject
                    </button>
                </div>
            )}

            {CallStatus === 'Answered' && (
                <div>
                    <button onClick={endCall} style={{ padding: '8px 15px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        End Call
                    </button>
                </div>
            )}
        </div>
    );
}