import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { useOutletContext } from "react-router-dom";

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
}



export default function Call() {
    const { userInfo } = useOutletContext();
    const [receiverId, setReceiverId] = useState('');
    const [incomingCaller, setIncomingCaller] = useState(null);
    const [CallStatus, setCallStatus] = useState('idle');
    const [PendingOffer, setPendingOffer] = useState(null);



    console.log(userInfo || 'bahar')



    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const localStream = useRef(null);
    const peerConnnection = useRef(null);


    const StartCamera = async () => {

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            localStream.current = stream;

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            return stream;
        }
        catch (error) {
            console.log('error is ', error)
        }

    }

    const CreatePeerConnection = async () => {
        const pc = new RTCPeerConnection(ICE_SERVERS);

        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => {
                pc.addTrack(track, localStream.current)
            });

        }

        pc.onTrack = (event) => {
            if (remoteVideoRef.current && event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        }

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice_candidate', {
                    targetUserId: receiverId,
                    candidate: event.candidate
                })

            }
        }

        peerConnnection.current = pc;
        return pc;

    }


    //Backend Socket

    useEffect(() => {
        if (!socket) return;

        socket.on('incoming_call', ({ offer, from }) => {
            setIncomingCaller(from);
            setPendingOffer(offer);
            setCallStatus('Incoming');

        })




        socket.on('call_answered', async ({ answer }) => {
            if (peerConnnection.current) {
                await peerConnnection.current.setRemoteDescription(new RTCSessionDescription(answer));
                setCallStatus('Answered');
            }
        })


        socket.on('ice_candidate', async ({ candidate }) => {
            try{
                if (peerConnnection.current && peerConnnection.current.remoteDescription) {
                await peerConnnection.current.addIceCandidate(new RTCIceCandidate(candidate));
                setCallStatus('Answered');
            }
            }
            catch(error){
                console.log('Ice candidate error' , error);
            }
        })

    })






    return (
        <>
            <div className="w-full h-full">
                <video
                    ref={localVideoRef}
                    className="w-100 rounded-xl"
                    autoPlay
                    playsInline
                    muted
                />
                <button onClick={StartCamera} className="h-10 w-30" >Start Camera</button>
                {/* <button onClick={()=>{
                localVideoRef.current = null;
            }} className="h-10 w-30" >Stop Camera</button> */}

            </div>

        </>
    )

}