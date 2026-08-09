const Api_URL = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom"


export default function DM() {
    const { setHeaderTitle } = useOutletContext() || {};



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
            <div  className="  bg-[#151518] border-t border-t-zinc-800 flex-1 items-center">
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
                
            </div>

        </>
    )
}