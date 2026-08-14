import { useEffect } from "react"
import { useParams ,  useNavigate} from "react-router-dom"
const Api_URL = import.meta.env.VITE_API_URL

export default function ServerPage(){
    const { server_id } = useParams()
    const navigate = useNavigate()
    console.log(server_id)


      useEffect(() => {
            const url = `${Api_URL}/servers/${server_id}`
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
                    console.log("SERVER DATA RETURNED channels:", result);
    
                    if (!response.ok) {
                        throw new Error(result.error || 'no servers found')
                    }
    
                    console.log(result)
                    
    
    
    
                }
                catch (error) {
    
                    console.log(error.message)
                    if (error.message === 'Invalid token') {
                        navigate('/login');
                    }
    
                }
    
            }
            fetchData()
    
    
        }, [navigate ,  server_id])
    
    





    return (
        <p> hello my man u are in the server with ServerId <span>{server_id}</span></p>
    )
}