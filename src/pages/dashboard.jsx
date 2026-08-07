import { useEffect, useState } from "react"
import { useNavigate, Link } from 'react-router-dom';

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
                setError(error)
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
                    <div className="flex gap-2  ml-2 ">
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
                            <div className="absolute left-full  py-1 px-3  bg-zinc-600 rounded-xl flex items-center justify-center opacity-0 font-black text-base pointer-events-none top-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity peer-hover:opacity-100 " >Direct Messages
                                <div className="absolute -left-2 h-0 w-0 border-y-[8px] rounded-sm  border-y-transparent border-r-[13px] border-r-zinc-600" />

                            </div>
                        </div>

                            {/*Personal Server*/}
                        <div className="relative flex justify-center items-center  w-20">
                            <span className=" peer flex h-12 w-12 cursor-pointer mt-1 ml-1 items-center justify-center bg-zinc-800  text-white transition-all duration-200 ease-in-out rounded-2xl hover:bg-[#5865f2] ">
                                owner
                            </span>
                            <div className="absolute left-0 w-1 bg-white h-0 rounded-r-full transition-all duration-300 peer-hover:h-7" />
                            <div className="absolute left-full  py-1 px-3  bg-zinc-600 rounded-xl flex items-center justify-center opacity-0 font-black text-base pointer-events-none top-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity peer-hover:opacity-100 " >Muhammads Server
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
                                <div className="absolute left-full  py-1 px-3  bg-zinc-600 rounded-xl flex items-center justify-center opacity-0 font-black text-base pointer-events-none top-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity peer-hover:opacity-100 " >{item.server_name}
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

                            <div className="absolute left-full  py-1 px-3  bg-zinc-600 rounded-xl flex items-center justify-center opacity-0 font-black text-base pointer-events-none top-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity peer-hover:opacity-100 " >Add a Server
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
                            <div className="absolute left-full py-1 px-3  bg-zinc-600 rounded-xl flex items-center justify-center opacity-0 font-black text-base pointer-events-none top-1/2 -translate-y-1/2 whitespace-nowrap transition-opacity peer-hover:opacity-100 " >Discover
                                <div className="absolute -left-2 h-0 w-0 border-y-[8px] rounded-sm  border-y-transparent border-r-[13px] border-r-zinc-600" />

                            </div>
                        </div>





                    </div>

                    {/*channels list middlebar*/}
                    <div className="flex-none p-3 w-90 flex flex-col   border border-blue-500 ">this is ur channels list</div>
                     {/*chat area  rightbar*/}
                    <div className="flex flex-col flex-1 items-center justify-center align-center   border border-pink-500 ">this is ur chat area</div>

                </div>

            </div>


        </>
    )
}