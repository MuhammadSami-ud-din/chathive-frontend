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

          <div className="flex-none  w-20 flex flex-col  items-center border border-red-500 "> 
            <div className="border-b border-b-zinc-800 pb-3 mb-2 "><div class=" flex h-12 w-12 cursor-pointer mt-1 ml-1 items-center justify-center bg-zinc-800  text-white transition-all duration-200 ease-in-out rounded-2xl hover:bg-[#5865f2] ">
  <svg xmlns="http://w3.org" viewBox="0 0 128 128" class="w-12 h-12 fill-current">
    <path d="M89.7 41.4c-4.9-3.6-10.4-5.9-16.1-6.7-.7 1.3-1.5 2.9-2.1 4.4-6.2-.9-12.3-.9-18.4 0-.6-1.5-1.4-3.1-2.1-4.4-5.8.8-11.2 3.1-16.1 6.7-9.8 14.6-12.4 28.8-11.1 42.7 6.5 4.8 12.6 7.7 18.6 9.6 1.5-2.1 2.9-4.3 4-6.7-2.2-.8-4.4-1.9-6.4-3.2.5-.4 1.1-.8 1.6-1.2 12.2 5.6 25.4 5.6 37.3 0 .5.4 1.1.8 1.6 1.2-2 1.3-4.2 2.3-6.4 3.2 1.2 2.4 2.5 4.6 4 6.7 6-1.9 12.1-4.8 18.6-9.6 1.5-16-.9-30-11.1-42.7zM50.4 72.8c-3.6 0-6.6-3.3-6.6-7.4s2.9-7.4 6.6-7.4c3.7 0 6.6 3.3 6.6 7.4s-2.9 7.4-6.6 7.4zm27.2 0c-3.6 0-6.6-3.3-6.6-7.4s2.9-7.4 6.6-7.4c3.7 0 6.6 3.3 6.6 7.4s-2.9 7.4-6.6 7.4z" />
  </svg>
</div></div>

       <div class=" flex h-12 w-12 cursor-pointer mt-1 ml-1 items-center justify-center bg-zinc-800  text-white transition-all duration-200 ease-in-out rounded-2xl hover:bg-[#5865f2] ">
        owner
       </div>

                
           
            
            {data.map((item) => (
          <div key={item.id} className="p-4 g-zinc-800 h-12 w-12  mt-2 ml-2 items-center justify-center bg-zinc-800 border-l-2 border-l-transparent  text-white  transition-all duration-200 ease-in-out rounded-2xl hover:bg-[#5865f2] hover:border-l-red-200" >
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