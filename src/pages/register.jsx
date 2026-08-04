import { useState } from "react";
import {useNavigate , Link} from 'react-router-dom';

export default function RegisterUser(){
    const [message , setMessage] = useState({text : '' , type : ''  })
    const [submitted , setSubmitted] = useState(false)
    const [showPass , setShowpass] = useState(false)
    const [ userName , setUserName] = useState('');
    const [email , setEmail] = useState('');
    const [plainPassword , setPassword] = useState('');
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();
    const url = 'http://192.168.18.40:5000/register'


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailInvalid = submitted && (email.trim() === '' || !emailRegex.test(email));
    const isUsernameInvalid = submitted && userName.trim() === '' 
    const isPasswordInvalid = submitted && plainPassword.trim() === '' ;

    const handleRegister = async(e)=>{
        e.preventDefault();
        setSubmitted(true);
        setMessage({text : '' , type : ''  });

        if(!email.trim() || !emailRegex.test(email) || userName.trim() === '' || plainPassword.trim() === ''){
            return ;
        }

        setLoading(true);



        try{
            const response = await fetch(url , {
                method : 'POST',
                headers : {
                    "Content-Type" : 'application/json'
                },
                body : JSON.stringify({userName , email , plainPassword})
            })

            const result = await response.json();

            if(!response.ok){
                throw new Error(result.error || 'User Already exists');
            }

            setMessage({text : result.message , type : 'success'});
            alert(result.message);
            console.log(result.message)
            navigate('/login');

        }
        catch (error){
            console.log(error.message);
            setMessage({text : error.message , type : 'error'});
            alert(error.message);
        }
        finally{
            
            setLoading(false);
            
            
        }
            
    }





    return(

        <>
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-black to-[#434343] p-4">
            <div className=" w-full flex flex-col gap-y-6 items-center justify-items-center w-full max-w-md bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-md  shadow-2xl rounded-2xl p-4 text-white  ">
            <div>
                <h1 className="font-serif text-3xl mt-3 ">Welcome to ChatHive </h1>
            
            </div>

             {message.text && (
              <div className={`w-full p-3 text-center text-sm font-medium rounded-xl transition-all ${
                message.type === 'success' 
                  ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-200' 
                  : 'bg-red-500/20 border border-red-500 text-red-200'
              }`}>
                {message.text}
              </div>
            )}


            <form onSubmit={handleRegister} noValidate className="w-full flex flex-col gap-y-9 items-center justify-center  ">
               
                <div className="w-full flex flex-col ">
                     <label for = 'email' className="ml-1 text-xl">Email</label>
                    <input 
                    className={`w-full border bg-zinc-700 rounded-2xl p-2 mt-1 outline-none transition-colors ${
                  isEmailInvalid 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-400 focus:border-neutral-50'
                }`}
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e)=> {
                        setEmail(e.target.value);
                        setSubmitted(false);
                        setMessage({text : '' , type : ''  })

                    }
                    }
                    required
                    placeholder="Enter Your Email Here" />
                    {isEmailInvalid &&(
                    <p className=" ml-1 mt-1 text-xs text-red-500 transition-all">Please enter a valid Email</p>
                )}

                </div>

                


                <div className="w-full flex flex-col">
                     <label for = 'name' className="ml-1 text-xl">Username</label>
                    <input 
                    className={`border  bg-zinc-700 rounded-2xl p-2 mt-1 outline-none  transition-colors ${
                        isUsernameInvalid ? 'border-red-500 focus:border-red-500'
                        : ' border-gray-400 focus:border-neutral-50'
                    } `}
                    type="text"
                    id="name"
                    value={userName}
                    onChange={(e)=> {
                        setUserName(e.target.value);
                        setSubmitted(false);
                        setMessage({text : '' , type : ''  })
                    }}
                    required
                    placeholder="Enter Your Username Here" />

                    {isUsernameInvalid && (
                        <p className="ml-1 mt-1 text-xs text-red-500 transition-all"> Please enter a valid username</p>
                    )}



                </div>

                <div className="w-full flex flex-col relative">

                     <label for = 'password' className="ml-1 text-xl">Password</label>
                    <input 
                    className={`border  bg-zinc-700 rounded-2xl p-2 mt-1 outline-none transition-colors pr-10  ${
                        isPasswordInvalid ? ' border-red-500 focus:border-red-500'
                        : 'border-gray-400 focus:border-neutral-50'
                    }`}
                    type={showPass ? 'text' : 'password'}
                    id="password"
                    value={plainPassword}
                    onChange={(e)=> {
                        setPassword(e.target.value)
                        setSubmitted(false)
                        setMessage({text : '' , type : ''  })
                    }}
                    required
                    placeholder="Enter Your Password Here" />

                    {isPasswordInvalid && (
                        <p className="mt-1 ml-1 text-red-500 transition-all text-xs">Please enter the password</p>
                    )}

                    <button type='button' onClick={()=> setShowpass(!showPass)} className="absolute right-3 top-[42px] flex items-center text-gray-300 hover:text-white transition-colors">
                {showPass ? (
                  <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12c2.75-4.2 6.75-6 9.5-6s6.75 1.8 9.5 6c-2.75 4.2-6.75 6-9.5 6s-6.75-1.75-9.5-6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                  </svg>
                ) : (
                  <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10c2.5 3.5 6.5 5 9 5s6.5-1.5 9-5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 11.5L2.5 13.5M9 14.5v2.5M12 15v3M15 14.5v2.5M20 11.5l1.5 2" />
                  </svg>
                )}
              </button>


                </div>


                <div className="w-full  h-10 ">
                    <button type="submit" disabled={loading} className="w-full border-2 border-emerald-900 h-10 bg-emerald-800 text-cyan-50 rounded-2xl mt-2 hover:bg-emerald-900">
                        {loading ? 'Registering' : 'Register'}
                    </button>
                </div>
            </form>
            <p>Already have an Account? <Link to="/login" className="text-blue-500">Login</Link>

            </p>




        </div>
        </div>
        
        
        
        </>















    )

}