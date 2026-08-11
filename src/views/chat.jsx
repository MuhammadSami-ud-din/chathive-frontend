
import { useEffect , useState } from "react";
import { useParams , useNavigate } from "react-router-dom"
import { NavLink, Outlet, useOutletContext } from "react-router-dom"
const Api_URL = import.meta.env.VITE_API_URL;



export default function ChatArea(){
    const {id} = useParams();
    const [data, setData] = useState({success : false , data : [] , my_id : '' ,  user : []});
    const navigate = useNavigate();
    




    useEffect(()=>{
         const url =  `${Api_URL}/messages/dm/${id} `
 const fetchData = async () => {
            try {

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                        "Content-Type": "application/json"
                    }
                });

                const result = await response.json();
                console.log("SERVER DATA RETURNED:", result);

                if (!response.ok) {
                    throw new Error(result.error || 'no servers found')
                }
               
                console.log(result)
                setData(result)



            }
            catch (error) {
              
                console.log(error.message)
                if (error.message === 'Invalid token') {
                    navigate('/login');
                }

            }
            
        }
        if(id ) fetchData()

 
    }, [id , navigate])

    return (
       <>
      <div className="flex flex-col overflow-hidden w-full h-full">
        <div className="flex items-center border-b border-b-neutral-800 h-13 pl-3 text-sm gap-x-3 shrink-0">
             <span className="h-8 w-8 rounded-full bg-zinc-700/50">{data.user.avatar}</span>      
            <span className="text-zinc-100">{data.user.username}</span>
             
         </div>
       <div className=" flex flex-1 w-full min-h-0 overflow-hidden">
        <div className="flex   flex-1  min-h-0 overflow-hidden flex-col  ">
            <div className=" flex flex-col  w-full min-h-0 flex-1 overflow-y-auto min-w-50 p-2 space-y-3 mb-2">
            { data.data.map((msg)=>{
              const isMe = msg.sender_id === data.my_id 
              console.log(isMe)

              return(
                
                <div key={msg.id} className={`flex w-full  items-start ${isMe ? 'justify-end ' : 'justify-start '} `} > 

                   <div className=" p-1 border rounded-xl text-sm flex-none max-w-[70%]  break-words shadow-sm leading-relaxed ">{msg.content}</div> 
                </div>
                
                
              )

            }
        

            )}
            </div>


         <div className="flex w-full p-1 pl-2 border shrink-0 rounded-3xl items-center ">
            <textarea rows={'2'} className="flex-1 h-6 border-none outline-none resize-none bg-transparent w-full overflow-hidden ml-2" />
            <button className="h-7 w-15 bg-green-400/50 mr-2 ml-2 rounded-2xl">Send</button>
         </div>

        </div>
          <div className="flex  border w-80 shrink-0  h-full overflow-y-auto">right</div>

            

       </div>
       
      </div>
       
       </>
    )
}