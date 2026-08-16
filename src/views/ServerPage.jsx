import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate, Outlet, NavLink, useOutletContext } from "react-router-dom"
import { createPortal } from "react-dom"

const Api_URL = import.meta.env.VITE_API_URL

export default function ServerPage() {
    const { server_id } = useParams()
    const [data, setData] = useState({ Channels: [], Serverinfo: [], role: [] })
    const [isMember, setIsMember] = useState({ ismember: false })
    const [joining, setJoining] = useState(false)
    const [showMessage, setShowMessage] = useState({ message: '', type: '' });
    const { AddJoinedServers } = useOutletContext()
    const navigate = useNavigate()

    const isAuthorized = (data?.role?.length > 0)
    console.log(isAuthorized)
console.log(data.Channels)




    const [navOpacity, setNavOpacity] = useState(0);

    const handleScroll = (e) => {
        const currentScroll = e.currentTarget.scrollTop;


        const startChangingAt = 0;
        const fullyColoredAt = 100;

        if (currentScroll <= startChangingAt) {
            setNavOpacity(0);
        } else if (currentScroll >= fullyColoredAt) {
            setNavOpacity(1);
        } else {

            const dynamicFraction = (currentScroll - startChangingAt) / (fullyColoredAt - startChangingAt);
            setNavOpacity(dynamicFraction);
        }
    };







    useEffect(() => {
        const url = `${Api_URL}/channels/${server_id}`
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
                console.log("SERVER DATA RETURNED channels:", result);

                if (!response.ok) {
                    throw new Error(result.error || 'no servers found')
                }


                setData(result)
                console.log(result.role)




            }
            catch (error) {

                console.log(error.message)
                if (error.message === 'Invalid token') {
                    navigate('/login');
                }

            }

        }
        fetchData()


    }, [navigate, server_id])



    useEffect(() => {
        const url = `${Api_URL}/server_join/${server_id}`
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
                console.log("SERVER DATA RETURNED channels:", result);

                if (!response.ok) {
                    throw new Error(result.error || 'no servers found')
                }


                setIsMember(result)
                console.log(result)




            }
            catch (error) {

                console.log(error.message)
                if (error.message === 'Invalid token') {
                    navigate('/login');
                }

            }

        }
        fetchData()


    }, [navigate, server_id])




    async function HandleServerJoin() {
        if (joining) return
        setIsMember({ ismember: true });
        setJoining(true)
        const url = `${Api_URL}/server_join/${server_id}`

        try {

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                    "Content-Type": "application/json"
                }
            });

            const result = await response.json();
            console.log("SERVER RETURNED:", result);

            if (!response.ok) {
                throw new Error(result.error || 'no servers found')
            }


            setShowMessage({ message: result.message || 'Server Join Successfull', type: 'success' });

            console.log(result.serverInfo)

            if (result?.serverInfo && AddJoinedServers) {
                AddJoinedServers(result.serverInfo)
            }






        }
        catch (error) {

            console.log(error.message)
            setIsMember({ ismember: false });
            setShowMessage({ message: error.message || 'Already a Member', type: 'error' });
            if (error.message === 'Invalid token') {
                navigate('/login');
            }

        }
        finally {
            setJoining(false)
        }




    }














    return (
        <>
            <div className="flex w-full relative">


                <div className="flex-none relative  w-80 h-full flex flex-col  rounded-l-xl border-t border-l border-zinc-800 ">
                    <div
                        style={{

                            backgroundColor: `rgba(24, 24, 27, ${navOpacity})`,
                        }}
                        className={`absolute top-0 left-0 z-49 flex flex items-center text-white justify-between font-bold text-xl border-b h-13 pl-4 text-sm gap-x-3 shrink-0 w-full transition-all  ${navOpacity > 0.8 ? 'border-b-zinc-800/50 shadow-md' : 'border-b-transparent hover:!bg-zinc-950/50 '
                            }`}
                    >
                        {data?.Serverinfo?.[0]?.server_name}

                        {
                            isMember.ismember ?
                                (<div className="relative w-12 h-12 text-sm p-1.5 rounded-xl mr-3 transition-all group ">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">

                                        <g>
                                            <circle cx="56" cy="40" r="10" fill="#FFFFFF" />
                                            <path d="M56,53 C46,53 38,59 38,68 L74,68 C74,59 66,53 56,53 Z" fill="#FFFFFF" />
                                            <circle cx="42" cy="48" r="12" fill="#FFFFFF" />
                                            <path d="M42,63 C30,63 20,70 20,80 L64,80 C64,70 54,63 42,63 Z" fill="#FFFFFF" />
                                            <path d="M66,74 L74,74 L74,66 L78,66 L78,74 L86,74 L86,78 L78,78 L78,86 L74,86 L74,78 L66,78 Z" fill="#FFFFFF" />
                                        </g>
                                    </svg>

                                    <div className="absolute z-10 font-medium  p-2 mt-7 text-sm w-max bg-zinc-600 rounded-xl pointer-events-none opacity-0  left-1/2  -translate-1/2 scale-0 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:scale-100     ">Invite to Server
                                        <div className="absolute bottom-full  left-[45%] h-0 w-0 border-x-8   border-x-transparent border-b-8 border-b-zinc-600" />
                                    </div>
                                </div>
                                ) :
                                (<button onClick={HandleServerJoin} className="relativep-2 bg-green-500/50 text-sm p-1.5 rounded-xl mr-3 transition-all hover:bg-green-700/50 ">Join Server</button>)

                        }

                    </div>


                    <div className="w-full  min-h-40 bg-blue-300 rounded-tl-xl absolute top-0 z-0 left-0 "> </div>

                    <div
                        onScroll={handleScroll}
                        className="overflow-y-auto z-10 h-full w-full pt-40 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ">

                        <div className="h-[1000px] bg-zinc-900 w-full ">
                            <div className="w-full border-b border-b-zinc-700/50 h-15 flex items-center group ">
                                <div className=" flex items-center g-x-3 m-2 w-full  rounded-xl transition-all text-zinc-400 hover:bg-zinc-500/50  group-hover:text-white ">

                                    <svg xmlns="http://w3.org" viewBox="0 0 100 100" className="w-10 h-10 ">
                                        <g transform="translate(10, 10) scale(0.8)">
                                            <rect className="fill-[#7D7D84] transition-colors duration-200 group-hover:fill-white" x="46" y="20" width="8" height="60" rx="2" />
                                            <path className="fill-[#7D7D84] transition-colors duration-200 group-hover:fill-white" d="M 25 35 L 70 35 L 85 45 L 70 55 L 25 55 Z" />
                                            <path d="M 25 35 L 33 45 L 25 55 Z" className="fill-[#121212]" />
                                            <rect className="fill-[#7D7D84] transition-colors duration-200 group-hover:fill-white" x="36" y="74" width="28" height="6" rx="3" />
                                        </g>
                                    </svg>


                                    Server Guide</div>
                            </div>

                            <div className="w-full flex flex-col ">

                                <div className="flex items-center  justify-between  pl-7 text-zinc-400 transition-all my-3">
                                    <div className="flex items-center group">
                                        <div className=" inline w-10 h-0 border border-zinc-400 transition-all  group-hover:border-white "></div>
                                        <div className="transition-all  group-hover:text-white mx-1 text-sm">Welcome & Info</div>
                                        <div className=" inline w-8 h-0  border border-zinc-400 transition-all  group-hover:border-white "></div>
                                    </div>
                                    {isAuthorized && (
                                        <div className="relative text-2xl mr-5 pb-1 group hover:text-white cursor-pointer select-none">
                                            +
                                            <div className="absolute z-50 right-full top-1/2 -translate-y-1/2 mr-2 font-medium p-2 text-sm w-max bg-zinc-700 text-white rounded-xl pointer-events-none opacity-0 scale-90 transition-all duration-150 ease-out group-hover:opacity-100 group-hover:scale-100 shadow-xl">
                                                Add Channel
                                                <div className="absolute top-1/2 -translate-y-1/2 left-full h-0 w-0 border-y-6 border-y-transparent border-l-6 border-l-zinc-700" />
                                            </div>
                                        </div>
                                    )}



                                </div>

                                {
                                    data?.Channels?.map((channel) => {

                                        return (
                                            <NavLink
                                                to={`${channel.channel_id}`}
                                                key={channel.channel_id} className="w-full flex  ">
                                                <span className=" w-full mx-2 py-1 pl-2 rounded-xl transition-all text-zinc-400 hover:bg-zinc-500/50 ">{channel.channel_name}</span>
                                            </NavLink>
                                        )
                                    })
                                }
                            </div>
                        </div>





                    </div>





                </div>


                {/* {Right Side} */}
                <div className={`relative  bg-[#151518] border-t border-t-zinc-800 flex-1 flex flex-col min-w-0 overflow-hidden  `}>
                    {showMessage.message && (

                        <div className={`absolute top-0 right-1 animate-auto-glide p-2 text-center text-sm font-medium rounded-xl transition-all duration-500 ease-in-out transform ${showMessage.type === 'success'
                            ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-200 translate-x-0 opacity-100 pointer-events-auto'
                            : 'bg-red-500/20 border border-red-500 text-red-200  translate-x-0 opacity-100 pointer-events-auto '
                            }`}
                            onAnimationEnd={() => setShowMessage({ message: '', type: '' })}>
                            {showMessage.message}
                        </div>
                    )}
                    <Outlet context={data.Channels}/>
                </div>

            </div>



        </>
    )
}