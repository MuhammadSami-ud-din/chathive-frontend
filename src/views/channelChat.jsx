import { useEffect, useState, useRef } from "react";
import React from "react";
import { useParams,  useOutletContext } from "react-router-dom";
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
    const parse = new Date(safeString);
    if (isNaN(parse.getTime())) return "";

    return parse.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const ChannelFetch = async (channel_id) => {
    const url = `${Api_URL}/channels/${channel_id}/messages`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || 'No channels found');
    }

    return result;
};

export default function ChannelChat() {
    const { channel_id } = useParams();

    const [message, setMessage] = useState('');

    const [isFocused, setIsFocused] = useState(true);
    const [showMessage, setShowMessage] = useState({ text: '', type: '' });
    const channels = useOutletContext();
    const messageEndRef = useRef(null);
    const queryClient = useQueryClient();
    const isTypingRef = useRef(false);
    const typingRef = useRef(null);
    const [TypingUsers, setTypingUsers] = useState([]);

    const { data = { success: false, data: [], my_id: '' }, error, isSuccess } = useQuery({
        queryKey: ['ChannelFetch', channel_id],
        queryFn: () => ChannelFetch(channel_id)
    });

    const ChannelInfo = channels?.find((channel) => Number(channel.channel_id) === Number(channel_id));

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [data.data]);

    // Channel Room Join & Cleanup
    useEffect(() => {
        setMessage('');
        setTypingUsers([]); // Reset typing state on channel change
        isTypingRef.current = false;
        
        if (typingRef.current) {
            clearTimeout(typingRef.current);
        }

        socket.emit('join_channel', channel_id);

        const handleReconnect = () => {
            socket.emit('join_channel', channel_id);
        };

        socket.on('connect', handleReconnect);

        return () => {
            socket.off('connect', handleReconnect);
        };
    }, [channel_id]);

    // Socket New Message Listeners
    useEffect(() => {
        const handleNewMessage = (msg) => {
            if (String(msg.channel_id) === String(channel_id)) {
                queryClient.setQueryData(['ChannelFetch', channel_id], (prev) => {
                    if (!prev || !prev.data) return prev;
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
    }, [channel_id, queryClient]);

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                setShowMessage({ text: 'Fetch Successful', type: 'success' });
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setShowMessage({ text: error?.message || 'Not Authorized', type: 'error' });
            }, 0);

           

            return () => clearTimeout(timer);
        }
    }, [error]);

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

            queryClient.setQueryData(['ChannelFetch', channel_id], (prev) => {
                if (!prev || !prev.data) return prev;
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
            socket.emit('stop_channel_typing', channel_id);
            isTypingRef.current = false;

            setMessage('');

        } catch (error) {
            console.log(error?.message);
            setShowMessage({ text: error?.message || 'Not Authorized', type: 'error' });
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

    const HandleTypingUsers = () => {
        if (!socket) return;

        if (!isTypingRef.current) {
            isTypingRef.current = true;
            socket.emit('channel_typing', channel_id);
        }

        if (typingRef.current) {
            clearTimeout(typingRef.current);
        }

        typingRef.current = setTimeout(() => {
            socket.emit('stop_channel_typing', channel_id);
            isTypingRef.current = false;
        }, 2000);
    };

    // Socket Channel Typing Listeners (Filtered current user)
    useEffect(() => {
        if (!socket || !channel_id) return;

        const usersTyping = (typingUsersList) => {
            // Self-user filter out taake apni hi typing bar show na ho
            const filteredOtherUsers = typingUsersList.filter(
                (id) => String(id) !== String(data.my_id)
            );
            setTypingUsers(filteredOtherUsers);
        };

        const usersNotTyping = (notTypingUsersList) => {
            const filteredOtherUsers = notTypingUsersList.filter(
                (id) => String(id) !== String(data.my_id)
            );
            setTypingUsers(filteredOtherUsers);
        };

        socket.on('channel_typing', usersTyping);
        socket.on('stop_channel_typing', usersNotTyping);

        return () => {
            socket.off('channel_typing', usersTyping);
            socket.off('stop_channel_typing', usersNotTyping);
        };
    }, [channel_id, data.my_id]);

    return (
        <div className="flex flex-col overflow-hidden w-full h-full">
            {/* Upper Header Bar */}
            <div className="flex items-center border-b border-b-neutral-800 h-13 pl-3 text-sm gap-x-3 shrink-0">
                <span className="h-8 w-8 rounded-full bg-zinc-700/50 flex justify-center items-center text-lg text-yellow-200/50 overflow-hidden">
                    {ChannelInfo?.avatar ? (
                        <img src={ChannelInfo.avatar} alt="avatar" className="h-full w-full object-cover rounded-full" />
                    ) : (
                        ChannelInfo?.channel_name ? ChannelInfo.channel_name.charAt(0).toUpperCase() : '?'
                    )}
                </span>

                <div className="flex flex-col">
                    <span className="text-zinc-100">{ChannelInfo?.channel_name}</span>

                    {/* Dynamic Typing Indicator */}
                    <div
                        className={`grid transition-all duration-300 ease-in-out ${
                            TypingUsers?.length > 0
                                ? 'grid-rows-[1fr] opacity-100 mt-0.5'
                                : 'grid-rows-[0fr] opacity-0 mt-0'
                        }`}
                    >
                        <div className="overflow-hidden">
                            {TypingUsers?.length === 1 ? (() => {
                                const typingUserMessage = data?.data?.find(
                                    (msg) => String(msg.sender_id) === String(TypingUsers[0])
                                );
                                const username = typingUserMessage?.sender?.username || 'Someone';

                                return (
                                    <span className="text-zinc-400 font-medium text-[11px] leading-none block">
                                        {`${username} is typing...`}
                                    </span>
                                );
                            })() : TypingUsers?.length > 1 ? (
                                <span className="text-zinc-400 font-medium text-[11px] leading-none block">
                                    {`${TypingUsers.length} users are typing...`}
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>

                {showMessage.text && (
                    <div
                        className={`absolute right-4 animate-auto-glide p-2 text-center text-sm font-medium rounded-xl transition-all duration-500 ease-in-out transform ${
                            showMessage.type === 'success'
                                ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-200 translate-x-0 opacity-100 pointer-events-auto'
                                : 'bg-red-500/20 border border-red-500 text-red-200'
                        }`}
                        onAnimationEnd={() => setShowMessage({ text: '', type: '' })}
                    >
                        {showMessage.text}
                    </div>
                )}
            </div>

            {/* Chat Body */}
            <div className="flex flex-1 w-full min-h-0 overflow-hidden">
                <div className="flex flex-1 min-h-0 min-w-50 overflow-hidden flex-col">
                    {/* Scrollable Chat Area */}
                    <div className="flex flex-col w-full min-h-0 flex-1 overflow-y-auto overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-w-50 p-2 mb-2 space-y-3">
                        {/* Beginning Header */}
                        <div className="h-100 shrink-0 flex flex-col justify-center items-center">
                            <span className="h-25 w-25 rounded-full border-5 border-zinc-800 bg-zinc-900 flex justify-center items-center text-6xl text-yellow-200/50 mb-4 overflow-hidden">
                                {ChannelInfo?.avatar ? (
                                    <img src={ChannelInfo?.avatar} alt="avatar" className="h-full w-full object-cover rounded-full" />
                                ) : (
                                    ChannelInfo?.channel_name ? ChannelInfo.channel_name.charAt(0).toUpperCase() : '?'
                                )}
                            </span>

                            <span className="text-4xl text-zinc-500 font-bold text-center">{ChannelInfo?.channel_name}</span>
                            <span className="text-zinc-500">{ChannelInfo?.description}</span>
                            <span className="text-zinc-500">Channel Created on: {CleanDate(ChannelInfo?.created_at)}</span>
                            <div className="p-1 px-3 mt-10 flex rounded-3xl bg-zinc-800 text-sm text-yellow-200/50 text-center">
                                This is the Beginning of messages history In "{ChannelInfo?.channel_name}"
                            </div>
                        </div>

                        {data.data.map((msg, index) => {
                            const isMe = String(msg.sender_id) === String(data.my_id);
                            const prevMsg_date = index > 0 ? CleanDate(data.data[index - 1].Date) : null;
                            const currentDate = CleanDate(msg.Date);
                            const isSame = prevMsg_date === currentDate;

                            return (
                                <React.Fragment key={msg._id || index}>
                                    {!isSame && (
                                        <div className="flex justify-center items-center my-5 p-2">
                                            <span className="rounded-3xl font-semibold text-sm bg-teal-900/50 p-1 px-3 text-center text-zinc-200">
                                                {currentDate}
                                            </span>
                                        </div>
                                    )}

                                    <div className={`flex w-full items-start ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`pb-1 px-1 flex flex-col rounded-xl text-sm flex-none max-w-[70%] shrink-0 break-words shadow-sm leading-relaxed ${isMe ? 'bg-green-700/50' : 'bg-zinc-700/70'}`}>
                                            {!isMe && (
                                                <div className="rounded-t-xl pl-2 pt-1 pr-7 font-bold text-amber-200">
                                                    {msg?.sender?.username}
                                                </div>
                                            )}
                                            <div className="px-2 pt-1 text-sm flex-none shrink-0 break-words shadow-sm leading-relaxed">
                                                {msg.content}
                                                <span className="float-right ml-2 mt-3 text-[10px] text-zinc-300 opacity-70 select-none leading-none">
                                                    {CleanTime(msg.Date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}

                        <div ref={messageEndRef} />
                    </div>

                    {/* Input Field Area */}
                    <div className={`flex w-full p-1 pl-2 mb-2 shrink-0 rounded-3xl items-center ${isFocused ? 'border border-green-500/50 bg-zinc-900/50' : 'border border-zinc-700 bg-transparent'}`}>
                        <textarea
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            rows="2"
                            className="flex-1 h-6 border-none outline-none resize-none bg-transparent w-full overflow-hidden ml-2 text-zinc-100"
                            onKeyDown={handleKeyDown}
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                HandleTypingUsers();
                            }}
                        />

                        <button
                            className="h-7 w-15 bg-green-400/50 mr-2 ml-2 rounded-2xl transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:hover:bg-zinc-800 text-sm font-medium"
                            onClick={SendMsg}
                            disabled={!message.trim()}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}