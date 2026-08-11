
import { useParams } from "react-router-dom"



export default function ChatArea(){
    const {id} = useParams();
    return (
        <p>{id}</p>
    )
}