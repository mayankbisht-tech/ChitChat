import React, { useState } from 'react'
import assets from '../assets/assets'

const LoginPage = () => {
  const [curState,setCurrentState]=useState<"Sign Up" | "Login">("Sign Up")
  const [fullName,setFullName]=useState<string>("")
  const [email,setEmail]=useState<string>("")
  const [password,setPassword]=useState<string>("")
  const [bio,setBio]=useState<string>("")
  const [isDataSubmitting,setIsDataSubmitting]=useState<boolean>(false)
  const onSumitHandler=(e:React.FormEvent)=>{
    e.preventDefault();
    if(curState==="Sign Up" && !isDataSubmitting){
      setIsDataSubmitting(true);
      return;
    }
  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
        <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />
        <form onSubmit={onSumitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg '>
        <h2 className='font-medium text-2xl flex justify-center items-center'>{curState}
                {isDataSubmitting && <img onClick={()=>setIsDataSubmitting(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}
          
        </h2>
        {curState==="Sign Up" && !isDataSubmitting && (
        
        <input onChange={(e)=>setFullName(e.target.value)} value={fullName} type="text" placeholder='Full Name' className=' border border-gray-500 rounded-md p-2 focus:outline-none ' required />
        )}
        {!isDataSubmitting && (
          <>
          <input onChange={(e)=>setEmail(e.target.value)} type="email" value={email} placeholder='Email' className=' p-2 border border-gray-500 rounded-md focus:outline-none focus-ring-2 focus:ring-indigo-500'  required />
          <input onChange={(e)=>setPassword(e.target.value)} type="password" value={password} placeholder='Password' className=' p-2 border border-gray-500 rounded-md focus:outline-none focus-ring-2 focus:ring-indigo-500'  required />
          </>
        )}
        {
          curState==="Sign Up" && isDataSubmitting && (
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder='provide a short bio' rows={4} className=' p-2 border border-gray-500 rounded-md focus:outline-none focus-ring-2 focus:ring-indigo-500' required  />
          )
        }
        <button className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {curState==="Sign Up" ? "Create Account"  : "Login Now"}
        </button>
        
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to terms and conditions</p>
        </div>
        <div className='flex flex-col gap-2'>
          {curState==="Sign Up" ? (
            <p className='text-sm text-gray-600'>Already have an account? <span onClick={()=>{setCurrentState("Login"); setIsDataSubmitting(false)}} className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
          ) : (
            <p className='text-sm text-gray-600'>Don't have an account? <span onClick={()=>{setCurrentState("Sign Up"); setIsDataSubmitting(false)}} className='font-medium text-violet-500 cursor-pointer'>Sign Up here</span></p>
          )}
        </div>
        </form>
    </div>
  )
}

export default LoginPage