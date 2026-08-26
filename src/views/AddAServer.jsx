import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

const Api_URL = import.meta.env.VITE_API_URL;

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
    }),
};

export default function AddServer({ isOpen, onClose, userInfo ,  setData }) {
    const [FormData, setFormData] = useState({ serverName: userInfo?.username ? `${userInfo?.username}'s Server` : "", serverDescription: '', serverDest: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [[step, direction], setStepWithDirection] = useState([1, 0]);
    const navigate = useNavigate();

    const goToStep = (nextStep) => {
        const newDirection = nextStep > step ? 1 : -1;
        setStepWithDirection([nextStep, newDirection]);
    };



    if (!isOpen) return null;
  



    const HandleCreate = async (e) => {
        e.preventDefault()
        const url = `${Api_URL}/servers`

       
        try {

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ serverName: FormData.serverName , serverDescription : FormData.serverDescription , serverDest : FormData.serverDest })
            })


            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Cannot Create ');
            }

            

           setData((prev )=>({
            ...prev , 
            servers : [...prev.servers , result.newServer]
           }))

            setMessage({ text: result.message || 'Server Created Successfully!', type: 'success' });


            setFormData({serverName: '' , serverDescription: '', serverDest: ''});


            setTimeout(() => {
                onClose();
            }, 1000)


        }
        catch (error) {
            console.log(error.message);
            setMessage({ text: error.message, type: 'error' });
            if (error.message === 'Invalid token') {
                navigate('/login');
            }
            setMessage({ text: error.message, type: 'error' });
        }







    }














    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">

            {message.text && (

                        <div className={`absolute right-4  top-10 animate-auto-glide p-2 text-center text-sm font-medium rounded-xl transition-all duration-500 ease-in-out transform ${message.type === 'success'
                            ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-200 translate-x-0 opacity-100 pointer-events-auto'
                            : 'bg-red-500/20 border border-red-500 text-red-200 '
                            }`}
                            onAnimationEnd={() => setMessage({ text: '', type: '' })}>
                            {message.text}
                        </div>
                     )} 

            {/* Modal Wrapper with fixed dimensions and hidden overflow */}
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-zinc-900 border border-neutral-800/50 p-6 text-white min-h-[360px] flex flex-col justify-center">

                <AnimatePresence initial={false} custom={direction} mode="wait">

                    {/* STEP 1 */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="w-full"
                        >
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
                                onClick={() => goToStep(3)}
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
                                    onClick={() => goToStep(2)}
                                    className="w-full text-center bg-zinc-800 rounded-lg py-2.5 text-sm font-medium transition-all hover:bg-zinc-700/50"
                                >
                                    Join a Server
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="w-full"
                        >
                            <div
                                onClick={onClose}
                                className="absolute top-0 right-2 rotate-45 text-zinc-500 transition-all hover:text-white text-4xl cursor-pointer"
                            >
                                +
                            </div>

                            <div className="w-full text-center font-bold text-2xl mt-1">Join a Server</div>
                            <div className="w-full text-center text-zinc-400 text-sm mt-1">Enter an invite below to join an existing server.</div>

                            <form className="flex flex-col gap-y-1 mt-4" onSubmit={(e) => e.preventDefault()}>
                                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Invite Link</label>
                                <input
                                    type="text"
                                    placeholder="https://ChatHive.gg/Htmkfe"
                                    className="outline-none bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-sm focus:border-indigo-500 transition-colors"
                                />
                            </form>

                            <NavLink
                                to='/discovery/servers'
                                onClick={onClose}
                                className="relative w-full text-sm flex items-center p-3 bg-zinc-950/50 mt-6 border border-zinc-800 rounded-lg transition-all hover:bg-zinc-800/50 group"
                            >
                                <div className="mr-3 shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8">
                                        <rect x="10" y="10" width="80" height="80" rx="24" fill="#3A9E5D" />
                                        <circle cx="50" cy="50" r="24" fill="#FFFFFF" />
                                    </svg>
                                </div>
                                <div className="pr-8 text-left">
                                    <div className="font-semibold text-zinc-200">Don't have an invite?</div>
                                    <div className="text-xs text-zinc-400">Check out discoverable communities in Server Discovery</div>
                                </div>
                                <span className="absolute right-4 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </span>

                            </NavLink>

                            <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => goToStep(1)}
                                    className="text-zinc-400 text-sm font-medium hover:underline"
                                >
                                    Back
                                </button>
                                <button className="px-5 py-2 bg-indigo-600 rounded-lg text-sm font-medium transition-all hover:bg-indigo-500">
                                    Join Server
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="w-full"
                        >
                            <div
                                onClick={onClose}
                                className="absolute top-0 right-2 rotate-45 text-zinc-500 transition-all hover:text-white text-4xl cursor-pointer"
                            >
                                +
                            </div>

                            <div className="w-full text-center font-bold text-2xl mt-1">Customize Your Server</div>
                            <div className="w-full text-center text-zinc-400 text-sm mt-1">Give your new server a personality with a name and an icon. You can always change it later.</div>
                            <div className="flex justify-center mt-6">
                                <div className="h-20 w-20 rounded-full bg-zinc-900/50 border-4 border-dotted border-zinc-700"></div>
                            </div>

                            <form className="flex flex-col gap-y-3 mt-4" >
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-zinc-300 mb-2 ml-1">Server Name</label>
                                     <input
                                        key={userInfo?.username || "default"}
                                        type="text"
                                        value={`${FormData.serverName}`}
                                        onChange={(e) => setFormData(prev => ({ ...prev, serverName: e.target.value }))}
                                        className="w-full outline-none bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-sm mt-2 focus:border-zinc-500 transition-colors"
                                    />
                                </div>


                                <div className="text-[10px] text-zinc-400  ml-1 ">By Creating this server, you agree to ChatHive's Community guidelines. </div>

                                <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={() => goToStep(1)}
                                        className="text-blue-800 text-sm font-medium hover:underline"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => goToStep(4)}
                                        className="px-5 py-2 bg-indigo-600 rounded-lg text-sm font-medium transition-all hover:bg-indigo-500">
                                        next
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}


                    {/* STEP 4 */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="w-full"
                        >

                            <div
                                onClick={onClose}
                                className="absolute top-0 right-2 rotate-45 text-zinc-500 transition-all hover:text-white text-4xl cursor-pointer"
                            >
                                +
                            </div>

                            <div className="w-full text-center font-bold text-2xl mt-2">Tell us More About Your Server</div>
                            <div className="w-full text-center text-zinc-400 text-sm mt-2">What is Your New Server for i.e. Gaming, Study, Coding etc</div>
                           

                            <form className="flex flex-col gap-y-3 mt-6" onSubmit={HandleCreate} >
                                <div className="overflow-hidden">
                                    <label className="text-xs uppercase tracking-wider text-zinc-300 mb-2 ml-1">Server Description</label>
                                    <textarea
                                        type="text"
                                        onChange={(e) => setFormData(prev => ({ ...prev, serverDescription: e.target.value }))}
                                        className="w-full outline-none bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-sm mt-2 focus:border-zinc-500 transition-colors h-30 resize-none overflow-y-auto"
                                    />
                                </div>

                                <div className="">
                                    <label className="text-xs uppercase tracking-wider text-zinc-300 mb-2 ml-1">Server Destination</label>
                                    <input
                                        type="text"
                                        placeholder="'Pakistan' , 'USA' , 'Dubai' , 'UK'"
                                        onChange={(e) => setFormData(prev => ({ ...prev, serverDest: e.target.value }))}
                                        className="w-full outline-none bg-zinc-950 border border-zinc-800 p-2.5 rounded-lg text-sm mt-2 focus:border-zinc-500 transition-colors  "
                                    />
                                </div>


                                <div className="text-[10px] text-zinc-400  ml-1 -mt-1 ">By Creating this server, you agree to ChatHive's Community guidelines. </div>

                                <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={() => goToStep(3)}
                                        className="text-blue-800 text-sm font-medium hover:underline"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        
                                        className="px-5 py-2 bg-indigo-600 rounded-lg text-sm font-medium transition-all hover:bg-indigo-500">
                                        Create Server
                                    </button>
                                </div>
                            </form>



                        </motion.div>
                    )}


                </AnimatePresence>

            </div>
        </div>
    );
}