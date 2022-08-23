import { Login } from './Login';
import React, { useState } from "react";
import './styles/NavBar.css';
import { useHistory } from "react-router-dom";
import { MdManageAccounts, MdPerson } from 'react-icons/md'
import { RiMovie2Line } from 'react-icons/ri';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';

const NavBar = () => {

    const [loginMenu, setLoginMenu] = useState(false);
    const cookies = new Cookies();
    const history = useHistory();
  
    // Return to home page
    const handleRoute = () =>{ 
        history.push("/");
    }

    // Close login popup if user click wrapper
    const handleClick = (e) => {
        if(e.target.className.includes("login-wrapper")){
            setLoginMenu(false)
        }
    }

    return ( 
        <div className="topnav m-auto h-16 pt-1 w-11/12 tb:w-10/12 lp:w-10/12 dp:w-10/12 bg-primary-900 overflow-hidden">
            <ul>
                <li className='float-left text-center text-[#3c2ab0] text-3xl'>
                    <button className="inline-flex h-14 items-center" onClick={handleRoute}>
                        <RiMovie2Line className="inline-block h-10 w-10"/>
                        <h1 className='inline font-normal h-10 p-0 m-0'>Hooked</h1>
                    </button>
                </li>
                               
                <li><Link to="/watchlist">Watch List</Link></li>

                <li>
                    <div className='float-right inline-flex items-center justify-center w-24 m-auto h-14 text-[#cfd0d0]'>
                        <div className='navbar-icon'>
                            <Link to="/search">
                                <BsSearch size='18'/>
                            </Link>
                        </div>
                        {cookies.get('token') === undefined && 
                            <div className="navbar-icon" onClick={() => setLoginMenu(!loginMenu)}>
                                <MdPerson />
                            </div>
                        }
                        {cookies.get('token') !== undefined && 
                            <div className="navbar-icon">
                                <Link to="/profile">
                                    <MdManageAccounts />
                                </Link>
                            </div>
                        }
                        
                    </div>
                </li>                    
            </ul>
            <div onClick={handleClick}>
                {loginMenu === true && <Login />}
            </div>
        </div>
    );
}
 
export default NavBar;