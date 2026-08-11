
import { useEffect , useState } from "react";
import { useParams , useNavigate } from "react-router-dom"
const Api_URL = import.meta.env.VITE_API_URL;



export default function ChatArea(){
    const {id} = useParams();
      const [data, setData] = useState({success : false , data : []});
    const url =  `${Api_URL}/messages/dm/${id} `
    const navigate = useNavigate();

    useEffect(()=>{
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
        fetchData()

 // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id , navigate])

    return (
       <>
       <div className=" w-full border bottom-[0%]">type</div>
       <div className=" flex w-full h-full">
        <div className="w-[50%] border ">left </div>
          <div className="w-[50%] border ">right</div>
            

       </div>
       <div className=" w-full border bottom-[0%]">type</div>
       
       </>
    )
}