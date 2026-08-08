import { useEffect } from "react";
import { useOutletContext } from "react-router-dom"


export default function DM(){
    const  { setHeaderTitle }  = useOutletContext() || {};

    useEffect(()=>{
      if (setHeaderTitle){
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
);}

    } , [setHeaderTitle])



    return (
        <>
        <p>This is ur DM</p>
        </>
    )
}