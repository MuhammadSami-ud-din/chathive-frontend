import { useState } from "react";
import {useNavigate , Link} from 'react-router-dom';

export default function LoginUser(){
    const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();
  const url = 'http://localhost:5000/login';

  const handleLogin = async (e)=>{
    e.preventDefault();
    setLoading(true);

    try{
    const response = await fetch(url , {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({email , password})
    })

    const result = await response.json();

    if (!response.ok) {
    throw new Error(result.error || 'Invalid Credentials');
  }
    

    localStorage.setItem('authToken' , result.token)
    alert(result.message)
    console.log('login successful')

      navigate('/Dashboard');
  
    }
  
    catch(error){
      console.log(error.message);
      alert(error.message)
    }finally{
      setLoading(false);
    }
  }


    return(
      <>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-black to-[#434343] p-4">
        <div className="w-full max-w-md bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 text-white" >
       <h1>Welcome To ChatHive</h1>
       <form onSubmit={handleLogin}>
        <div>
            <input  
            type='email'
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            placeholder="Enter your Email"
            required
            /> 
        </div>
         <div>
            <input  
            type='password'
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            placeholder="Enter Your password"
            required
            /> 
        </div>
         <div>
            <button type='submit' disabled = {loading}>
              {loading ? 'logging in ... ' : 'login'}
            </button>
            
        </div>
        

       </form>
       <p>Don't have an account? <Link to = "/register">Register here</Link> </p>

      </div>
      </div>
      
      
      
      
      
      
      
      </>
    )
}


