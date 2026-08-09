import { useEffect } from "react";
import { useOutletContext } from "react-router-dom"


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
            <div className="flex-none  w-80 h-full flex flex-col  rounded-xl border-t border-l border-zinc-800 ">
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

                <div className=" flex-1 -100 mt-2  ">
                    <span className="block w-full h-7 pl-3 text-sm text-zinc-500 hover:text-zinc-100 ">Direct Messages</span>
                </div>




            </div>

            {/*chat area  rightbar*/}
            <div className="flex flex-col flex-1 items-center justify-center align-center bg-zinc-500">

                <svg viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-90 h-90 select-none">

                    <rect x="20" y="42" width="185" height="32" rx="16" fill="#1E1F22" />
                    <rect x="15" y="125" width="190" height="42" rx="21" fill="#1E1F22" />


                    <g>
                        <rect x="52" y="38" width="120" height="36" rx="6" stroke="#35363C" strokeWidth="1.5" fill="#18191C" />
                        <path d="M 52 50 L 45 54 L 52 58" stroke="#35363C" strokeWidth="1.5" fill="#18191C" />
                        <text x="62" y="61" fill="#2B2D31" fontSize="13" letterSpacing="2.5" fontWeight="bold">★★★★★★★★★</text>
                    </g>


                    <circle cx="68" cy="22" r="2.5" stroke="#35363C" strokeWidth="1.2" fill="none" />
                    <path d="M 188 60 L 194 60 M 191 57 L 191 63" stroke="#35363C" strokeWidth="1.2" />

                    <g>
                        <rect x="75" y="70" width="125" height="48" rx="6" fill="#2B2D31" />
                        <path d="M 200 88 L 207 93 L 200 98 Z" fill="#2B2D31" />
                        <text x="88" y="90" fill="#1E1F22" fontSize="11" letterSpacing="2">★★★★★★★★</text>
                        <text x="98" y="106" fill="#1E1F22" fontSize="11" letterSpacing="2">★★★★★★★</text>
                    </g>


                    <g>
                        <rect x="42" y="122" width="110" height="36" rx="6" stroke="#35363C" strokeWidth="1.5" fill="#18191C" />
                        <path d="M 42 134 L 35 138 L 42 142" stroke="#35363C" strokeWidth="1.5" fill="#18191C" />
                    </g>


                    <path d="M 136 148 L 142 148 M 139 145 L 139 151 M 137 146 L 141 150 M 141 146 L 137 150" stroke="#35363C" strokeWidth="1" />
                    <path d="M 166 158 L 168 162 L 172 164 L 168 166 L 166 170 L 164 166 L 160 164 L 164 162 Z" fill="#35363C" />


                    <g transform="translate(58, 106)">
                        <path d="M18 6 L14 38 M30 6 L26 38 M6 16 L36 16 M4 28 L34 28" stroke="#585A63" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                </svg>

                <h1 className="text-xl mb-2 font-bold text-zinc-400">NO TEXT CHANNELS</h1>
                <p className="w-120 flex text-center font-medium text-sm text-zinc-400">You find yourself in a strange place. You don't have access to any text channels, or there are none in this server.</p>
            </div>

        </>
    )
}