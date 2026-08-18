import { useState } from "react"
import { useNavigate } from "react-router-dom";
const Api_URL = import.meta.env.VITE_API_URL

export default function CreateChannel({ server_id, isOpen, onclose , onChannelCreated }) {
    const [ChannelName, setChannelName] = useState('')
    const [ChannelDesc, setChannelDesc] = useState('');
     const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    if (!isOpen) return null;



    const HandleSubmit = async (e) => {
         e.preventDefault()
        const url = `${Api_URL}/channels/${server_id}`

        if (!ChannelName.trim() || !ChannelDesc.trim()) {
        return; 
    }
       
       

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



              setMessage({ text: result.message || 'Channel Created Successfully!', type: 'success' });

            setChannelName('');
            setChannelDesc('');
            onChannelCreated(result.channelFetch)

            setTimeout(()=>{
             onclose();
            } , 1000)

       
        }
        catch (error) {
            console.log(error.message);
            setMessage({ text: error.message, type: 'error' });
            if (error.message === 'Invalid token') {
                navigate('/login');
            }
            // setMessage({ text: error.message, type: 'error' });
        } 







    }











    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-60 flex justify-center items-center cursor-pointer ">

                <form onSubmit={HandleSubmit} className="relative bg-white/10 backdrop-blur-md border border-white/20 shadow-lg   px-4 rounded-2xl flex flex-col items-center" >
                    <p className="text-2xl font-bold mt-6 ">Create A Channel </p>
                     <div onClick={onclose} className="absolute right-[5%] top-[2%] text-3xl rotate-45 ml-12 text-zinc-500 hover:text-white  cursor-pointer ">+</div>

                    {message.text && (
              <div className={`w-full p-3 text-center text-sm font-medium rounded-xl transition-all mt-6 ${
                message.type === 'success' 
                  ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-200' 
                  : 'bg-red-500/20 border border-red-500 text-red-200'
              }`}>
                {message.text}
              </div>
            )}

                    <div className="w-full  mt-4 ">
                        <label className="font-bold text-lg">Channel Name</label>
                        <input 
                         onChange={(e)=> {
                  setChannelName(e.target.value)
                  if(message.text) setMessage({ text: '', type: '' });
                }}
                        className="w-full  bg-zinc-900/80 rounded-xl mt-2 p-2 px-3 outline-none  " 
                        />
                    </div>
                    <div className="w-full  mt-3 overflow-hidden  ">
                        <label className="font-bold text-lg">Channel Description</label>
                        <textarea 
                           onChange={(e)=> {
                  setChannelDesc(e.target.value)
                  if(message.text) setMessage({ text: '', type: '' });
                }}
                        className="w-full h-80 resize-none bg-zinc-900/80 overflow-y-auto outline-none   rounded-xl mt-2 p-2 px-3  " 
                        />
                    </div>

                    <div className="w-full  mt-4 mb-5">
                        <button type="submit" className=" w-full py-2 bg-green-700 rounded-xl ">Create Channel</button>
                    </div>





                </form>


            </div>



        </>
    )
}