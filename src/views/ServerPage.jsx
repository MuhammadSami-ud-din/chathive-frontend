import { useEffect, useState, } from "react"
import { useParams, useNavigate , Outlet , NavLink} from "react-router-dom"
const Api_URL = import.meta.env.VITE_API_URL

export default function ServerPage() {
    const { server_id } = useParams()
    const [data, setData] = useState({ Channels: [], Serverinfo: [] })
    const navigate = useNavigate()
   


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









    return (
        <>
            <div className="flex-none relative  w-80 h-full flex flex-col overflow-hidden  rounded-l-xl border-t border-l border-zinc-800 ">
                <div
                    style={{

                        backgroundColor: `rgba(24, 24, 27, ${navOpacity})`,
                    }}
                    className={`absolute top-0 left-0 z-50 flex items-center text-white font-bold text-xl border-b h-13 pl-4 text-sm gap-x-3 shrink-0 w-full ${navOpacity > 0.8 ? 'border-b-zinc-800/50 shadow-md' : 'border-b-transparent'
                        }`}
                >
                    {data?.Serverinfo?.[0]?.server_name}
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

                           <div className="flex items-center  pl-7 text-zinc-400 transition-all group my-3"> 
                           <div className=" inline w-10 h-0 border border-zinc-400 transition-all  group-hover:border-white "></div>
                           <div className="transition-all  group-hover:text-white mx-1 text-sm">Welcome & Info</div>
                           <div className=" inline w-8 h-0 border border-zinc-400 transition-all  group-hover:border-white "></div>
                           
                           
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
              <Outlet />
            </div>




        </>
    )
}