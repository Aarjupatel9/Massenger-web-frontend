import React, { useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { useNavigate } from "react-router-dom";

export default function VoiceCall() {
const CurrentUser = useSelector((state) => state.CurrentUser);
const contactId = useSelector((state) => state.ContactId);
const CurrentContact = useSelector((state) => state.CurrentContact);

const navigate = useNavigate();

function goBack() {
  navigate("/home");
}

return (
  <>
    <nav className="navbar navbar-expand-lg navbar-light bg-danger">
      <div className="collapse navbar-collapse" id="navbarText">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">{CurrentContact.name}</li>
        </ul>
      </div>
    </nav>

    <div className="container">
      <div className="card text-center">
        <div className="card-header">Voice Call</div>
        <div className="card-body">
          <button className="btn btn-primary btn-lg">Start</button>
        </div>
      </div>
      <div className="card p-0 text-center">
        <div className="card-body ">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              goBack();
            }}
          >
            End
          </button>
        </div>
      </div>
    </div>
  </>
);
}
