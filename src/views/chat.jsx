
import { useEffect, useState, useRef } from "react";
import React from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query";

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






const DMmessages = async (id) => {

    const url = `${Api_URL}/messages/dm/${id}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();


    if (!response.ok) {
        throw new Error(result.error || 'no Chat found');
    }


    return result;



};



export default function ChatArea() {

    const { id } = useParams();
    const [typing, setTyping] = useState(false);
    const { conversationId, setConversationId } = useOutletContext() || {};
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
    const [isFocused, setIsFocused] = useState(false);
    const messageEndRef = useRef(null)
    const isTypingRef = useRef(false);
    const typingRef = useRef(null);
    const { onlineUsers } = useOutletContext();

    const conversationIdRef = useRef(conversationId);
    const queryClient = useQueryClient();


    const { data = { success: false, data: [], my_id: '', user: {} }, error } = useQuery({
        queryKey: ['DMmessages', id],
        queryFn: () => DMmessages(id),
        enabled: !!id
    })

    const isOnline = onlineUsers.some(
        (userId) => String(id) === String(userId)
    );




    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [data.data])

    useEffect(() => {
        conversationIdRef.current = conversationId;
    }, [conversationId]);


    useEffect(() => {
        if (!conversationId) return;

        socket.emit('join_conversation', conversationId);

        const handleReconnect = () => {
            socket.emit('join_conversation', conversationId);
        };

        socket.on('connect', handleReconnect);

        return () => {
            socket.off('connect', handleReconnect);
        };
    }, [conversationId]);

    useEffect(() => {
        const handleNewMessage = (msg) => {
            if (String(msg.conversation_id) === String(conversationIdRef.current)) {
                queryClient.setQueryData(['DMmessages', id], (prev) => {
                    const alreadyExists = prev.data.some((m) => String(m._id) === String(msg._id));
                    if (alreadyExists) return prev;
                    return {
                        ...prev,
                        data: [...prev.data, msg]
                    };
                });
            }
        };

        const handleError = (err) => {
            console.log('socket error:', err.message);
        };

        socket.on('DMmessage', handleNewMessage);
        socket.on('new_error', handleError);

        return () => {
            socket.off('DMmessage', handleNewMessage);
            socket.off('new_error', handleError);
        };
    }, []);



    useEffect(() => {
        if (error?.message === 'Invalid token') {
            navigate('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, navigate])

    useEffect(() => {
        const activeConvId = data?.data?.[0]?.conversation_id;

        if (activeConvId && setConversationId) {
            setConversationId(activeConvId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationId, data, setConversationId])


    async function SendMsg() {
        const url = `${Api_URL}/messages/dm/${id}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 'msg_content': message, conversation_id: conversationId })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error');
            }


            queryClient.setQueryData(['DMmessages', id], (prev) => {
                const alreadyExists = prev.data.some((m) => String(m._id) === String(result.data._id));
                if (alreadyExists) return prev;
                return {
                    ...prev,
                    data: [...prev.data, result.data]
                };
            });

            if (typingRef.current) {
                clearTimeout(typingRef.current);
            }
            socket.emit('stop_typing', { conversation_id: conversationId })

            setMessage('');

        } catch (error) {
            console.log(error.message);
        }
    }


    const handleKeyDown = (e) => {

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            if (message.trim()) {
                SendMsg(e);
            }
        }
    };

    const TypingIndicator = () => {
        if (!socket) return;


        if (!isTypingRef.current) {
            isTypingRef.current = true;
            socket.emit('start_typing', {
                conversation_id: conversationId
            });
        }


        if (typingRef.current) {
            clearTimeout(typingRef.current);
        }


        typingRef.current = setTimeout(() => {
            socket.emit('stop_typing', {
                conversation_id: conversationId
            });
            isTypingRef.current = false;
        }, 2000);
    };


    useEffect(() => {
        if (!socket || !id) return;

        const HandleTyping = (data) => {

            if (String(data?.userId) === String(id)) {
                console.log('typing')
                setTyping(true)
            }
        }
        const HandleStopTyping = ({ userId }) => {
            if (String(userId) === String(id)) {
                console.log("not typing")
                setTyping(false)
            }
        }
        socket.on('start_typing', HandleTyping)
        socket.on('stop_typing', HandleStopTyping)

        return () => {
            socket.off('start_typing', HandleTyping)
            socket.off('stop_typing', HandleStopTyping)
        }

    }, [conversationId, id])













    return (
        <>
            <div className="flex flex-col overflow-hidden w-full h-full">

                {/* upper bar to show Friend name */}
                <div className="flex items-center border-b border-b-neutral-800 h-13 pl-3 text-sm gap-x-3 shrink-0">
                    <span className="h-8 w-8 rounded-full bg-zinc-700/50 flex justify-center items-center text-lg text-yellow-200/50">
                        {data.user?.avatar ? (
                            <img src={data.user.avatar} alt="avatar" className="h-full w-full object-cover rounded-full" />
                        ) : (
                            data.user?.username ? data.user.username.charAt(0).toUpperCase() : '?'
                        )}
                    </span>

                    <div className="flex flex-col">
                        <span className="text-zinc-100">{data.user.username}</span>


                        <div className="h-4 overflow-hidden relative text-[10px] font-normal">
                            {/* Typing Indicator */}
                            <span
                                className={`absolute inset-0 text-zinc-400  font-medium transition-all duration-300 ease-in-out ${typing
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 -translate-y-2 pointer-events-none'
                                    }`}
                            >
                                Typing...
                            </span>

                            {/* Online Status */}
                            <span
                                className={`absolute inset-0 text-zinc-400 transition-all duration-300 ease-in-out ${isOnline && !typing
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-2 pointer-events-none'
                                    }`}
                            >
                                Online
                            </span>
                        </div>
                    </div>
                </div>



                <div className=" flex flex-1 w-full min-h-0 overflow-hidden">

                    {/* middle area */}
                    <div className="flex   flex-1  min-h-0 min-w-50 overflow-hidden flex-col  ">

                        {/* scrollable chat area */}
                        <div className=" flex flex-col  w-full min-h-0 flex-1 overflow-y-auto overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-w-50 p-2 mb-2 space-y-3 ">

                            <div className=" h-100 shrink-0 flex flex-col justify-center items-center  ">
                                <span className="h-25 w-25 rounded-full border-5  border-zinc-800 bg-zinc-900 flex justify-center items-center text-6xl text-yellow-200/50 mb-4">{data.user?.avatar ? (
                                    <img src={data.user.avatar} alt="avatar" className="h-full w-full object-cover rounded-full" />
                                ) : (
                                    data.user?.username ? data.user.username.charAt(0).toUpperCase() : '?'
                                )}</span>

                                <span className="text-4xl text-zinc-500 font-bold text-center">{data.user?.username}</span>
                                <span className="text-zinc-500 ">{data.user?.email}</span>
                                <div className="p-1 px-3 mt-10 flex  rounded-3xl  bg-zinc-800  text-sm text-yellow-200/50 text-center ">This is the Beginning of Direct messages history with  " {data.user?.username} "</div>
                            </div>




                            {data.data.map((msg, index) => {

                                const isMe = String(msg.sender_id) === String(data.my_id)
                                const prevMsg_date = index > 0 ? CleanDate(data.data[index - 1].created_at) : null;

                                const currentDate = CleanDate(msg.created_at);

                                const isSame = prevMsg_date === currentDate;


                                return (

                                    <React.Fragment key={msg._id || index}>
                                        {!isSame && (
                                            <div className=' flex justify-center items-center my-5 p-2'>
                                                <span className='rounded-3xl font-semibold text-sm text-shadow-mist-700/50 bg-teal-900/50  p-1 px-3 text-center '> {currentDate} </span>
                                            </div>)}


                                        <div className={`flex w-full  items-start ${isMe ? 'justify-end ' : 'justify-start '} `} >

                                            <div className={` px-3 py-2   rounded-2xl text-sm flex-none max-w-[70%] md:max-w-[600px]  break-words shadow-sm leading-relaxed ${isMe ? 'bg-green-700/50 ' : 'bg-zinc-500/50 '} `}>
                                                {msg.content}
                                                <span className="float-right ml-2 mt-3 text-[10px] text-zinc-300 opacity-70 select-none leading-none">
                                                    {CleanTime(msg.created_at)}
                                                </span>
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
                                rows={1}
                                className="flex-1 py-1 border-none outline-none resize-none bg-transparent w-full overflow-hidden ml-2"
                                onKeyDown={handleKeyDown}
                                value={message}

                                onChange={(e) => {
                                    setMessage(e.target.value)
                                    TypingIndicator();
                                }} />

                            <button className="h-7 w-15 bg-green-400/50 mr-2 ml-2 rounded-2xl transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:hover:bg-zinc-800" onClick={SendMsg} disabled={!message.trim()}>Send</button>
                        </div>

                    </div>

                    {/* Friends information profile */}
                    <div className="flex border border-zinc-700/50 flex-col m-2  rounded-2xl w-80 shrink-0  overflow-y-auto">
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





                    </div>



                </div>

            </div>

        </>
    )
}