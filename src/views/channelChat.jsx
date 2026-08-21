
import { useEffect, useState, useRef } from "react";
import React from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom"

const Api_URL = import.meta.env.VITE_API_URL;
import { socket } from "../socket.js";


const CleanDate = (date) => {
    if (!date) return "";

    const strDate = typeof date === 'string' ? date : String(date);
    const safeString = strDate.replace(' ', 'T');
    const parsed = new Date(safeString);


    if (isNaN(parsed.getTime())) return "";

    return parsed.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};


const CleanTime = (date) => {
    if (!date) return "";
    const strTIme = typeof date === 'string' ? date : String(date);
    const safeString = strTIme.replace(' ', 'T');
    const parse = new Date(safeString)
    if (isNaN(parse.getTime())) return "";

    return parse.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};



export default function ChannelChat() {

    const { channel_id } = useParams();
    const [data, setData] = useState({ success: false, data: [], my_id: '' });
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
    const [isFocused, setIsFocused] = useState(false);
    const [showMessage, setShowMessage] = useState({ text: '', type: '' });
    const channels = useOutletContext();
    const messageEndRef = useRef(null)


    const ChannelInfo = channels.find((channel) => Number(channel.channel_id) === Number(channel_id));




    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [data.data])



    useEffect(() => {


        socket.emit('join_channel', channel_id);

        const handleReconnect = () => {
            socket.emit('join_channel', channel_id);
        };

        socket.on('connect', handleReconnect);

        return () => {
            socket.off('connect', handleReconnect);
        };
    }, [channel_id]);


  useEffect(() => {
    const handleNewMessage = (msg) => {
        if (String(msg.channel_id) === String(channel_id)) {
            setData((prev) => {
                const alreadyExists = prev.data.some((m) => String(m._id) === String(msg._id));
                if (alreadyExists) return prev;
                return { ...prev, data: [...prev.data, msg] };
            });
        }
    };

    const handleError = (err) => {
        console.log('socket error:', err.message);
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('new_error', handleError);

    return () => {
        socket.off('newMessage', handleNewMessage);
        socket.off('new_error', handleError);
    };
}, [channel_id]);



    useEffect(() => {
        const url = `${Api_URL}/channels/${channel_id}/messages`
        let ignore = false;
        const fetchData = async () => {
            try {

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                        "Content-Type": "application/json"
                    }
                });

                const result = await response.json();
                console.log("SERVER DATA RETURNED:", result);

                if (!response.ok) {
                    throw new Error(result.error || 'no servers found')
                }
                if (ignore) return;

                console.log(result)
                setShowMessage({ text: result.message || 'Fetch Successful', type: 'success' });
                setData(result)



            }
            catch (error) {

                console.log(error.message)
                setShowMessage({ text: error.message || 'Not Authorized', type: 'error' });
                if (error.message === 'Invalid token') {
                    navigate('/login');
                }

            }

        }
        if (channel_id) fetchData()


            return () => {
        ignore = true;
    }; 

    }, [channel_id, navigate])


    async function SendMsg() {
    const url = `${Api_URL}/channels/${channel_id}/messages`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 'msg_content': message })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Error');
        }

       setData((prev) => {
            const alreadyExists = prev.data.some((m) => String(m._id) === String(result.data._id));
            if (alreadyExists) return prev;   // socket already isse add kar chuka hai
            return {
                ...prev,
                data: [...prev.data, result.data]
            };
        });

        setMessage('');

    } catch (error) {
        console.log(error.message);
        setShowMessage({ text: error.message || 'Not Authorized', type: 'error' });
    }
}


    const handleKeyDown = (e) => {

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            if (message.trim()) {
                SendMsg();
            }
        }
    };






    return (
        <>
            <div className="flex flex-col overflow-hidden w-full h-full">

                {/* upper bar to show Channel name and search bar to search the chats in the channel whcih will IA come later  */}
                <div className="flex items-center border-b border-b-neutral-800 h-13 pl-3 text-sm gap-x-3 shrink-0">
                    <span className="h-8 w-8 rounded-full bg-zinc-700/50 flex justify-center items-center text-lg text-yellow-200/50">{ChannelInfo?.avatar ? (
                        <img src={ChannelInfo.avatar} alt="avatar" className="h-full w-full object-cover rounded-full" />
                    ) : (
                        ChannelInfo?.channel_name ? ChannelInfo.channel_name.charAt(0).toUpperCase() : '?'
                    )}</span>
                    <span className="text-zinc-100">{ChannelInfo?.channel_name}</span>

                    {showMessage.text && (

                        <div className={`absolute right-4 animate-auto-glide p-2 text-center text-sm font-medium rounded-xl transition-all duration-500 ease-in-out transform ${showMessage.type === 'success'
                            ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-200 translate-x-0 opacity-100 pointer-events-auto'
                            : 'bg-red-500/20 border border-red-500 text-red-200 '
                            }`}
                            onAnimationEnd={() => setShowMessage({ text: '', type: '' })}>
                            {showMessage.text}
                        </div>
                    )}




                </div>



                <div className=" flex flex-1 w-full min-h-0 overflow-hidden">

                    {/* middle area */}
                    <div className="flex   flex-1  min-h-0 min-w-50 overflow-hidden flex-col  ">

                        {/* scrollable chat area */}
                        <div className=" flex flex-col  w-full min-h-0 flex-1 overflow-y-auto overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-w-50 p-2 mb-2 space-y-3 ">


                            {/* {Server Info at the begining} */}
                            <div className=" h-100 shrink-0 flex flex-col justify-center items-center  ">
                                <span className="h-25 w-25 rounded-full border-5  border-zinc-800 bg-zinc-900 flex justify-center items-center text-6xl text-yellow-200/50 mb-4">{ChannelInfo?.avatar ? (
                                    <img src={ChannelInfo?.avatar} alt="avatar" className="h-full w-full object-cover rounded-full" />
                                ) : (
                                    ChannelInfo?.channel_name ? ChannelInfo.channel_name.charAt(0).toUpperCase() : '?'
                                )}</span>

                                <span className="text-4xl text-zinc-500 font-bold text-center">{ChannelInfo?.channel_name}</span>
                                <span className="text-zinc-500 ">{ChannelInfo?.description}</span>
                                <span className="text-zinc-500 ">Channel Created on: {CleanDate(ChannelInfo?.created_at)}</span>
                                <div className="p-1 px-3 mt-10 flex  rounded-3xl  bg-zinc-800  text-sm text-yellow-200/50 text-center ">This is the Beginning of messages history In  " {ChannelInfo?.channel_name} "</div>
                            </div>



                            {data.data.map((msg, index) => {

                                const isMe = String(msg.sender_id) === String(data.my_id)
                                const prevMsg_date = index > 0 ? CleanDate(data.data[index - 1].Date) : null;

                                const currentDate = CleanDate(msg.Date);

                                const isSame = prevMsg_date === currentDate;


                                return (

                                    <React.Fragment key={msg._id || index}>
                                        {!isSame && (
                                            <div className=' flex justify-center items-center my-5 p-2'>
                                                <span className='rounded-3xl font-semibold text-sm text-shadow-mist-700/50 bg-teal-900/50  p-1 px-3 text-center '> {currentDate} </span>
                                            </div>)}


                                        <div className={`flex  w-full  items-start ${isMe ? 'justify-end ' : 'justify-start '} `} >
                                           

                                            <div className={`  pb-1 px-1 flex flex-col rounded-xl text-sm flex-none  max-w-[70%] shrink-0 break-words shadow-sm leading-relaxed ${isMe ? 'bg-green-700/50 ' : 'bg-zinc-700/70 '} `}>
                                              
                                               {!isMe &&(
                                                 <div className={`rounded-t-xl pl-2 pt-1 pr-7  font-bold  text-amber-200 `}>{msg?.sender?.username}</div>
                                               )}
                                                <div className="px-2 pt-1 text-sm flex-none  shrink-0 break-words shadow-sm leading-relaxed">
                                                {msg.content}
                                                <span className="float-right ml-2 mt-3 text-[10px] text-zinc-300 opacity-70 select-none leading-none">
                                                    {CleanTime(msg.Date)}
                                                </span>
                                                </div>

                                            </div>
                                        </div>



                                    </React.Fragment>


                                )

                            }
                            )}

                            <div ref={messageEndRef} />
                        </div>


                        {/* input field */}
                        <div className={`flex w-full p-1 pl-2 mb-2 shrink-0 rounded-3xl items-center ${isFocused ? 'border border-green-500/50 bg-zinc-900/50' : 'border border-zinc-700 bg-transparent'}`}>
                            <textarea
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                rows={'2'}
                                className="flex-1 h-6 border-none outline-none resize-none bg-transparent w-full overflow-hidden ml-2"
                                onKeyDown={handleKeyDown}
                                value={message}

                                onChange={(e) => {
                                    setMessage(e.target.value)
                                }} />

                            <button className="h-7 w-15 bg-green-400/50 mr-2 ml-2 rounded-2xl transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:hover:bg-zinc-800" onClick={SendMsg} disabled={!message.trim()}>Send</button>
                        </div>

                    </div>

                    {/* Friends information profile */}
                    {/* <div className="flex border border-zinc-700/50 flex-col m-2  rounded-2xl w-80 shrink-0  overflow-y-auto">
                        <div className=" relative  flex-1 w-full bg-gradient-to-r from-black-300  to-emerald-900 p-4">
                            <span className="absolute peer rounded-full border-4 border-zinc-800 h-20 w-20 -bottom-[23%] bg-zinc-900 flex justify-center items-center text-4xl text-yellow-100/50">
                                {data.user?.avatar ? (
                                    <img src={data.user.avatar} alt="avatar" className="h-full w-full object-cover rounded-full " />
                                ) : (
                                    data.user?.username ? data.user.username.charAt(0).toUpperCase() : '?'
                                )}
                            </span>
                            <span className="absolute bg-black h-20 w-20 -bottom-[23%] rounded-full opacity-0 transition-opacity duration-300 peer-hover:opacity-10 pointer-events-none"></span>
                        </div>
                        <div className=" flex-4 w-full bg-zinc-900/80 pt-12 px-6">
                            <p className="text-lg text-zinc-300">{data.user.username}</p>
                            <p className="text-sm text-zinc-500">{data.user.email}</p>
                            <p className="text-xm text-zinc-400 mt-5">Member Since:</p>
                            <p className="text-sm text-zinc-500 ">
                                {CleanDate(data.user.created_at)}
                            </p>


                        </div>





                    </div> */}



                </div>

            </div>

        </>
    )
}