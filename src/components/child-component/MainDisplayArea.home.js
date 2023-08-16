import React, { useContext, useEffect, useState } from "react";

import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";

import VideoCallIcon from "@mui/icons-material/VideoCall";
import CallIcon from "@mui/icons-material/Call";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MainDisplayAreaNullDesign from "./MainDisplayAreaNullDesign"
import UserContext from "../../context/createContext";
import HomeContext from "../../context/HomeContext";
import ChatsRecyclerView from "./chatsRecyclerView";
import ContactProfileView from "./ContactProfileView";
import VideoCall from "./Videocall.comp"
import VoiceCall from "./Voicecall.comp"
import authService from "../../services/auth.service";
import { userDetailsTemplate } from "../../templates/Templates";
function MainDisplayArea() {

  const { isSidebarOpen, setIsSidebarOpen, currentContactOnlineStatus, setCurrentContactOnlineStatus, massegeArray, setMassegeArray, admin, currentUser, setCurrentUser, mySocket, setMySocket, storedEmitEvents, setStoredEmitEvents, contactId, setContactId, currentContact, setCurrentContact, typedMassege, setTypedMassege } = useContext(UserContext);

  const { fUpdateContactRankAndLastMassege, massegeArrayScrollToBottom, setMassegeArrayScrollToBottom, addMyContactsUpdateQueue } = useContext(HomeContext);

  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  function MakeVedioCall() {
    if (page == 0) {
      setPage(3);
    } else if (page == 3 || page == 1) {
      setPage(0);
    }
  }
  function MakeVoiceCall() {
    if (page == 2) {
      setPage(0);
    } else if (page == 0 || page == 1) {
      setPage(2);
    }
  }
  function viewProfilePage() {

    if (page == 1) {
      setPage(0);
    } else if (page == 0) {
      setPage(1);
    }
  }

  function repeatTask() {
    if (mySocket != null && currentContact != userDetailsTemplate) {
      // console.log("onlineStatus checking emited for  ", currentContact._id);
      mySocket.emit("CheckContactOnlineStatus", authService.getCurrentUserId(), currentContact._id)
    } else {
      // console.log("onlineStatus checking not emited");
    }
  }
  const intervalMilliseconds = 1500;
  useEffect(() => {
    setPage(0);

    //online status area
    setCurrentContactOnlineStatus("Tap to see Contact info");
    if (currentContact._id == currentUser._id) {
      setCurrentContactOnlineStatus("online");
    } else {
      var intervalId = setInterval(repeatTask, intervalMilliseconds);
    }
    return () => { clearInterval(intervalId); }
  }, [currentContact, mySocket])


  function SendMassege(e) {
    console.log("sending massege : ", typedMassege);
    if (typedMassege.trim() == "") {
      return;
    }
    var massegeObj = {
      from: currentUser._id,
      to: currentContact._id,
      massege: typedMassege.trim(),
      time: Date.now(),
      massegeStatus: 0,
      massegeStatusL: 1,
      ef1: 1,
      ef2: 1,
      elf1: 1,
      elf2: 1,
    }
    if (currentContact._id == authService.getCurrentUserId()) {
      massegeObj.massegeStatus = 3;
    }
    mySocket.emit("send_massege_to_server_from_sender", currentUser._id, massegeObj);
    addMyContactsUpdateQueue(1, massegeObj, 0);//tyoe=1

    setMassegeArray((prevMessages) => [...prevMessages, massegeObj]);
    setMassegeArrayScrollToBottom((prev) => prev + 1);

    const massegePointer = "masseges_" + authService.getCurrentUserId() + currentContact._id;

    var localMasseege = JSON.parse(
      localStorage.getItem(massegePointer)
    );
    if (localMasseege != undefined || localMasseege != null) {
      if (
        !localMasseege.some(
          (message) => message.time === massegeObj.time
        )
      ) {
        // console.log("before push and store i localstoreage");
        localMasseege.push(massegeObj);
        const sortedLocalMasseege = localMasseege.slice().sort((a, b) => a.time - b.time);
        localStorage.setItem(massegePointer, JSON.stringify(sortedLocalMasseege));
      }
    } else {
      // console.log("problem in localMassege");
      var tmp = [];
      tmp.push(massegeObj);
      localStorage.setItem(massegePointer, JSON.stringify(tmp));
    }
    setTypedMassege("");
  }


  return (
    <div className="MainDisplayArea ">
      {contactId == "-1" ? (
        <MainDisplayAreaNullDesign />) : (
        <>
          <nav className="MAinDisplayAreaNavbar py-1 navbar navbar-expand-lg navbar-light">
            <div className="collapse navbar-collapse" id="navbarText">
              <div className="navbar-item mr-auto" onClick={() => {
                viewProfilePage();
              }}>
                <div className="navbar-item h4 py-0 my-0">{currentContact.Name}</div>
                <div className=" h6 py-0 my-0 onlineStatusDiv">{currentContactOnlineStatus}</div>
              </div>
              <span className="btn mr-1 ml-1">
                <CallIcon
                  titleAccess="make voice call"
                  onClick={() => {
                    MakeVoiceCall();
                  }}
                />
              </span>
              <span className="btn mr-1 ml-1">
                <VideoCallIcon
                  titleAccess="make vedio call"
                  onClick={() => {
                    MakeVedioCall();
                  }}
                />
              </span>
              <span className="btn mr-2 ml-1">
                <MoreVertIcon
                  titleAccess="more options"
                  onClick={() => {
                    // MakeVedioCall();
                  }}
                />
              </span>
            </div>
          </nav>

          {page == 0 ? <>
            <ChatsRecyclerView />
            <div className="typedMassegeBox mb-2 mx-4 mt-1">
              <div className="input-group  ">
                <input
                  type="text"
                  className=" rounded-corner-input "
                  placeholder="write massege"
                  value={typedMassege}
                  onChange={(e) => { setTypedMassege(e.target.value); }}
                />

                <button
                  className=" btn btn-primary ml-2"
                  onClick={() => {
                    SendMassege();
                  }}
                >
                  send
                </button>

              </div>
            </div></> :
            page == 1 ? <ContactProfileView /> : page == 2 ? <VoiceCall /> : page == 3 ? <VideoCall /> : <></>}
        </>
      )}
    </div>
  );
}

export default MainDisplayArea;
