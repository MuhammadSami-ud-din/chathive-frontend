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
           
            // setMessage({ text: error.message, type: 'error' });
        } 







    }











    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-60 flex justify-center items-center cursor-pointer ">

                <form onSubmit={HandleSubmit} className="relative bg-zinc-900 shadow-lg   px-8 rounded-2xl flex flex-col items-center" >
                   <p className="text-2xl font-bold mt-10 mx-5  ">Tell Us More About Your Channel </p>
                     <p className="text-sm text-zinc-400  ">What You Channel is About: fun, announcements, general etc... </p>
                 
                     <div onClick={onclose} className="absolute right-[3%] top-1 text-4xl rotate-45  text-zinc-500 hover:text-white  cursor-pointer ">+</div>

                    {message.text && (
              <div className={`w-full p-3 text-center text-sm font-medium rounded-xl transition-all mt-6 ${
                message.type === 'success' 
                  ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-200' 
                  : 'bg-red-500/20 border border-red-500 text-red-200'
              }`}>
                {message.text}
              </div>
            )}

                    <div className="w-full  mt-6 ">
                        <label className="uppercase tracking-wider text-zinc-300 text-sm">Channel Name</label>
                        <input 
                         onChange={(e)=> {
                  setChannelName(e.target.value)
                  if(message.text) setMessage({ text: '', type: '' });
                }}
                        className="w-full  bg-zinc-950/80 rounded-xl mt-2 p-2 px-3 outline-none  " 
                        />
                    </div>
                    <div className="w-full  mt-3 overflow-hidden  ">
                        <label className="uppercase tracking-wider text-zinc-300 text-sm">Channel Description</label>
                        <textarea 
                           onChange={(e)=> {
                  setChannelDesc(e.target.value)
                  if(message.text) setMessage({ text: '', type: '' });
                }}
                        className="w-full h-50 resize-none bg-zinc-950/80 overflow-y-auto outline-none   rounded-xl mt-2 p-2 px-3  " 
                        />
                    </div>

                    <div className="w-full  mt-5 mb-5">
                        <button type="submit" className=" w-full py-2 bg-green-700 rounded-xl ">Create Channel</button>
                    </div>





                </form>


            </div>



        </>
    )
}