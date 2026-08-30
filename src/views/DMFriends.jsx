import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useOutletContext, useLocation } from "react-router-dom";

const Api_URL = import.meta.env.VITE_API_URL;

export default function DMFriends() {
    const [isFocused, setIsFocused] = useState(false);
    const [userName, setUserName] = useState('');
    const [searchedUsers, setSearchedUsers] = useState([]);
    const queryClient = useQueryClient();
    const location = useLocation();
    const navigate = useNavigate();
    const { setConversationId } = useOutletContext() || {};

    useEffect(() => {
        if (!userName.trim()) {
            setSearchedUsers([]);
            return;
        }

        const fetchUsers = setTimeout(async () => {
            const url = `${Api_URL}/users/search?query=${encodeURIComponent(userName)}`;

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
                    throw new Error(result.error || 'No users found');
                }

                setSearchedUsers(result.data || []);
            } catch (error) {
                console.error(error.message);

            }
        }, 300);

        return () => clearTimeout(fetchUsers);
    }, [userName, navigate]);

    const GetOrCreate = async (receiver_id) => {
        const url = `${Api_URL}/messages/get_Create/${receiver_id}`;

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
                throw new Error(result.error || 'Error creating conversation');
            }

            if (setConversationId) {
                setConversationId(result?.conversation?.conversation_id);
            }

            queryClient.setQueryData(['Dmlist'], (oldData) => {

                if (!oldData) return { success: true, data: [result.conversation] }

                return {
                    ...oldData,
                    data: [...oldData.data, result.FriendsInfo]
                }
            })



            setUserName('');
            setSearchedUsers([]);

            navigate(`/@me/${receiver_id}`);
        } catch (error) {
            console.error(error.message);
            if (error.message === 'Invalid token') {
                navigate('/login');
            }
        }
    };

    return (
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
                <span className="text-zinc-300 font-medium">Friends</span>
            </div>

            <div className="border-b border-b-neutral-800 min-h-45 w-full flex flex-col justify-center p-4 md:p-6 shrink-0">
                <p className="text-xl md:text-2xl font-semibold text-zinc-100">Add Friend</p>
                <p className="text-xs md:text-sm text-zinc-400 mt-1">You can add friends with their username</p>

                <div className={`relative flex items-center h-14 w-full max-w-4xl rounded-xl p-1 mt-4 transition-all duration-200
                    ${isFocused ? 'border border-blue-500 bg-zinc-900/50' : 'border border-zinc-700 bg-transparent'}`}
                >
                    <input
                        className="flex-1 min-w-0 h-full bg-transparent text-zinc-100 px-3 text-sm focus:outline-none"
                        type="text"
                        placeholder="Type in the username"
                        value={userName}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    <button
                        onClick={() => searchedUsers.length > 0 && GetOrCreate(searchedUsers[0].id)}
                        className="h-full max-h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs md:text-sm font-medium text-white transition-colors mr-1 shrink-0"
                    >
                        Start Chatting
                    </button>

                    {userName.trim() && (
                        <div className="absolute left-0 top-full mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 z-50 shadow-xl max-h-60 overflow-y-auto">
                            {searchedUsers.length > 0 ? (
                                searchedUsers.map((user) => {
                                    const isActive = location.pathname === `/@me/${user.id}`;

                                    return (
                                        <div
                                            key={user.id}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                GetOrCreate(user.id);
                                            }}
                                            className={`
                                                w-full flex items-center p-2 space-x-3 rounded-xl mb-1 transition-all duration-150 group cursor-pointer
                                                 border-1 border-transparent bg-zinc-500/20
                                                hover:opacity-100  hover:border-zinc-500/30
                                                ${isActive ? 'opacity-100 ring-1 ring-emerald-500/50' : 'opacity-80'}
                                            `}
                                        >
                                            <div className="h-8 w-8 bg-zinc-700 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden text-white font-semibold">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    user.username?.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="flex-1 text-sm text-zinc-200 group-hover:text-white truncate">
                                                {user.username}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-3 text-zinc-400 text-sm text-center">No users found</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 md:p-6 flex-1 overflow-y-auto">
                <p className="text-xl md:text-2xl font-semibold text-zinc-100">Other Places to make friends</p>
                <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl">
                    Don't have a username at hand? Check out our list of servers that include everything from gaming to cooking, music, anime and more.
                </p>

                <NavLink
                    to='/discovery/servers'
                    className="relative flex items-center border border-zinc-700 h-14 w-full max-w-sm pr-12 rounded-xl mt-6 hover:bg-zinc-800/50 cursor-pointer group transition-colors">
                    <div className="flex items-center justify-center w-14 h-14 shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-10 h-10">
                            <rect x="10" y="10" width="80" height="80" rx="24" fill="#3A9E5D" />
                            <circle cx="50" cy="50" r="24" fill="#FFFFFF" />
                            <path d="M 39 58 L 47 43 L 61 42 L 53 57 Z" fill="#3A9E5D" />
                            <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
                        </svg>
                    </div>

                    <span className="text-sm font-semibold text-zinc-200 pl-1 select-none">
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
    );
}