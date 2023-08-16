import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import AuthService from "./services/auth.service";
import Login from "./components/login.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import VideoCall from "./components/child-component/Videocall.comp";
import VoiceCall from "./components/child-component/Voicecall.comp";

import "bootstrap/dist/css/bootstrap.min.css";
import "./ChatsComp.css";
import "./mainstyle.css";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "./state/index1";
import { userDetailsTemplate } from "./templates/Templates";

import UserContext from "./context/createContext";

import store from "./state/store";
import io from "socket.io-client";
import userService from "./services/user.service";


import NavBar from "./components/common/NavBar";
function App() {

  const [currentUser, setCurrentUser] = useState(userDetailsTemplate);
  const [currentContact, setCurrentContact] = useState(userDetailsTemplate);
  const [mySocket, setMySocket] = useState(null);
  // const [myContacts, setMyContacts] = useState([]);
  const [contactId, setContactId] = useState("-1");
  const [storedEmitEvents, setStoredEmitEvents] = useState([]);
  const [massegeArray, setMassegeArray] = useState([]);
  const [typedMassege, setTypedMassege] = useState("");
  const [currentContactOnlineStatus, setCurrentContactOnlineStatus] = useState("");


  const navigate = useNavigate();

  useEffect(() => {

    const localCurrentUser = AuthService.getCurrentUser();
    console.log("app.js useeffect localcurrentUser :", localCurrentUser);
    if (localCurrentUser == null) {
      navigate("/login");
    } else {
      setCurrentUser(localCurrentUser);
      navigate("/home");
    }
  }, []);



  return (
    <UserContext.Provider value={{ currentContactOnlineStatus, setCurrentContactOnlineStatus, currentUser, setCurrentUser, mySocket, setMySocket,  storedEmitEvents, setStoredEmitEvents, contactId, setContactId, currentContact, setCurrentContact, massegeArray, setMassegeArray, typedMassege, setTypedMassege }} ><div className="App">
      {/* myContacts, setMyContacts, */}
      <NavBar />
      <div className="MainComponents">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/VedioCall" element={<VideoCall />} />
          <Route path="/VoiceCall" element={<VoiceCall />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div></UserContext.Provider>

  );
}

export default App;
