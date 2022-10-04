import React, { useState } from "react";
import { BsFillPencilFill, BsCheck2 } from 'react-icons/bs';
import { useHistory } from "react-router-dom";
import Cookies from 'universal-cookie';
import axios from "axios";

export const Profile = () => {

  const [nameDisabled, setNameDisabled] = useState(true);
  const [passDisabled, setPassDisabled] = useState(true);
  const [ name, setName ] = useState('');
  const [ pass, setPass ] = useState('');
  const [ message, setMessage] = useState('no error');
  const [ textColor, setTextColor ] = useState('text-transparent');

  const cookies = new Cookies();
  const history = useHistory();

  const editNameField = (e) => {
    e.preventDefault();
    if(nameDisabled === false){
      if(nameDisabled === false){
        axios({
          method: "POST",
          url:"https://hookedbackend.onrender.com/api/updateName",
          data:{
            name: cookies.get('name'),
            newname: name,
          }
        }).then((response) => {
          cookies.set('name', response.data.name);
          setMessage('Username changed')
          setTextColor('text-green-500')
        }).catch((response) => {
          setMessage("Username taken")
          setTextColor('text-red-500')
          if(response.response.data[0] === "SHORT USERNAME"){
            setMessage('Username too short')
          }
          if(response.response.data[0] === "SAME USERNAME"){
            setMessage("Can't set new username same as current username")
          }
        })
      }
    }
    setNameDisabled(!nameDisabled);
  }

  const editPassField = (e) => {
    e.preventDefault();

    if(passDisabled === false){
      axios({
        method: "POST",
        url:"https://hooked-to-movies.herokuapp.com/api/updatePassword",
        data:{
          name: cookies.get('name'),
          password: pass,
        }
      }).then(() => {
        setMessage("Password Changed")
        setTextColor("text-green-500")
      }).catch((response) => {
        setTextColor('text-red-500')
        setMessage('Invalid Password')
        if(response.response.data[0] === "SHORT PASSWORD"){
          setMessage('Password too short')
        }
      })
    }
    setPassDisabled(!passDisabled);
  }

  const handleLogOut = () => {
    cookies.remove("token");
    cookies.remove("jwt");
    cookies.remove("watchlist");
    cookies.remove("name");
    history.push("");
  }

  return (  
    <div className='w-10/12 m-auto pt-4 font-roboto'>
        <h1 className='text-[#cfd0d0] border-b border-[#cfd0d02c] text-xl'>Profile</h1>

            <div className='float-left'>
                <p className={`mt-2 text-sm ${textColor}`}>{message} </p>
                <div className='flex items-center justify-center mt-2 text-[#cfd0d0]'>
                      <h1 className='inline text-base opacity-80'>Username  </h1>
                      {nameDisabled 
                      ? <input type="text" disabled='true' className="bg-primary-700 dp:w-62 lp:w-62 tb:w-62 w-48 ml-3 border-0 rounded focus:ring-[#3c2ab0]" placeholder={cookies.get('name')} ></input>
                      : <input type="text" className="bg-primary-600 dp:w-62 lp:w-62 tb:w-62 w-48 ml-3 border-0 rounded focus:ring-[#3c2ab0]" onChange={(e) => {setName(e.target.value)}}></input>
                      }
                      <div className="icon" onClick={editNameField}>
                          {nameDisabled ? <BsFillPencilFill /> : <BsCheck2 /> }  
                      </div>
                </div>

                <div className='flex items-center justify-center mt-4 text-[#cfd0d0]'>
                      <h1 className='inline text-base opacity-80'>Password  </h1>
                      {passDisabled 
                      ? <input type="password" disabled='true' className="bg-primary-700 dp:w-62 lp:w-62 tb:w-62 w-48 ml-3 border-0 rounded focus:ring-[#3c2ab0]" ></input>
                      : <input type="password"className="bg-primary-600 dp:w-62 lp:w-62 tb:w-62 w-48 ml-3 border-0 rounded focus:ring-[#3c2ab0]" onChange={(e) => {setPass(e.target.value)}}></input>
                      }
                      <div className="icon" onClick={editPassField}>
                          {passDisabled ? <BsFillPencilFill /> : <BsCheck2 /> }  
                      </div>
                </div>
              
                <button type="submit" onClick={handleLogOut} className="btn btn-outline-light inline align-middle mt-12">Log Out</button>
            </div>
    </div>
    
  )
}
