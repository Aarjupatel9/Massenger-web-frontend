import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import Test from "./components/test/Test";
import VideoCall from "./components/child-component/Videocall.comp";
import VoiceCall from "./components/child-component/Voicecall.comp";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./mainstyle.css";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "./state/index";
import { userDetailsTemplate } from "./templates/Templates";


import { SocketServiceInit } from "./services/socket.service";
import store from "./state/store";
import io from "socket.io-client";
import userService from "./services/user.service";


import NavBar from "./components/common/NavBar";
function App() {
  const CurrentUser = useSelector((state) => state.CurrentUser);
  const MySocket = useSelector((state) => state.MySocket);
  const MyContacts = useSelector((state) => state.MyContacts);

  const navigate = useNavigate();
  const dispach = useDispatch();

  useEffect(() => {
    const localCurrentUser = AuthService.getCurrentUser();
    console.log("app.js useeffect localcurrentUser :", localCurrentUser);
    
    if (localCurrentUser == null) {
      // console.log("app.js useeffect localcurrentUser enter if cond.");
      navigate("/login");
      // window.location.reload();
    } else {
      // console.log("app.js useeffect localcurrentUser enter else cond.");
      dispach(actionCreators.SetCurrentUser(localCurrentUser));
      // console.log(
      //   "app.js useeffect localcurrentUser enter else cond. currentuser : ",
      //   CurrentUser
      // );
      navigate("/home");
    }
  }, []);

  

  // function displayFunction() {
  //   console.log("app.js DF currentUser : ", CurrentUser);
  // }
  return (
    <>
      <div className="MainPage">
        <NavBar/>

        <div className="MainComponents">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/VedioCall" element={<VideoCall />} />
            <Route path="/VoiceCall" element={<VoiceCall />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
