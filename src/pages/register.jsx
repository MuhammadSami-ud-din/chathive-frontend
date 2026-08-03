import { useState } from "react";
import {useNavigate , Link} from 'react-router-dom';

export default function RegisterUser(){
    const [ userName , setUserName] = useState('');
    const [email , setEmail] = useState('');
    const [plainPassword , setPassword] = useState('');
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();
    const url = 'http://192.168.18.40:5000/register'

    const handleRegister = async(e)=>{
        e.preventDefault();
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

            alert(result.message);
            console.log(result.message)
            navigate('/login');
        }
        catch (error){
            console.log(error.message);
            alert(error.message);
        }
        finally{
            setLoading(false);
        }
            
    }





    return(

        <>
        <div >
            <h1>Welcome to ChatHive </h1>
            <h2>Please Register Yourselves</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <input 
                    type="email"
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    required
                    placeholder="Enter Your Email Here" />
                </div>
                <div>
                    <input 
                    type="text"
                    value={userName}
                    onChange={(e)=> setUserName(e.target.value)}
                    required
                    placeholder="Enter Your Username Here" />
                </div>
                <div>
                    <input 
                    type="password"
                    value={plainPassword}
                    onChange={(e)=> setPassword(e.target.value)}
                    required
                    placeholder="Enter Your Password Here" />
                </div>
                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering' : 'Register'}
                    </button>
                </div>
            </form>
            <p>Already have an Account? <Link to="/login">Login</Link>

            </p>




        </div>
        
        
        
        </>















    )

}