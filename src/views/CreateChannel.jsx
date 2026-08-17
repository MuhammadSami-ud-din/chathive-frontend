import { useState } from "react"
import { useNavigate } from "react-router-dom";
const Api_URL = import.meta.env.VITE_API_URL

export default function CreateChannel({ server_id, isOpen, onclose }) {
    const [ChannelName, setChannelName] = useState('')
    const [ChannelDesc, setChannelDesc] = useState('');
    const navigate = useNavigate();

    if (!isOpen) return null;



    const HandleSubmit = async (e) => {
         e.preventDefault()
        const url = `${Api_URL}/channels/${server_id}`
        console.log('creting channel')
       

        try {

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ channel_name: ChannelName, channel_description: ChannelDesc })
            })


            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Cannot Create ');
            }



            //   setMessage({ text: result.message || 'Login Successful!', type: 'success' });

            setChannelName('');
            setChannelDesc('');
            onclose();

       
        }
        catch (error) {
            console.log(error.message);
            if (error.message === 'Invalid token') {
                navigate('/login');
            }
            // setMessage({ text: error.message, type: 'error' });
        } 







    }











    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-60 flex justify-center items-center ">

                <form onSubmit={HandleSubmit} className="bg-gradient-to-r from-cyan-900 to-green-950 h-155 w-100 rounded-2xl flex flex-col items-center" >
                    <p className="text-2xl font-bold mt-4">Create A Channel </p>

                    <div className="w-full p-3 mt-4 ">
                        <label className="font-bold text-lg">Channel Name</label>
                        <input 
                        onChange={(e)=> setChannelName(e.target.value)}
                        className="w-full  bg-zinc-900/80 rounded-xl mt-2 p-2 px-3 outline-none  " 
                        />
                    </div>
                    <div className="w-full p-3  overflow-hidden  ">
                        <label className="font-bold text-lg">Channel Description</label>
                        <textarea 
                        onChange={(e)=> setChannelDesc(e.target.value)}
                        className="w-full h-80 resize-none bg-zinc-900/80 overflow-y-auto outline-none   rounded-xl mt-2 p-2 px-3  " 
                        />
                    </div>

                    <div className="w-full px-5 mt-2">
                        <button type="submit" className=" w-full py-2 bg-green-700 rounded-xl ">Create Channel</button>
                    </div>





                </form>


            </div>



        </>
    )
}