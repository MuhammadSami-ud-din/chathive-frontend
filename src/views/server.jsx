import { NavLink, Outlet } from "react-router-dom";

export default function ServersListing() {
  

    return (
        <>
            <div className="flex-none  w-80 h-full flex flex-col  rounded-l-xl border-t border-l border-zinc-800 ">
                <div className="flex items-center border-b border-b-neutral-800 h-13  pl-5 text-xl font-bold">
                    Discover
                </div>
                <div

                    className="h-17 flex flex-col justify-start mt-2 flex-1 ">

                    <NavLink
                        to="/discovery/servers"
                        end
                        className={({ isActive }) => ` flex   pl-1 p-2  h-13 text-zinc-200 font-semibold w-full rounded-xl   items-center   transition-colors   ${isActive ? 'bg-zinc-400/10' : 'bg-neutral-900 hover:bg-zinc-400/10'} `} >
                        <svg xmlns="http://w3.org" viewBox="0 0 100 100" width="40" height="40">
                            <rect width="100" height="100" rx="12" ry="12" fill="transparent" />
                            <g fill="#ffffff" stroke="#114294" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M 49,36 L 69,27 A 3,3 0 0,1 73,30 L 73,72 A 4,4 0 0,1 69,76 L 57,76 A 4,4 0 0,1 53,72 Z" />
                                <path d="M 33,33 L 45,26 A 3,3 0 0,1 49,29 L 49,50 L 33,59 Z" />
                                <path d="M 23,55 L 38,41 A 3,3 0 0,1 42,41 L 57,55 A 2,2 0 0,1 56,58 L 54,58 L 54,73 A 3,3 0 0,1 51,76 L 29,76 A 3,3 0 0,1 26,73 L 26,58 L 24,58 A 2,2 0 0,1 23,55 Z" />
                            </g>
                        </svg>


                        Servers</NavLink>


                         <NavLink
                        to="/discovery/servers/joined"
                        end
                        className={({ isActive }) => ` flex   pl-1 p-2 w-full h-13 text-zinc-200 font-semibold  rounded-xl m-1 items-center   transition-colors   ${isActive ? 'bg-zinc-400/10' : 'bg-neutral-900 hover:bg-zinc-400/10'} `} >
                        <svg xmlns="http://w3.org" viewBox="0 0 100 100" width="40" height="40">
                            <rect width="100" height="100" rx="12" ry="12" fill="transparent" />
                            <g fill="#ffffff" stroke="#114294" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M 49,36 L 69,27 A 3,3 0 0,1 73,30 L 73,72 A 4,4 0 0,1 69,76 L 57,76 A 4,4 0 0,1 53,72 Z" />
                                <path d="M 33,33 L 45,26 A 3,3 0 0,1 49,29 L 49,50 L 33,59 Z" />
                                <path d="M 23,55 L 38,41 A 3,3 0 0,1 42,41 L 57,55 A 2,2 0 0,1 56,58 L 54,58 L 54,73 A 3,3 0 0,1 51,76 L 29,76 A 3,3 0 0,1 26,73 L 26,58 L 24,58 A 2,2 0 0,1 23,55 Z" />
                            </g>
                        </svg>


                        Joined Servers</NavLink>

                         <NavLink
                        to="/discovery/servers/created"
                        end
                        className={({ isActive }) => ` flex   pl-1 p-2 w-full h-13 text-zinc-200 font-semibold  rounded-xl m-1 items-center   transition-colors   ${isActive ? 'bg-zinc-400/10' : 'bg-neutral-900 hover:bg-zinc-400/10'} `} >
                        <svg xmlns="http://w3.org" viewBox="0 0 100 100" width="40" height="40">
                            <rect width="100" height="100" rx="12" ry="12" fill="transparent" />
                            <g fill="#ffffff" stroke="#114294" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M 49,36 L 69,27 A 3,3 0 0,1 73,30 L 73,72 A 4,4 0 0,1 69,76 L 57,76 A 4,4 0 0,1 53,72 Z" />
                                <path d="M 33,33 L 45,26 A 3,3 0 0,1 49,29 L 49,50 L 33,59 Z" />
                                <path d="M 23,55 L 38,41 A 3,3 0 0,1 42,41 L 57,55 A 2,2 0 0,1 56,58 L 54,58 L 54,73 A 3,3 0 0,1 51,76 L 29,76 A 3,3 0 0,1 26,73 L 26,58 L 24,58 A 2,2 0 0,1 23,55 Z" />
                            </g>
                        </svg>


                        My Servers</NavLink>
                </div>





            </div>


           <div>
            <Outlet />
           </div>




        </>
    )
}