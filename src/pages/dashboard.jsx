import { useEffect , useState } from "react"
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard(){
    const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
    const url = 'http://192.168.18.40:5000/servers'
    
    
    useEffect(()=>{
         const fetchData = async ()=>{
            try{
            const response = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json"
          }
        });

        const result = await response.json();
        console.log("SERVER DATA RETURNED:", result);

        if(!response.ok){
            throw new Error (result.error || 'no servers found')
        }
        setData(result)
        
 

         }
         catch(error) {
            setError(error)
            console.log(error.message)
            if(error.message === 'Invalid token'){
               navigate('/login');
            }
            
         }
         finally{
            setLoading(false)
         }
         }
         fetchData()
    
}, [navigate])
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    return(
       <>
      <div className="flex flex-col h-screen bg-zinc-900">

         <div className="h-8 flex-none  px-4 flex items-center justify-end ">
      
    <div className="flex flex-col items-center  gap-2">
      <svg 
        xmlns="http://w3.org"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        className="w-5 h-5 text-neutral-400 hover:text-neutral-100 transition-colors"
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
     
    </div>
          <div className="flex gap-2  ml-2 ">
      <svg 
        xmlns="http://w3.org" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        className="w-5 h-5 text-neutral-400 hover:text-neutral-100 transition-colors"
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >

        <circle cx="12" cy="12" r="10" />

        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>

      
     
    </div>

         </div>

       <div className=" flex-1 min-h-0 flex     text-white">

          <div className="flex-none p-3 w-20 flex flex-col   border border-red-500 "> {data.map((item) => (
          <div key={item.id} className="p-4 bg-zinc-800 rounded-xl border border-zinc-700">
            {item.server_name || item.server_description}
          </div>
        ))}</div>
          <div className="flex-none p-3 w-90 flex flex-col   border border-blue-500 ">this is ur channels list</div>
          <div className="flex flex-col flex-1 items-center justify-center align-center   border border-pink-500 ">this is ur chat area</div>

       </div>

      </div>

       
       </>
    )
}