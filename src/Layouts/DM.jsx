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

            {/*chat area  rightbar*/}
            <div className="  bg-[#151518] border-t border-t-zinc-800 flex-1 items-center">
                <div className="flex items-center border-b border-b-neutral-800 h-13 pl-3 text-sm gap-x-2 ">

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
                    Friends
                </div>

                <div className="relative border-b border-b-neutral-800 h-45 w-full space-y-2 flex flex-col justify-center p-4">
                    <p className="text-2xl ml-1">Add Friend</p>
                    <p className="text-sm ml-1">You can Add Friends with their username</p>
                    <div className={`flex justify-between items-center h-15 w-250  rounded-2xl p-2 mt-2
                    ${isFocused ? 'border border-blue-500' : 'border border-zinc-700'
                        } `}>
                        <input
                            className=" w-200 h-12 rounded-2xl p-4 focus:outline-none focus:border-transparent focus:ring-0"
                            type="text"
                            placeholder="Type in the username"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}

                        />
                        <button className=" h-10 w-50  rounded-xl bg-indigo-500 ">Start Chatting</button>
                    </div>
                </div>

                <div className="p-6 space-y-2">
                    <p className="text-2xl">Other Places to make friends</p>
                    <p className="text-sm">Don't have a username at hand? Check out at out list of servers that include everything from gaming to cooking, music, anime and more.</p>


                    <div className="relative flex items-center border border-zinc-700 h-14 w-100 gap-x-1 rounded-xl mt-6 hover:bg-zinc-700">
                        <svg xmlns="http://w3.org" viewBox="0 0 100 100" width="50" height="50">
                            <rect x="10" y="10" width="80" height="80" rx="24" fill="#3A9E5D" />
                            <circle cx="50" cy="50" r="24" fill="#FFFFFF" />
                            <path d="M 39 58 L 47 43 L 61 42 L 53 57 Z" fill="#3A9E5D" />
                            <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
                        </svg>
                        <span className="absolute right-[5%] ">

                            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="3.5" stroke="currentColor" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>


                        </span>

                        Explore Discoverable Servers
                    </div>

                </div>





            </div>

        </>
    )
}