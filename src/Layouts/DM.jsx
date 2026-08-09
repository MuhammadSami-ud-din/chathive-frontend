const Api_URL = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom"


export default function DM() {
    const { setHeaderTitle } = useOutletContext() || {};
    const [isFocused, setIsFocused] = useState(false);



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
                        {/* Head on Top-Right */}
                        <circle cx="16" cy="5.5" r="3" />

                        {/* Body + High Raised Waving Hand (Up-Left) */}
                        <path d="M6.5 4c-.8 0-1.5.7-1.5 1.5 0 3 2 5.5 4.5 6.5V18c0 1.1.9 2 2 2h5.5c1.1 0 2-.9 2-2v-4c0-3.3-2.7-6-6-6h-1.5c-1.3 0-2.5-.7-3.2-1.8L6.5 4z" />
                    </svg>
                    <span className="text-neutral-300 font-medium">Friends</span>
                </div>
            );
        }





    }, [setHeaderTitle])



    return (
        <>
            {/*channels list middlebar*/}
            <div className="flex-none  w-80 h-full flex flex-col  rounded-l-xl border-t border-l border-zinc-800 ">
                <div className="flex items-center border-b border-b-neutral-800 h-13 justify-center">
                    <button className="w-72 h-8  bg-neutral-800 text-sm text-zinc-100 rounded-xl transition-colors hover:bg-neutral-700 ">Find or Start a Conversation</button>
                </div>
                <div className="h-17 flex items-center justify-center border-b border-b-neutral-800 mt-1  ">

                    <span className=" flex  gap-x-3 pl-1 p-2 w-72 h-10 text-zinc-200 font-semibold  bg-neutral-800 rounded-xl   transition-colors hover:bg-neutral-700">
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
                        Friends</span>
                </div>

                <div className=" flex-1 -100 mt-2 overflow-scroll ">
                    <span className="block w-full h-7 pl-3 text-sm text-zinc-500 hover:text-zinc-100 ">Direct Messages</span>

                    <div className="pl-3 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]">
                        {[...Array(12)].map((_, index) => (
                            <div key={index} className="flex items-center space-x-3 py-2 opacity-50">
                                <div className="h-8 w-8 bg-zinc-700 rounded-full flex-shrink-0" />
                                <div className="h-5 w-50 bg-zinc-700 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>




            </div>



            {/* chat area rightbar */}
<div className="bg-[#151518] border-t border-t-zinc-800 flex-1 flex flex-col min-w-0">
    <div className="flex items-center border-b border-b-neutral-800 h-13 pl-3 text-sm gap-x-2 shrink-0">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-zinc-300 transition-colors cursor-pointer"
        >
            <circle cx="16" cy="5.5" r="3" />
            <path d="M6.5 4c-.8 0-1.5.7-1.5 1.5 0 3 2 5.5 4.5 6.5V18c0 1.1.9 2 2 2h5.5c1.1 0 2-.9 2-2v-4c0-3.3-2.7-6-6-6h-1.5c-1.3 0-2.5-.7-3.2-1.8L6.5 4z" />
        </svg>
        <span className="text-zinc-300">Friends</span>
    </div>

    {/* Input Section */}
    <div className="border-b border-b-neutral-800 min-h-45 w-full flex flex-col justify-center p-4 md:p-6 shrink-0">
        <p className="text-xl md:text-2xl font-semibold text-zinc-100">Add Friend</p>
        <p className="text-xs md:text-sm text-zinc-400 mt-1">You can Add Friends with their username</p>
        
        
        <div className={`flex items-center h-14 w-full max-w-4xl rounded-xl p-1 mt-4 transition-all duration-200
            ${isFocused ? 'border border-blue-500 bg-zinc-900/50' : 'border border-zinc-700 bg-transparent'}`}
        >
            <input
                className="flex-1 min-w-0 h-full bg-transparent text-zinc-100 px-3 text-sm  focus:outline-none"
                type="text"
                placeholder="Type in the username"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            <button className="h-full max-h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs md:text-sm font-medium text-white transition-colors shrink-0">
                Start Chatting
            </button>
        </div>
    </div>

    {/* Discover Section */}
    <div className="p-4 md:p-6 flex-1 overflow-y-auto">
        <p className="text-xl md:text-2xl font-semibold text-zinc-100">Other Places to make friends</p>
        <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl">
            Don't have a username at hand? Check out our list of servers that include everything from gaming to cooking, music, anime and more.
        </p>

        
        <div className="relative flex items-center border border-zinc-700 h-14 w-full max-w-sm pr-12 rounded-xl mt-6 hover:bg-zinc-800/50 cursor-pointer group transition-colors">
            <div className="flex items-center justify-center w-14 h-14 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-10 h-10">
                    <rect x="10" y="10" width="80" height="80" rx="24" fill="#3A9E5D" />
                    <circle cx="50" cy="50" r="24" fill="#FFFFFF" />
                    <path d="M 39 58 L 47 43 L 61 42 L 53 57 Z" fill="#3A9E5D" />
                    <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
                </svg>
            </div>
            
            <span className="text-sm font-medium text-zinc-200 pl-1 select-none">
                Explore Discoverable Servers
            </span>

            <span className="absolute right-4 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </span>
        </div>
    </div>
</div>


         





            

        </>
    )
}