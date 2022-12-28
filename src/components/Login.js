import React, { useState } from "react";
import Cookies from 'universal-cookie';
import axios from "axios";
import { RiMovie2Line } from 'react-icons/ri';
import { Register } from './Register';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export const Login = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ showRegister, setShowRegister ] = useState(false);
  const  [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [ invalid, setInvalid ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  const cookies = new Cookies();

  function login(event) {
    setIsLoading(true)
    axios({
      method: "POST",
      url:"https://hookedbackend.onrender.com/api/login",
      data:{
        name: userName,
        password: password
       }
    }).then((response) => {
      setIsLoggedIn(true);
      cookies.set("token", response.data.jwt);
      cookies.set("watchlist", response.data.watchlist);
      cookies.set('name', response.data.name);
      setInvalid(false);
      setIsLoading(false)
      window.location.reload();
    }).catch(() => {
      setInvalid(true);
      setIsLoading(false)
    })
    event.preventDefault()
}

  return (
    <div className='login-wrapper absolute left-0 z-10 w-full h-full bg-primary-900 bg-opacity-40 text-primary-100 animate-fadeJump'>

      {showRegister
      ? <Register />
      :
      
      <div className='login-popup absolute shadow-2xl w-80 h-[26rem] bg-primary-800 rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <div className="logo flex text-[#3c2ab0] text-3xl w-full mt-3 align-middle justify-center">
            <RiMovie2Line className="inline-block h-10 w-10"/>
            <h1 className='inline font-normal h-10 p-0 mr-2'>Hooked</h1>
          </div>

          <div className='title text-center w-full font-thin mt-2'>
            {isLoading ? 
              <AiOutlineLoading3Quarters className="inline animate-spin" size="25"/>
            :
            isLoggedIn 
            ? <h1 className='text-base font-thin text-green-400'>Logged In</h1>
            : invalid === false && <h1 className='text-base font-thin'>Log In</h1>
            }
            {invalid && <h1 className='text-base font-thin text-red-600'>Invalid username or password</h1>}
          </div>

        <form onSubmit={login} className="w-3/4 m-auto">
            <label className='text-xs text-primary-200'>Username</label>
            <input type="text" required value={userName} onChange={(e) => setUserName(e.target.value)} className="bg-primary-600 w-full border-0 rounded focus:ring-[#3c2ab0]"/>
            <label className='mt-2 text-xs text-primary-200'>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-primary-600 w-full border-0 rounded focus:ring-[#3c2ab0]"/>
            <div className='flex justify-center align-middle mt-3'>
              <button type="submit" className="btn btn-outline-light inline align-middle mt-2">Log In</button>
            </div>
        </form>

        <div className='text-slate-700 dark:text-slate-500 w-3/4 m-auto text-center mt-3'>
          <h1 className='text-sm text-primary-200'>Don't have an account yet?</h1>
          <button type="button" className="btn btn-outline-light mt-1" onClick={() => setShowRegister(true)}>Create Account</button>
        </div>
      </div>

      
    }
    </div>
      )
}
