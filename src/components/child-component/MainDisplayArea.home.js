import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";

import VideoCallIcon from "@mui/icons-material/VideoCall";
import CallIcon from "@mui/icons-material/Call";
import MoreVertIcon from "@mui/icons-material/MoreVert";


import Chats from "./chats.comp";

function MainDisplayArea() {
  const CurrentUser = useSelector((state) => state.CurrentUser);
  const contactId = useSelector((state) => state.ContactId);
  const CurrentContact = useSelector((state) => state.CurrentContact);

  const navigate = useNavigate();
  const [Tabs, setTabs] = useState(0);

  function MakeVedioCall() {
    console.log("video calling...");
    navigate("/vedioCall");
  }
  function MakeVoiceCall() {
    navigate("/voiceCall");
  }

  return (
    <>
      {contactId == "-1" ? (
        <h1>welcome on massenger {CurrentUser.username}</h1>
      ) : (
        <>
          <nav className="navbar navbar-expand-lg navbar-light bg-danger">
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">{CurrentContact.name}</li>
              </ul>
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

          <div className="">
              {Tabs == 0 ? (<Chats /> ):(<></>)}
          </div>
        </>
      )}
    </>
  );
}

export default MainDisplayArea;
