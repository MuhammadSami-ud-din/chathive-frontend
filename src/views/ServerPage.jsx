import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
const Api_URL = import.meta.env.VITE_API_URL

export default function ServerPage() {
    const { server_id } = useParams()
    const [data, setData] = useState({ channels: [], Serverinfo: [] })
    const navigate = useNavigate()
    const [isScrolled, setIsScrolled] = useState(false);


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
                    className={`absolute top-0 left-0 z-50 flex items-center text-blue-500 border-b h-13 pl-3 text-sm gap-x-3 shrink-0 w-full ${navOpacity > 0.8 ? 'border-b-zinc-800/50 shadow-md' : 'border-b-transparent'
                        }`}
                >
                    {data?.Serverinfo?.[0]?.server_name}
                </div>


                <div className="w-full  min-h-40 bg-blue-300 rounded-tl-xl absolute top-0 z-0 left-0 "> hi mera naam Sami hai tu kon hai be</div>

                <div
                    onScroll={handleScroll}

                    className="overflow-y-auto z-10 h-full w-full pt-40 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ">

                    <div className="h-[1000px] bg-zinc-900 "></div>

                </div>





            </div>


            {/* {Right Side} */}
            <div className={`relative  bg-[#151518] border-t border-t-zinc-800 flex-1 flex flex-col min-w-0 overflow-hidden  `}>









            </div>




        </>
    )
}