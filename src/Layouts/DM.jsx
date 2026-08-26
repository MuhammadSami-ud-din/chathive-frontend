const Api_URL = import.meta.env.VITE_API_URL;

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useOutletContext, useNavigate } from "react-router-dom"





const fetchDM = async () => {
const url = `${Api_URL}/messages/dm`

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();


    if (!response.ok) {
        throw new Error(result.error || 'No DM found')
    }
    return result

}


export default function DM() {
    const { setHeaderTitle } = useOutletContext() || {};
  
    const [conversationId, setConversationId] = useState(null)
    const navigate = useNavigate()
    







    useEffect(() => {
        if (setHeaderTitle) {
            setHeaderTitle(
                <div className="flex items-center gap-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer"
                    >

                        <circle cx="16" cy="5.5" r="3" />


                        <path d="M6.5 4c-.8 0-1.5.7-1.5 1.5 0 3 2 5.5 4.5 6.5V18c0 1.1.9 2 2 2h5.5c1.1 0 2-.9 2-2v-4c0-3.3-2.7-6-6-6h-1.5c-1.3 0-2.5-.7-3.2-1.8L6.5 4z" />
                    </svg>
                    <span className="text-neutral-300 font-medium">Friends</span>
                </div>
            );
        }
        return () => {
            setHeaderTitle(null);
        };


    }, [setHeaderTitle])



    const { data = {success : false , data: []} , error } = useQuery({
        queryKey : ['Dmlist'],
        queryFn : fetchDM
    })



    useEffect(() => {
            if (error?.message === 'Invalid token') {
                navigate('/login');
            }

       

    
       

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error , navigate])


const GetOrCreate = async (receiver_id) => {
    const url = `${Api_URL}/messages/get_Create/${receiver_id}`

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
            throw new Error(result.error || 'Error')
        }
        setConversationId(result?.conversation?.conversation_id)




    }
    catch (error) {
        console.log(error.message)
        if (error.message === 'Invalid token') {
            navigate('/login');
        }

    }



}



return (
    <>
        {/*DM list middlebar*/}
        <div className="flex-none  w-80 h-full flex flex-col  rounded-l-xl border-t border-l border-zinc-800 ">
            <div className="flex items-center border-b border-b-neutral-800 h-13 justify-center">
                <button className="w-72 h-8  bg-neutral-800 text-sm text-zinc-100 rounded-xl transition-colors hover:bg-zinc-100/10" >Find or Start a Conversation</button>
            </div>
            <div

                className="h-17 flex items-center justify-center border-b border-b-neutral-800 mt-1  ">

                <NavLink
                    to="/@me"
                    end
                    className={({ isActive }) => ` flex  gap-x-3 pl-1 p-2 w-72 h-10 text-zinc-200 font-semibold   rounded-xl   transition-colors   ${isActive ? "bg-zinc-100/10" : " bg-neutral-800 hover:bg-zinc-100/10"}`} >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="CurrentColor"
                        className="w-6 h-6 text-zinc-300  transition-colors cursor-pointer"
                    >
                        {/* Head on Top-Right */}
                        <circle cx="16" cy="5.5" r="3" />

                        {/* Body + High Raised Waving Hand (Up-Left) */}
                        <path d="M6.5 4c-.8 0-1.5.7-1.5 1.5 0 3 2 5.5 4.5 6.5V18c0 1.1.9 2 2 2h5.5c1.1 0 2-.9 2-2v-4c0-3.3-2.7-6-6-6h-1.5c-1.3 0-2.5-.7-3.2-1.8L6.5 4z" />
                    </svg>
                    Friends</NavLink>
            </div>

            <div className=" flex-1  mt-2 overflow-scroll p-2 ">
                <span className="block w-full h-7  text-sm text-zinc-500 hover:text-zinc-100 ">Direct Messages</span>


                {(!data.data || data.data.length === 0) ?
                    <div className="pl-3 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]">
                        {[...Array(12)].map((_, index) => (
                            <div key={index} className="flex items-center space-x-3 py-2 opacity-50">
                                <div className="h-8 w-8 bg-zinc-700 rounded-full flex-shrink-0" />
                                <div className="h-5 w-50 bg-zinc-700 rounded-full" />
                            </div>
                        ))}
                    </div> :
                    data.data.map((user) => (
                        <NavLink
                            to={`/@me/${user.id}`}
                            key={user.id}
                            onClick={() => GetOrCreate(user.id)}
                            className={({ isActive }) =>
                                `
        w-full flex items-center p-2 space-x-1 rounded-xl mb-2 mt-2 transition-all duration-150 group
        bg-gradient-to-r from-black via-teal-950 to-emerald-900
        hover:shadow-[0_0_20px_-10px_rgba(34,197,94,0.4)] hover:opacity-100
        ${isActive ? 'opacity-100 ring-1 ring-emerald-500/30' : 'opacity-50'}
    `}>
                            <div className="h-8 w-8 bg-zinc-700 rounded-full flex-shrink-0 flex justify-center items-center" >{user?.avatar  ? 
                            (
                        <img src={data.user.avatar} alt="avatar" className="h-full w-full object-cover rounded-full" />
                    ) : (
                        user?.username ? user?.username.charAt(0).toUpperCase() : '?'
                    ) 
                    }</div>
                            <div className="h-8 w-full  flex flex-1 items-center p-2 text-zinc-300 group-hover:text-neutral-100" >{user.username}</div>
                        </NavLink>
                    ))



                }

            </div>




        </div>



        



        {/* chat area rightbar */}
        <div className="bg-[#151518] border-t border-t-zinc-800 flex-1 flex flex-col min-w-0">
            <Outlet context={{ conversationId, setConversationId }} />
        </div>










    </>
)
}