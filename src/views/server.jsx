const Api_URL = import.meta.env.VITE_API_URL
import { useState, useEffect, useRef } from "react"
import { NavLink, useNavigate } from "react-router-dom"






export default function ServersListing() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [Data, setData] = useState([]);
    const navigate = useNavigate()
    const scrolableContainer = useRef(null)

    useEffect(() => {
        const container = scrolableContainer.current
         if (!container) return;

        const handleScroll = () => {
            if (container.scrollTop > 5) {
                setIsScrolled(true)
                
            } else {
                setIsScrolled(false)
            }
        }
         


        container.addEventListener('scroll', handleScroll)

        return () =>  container.removeEventListener('scroll', handleScroll)
        

    }, []);


    useEffect(() => {
        const url = `${Api_URL}/servers`
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
                console.log("SERVER DATA RETURNED servers:", result);

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
        fetchData()


    }, [navigate])












    return (
        <>
            <div className="flex-none  w-80 h-full flex flex-col  rounded-l-xl border-t border-l border-zinc-800 ">
                <div className="flex items-center border-b border-b-neutral-800 h-13  pl-5 text-xl font-bold">
                    Discover
                </div>
                <div

                    className="h-17 flex items-center justify-center  mt-1  ">

                    <NavLink
                        to="/discovery/servers"
                        end
                        className={({ isActive }) => ` flex   pl-1 p-2 w-full h-13 text-zinc-200 font-semibold  rounded-xl m-1 items-center   transition-colors   ${isActive ? 'bg-zinc-100/10' : 'bg-neutral-800 hover:bg-zinc-100/10'} `} >
                        <svg xmlns="http://w3.org" viewBox="0 0 100 100" width="40" height="40">
                            <rect width="100" height="100" rx="12" ry="12" fill="transparent" />
                            <g fill="#ffffff" stroke="#114294" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M 49,36 L 69,27 A 3,3 0 0,1 73,30 L 73,72 A 4,4 0 0,1 69,76 L 57,76 A 4,4 0 0,1 53,72 Z" />
                                <path d="M 33,33 L 45,26 A 3,3 0 0,1 49,29 L 49,50 L 33,59 Z" />
                                <path d="M 23,55 L 38,41 A 3,3 0 0,1 42,41 L 57,55 A 2,2 0 0,1 56,58 L 54,58 L 54,73 A 3,3 0 0,1 51,76 L 29,76 A 3,3 0 0,1 26,73 L 26,58 L 24,58 A 2,2 0 0,1 23,55 Z" />
                            </g>
                        </svg>


                        Servers</NavLink>
                </div>





            </div>


            {/* {Right Side} */}
            <div className={`relative  bg-[#151518] border-t border-t-zinc-800 flex-1 flex flex-col min-w-0 overflow-hidden  `}>

                {/* upper bar to select the type of servers u wanna see */}
                <div className={`absolute flex items-center border-b border-b-zinc-800/50 h-13 pl-3 text-sm gap-x-3 shrink-0 w-full transition-colors duration-300 ${isScrolled
                    ? 'bg-zinc-900 shadow-md '
                    : 'bg-transparent '
                    }`}>
                    <svg xmlns="http://w3.org" viewBox="0 0 100 100" width="40" height="40">
                        <rect width="100" height="100" rx="12" ry="12" fill="transparent" />
                        <g fill="#ffffff" stroke="#114294" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M 49,36 L 69,27 A 3,3 0 0,1 73,30 L 73,72 A 4,4 0 0,1 69,76 L 57,76 A 4,4 0 0,1 53,72 Z" />
                            <path d="M 33,33 L 45,26 A 3,3 0 0,1 49,29 L 49,50 L 33,59 Z" />
                            <path d="M 23,55 L 38,41 A 3,3 0 0,1 42,41 L 57,55 A 2,2 0 0,1 56,58 L 54,58 L 54,73 A 3,3 0 0,1 51,76 L 29,76 A 3,3 0 0,1 26,73 L 26,58 L 24,58 A 2,2 0 0,1 23,55 Z" />
                        </g>
                    </svg>
                    <span className="text-zinc-300 font-semibold">Home</span>
                </div>



                {/* scrolable  */}
                <div ref={scrolableContainer} className="overflow-y-auto w-full h-full ">

                    {/* Servers Dicover */}
                    <div className="border-b border-b-neutral-800 bg-gradient-to-r from-cyan-900 via-blue-950 to-neutral-950 min-h-90 w-full flex flex-col justify-center p-4 md:p-6 shrink-0">
                      <p className="font-extrabold text-5xl w-[55%] mt-20">Find Your Community on ChatHive</p>
                      <p className="text-xl text-zinc-200/50 mt-3 ">From gaming, to music, to learning, there's a place for you</p>
                         
                    </div>
                    <div className="mt-4 ml-6 text-xl font-semibold">Featured Servers</div>

                    {/* servers listing  */}
                    <div className=" flex-1 flex w-full flex-wrap gap-3 py-5 px-5">
                        {Data.map((server) => {
                            return (
                                <NavLink 
                                to= {`/channels/${server.server_id}`}
                                key={server.server_id} 
                                className=" flex flex-col  border border-zinc-700/50 min-w-48 w-[300px] min-h-[340px]  rounded-xl gap-4 transiton-all duration-300 hover:border-zinc-300/50 " >
                                    <div className="h-37 w-full rounded-t-xl bg-gradient-to-r from-cyan-800 to-neutral-950"></div>
                                    <div className="flex flex-col justify-between flex-1 gap-1 ml-4 text-zinc-400">
                                        <div className="flex flex-col">
                                            <span className="text-xl font-semibold  ">{server.server_name}</span>
                                     <span className="test-xs ">{server.server_description}</span>
                                        </div>
                                    <div className="text-xs  mb-2 float-left text-zinc-100/50">6694508 Members</div>

                                    </div>




                                </NavLink>
                            )


                        })}

                    </div>
                </div>







            </div>




        </>
    )
}