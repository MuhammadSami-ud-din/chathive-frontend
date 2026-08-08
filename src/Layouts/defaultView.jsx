
const SKELETON_GROUPS = [
    { id: 'cat-1', items: ['w-32', 'w-40', 'w-24', 'w-36', 'w-28', 'w-20'] },
    { id: 'cat-2', items: ['w-28', 'w-36', 'w-20', 'w-32', 'w-24', 'w-40'] }
];

export default function DefaultView(){
    return(
        <>
         {/*channels list middlebar*/}
                    <div className="flex-none  w-73 p-4 flex flex-col space-y-6 rounded-xl border-t border-l border-zinc-800 ">
                     

                        {SKELETON_GROUPS.map((group) => (
                            <div key={group.id} className="space-y-3">

                                <div className="h-3.5 w-24 rounded-full bg-zinc-700 " />


                                {group.items.map((width, i) => (
                                    <div key={`${group.id}-${i}`} className="flex items-center space-x-3 py-1 opacity-50">
                                        <div className="h-4 w-4 bg-zinc-700 rounded-full flex-shrink-0" />
                                        <div className={`h-3.5 ${width} bg-zinc-700 rounded-full`} />
                                    </div>
                                ))}
                            </div>
                        ))}

                    </div>

                    {/*chat area  rightbar*/}
                    <div className="flex flex-col flex-1 items-center justify-center align-center ">
                       
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
   