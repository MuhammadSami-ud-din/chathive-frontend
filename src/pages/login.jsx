import { useState } from "react";
import {useNavigate , Link} from 'react';

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
      <div >
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
      
      
      
      
      
      
      
      </>
    )
}


