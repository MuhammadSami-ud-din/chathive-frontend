import { useState  } from "react";
import { NavLink } from "react-router-dom";
export default function DMFriends(){
     const [isFocused, setIsFocused] = useState(false);
 return(
    <>
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


                    <div className={`relative flex items-center h-14 w-full max-w-4xl rounded-xl p-1 mt-4 transition-all duration-200
            ${isFocused ? 'border border-blue-500 bg-zinc-900/50' : 'border border-zinc-700 bg-transparent'}`}
                    >
                        <input
                            className="flex-1 min-w-0 h-full bg-transparent text-zinc-100 px-3 text-sm  focus:outline-none"
                            type="text"
                            placeholder="Type in the username"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                        <button className="h-full max-h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs md:text-sm font-medium text-white transition-colors mr-1 shrink-0">
                            Start Chatting
                        </button>

                        <div className="absolute right-0 -top-26 max-w-[110px] ">
                            <svg xmlns="http://w3.org" viewBox="0 0 240 240" width="100%" height="100%">
                                <g id="wumpus-mascot" transform="translate(10, 35)">
                                    <path d="M 64 140 L 46 122 L 28 140 L 46 158 Z" fill="#FFFFFF" />
                                    <path d="M 46 122 Q 54 136, 46 158" stroke="#D5D8DC" strokeWidth="1.5" fill="none" />
                                    <path d="M 47 121 L 32 106 C 26 100, 16 110, 22 116 L 31 125 L 25 125 C 18 125, 18 135, 25 135 L 43 135 Z" fill="#5865F2" />

                                    <rect x="36" y="85" width="20" height="34" rx="10" fill="#4752C4" />
                                    <rect x="40" y="89" width="12" height="26" rx="6" fill="#5865F2" />
                                    <rect x="156" y="85" width="20" height="34" rx="10" fill="#4752C4" />
                                    <rect x="160" y="89" width="12" height="26" rx="6" fill="#5865F2" />

                                    <rect x="48" y="62" width="116" height="84" rx="36" fill="#5865F2" />

                                    <path d="M 148 64 C 158 72, 166 90, 162 110 C 159 123, 152 133, 142 140 C 154 131, 165 109, 159 85 C 156 75, 150 68, 148 64 Z" fill="#F47FFF" opacity="0.65" />

                                    <circle cx="70" cy="94" r="4.5" fill="#111214" />
                                    <circle cx="140" cy="94" r="4.5" fill="#111214" />

                                    <rect x="82" y="88" width="48" height="32" rx="15" fill="#727EFF" />
                                    <ellipse cx="94" cy="104" rx="4" ry="3" fill="#111214" />
                                    <ellipse cx="118" cy="104" rx="4" ry="3" fill="#111214" />

                                    <path d="M 116 130 Q 124 133, 129 125" stroke="#111214" strokeWidth="4.5" fill="none" strokeLinecap="round" />

                                    <g transform="translate(102, 42) rotate(12) translate(-102, -42)">
                                        <path d="M 94 44 C 74 44, 78 26, 104 14 C 116 16, 132 24, 140 36 C 124 38, 108 44, 94 44 Z" fill="#2E8B4C" />
                                        <path d="M 104 14 C 120 12, 142 16, 154 30 C 151 34, 143 36, 140 36 C 132 24, 116 16, 104 14 Z" fill="#3CE077" />
                                        <path d="M 104 40 Q 106 48, 112 52" stroke="#2E8B4C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                                    </g>

                                    <path d="M 52 144 C 58 141, 68 140, 76 140 L 136 140 C 144 140, 154 141, 160 144 L 168 190 L 44 190 Z" fill="#FFFFFF" />

                                    <line x1="104" y1="140" x2="104" y2="190" stroke="#232428" strokeWidth="5" />
                                    <path d="M 96 146 L 112 146 L 108 162 L 100 162 Z" fill="#232428" />
                                    <circle cx="104" cy="156" r="2" fill="#FFFFFF" />

                                    <path d="M 132 190 C 132 178, 140 172, 154 176" stroke="#D5D8DC" strokeWidth="2" fill="none" />
                                    <path d="M 128 190 C 128 178, 138 172, 150 176 C 156 179, 158 190, 158 190 Z" fill="#5865F2" />
                                </g>
                            </svg>




                        </div>
                    </div>

                </div>

                {/* Discover Section */}
                <div className="p-4 md:p-6 flex-1 overflow-y-auto">
                    <p className="text-xl md:text-2xl font-semibold text-zinc-100">Other Places to make friends</p>
                    <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl">
                        Don't have a username at hand? Check out our list of servers that include everything from gaming to cooking, music, anime and more.
                    </p>


                    <NavLink
                    to = '/discovery/servers'
                    className="relative flex items-center border border-zinc-700 h-14 w-full max-w-sm pr-12 rounded-xl mt-6 hover:bg-zinc-800/50 cursor-pointer group transition-colors">
                        <div className="flex items-center justify-center w-14 h-14 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-10 h-10">
                                <rect x="10" y="10" width="80" height="80" rx="24" fill="#3A9E5D" />
                                <circle cx="50" cy="50" r="24" fill="#FFFFFF" />
                                <path d="M 39 58 L 47 43 L 61 42 L 53 57 Z" fill="#3A9E5D" />
                                <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
                            </svg>
                        </div>

                        <span className="text-sm font-medium text-zinc-200 pl-1 select-none font-semibold">
                            Explore Discoverable Servers
                        </span>

                        <span className="absolute right-4 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </span>
                    </NavLink>

                </div>
            </div>

    
    
    </>
 )




}