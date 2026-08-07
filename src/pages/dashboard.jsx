import { useEffect, useState } from "react"
import { useNavigate, Link } from 'react-router-dom';

const SKELETON_GROUPS = [
    { id: 'cat-1', items: ['w-32', 'w-40', 'w-24', 'w-36', 'w-28', 'w-20'] },
    { id: 'cat-2', items: ['w-28', 'w-36', 'w-20', 'w-32', 'w-24', 'w-40'] }
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const url = 'http://192.168.18.40:5000/servers'


    useEffect(() => {
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
                setData(result)



            }
            catch (error) {
                setError(error.message)
                console.log(error.message)
                if (error.message === 'Invalid token') {
                    navigate('/login');
                }

            }
            finally {
                setLoading(false)
            }
        }
        fetchData()

    }, [navigate])






    return (
        <>
            <div className="flex flex-col h-screen bg-zinc-900">

                {/*//navebar*/}
                <div className="h-8 flex-none  px-4 flex items-center justify-end ">

                    <div className="flex flex-col items-center  gap-2">
                        <svg
                            xmlns="http://w3.org"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="w-5 h-5 text-neutral-400 hover:text-neutral-100 transition-colors"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >

                            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                        </svg>

                    </div>
                    <div className="flex gap-2  ml-4 ">
                        <svg
                            xmlns="http://w3.org"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="w-5 h-5 text-neutral-400 hover:text-neutral-100 transition-colors"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >

                            <circle cx="12" cy="12" r="10" />

                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />

                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>



                    </div>

                </div>

                {/*lower div*/}
                <div className=" flex-1 min-h-0 flex     text-white">

                    {/*servers list sidebar*/}
                    <div className="flex-none  w-20 flex flex-col  items-center  ">

                        {/*DM icon*/}
                        <div className=" relative  mb-2 pb-3  w-20 flex items-center justify-center ">
                            <span className="peer flex h-12 w-12 cursor-pointer mt-1 ml-1 items-center justify-center bg-zinc-800  text-white transition-all duration-200 ease-in-out rounded-2xl hover:bg-[#5865f2] ">
                                <svg xmlns="http://w3.org" viewBox="0 0 128 128" className="w-12 h-12 fill-current">
                                    <path d="M89.7 41.4c-4.9-3.6-10.4-5.9-16.1-6.7-.7 1.3-1.5 2.9-2.1 4.4-6.2-.9-12.3-.9-18.4 0-.6-1.5-1.4-3.1-2.1-4.4-5.8.8-11.2 3.1-16.1 6.7-9.8 14.6-12.4 28.8-11.1 42.7 6.5 4.8 12.6 7.7 18.6 9.6 1.5-2.1 2.9-4.3 4-6.7-2.2-.8-4.4-1.9-6.4-3.2.5-.4 1.1-.8 1.6-1.2 12.2 5.6 25.4 5.6 37.3 0 .5.4 1.1.8 1.6 1.2-2 1.3-4.2 2.3-6.4 3.2 1.2 2.4 2.5 4.6 4 6.7 6-1.9 12.1-4.8 18.6-9.6 1.5-16-.9-30-11.1-42.7zM50.4 72.8c-3.6 0-6.6-3.3-6.6-7.4s2.9-7.4 6.6-7.4c3.7 0 6.6 3.3 6.6 7.4s-2.9 7.4-6.6 7.4zm27.2 0c-3.6 0-6.6-3.3-6.6-7.4s2.9-7.4 6.6-7.4c3.7 0 6.6 3.3 6.6 7.4s-2.9 7.4-6.6 7.4z" />
                                </svg>

                            </span>
                            <div className="absolute left-0 w-1 bg-white h-0 rounded-r-full transition-all duration-300 peer-hover:h-7" />
                            <div className="absolute w-10 h-0.5 bottom-0 bg-zinc-700"></div>
                            <div className="absolute left-full z-50 py-1 px-3  bg-zinc-600 rounded-xl flex items-center justify-center opacity-0 font-black text-base pointer-events-none top-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity peer-hover:opacity-100 " >Direct Messages
                                <div className="absolute -left-2 h-0 w-0 border-y-[8px] rounded-sm  border-y-transparent border-r-[13px] border-r-zinc-600" />

                            </div>
                        </div>

                        {/*Personal Server*/}
                        <div className="relative flex justify-center items-center  w-20">
                            <span className=" peer flex h-12 w-12 cursor-pointer mt-1 ml-1 items-center justify-center bg-zinc-800  text-white transition-all duration-200 ease-in-out rounded-2xl hover:bg-[#5865f2] ">
                                owner
                            </span>
                            <div className="absolute left-0 w-1 bg-white h-0 rounded-r-full transition-all duration-300 peer-hover:h-7" />
                            <div className="absolute left-full z-50 py-1 px-3  bg-zinc-600 rounded-xl flex items-center justify-center opacity-0 font-black text-base pointer-events-none top-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity peer-hover:opacity-100 " >Muhammads Server
                                <div className="absolute -left-2 h-0 w-0 border-y-[8px] rounded-sm  border-y-transparent border-r-[13px] border-r-zinc-600" />

                            </div>
                        </div>

                        {/*Joined server list*/}
                        {data.map((item) => (
                            <div
                                key={item.server_id || item._id}
                                className="relative h-12 w-20 mt-1 flex justify-center items-center">

                                <span className="peer relative flex h-12 w-12 items-center justify-center bg-zinc-800 text-white transition-all duration-300 ease-in-out rounded-2xl hover:bg-[#5865f2] cursor-pointer text-xs font-semibold text-center truncate select-none px-1">

                                    {item.server_name ? item.server_name.charAt(0).toUpperCase() : '?'}

                                </span>

                                <div className="absolute left-0 w-1 bg-white h-3 rounded-r-full transition-all duration-300 peer-hover:h-7" />
                                <div className="absolute left-full z-50 py-1 px-3  bg-zinc-600 rounded-xl flex items-center justify-center opacity-0 font-black text-base pointer-events-none top-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity peer-hover:opacity-100 " >{item.server_name}
                                    <div className="absolute -left-2 h-0 w-0 border-y-[8px] rounded-sm  border-y-transparent border-r-[13px] border-r-zinc-600" />

                                </div>

                            </div>
                        ))}

                        {/*add a Server*/}
                        <div className=" relative flex justify-center items-center  w-20">
                            <span className=" peer flex h-12 w-12 cursor-pointer mt-2 ml-1 items-center justify-center bg-zinc-800  text-white transition-all duration-200 ease-in-out rounded-2xl hover:bg-[#5865f2] ">
                                <svg xmlns="http://w3.org" viewBox="0 0 24 24" className="w-6 h-6 cursor-pointer text-zinc-700 hover:text-zinc-900 transition-colors">
                                    <circle cx="12" cy="12" r="10" fill="#ffffff" />
                                    <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                            </span>

                            <div className="absolute left-full z-50 py-1 px-3  bg-zinc-600 rounded-xl flex items-center justify-center opacity-0 font-black text-base pointer-events-none top-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity peer-hover:opacity-100 " >Add a Server
                                <div className="absolute -left-2 h-0 w-0 border-y-[8px] rounded-sm  border-y-transparent border-r-[13px] border-r-zinc-600" />

                            </div>

                        </div>


                        {/*Discover*/}
                        <div className=" relative flex justify-center items-center  w-20">
                            <span className=" peer flex h-12 w-12 cursor-pointer mt-2 ml-1 items-center justify-center bg-zinc-800  text-white transition-all duration-200 ease-in-out rounded-2xl hover:bg-[#5865f2] ">
                                <svg xmlns="www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                                </svg>
                            </span>
                            <div className="absolute left-0 w-1 bg-white h-0 rounded-r-full transition-all duration-300 peer-hover:h-7" />
                            <div className="absolute left-full z-50 py-1 px-3  bg-zinc-600 rounded-xl flex items-center justify-center opacity-0 font-black text-base pointer-events-none top-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity peer-hover:opacity-100 " >Discover
                                <div className="absolute -left-2 h-0 w-0 border-y-[8px] rounded-sm  border-y-transparent border-r-[13px] border-r-zinc-600" />

                            </div>
                        </div>





                    </div>

                    {/*channels list middlebar*/}
                    <div className="flex-none  w-73 p-4 flex flex-col space-y-6 rounded-xl border-t border-l border-zinc-800 ">

                        {SKELETON_GROUPS.map((group) => (
                            <div key={group.id} className="space-y-3">

                                <div className="h-3.5 w-24 rounded-full bg-zinc-700 " />


                                {group.items.map((width, i) => (
                                    <div key={`${group.id}-${i}`} className="flex items-center space-x-3 py-1 opacity-50">
                                        <div className="h-4 w-4 bg-zinc-700 rounded-full flex-shrink-0" />
                                        <div className={`h-3.5 ${width} bg-zinc-700 rounded-full`} />
                                    </div>
                                ))}
                            </div>
                        ))}

                    </div>

                    {/*chat area  rightbar*/}
                    <div className="flex flex-col flex-1 items-center justify-center align-center ">
                        <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-90 h-90 select-none">
                            {/* Layer 1: Dark Pill Background Shapes */}
                            <rect x="20" y="42" width="185" height="32" rx="16" fill="#1E1F22" />
                            <rect x="15" y="125" width="190" height="42" rx="21" fill="#1E1F22" />

                            {/* Layer 2: Top Outlined Speech Bubble */}
                            <g>
                                <rect x="52" y="38" width="120" height="36" rx="6" stroke="#35363C" strokeWidth="1.5" fill="#18191C" />
                                <path d="M 52 50 L 45 54 L 52 58" stroke="#35363C" strokeWidth="1.5" fill="#18191C" />
                                <text x="62" y="61" fill="#2B2D31" fontSize="13" letterSpacing="2.5" fontWeight="bold">★★★★★★★★★</text>
                            </g>

                            {/* Top Background Accents */}
                            <circle cx="68" cy="22" r="2.5" stroke="#35363C" strokeWidth="1.2" fill="none" />
                            <path d="M 188 60 L 194 60 M 191 57 L 191 63" stroke="#35363C" strokeWidth="1.2" />

                            {/* Layer 3: Middle Solid Speech Bubble */}
                            <g>
                                <rect x="75" y="70" width="125" height="48" rx="6" fill="#2B2D31" />
                                <path d="M 200 88 L 207 93 L 200 98 Z" fill="#2B2D31" />
                                <text x="88" y="90" fill="#1E1F22" fontSize="11" letterSpacing="2">★★★★★★★★</text>
                                <text x="98" y="106" fill="#1E1F22" fontSize="11" letterSpacing="2">★★★★★★★</text>
                            </g>

                            {/* Layer 4: Lower Outlined Speech Bubble */}
                            <g>
                                <rect x="42" y="122" width="110" height="36" rx="6" stroke="#35363C" strokeWidth="1.5" fill="#18191C" />
                                <path d="M 42 134 L 35 138 L 42 142" stroke="#35363C" strokeWidth="1.5" fill="#18191C" />
                            </g>

                            {/* Bottom Background Accents */}
                            <path d="M 136 148 L 142 148 M 139 145 L 139 151 M 137 146 L 141 150 M 141 146 L 137 150" stroke="#35363C" strokeWidth="1" />
                            <path d="M 166 158 L 168 162 L 172 164 L 168 166 L 166 170 L 164 166 L 160 164 L 164 162 Z" fill="#35363C" />

                            {/* Layer 5: Foreground Hashtag (#) Symbol */}
                            <g transform="translate(58, 106)">
                                <path d="M18 6 L14 38 M30 6 L26 38 M6 16 L36 16 M4 28 L34 28" stroke="#585A63" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        </svg>

                        <h1 className="text-xl mb-2 font-bold text-zinc-400">NO TEXT CHANNELS</h1>
                        <p className="w-120 flex text-center font-medium text-sm text-zinc-400">You find yourself in a strange place. You don't have access to any text channels, or there are none in this server.</p>
                    </div>

                </div>

            </div>


        </>
    )
}