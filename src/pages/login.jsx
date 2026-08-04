import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

export default function LoginUser(){
  const [submit, setSubmit] = useState(false);
  const [showPass, setShowpass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const url = 'http://localhost:5000/login';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailInvalid = submit && (!email.trim() || !emailRegex.test(email));
  const isPasswordInvalid = submit && password.trim() === '';

  const handleLogin = async (e)=>{
    e.preventDefault();
    setSubmit(true);
    setMessage({ text: '', type: '' });

    if (!emailRegex.test(email) || password.trim() === '') {
      return;
    }

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

      localStorage.setItem('authToken' , result.token);
      setMessage({ text: result.message || 'Login Successful!', type: 'success' });
      console.log('login successful');
      
      setTimeout(() => {
        navigate('/Dashboard');
      }, 1000);
    }
    catch(error){
      console.log(error.message);
      setMessage({ text: error.message, type: 'error' });
    }finally{
      setLoading(false);
    }
  }

  return(
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-black to-[#434343] p-4">
        <div className="w-full flex flex-col gap-y-8 items-center justify-items-center max-w-md bg-gradient-to-br from-white/20 via-white/10 to-transparent backdrop-blur-md shadow-2xl rounded-2xl p-4 text-white">
          <h1 className="font-serif text-3xl mt-2">Welcome To ChatHive</h1>
          <form onSubmit={handleLogin} noValidate className="w-full flex flex-col gap-y-6 items-center justify-center">
        
            {message.text && (
              <div className={`w-full p-3 text-center text-sm font-medium rounded-xl transition-all ${
                message.type === 'success' 
                  ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-200' 
                  : 'bg-red-500/20 border border-red-500 text-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <div className="w-full flex flex-col">
              <label htmlFor="email" className="ml-1 text-xl">Email</label>
              <input
                className={`w-full border bg-zinc-700 rounded-2xl p-2 mt-1 outline-none transition-colors ${
                  isEmailInvalid 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-400 focus:border-neutral-50'
                }`}
                id="email"  
                type='email'
                value={email}
                onChange={(e)=> {
                  setEmail(e.target.value);
                  setSubmit(false);
                  if(message.text) setMessage({ text: '', type: '' });
                }}
                placeholder="Enter your Email"
                required
              /> 
              {isEmailInvalid && (
                <p className="mt-1 text-xs text-red-500 transition-all">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            <div className="w-full flex flex-col relative">
              <label htmlFor="password" className="ml-1 text-xl">Password</label>
              <input
                className={`w-full border bg-zinc-700 rounded-2xl p-2 pr-10 mt-1 outline-none transition-colors ${
                  isPasswordInvalid 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-400 focus:border-neutral-50'
                }`}
                id="password"  
                type={showPass? 'text' : 'password'}
                value={password}
                onChange={(e)=> {
                  setPassword(e.target.value);
                  setSubmit(false);
                  if(message.text) setMessage({ text: '', type: '' });
                }}
                placeholder="Enter Your password"
                required
              /> 
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
              {isPasswordInvalid && (
                <p className="mt-1 text-xs text-red-500 transition-all">
                  Please enter your password.
                </p>
              )}
            </div>

            <div className="w-full h-10">
              <button type='submit' disabled={loading} className="w-full border-2 border-emerald-900 h-10 bg-emerald-800 text-cyan-50 rounded-2xl mt-2 hover:bg-emerald-900 transition-colors disabled:opacity-50">
                {loading ? 'logging in ... ' : 'login'}
              </button>
            </div>

          </form>
          <p>Don't have an account? <Link to="/register" className="text-blue-500">Register here</Link></p>
        </div>
      </div>
    </>
  )
}
