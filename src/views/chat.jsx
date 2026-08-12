
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { NavLink, Outlet, useOutletContext } from "react-router-dom"
const Api_URL = import.meta.env.VITE_API_URL;


const CleanDate = ({ date }) => {
    if (!date) return "";
    const safeString = date.replace(' ', 'T');
    return new Date(safeString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
};


const CleanTime = ({ date }) => {
    if (!date) return "";
    const safeString = date.replace(' ', 'T');
    return new Date(safeString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};



export default function ChatArea() {
   
    const { id } = useParams();
    const [data, setData] = useState({ success: false, data: [], my_id: '', user: {} });
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
     const [isFocused, setIsFocused] = useState(false);





    useEffect(() => {
        const url = `${Api_URL}/messages/dm/${id} `
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

                console.log(result)
                setData(result)



            }
            catch (error) {

                console.log(error.message)
                if (error.message === 'Invalid token') {
                    navigate('/login');
                }

            }

        }
        if (id) fetchData()


    }, [id, navigate])



    async function SendMsg() {



        const url = `${Api_URL}/messages/dm/${id} `

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 'msg_content': message })
            })

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Error');
            }

            console.log(result.message)

            if (result.data) {
                setData((prev) => ({
                    ...prev,
                    data: [...prev.data, result.data]
                }))
            }

            setMessage('')

        }
        catch (error) {
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
















    return (
        <>
            <div className="flex flex-col overflow-hidden w-full h-full">
                {/* upper bar to show Friend name */}
                <div className="flex items-center border-b border-b-neutral-800 h-13 pl-3 text-sm gap-x-3 shrink-0">
                    <span className="h-8 w-8 rounded-full bg-zinc-700/50">{data.user.avatar}</span>
                    <span className="text-zinc-100">{data.user.username}</span>
                </div>

                <div className=" flex flex-1 w-full min-h-0 overflow-hidden">

                    {/* middle area */}
                    <div className="flex   flex-1  min-h-0 overflow-hidden flex-col  ">

                        {/* scrollable chat area */}
                        <div className=" flex flex-col  w-full min-h-0 flex-1 overflow-y-auto overflow-hidden min-w-50 p-3 mb-2 space-y-3 ">
                            {data.data.map((msg, index) => {
                                const isMe = msg.sender_id === data.my_id

                                return (

                                    <div key={msg._id || msg.message_id || `msg-${index}`} className={`flex w-full  items-start ${isMe ? 'justify-end ' : 'justify-start '} `} >

                                        <div className={` px-3 py-1  rounded-2xl text-sm flex-none max-w-[70%]  break-words shadow-sm leading-relaxed ${isMe ? 'bg-green-700/50 ' : 'bg-zinc-500/50 '} `}>{msg.content}</div>
                                    </div>


                                )

                            }
                            )}
                        </div>


                        {/* input field */}
                        <div className={`flex w-full p-1 pl-2  shrink-0 rounded-3xl items-center ${isFocused ? 'border border-green-500/50 bg-zinc-900/50' : 'border border-zinc-700 bg-transparent'}`}>
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
                    <div className="flex border border-zinc-700/50 flex-col m-2  rounded-2xl w-80 shrink-0  overflow-y-auto">
                        <div className=" relative  flex-1 w-full bg-gradient-to-r from-black-300  to-emerald-900 p-4">
                            <span className="absolute peer rounded-full border-4 border-zinc-800 h-20 w-20 -bottom-[23%] bg-zinc-900">{data.user.avatar}</span>
                            <span className="absolute bg-black h-20 w-20 -bottom-[23%] rounded-full opacity-0 transition-opacity duration-300 peer-hover:opacity-10 pointer-events-none"></span>
                        </div>
                        <div className=" flex-4 w-full bg-zinc-900/80 pt-12 px-6">
                            <p className="text-lg text-zinc-300">{data.user.username}</p>
                            <p className="text-sm text-zinc-500">{data.user.email}</p>
                            <p className="text-xm text-zinc-400 mt-5">Member Since:</p>
                            <p className="text-sm text-zinc-500 ">
                                {<CleanDate date={data.user.created_at} />}
                            </p>


                        </div>





                    </div>



                </div>

            </div>

        </>
    )
}