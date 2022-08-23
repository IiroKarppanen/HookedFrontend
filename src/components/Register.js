import React, { useState } from "react";
import axios from "axios";
import { RiMovie2Line } from 'react-icons/ri';
import { Login } from './Login';

export const Register = () => {

  const  [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [ password2, setPassword2 ] = useState('');
  const [ invalid, setInvalid ] = useState(false);
  const [ success, setSuccess ] = useState(false);
  const [ showLogin, setShowLogin ] = useState(false);
  const [ message, setMessage ] = useState('');

  function login(event) {
    if(password === password2){
      axios({
        method: "POST",
        url:"https://hooked-to-movies.herokuapp.com/api/register",
        data:{
          name: name,
          password: password
         }
      }).then(() => {
  
          setSuccess(true);
          setInvalid(false);
          setShowLogin(true);
        
      }).catch((response) => {
        setInvalid(true);
        
        setMessage("Username already in use")
        if(response.response.data[0] === "USERNAME ERROR"){
          setMessage("Username too short")
        }
        if(response.response.data[0] === "PASSWORD ERROR"){
          setMessage("Password too short")
        }
      })
    }
  else{
    setInvalid(true)
    setMessage("Passwords didn't match")
  }
  event.preventDefault()
    
}
  return (

      <div>
        {showLogin
        ? <Login />
        :
        <div className='login-popup absolute shadow-2xl w-80 h-[30rem] bg-primary-800 rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <div className="logo flex text-[#3c2ab0] text-3xl w-full mt-3 align-middle justify-center">
            <RiMovie2Line className="inline-block h-10 w-10"/>
            <h1 className='inline font-normal h-10 p-0 mr-2'>Hooked</h1>
          </div>

          <div className='title text-center w-full font-thin mt-2'>
            { success
            ? <h1 className='text-base font-thin text-green-400'>Account Created</h1>
            : invalid === false && <h1 className='text-base font-thin'>Account Creation</h1>
            }
            {invalid && <h1 className='text-base font-thin text-red-600'>{message}</h1>}
          </div>

        <form onSubmit={login} className="w-3/4 m-auto">
            <label className='text-xs text-primary-200'>Username</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="bg-primary-600 w-full border-0 rounded focus:ring-[#3c2ab0]"/>
            <label className='mt-2 text-xs text-primary-200'>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-primary-600 w-full border-0 rounded focus:ring-[#3c2ab0]"/>
            <label className='mt-2 text-xs text-primary-200'>Confirm Password</label>
            <input type="password" required value={password2} onChange={(e) => setPassword2(e.target.value)} className="bg-primary-600 w-full border-0 rounded focus:ring-[#3c2ab0]"/>
            <div className='flex justify-center align-middle mt-3'>
              <button type="submit" className="btn btn-outline-light inline align-middle mt-3">Create Account</button>
            </div>
        </form>

        <div className='text-slate-700 dark:text-slate-500 w-3/4 m-auto text-center mt-3'>
          <h1 className='text-sm text-primary-200'>Already have an account?</h1>
          <button type="button" className="btn btn-outline-light" onClick={() => setShowLogin(true)}>Log In</button>
        </div>
      </div>
        }
      </div>
      
      )
}
