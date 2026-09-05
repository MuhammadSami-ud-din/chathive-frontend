import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { useState } from "react";
const Api_URL = import.meta.env.VITE_API_URL;




export default function UserProfile({ isOpen, onClose, userInfo }) {
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();
    if (!isOpen) return;


    const HandleLogOut = () => {
        socket.disconnect()
        localStorage.removeItem('authToken')
         setMessage({ text: 'Logged Out!!!', type: 'success' });
        setTimeout(() => {
            navigate('/login');
        }, 2000)
    }


    const HandleDelAcc = async () => {
        const url = `${Api_URL}/delete/account`

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            })

            const result = response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Cannot Delete');
            }

            setMessage({ text: result.message || 'Account deleted successfully!', type: 'success' });

            setTimeout(() => {
                navigate('/login');
            }, 2000)
        }
        catch(error) {
            console.log(error);
            setMessage({ text: error.message, type: 'error' });
        }
        }





    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
            
             {message.text && (

                        <div className={`fixed top-8 right-4 animate-auto-glide p-2 text-center text-sm font-medium rounded-xl transition-all duration-500 ease-in-out transform ${message.type === 'success'
                            ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-200 translate-x-0 opacity-100 pointer-events-auto'
                            : 'bg-red-500/20 border border-red-500 text-red-200  translate-x-0 opacity-100 pointer-events-auto '
                            }`}
                            onAnimationEnd={() => setMessage({ message: '', type: '' })}>
                            {message.text}
                        </div>
                    )}







            <div className="relative w-full max-w-[650px]  overflow-hidden rounded-2xl bg-zinc-900 border border-neutral-800/50  text-white min-h-[360px] flex  justify-center">

                <div className="border-r border-neutral-800/90  w-50 flex flex-col gap-y-3 ">
                    <div className="flex gap-x-3 pt-4 pl-3">
                        <img src={userInfo?.avatar} className="h-10 w-10 rounded-full" />
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






                <div className=" relative flex-1 max-w-md  ">

                    <div className="absolute top-0 flex justify-between w-full p-1 border-b border-neutral-800">
                        <div className="flex items-center text-zinc-400 pl-3">Account</div>
                        <div
                            onClick={onClose}
                            className=" rotate-45 text-zinc-500 transition-all hover:text-white text-4xl cursor-pointer mr-2 flex items-center"
                        >
                            +
                        </div>

                    </div>


                    <div className="px-10 p-6 mt-10 space-y-10">

                        <div className="text-xl text-zinc-400 font-bold">
                            Account
                        </div>

                        <div className="flex justify-between">
                            <div className="text-sm text-zinc-400 font-bold">
                                Username
                            </div>
                            <div className="text-sm text-zinc-400">{userInfo?.username}</div>
                        </div>

                        <div className="flex justify-between">
                            <div className="text-sm text-zinc-400 font-bold">
                                Email
                            </div>
                            <div className="text-sm text-zinc-400">{userInfo?.email}</div>
                        </div>

                        <div className="flex justify-between">
                            <div className="text-sm text-zinc-400 font-bold">
                                Phone No.
                            </div>
                            <div className="text-sm text-zinc-300">You have not added any Numbers yet.</div>
                        </div>



                        <div className="mt-6 space-y-3 border-t border-zinc-800 pt-4">

                            <div className="flex w-full justify-between">
                                <div className="font-semibold text-lg text-zinc-300  text-center text-sm flex  items-center ">Log Out from this Account</div>
                                <button
                                    onClick={HandleLogOut}
                                    className="w-30 text-center text-zinc-300  bg-red-800/50 rounded-lg py-2.5 text-sm font-medium transition-all hover:bg-red-700/50"
                                >
                                    Log Out
                                </button>
                            </div>

                            <div className="flex w-full justify-between">
                                <div className="font-semibold text-zinc-300 text-lg text-center text-sm flex  items-center ">Delete this Account</div>
                                <button
                                    onClick={HandleDelAcc}
                                    className="w-30 text-center text-zinc-300  bg-red-800/50 rounded-lg py-2.5 text-sm font-medium transition-all hover:bg-red-700/50"
                                >
                                    Delete Account
                                </button>
                            </div>






                        </div>
                    </div>

                </div>


            </div>
        </div>
    );

}