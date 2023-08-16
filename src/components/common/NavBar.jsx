import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { userDetailsTemplate } from '../../templates/Templates';
import authService from '../../services/auth.service';

import userService from '../../services/user.service';
import UserContext from '../../context/createContext';

import io from 'socket.io-client'
import { useState } from 'react';


export default function NavBar() {

    const { isSidebarOpen, setIsSidebarOpen, admin, currentUser, setCurrentUser, mySocket, setMySocket,storedEmitEvents, setStoredEmitEvents } = useContext(UserContext);
    const [isProfile, setIsProfile] = useState(false);
    function localLogOut() {

        const per = window.confirm("are you sure to logout");
        if (per) {
            mySocket.disconnect();
            authService.logout();
            setCurrentUser(userDetailsTemplate);
            console.log("after logout currentuser : ", currentUser);
            window.location.reload();
            mySocket.disconnect();
        }
    }

    function localTest() {
        mySocket.emit("test", 1);
    }

    useEffect(() => {
        
    }, [currentUser])





    return (

        <nav className="MyNavbar navbar navbar-expand navbar-dark MainNavbar">
            <img
                className='profileImageNavbar rounded-circle mx-1'
                src="/logo192.png"
                alt="Logo"
               
            />
            <Link to={"/home"} className="navbar-brand">
                Massenger
            </Link>
            {/* {displayFunction()} */}
            {currentUser != userDetailsTemplate ? (
                <div className="navbar-nav ml-auto">
                    <li className="nav-item p-0">
                        <Link to={isProfile ? "/Home" : "/profile"} onClick={() => { setIsProfile(!isProfile) }} className="nav-link p-0">
                            <img className='profileImageNavbar  rounded-circle mx-1 ' src={currentUser.picture} onError={(e) => { e.target.src = process.env.REACT_APP_DEFAULT_PROFILE_IMAGE }} />  
                        </Link>
                    </li>
                    {/* <li className="nav-item">
                        <div
                            className="btn text-white"
                            onClick={() => {
                                localTest();
                            }}
                        >
                            Test
                        </div>
                    </li> */}
                    <li className="nav-item ">
                        <Link
                            className="btn text-white "
                            onClick={() => {
                                localLogOut();
                            }}
                        >
                            Logout
                        </Link>
                    </li>
                </div>
            ) : (
                <div className="navbar-nav ml-auto">
                    <li className="nav-item active">
                        <Link to={"/login"} className="nav-link">
                            Login
                        </Link>
                    </li>
                </div>
            )}
        </nav>
    )
}
