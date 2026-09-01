



export default function UserProfile({ isOpen, onClose, userInfo }) {





    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            {/* 
            {message.text && (

                <div className={`absolute right-4  top-10 animate-auto-glide p-2 text-center text-sm font-medium rounded-xl transition-all duration-500 ease-in-out transform ${message.type === 'success'
                    ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-200 translate-x-0 opacity-100 pointer-events-auto'
                    : 'bg-red-500/20 border border-red-500 text-red-200 '
                    }`}
                    onAnimationEnd={() => setMessage({ text: '', type: '' })}>
                    {message.text}
                </div>
            )} */}

            {/* Modal Wrapper */}




            <div className="relative w-full max-w-[650px]  overflow-hidden rounded-2xl bg-zinc-900 border border-neutral-800/50  text-white min-h-[360px] flex  justify-center">

                <div className="border border-neutral-800/90 mr-2 w-50 flex flex-col gap-y-3 ">
                    <div className="flex gap-x-3 pt-4 pl-3">
                         <img src={userInfo?.avatar}  className="h-10 w-10 rounded-full" />
                        <div className="flex items-center">{userInfo?.username}</div>
                    </div>

                    <div className="p-1">
                        <input placeholder="Search" className="outline-none focus:border-blue-900  w-full border border-neutral-800 rounded-sm pl-3 p-1" />
                    </div>

                    <div className="p-1 ">
                         <div className=" p-1 pl-3 bg-zinc-800 rounded-xl">
                        Account
                    </div>
                    </div>


                </div>






                <div className="flex-1 max-w-md p-6 ">
                     <div
                    onClick={onClose}
                    className="absolute top-0 right-2 rotate-45 text-zinc-500 transition-all hover:text-white text-4xl cursor-pointer"
                >
                    +
                </div>

                <div className="w-full text-center font-bold text-2xl mt-1">Create your Server</div>
                <div className="w-full text-center text-zinc-400 text-sm mt-2">
                    Your server is where you and your friends hangout. Make yours and start talking.
                </div>

                {/* Create Own Server Button */}
                <div

                    className="relative w-full text-sm flex items-center p-3 bg-zinc-800 mt-6 border border-neutral-700/50 rounded-lg transition-all hover:bg-zinc-700/50 cursor-pointer group"
                >
                    <div className="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="28" height="28" shapeRendering="crispEdges">
                            <rect x="3" y="3" width="10" height="7" fill="#ffffff" />
                            <rect x="3" y="3" width="10" height="3" fill="#1fc269" />
                            <rect x="5" y="6" width="1" height="1" fill="#1fc269" />
                            <rect x="7" y="6" width="2" height="1" fill="#1fc269" />
                            <rect x="10" y="6" width="1" height="1" fill="#1fc269" />
                            <rect x="4" y="6" width="1" height="1" fill="#f7cf9d" />
                            <rect x="6" y="6" width="1" height="1" fill="#f7cf9d" />
                            <rect x="9" y="6" width="1" height="1" fill="#f7cf9d" />
                            <rect x="11" y="6" width="1" height="1" fill="#f7cf9d" />
                            <rect x="3" y="7" width="10" height="1" fill="#f7cf9d" />
                            <rect x="3" y="8" width="1" height="2" fill="#e2996d" />
                            <rect x="12" y="8" width="1" height="2" fill="#e2996d" />
                            <rect x="4" y="8" width="8" height="1" fill="#f7cf9d" />
                            <rect x="4" y="9" width="8" height="1" fill="#e2996d" />
                            <rect x="5" y="10" width="6" height="1" fill="#df8b5e" />
                            <rect x="6" y="11" width="4" height="1" fill="#1c164a" />
                            <rect x="6" y="12" width="4" height="1" fill="#0f092e" />
                            <rect x="7" y="13" width="2" height="1" fill="#0c0724" />
                        </svg>
                    </div>
                    <span className="font-semibold">Create My Own</span>
                    <span className="absolute right-4 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </span>
                </div>

                <div className="mt-6 space-y-3 border-t border-zinc-800 pt-4">
                    <div className="font-semibold text-lg text-center text-sm">Have an invite already?</div>
                    <button

                        className="w-full text-center bg-zinc-800 rounded-lg py-2.5 text-sm font-medium transition-all hover:bg-zinc-700/50"
                    >
                        Join a Server
                    </button>
                </div>

                </div>


            </div>
        </div>
    );

}