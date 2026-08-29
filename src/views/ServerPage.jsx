import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate, Outlet, NavLink, useOutletContext } from "react-router-dom"

import CreateChannel from "./CreateChannel"
import { useQuery, useQueryClient } from "@tanstack/react-query";
const Api_URL = import.meta.env.VITE_API_URL





const FetchChannels = async (server_id) => {

    const url = `${Api_URL}/channels/${server_id}`

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();


    if (!response.ok) {
        throw new Error(result.error || 'no servers found')
    }


    return result





}



export default function ServerPage() {
    const { server_id } = useParams()

    const [isMember, setIsMember] = useState(null)
    const [joining, setJoining] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [showMessage, setShowMessage] = useState({ message: '', type: '' });
    const { AddJoinedServers ,  setPP } = useOutletContext()
    const navigate = useNavigate()
    const queryClient = useQueryClient();
    const inputClick = useRef(null)
    const [uploadAvatar, setUploadAvatar] = useState(null)
    const ImgInputClick = useRef(null)
    const [uploadImg, setUploadImg] = useState(null)





    const { data = { Channels: [], Serverinfo: [], role: [] }, error } = useQuery({
        queryKey: ['FetchChannels', server_id],
        queryFn: () => FetchChannels(server_id)
    })


    const currentAvatar = uploadAvatar || data?.Serverinfo?.[0]?.avatar;
    const currentImg = uploadImg || data?.Serverinfo?.[0]?.server_img;




    const isAuthorized = Boolean(Array.isArray(data?.role) && data.role.length > 0)



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


      console.log(error?.message)
    }, [ error])



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


                if (!response.ok) {
                    throw new Error(result.error || 'no servers found')
                }


                setIsMember(result.ismember)





            }
            catch (error) {
                setIsMember(false)
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


            if (!response.ok) {
                throw new Error(result.error || 'no servers found')
            }


            setShowMessage({ message: result.message || 'Server Join Successfull', type: 'success' });



            if (result?.serverInfo && AddJoinedServers) {
                AddJoinedServers(result.serverInfo)
            }

            setIsMember(true);





        }
        catch (error) {

            console.log(error.message)
            setIsMember(false);
            setShowMessage({ message: error.message || 'Already a Member', type: 'error' });
            if (error.message === 'Invalid token') {
                navigate('/login');
            }

        }
        finally {
            setJoining(false)
        }




    }


    const HandleNewChannel = (channel) => {
        queryClient.setQueryData(['FetchChannels', server_id], (prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                Channels: [...(prev.Channels || []), channel]
            }
        })
    }


    const HandleThePPChange = () => {
        if (isAuthorized &&inputClick.current) {
            inputClick.current.click()
        }
    }

    const HandleThePPChangePost = async (e) => {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const url = `${Api_URL}/avatar-upload/${server_id}`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: formData
            })

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Profile Picture Set Failed')
            }
            console.log(result);
            setUploadAvatar(result.avatar);
            setPP({pp : result.avatar , id : data?.Serverinfo?.[0]?.server_id})
            queryClient.invalidateQueries(['FetchChannels', server_id]);
            queryClient.invalidateQueries(['FetchServersMe'])
            queryClient.invalidateQueries(['FetchServersjoined'])
            
            

        } catch (error) {
            console.log(error.message);
        }






        // if (file){
        //     const url = URL.createObjectURL(file);
        //     setServerAvatar(url)
        // }

        console.log('Hi My firend');
    }


     const HandleTheImgChangePost = async (e) => {
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('Image', file);

        try {
            const url = `${Api_URL}/img-upload/${server_id}`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                },
                body: formData
            })

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Profile Picture Set Failed')
            }
            console.log(result);
            setUploadImg(result.server_img);
            queryClient.invalidateQueries(['FetchChannels', server_id]);

        } catch (error) {
            console.log(error.message);
        }

        // if (file){
        //     const url = URL.createObjectURL(file);
        //     setUploadImg(url)
        // }

        console.log('Hi My friend');
    }







    return (
        <>
            <div className="flex w-full relative">


                <div className="flex-none relative  w-80 h-full flex flex-col  rounded-l-xl border-t border-l border-zinc-800  ">
                    <div
                        style={{

                            backgroundColor: `rgba(24, 24, 27, ${navOpacity})`,
                        }}
                        className={`absolute top-0 left-0 z-40 flex flex items-center text-zinc-300 justify-between font-bold  border-b h-13 pl-4 text-lg gap-x-3 shrink-0 w-full  transition-all  ${navOpacity > 0.8 ? 'border-b-zinc-800/50 shadow-md' : 'border-b-transparent hover:!bg-zinc-950/50 '
                            }`}
                    >

                        <div className="flex gap-x-2 justify-center items-center">


                            {/* the server PP   */}
                            <div className="h-8 w-8 bg-zinc-700 rounded-full flex-shrink-0 flex justify-center items-center text-yellow-500" onClick={HandleThePPChange} >{currentAvatar || data?.Serverinfo?.[0]?.avatar ?
                                (<>
                                    <img src={currentAvatar || data?.Serverinfo?.[0]?.avatar} alt="avatar" className="h-full w-full object-cover rounded-full" />

                                </>
                                ) : (
                                    data?.Serverinfo?.[0]?.server_name ? data?.Serverinfo?.[0]?.server_name.charAt(0).toUpperCase() : '?'
                                )
                            }


                            </div>





                            {data?.Serverinfo?.[0]?.server_name}

                        </div>
                        <input type="file" ref={inputClick} className="hidden" onChange={(e) => HandleThePPChangePost(e)} accept="image/*" />

                        {
                            isMember ?
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
                                isMember === null ? (

                                    <div className="w-12 h-12 mr-3" />
                                ) : (<button onClick={HandleServerJoin} className="relative p-2 bg-green-500/50 text-sm p-1.5 rounded-xl mr-3 transition-all shrink-0 hover:bg-green-700/50 ">Join Server</button>)

                        }

                    </div>


                    <div className="w-full min-h-40 bg-neutral-800 rounded-tl-xl absolute top-0  left-0 flex items-center justify-center" >
                        {currentImg && (
                            <img src={currentImg || data?.Serverinfo?.[0]?.server_img} alt="avatar" className="h-40 w-full object-cover rounded-tl-xl " />
                        )}

                        {isAuthorized && (
                        <button
                            onClick={() => ImgInputClick?.current?.click()}
                            className={`absolute bottom-3 right-3 z-30 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-lg transition-all duration-200 border border-white/20 shadow-lg ${navOpacity > 0.05
                                    ? 'opacity-0 scale-90 pointer-events-none'
                                    : 'opacity-100 scale-100 pointer-events-auto'
                                }`}
                            title="Change Banner"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                         )}




                    </div>
                    <input type="file" ref={ImgInputClick} className="hidden" onChange={(e) => HandleTheImgChangePost(e)} accept="image/*" />





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

                            <div className="w-full flex flex-col px-2 ">

                                <div className="flex items-center  justify-between  pl-7 text-zinc-400 transition-all my-3">
                                    <div className="flex items-center group">
                                        <div className=" inline w-10 h-0 border border-zinc-400 transition-all  group-hover:border-white "></div>
                                        <div className="transition-all  group-hover:text-white mx-1 text-sm">Welcome & Info</div>
                                        <div className=" inline w-8 h-0  border border-zinc-400 transition-all  group-hover:border-white "></div>
                                    </div>
                                    {isAuthorized && (
                                        <div
                                            onClick={() => setIsOpen(true)}
                                            className=" relative text-2xl mr-2 pb-1 group hover:text-white cursor-pointer select-none">
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
                                                key={channel.channel_id}
                                                className={({ isActive }) =>
                                                    `w-full  py-1 pl-2 rounded-xl transition-all text-zinc-400 ${isActive ? 'bg-zinc-700/70 text-white font-medium' : 'hover:bg-zinc-500/30'
                                                    }`
                                                }
                                            >
                                                <span># {channel.channel_name}</span>
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
                    <Outlet context={data.Channels} />
                </div>

            </div>


            {isOpen && <CreateChannel
                server_id={server_id}
                isOpen
                onclose={() => setIsOpen(false)}
                onChannelCreated={HandleNewChannel} />}


        </>
    )
}