import { useContext, useState } from 'react'

import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [curState,setCurrentState]=useState<"Sign Up" | "Login">("Login")
  const [fullName,setFullName]=useState<string>("")
  const [email,setEmail]=useState<string>("")
  const [password,setPassword]=useState<string>("")
  const [bio,setBio]=useState<string>("")
  const [isDataSubmitting,setIsDataSubmitting]=useState<boolean>(false)
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error("LoginPage must be used within AuthProvider");
  }
  
  const {login} = authContext;

  const onSumitHandler=(e:React.FormEvent)=>{
    e.preventDefault();
    if(curState==="Sign Up" && !isDataSubmitting){
      setIsDataSubmitting(true);
      return;
    }
    const credentials = curState === "Sign Up" 
      ? { fullName, email, password, bio }
      : { email, password };
    login(curState==="Sign Up"?'signup':"login", credentials)
  }
  
  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <div className='w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center'>
        <div className='text-center md:text-left space-y-6 max-md:hidden'>
          
          <h1 className='text-5xl font-bold text-white'>
            Welcome to ChitChat
          </h1>
          <p className='text-xl text-gray-400'>Connect with friends and family instantly with video calls and messaging</p>
          <div className='flex gap-6 justify-center md:justify-start text-gray-400'>
            <div className='flex items-center gap-3 glass-panel p-4 rounded-xl'>
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <span className='text-2xl'>💬</span>
              </div>
              <span>Instant Messaging</span>
            </div>
            <div className='flex items-center gap-3 glass-panel p-4 rounded-xl'>
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <span className='text-2xl'>📹</span>
              </div>
              <span>Video Calls</span>
            </div>
          </div>
        </div>

        <div className='glass-panel rounded-3xl p-8 md:p-10'>
          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-white mb-2'>
              {curState === "Login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className='text-gray-400'>
              {curState === "Login" ? "Login to continue your conversations" : "Sign up to get started"}
            </p>
          </div>

          <form onSubmit={onSumitHandler} className='space-y-5'>
            {curState === "Sign Up" && !isDataSubmitting && (
              <div>
                <label className='block text-sm font-medium text-gray-400 mb-2'>Full Name</label>
                <input 
                  onChange={(e)=>setFullName(e.target.value)} 
                  value={fullName} 
                  type="text" 
                  placeholder='John Doe' 
                  className='w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none transition'
                  required={curState==="Sign Up" && !isDataSubmitting} 
                />
              </div>
            )}

            {!isDataSubmitting && (
              <>
                <div>
                  <label className='block text-sm font-medium text-gray-400 mb-2'>Email Address</label>
                  <input 
                    onChange={(e)=>setEmail(e.target.value)} 
                    type="email" 
                    value={email} 
                    placeholder='you@example.com' 
                    className='w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none transition'
                    required={!isDataSubmitting} 
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-400 mb-2'>Password</label>
                  <input 
                    onChange={(e)=>setPassword(e.target.value)} 
                    type="password" 
                    value={password} 
                    placeholder='••••••••' 
                    className='w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none transition'
                    required={!isDataSubmitting} 
                  />
                </div>
              </>
            )}

            {curState === "Sign Up" && isDataSubmitting && (
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-medium text-gray-400'>Bio</label>
                  <button 
                    type="button"
                    onClick={()=>setIsDataSubmitting(false)} 
                    className='text-sm text-blue-400 hover:text-blue-300 font-medium'
                  >
                    ← Back
                  </button>
                </div>
                <textarea 
                  onChange={(e)=>setBio(e.target.value)} 
                  value={bio} 
                  placeholder='Tell us about yourself...' 
                  rows={4} 
                  className='w-full px-4 py-3 glass-input rounded-xl text-white placeholder-gray-500 focus:outline-none transition resize-none'
                  required={curState==="Sign Up" && isDataSubmitting}  
                />
              </div>
            )}

            <button 
              type="submit"
              className='w-full py-3.5 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-semibold transition'
            >
              {curState==="Sign Up" ? (isDataSubmitting ? "Create Account" : "Continue") : "Login"}
            </button>

            {!isDataSubmitting && (
              <div className='flex items-center gap-2 text-sm text-gray-400'>
                <input type="checkbox" className='w-4 h-4 rounded' />
                <p>I agree to the terms and conditions</p>
              </div>
            )}

            <div className='text-center pt-4 border-t border-white/5'>
              {curState==="Sign Up" ? (
                <p className='text-sm text-gray-400'>
                  Already have an account? 
                  <button 
                    type="button"
                    onClick={()=>{setCurrentState("Login"); setIsDataSubmitting(false)}} 
                    className='font-semibold text-blue-400 hover:text-blue-300 ml-1'
                  >
                    Login here
                  </button>
                </p>
              ) : (
                <p className='text-sm text-gray-400'>
                  Don't have an account? 
                  <button 
                    type="button"
                    onClick={()=>{setCurrentState("Sign Up"); setIsDataSubmitting(false)}} 
                    className='font-semibold text-blue-400 hover:text-blue-300 ml-1'
                  >
                    Sign up here
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
