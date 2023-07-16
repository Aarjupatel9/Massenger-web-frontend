import React from 'react'
import {Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { userDetailsTemplate } from '../../templates/Templates';

import authService from '../../services/auth.service';
import { actionCreators } from '../../state';

export default function NavBar() {


    const CurrentUser = useSelector((state) => state.CurrentUser);
    const MySocket = useSelector((state) => state.MySocket);
    const MyContacts = useSelector((state) => state.MyContacts);

    const dispach = useDispatch();

    function localLogOut() {
        authService.logout();
        dispach(actionCreators.SetCurrentUser(userDetailsTemplate));
        console.log("after logout currentuser : ", CurrentUser);
        window.location.reload();
    }

    return (
      
        <nav className="MyNavbar navbar navbar-expand navbar-dark MainNavbar">
            <Link to={"/home"} className="navbar-brand">
                Massenger
            </Link>
            {/* {displayFunction()} */}
            {CurrentUser != userDetailsTemplate ? (
                <div className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link to={"/profile"} className="nav-link">
                            {CurrentUser.username}
                        </Link>
                    </li>
                    <li className="nav-item ">
                        <div
                            className="nav-link btn"
                            onClick={() => {
                                localLogOut();
                            }}
                        >
                            LogOut
                        </div>
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
