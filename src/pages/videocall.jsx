import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';

// STUN Servers Google ke free public servers hain
// Inka kaam sirf dono browsers ka public IP address dhoond kar WebRTC connection establish karwana hota hai.

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

export default function CallTest({ currentUserId }) {
    // 1. States UI tracking ke liye
    const [targetUserId, setTargetUserId] = useState('');
    const [callState, setCallState] = useState('idle'); // Options: 'idle' | 'incoming' | 'connected'
    const [incomingCaller, setIncomingCaller] = useState(null);
    const [pendingOffer, setPendingOffer] = useState(null);

    // 2. HTML Video elements reference
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // 3. WebRTC Streams aur PeerConnection instance hold karne ke liye References
    const peerConnection = useRef(null);
    const localStream = useRef(null);

    // -------------------------------------------------------------
    // HELPER 1: Camera aur Mic access karna
    // -------------------------------------------------------------
    const startCamera = async () => {
        try {
            // Browser se Camera aur Audio permission maangte hain
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStream.current = stream;

            // Apne video element par apni stream dikhate hain
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            return stream;
        } catch (error) {
            console.error("Camera error:", error);
        }
    };

    // -------------------------------------------------------------
    // HELPER 2: WebRTC Peer Connection Initialize Karna
    // -------------------------------------------------------------
    const createPeerConnection = (targetId) => {
        // RTCPeerConnection Object create hota hai
        const pc = new RTCPeerConnection(ICE_SERVERS);

        // A. Apni local video/audio tracks ko connection ke sath attach karte hain
        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStream.current);
            });
        }

        // B. Jab dusre bande (Remote User) ki video receive ho, usko Remote Video element par dikhao
        pc.ontrack = (event) => {
            if (remoteVideoRef.current && event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        // C. Network Candidates (ICE Candidates) generate hote hain to socket ke throw bhejo
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice_candidate', {
                    targetUserId: targetId,
                    candidate: event.candidate
                });
            }
        };

        peerConnection.current = pc;
        return pc;
    };

    // -------------------------------------------------------------
    // SOCKET LISTENERS (Backend se aane wale signals)
    // -------------------------------------------------------------
    useEffect(() => {
        if (!socket) return;

        // Signal 1: Call Aa rahi hai
        socket.on('incoming_call', ({ offer, from }) => {
            setIncomingCaller(from);
            setPendingOffer(offer);
            setCallState('incoming');
        });

        // Signal 2: Call Accept Ho gayi (Caller side receive karega)
        socket.on('call_answered', async ({ answer }) => {
            if (peerConnection.current) {
                // Receiver ka Answer SDP save kar liya
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
                setCallState('connected');
            }
        });

        // Signal 3: Continuous Network route info sync
        socket.on('ice_candidate', async ({ candidate }) => {
            try {
                if (peerConnection.current && peerConnection.current.remoteDescription) {
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (err) {
                console.error("ICE Candidate Error", err);
            }
        });

        // Signal 4: Call End
        socket.on('call_ended', () => {
            cleanupCall();
        });

        return () => {
            socket.off('incoming_call');
            socket.off('call_answered');
            socket.off('ice_candidate');
            socket.off('call_ended');
        };
    }, [socket]);

    // -------------------------------------------------------------
    // ACTION 1: CALLING (User A Button Event)
    // -------------------------------------------------------------
    const makeCall = async () => {
        if (!targetUserId) return alert("Pehle Target User ID likhein!");
        setCallState('calling');

        // 1. Local Camera turn ON
        await startCamera();

        // 2. Peer Connection Ready
        const pc = createPeerConnection(targetUserId);

        // 3. WebRTC Offer Generate karna
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer); // Apni Offer details save karo

        // 4. Socket se target user ko Offer bhej do
        socket.emit('call_user', {
            receiverUserId: targetUserId,
            offer: offer,
            callerInfo: { userId: currentUserId }
        });
    };

    // -------------------------------------------------------------
    // ACTION 2: ACCEPTING CALL (User B Button Event)
    // -------------------------------------------------------------
    const acceptCall = async () => {
        setCallState('connected');

        // 1. Receiver ka apna Camera turn ON
        await startCamera();

        // 2. Peer Connection Ready (Caller ID ke sath)
        const pc = createPeerConnection(incomingCaller.userId);

        // 3. Jo Offer Caller se aaya tha use save karo
        await pc.setRemoteDescription(new RTCSessionDescription(pendingOffer));

        // 4. WebRTC Answer generate karo
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // 5. Answer socket ke zariye Caller ko bhej do
        socket.emit('answer_call', {
            targetUserId: incomingCaller.userId,
            answer: answer
        });
    };

    // -------------------------------------------------------------
    // ACTION 3: HANG UP / CLEANUP
    // -------------------------------------------------------------
    const endCall = () => {
        const targetId = targetUserId || incomingCaller?.userId;
        if (targetId) {
            socket.emit('end_call', { targetUserId: targetId });
        }
        cleanupCall();
    };

    const cleanupCall = () => {
        // Active Peer Connection Close karo
        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        // Camera aur Mic Off karo
        if (localStream.current) {
            localStream.current.getTracks().forEach(track => track.stop());
            localStream.current = null;
        }

        // Video UI reset karo
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

        setCallState('idle');
        setIncomingCaller(null);
        setPendingOffer(null);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>WebRTC Video Call Basic Test</h2>
            <p>Your User ID: <strong>{currentUserId}</strong></p>

            {/* Video Layout */}
            <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                <div>
                    <h4>My Video</h4>
                    <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '300px', height: '200px', backgroundColor: '#000' }} />
                </div>
                <div>
                    <h4>Remote Video</h4>
                    <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '300px', height: '200px', backgroundColor: '#000' }} />
                </div>
            </div>

            {/* Controls */}
            {callState === 'idle' && (
                <div>
                    <input 
                        type="text" 
                        placeholder="Target User ID" 
                        value={targetUserId} 
                        onChange={(e) => setTargetUserId(e.target.value)}
                        style={{ padding: '8px', marginRight: '10px' }}
                    />
                    <button onClick={makeCall} style={{ padding: '8px 15px', backgroundColor: 'green', color: '#fff', border: 'none' }}>Call</button>
                </div>
            )}

            {callState === 'calling' && (
                <div>
                    <p>Calling {targetUserId}...</p>
                    <button onClick={endCall} style={{ padding: '8px 15px', backgroundColor: 'red', color: '#fff', border: 'none' }}>Cancel</button>
                </div>
            )}

            {callState === 'incoming' && (
                <div style={{ backgroundColor: '#ffeb3b', padding: '10px', borderRadius: '5px' }}>
                    <p>Incoming call from: <strong>{incomingCaller?.userId}</strong></p>
                    <button onClick={acceptCall} style={{ padding: '8px 15px', backgroundColor: 'green', color: '#fff', border: 'none', marginRight: '10px' }}>Accept</button>
                    <button onClick={endCall} style={{ padding: '8px 15px', backgroundColor: 'red', color: '#fff', border: 'none' }}>Reject</button>
                </div>
            )}

            {callState === 'connected' && (
                <div>
                    <button onClick={endCall} style={{ padding: '8px 15px', backgroundColor: 'red', color: '#fff', border: 'none' }}>End Call</button>
                </div>
            )}
        </div>
    );
}