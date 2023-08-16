import React, { useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import UserContext from '../../context/createContext';

export default function VoiceCall() {

  const { isSidebarOpen, setIsSidebarOpen, currentContact, setCurrentContact, admin, currentUser, setCurrentUser, mySocket, setMySocket, myContacts, setMyContacts, storedEmitEvents, setStoredEmitEvents, contactId, setContactId, massegeArray, setMassegeArray } = useContext(UserContext);


  const navigate = useNavigate();

  function goBack() {
    navigate("/home");
  }

  return (
    <div className="chatsRecyclerView">
      <nav className="navbar navbar-expand-lg navbar-light bg-danger">
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">{currentContact.name}</li>
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
    </div>
  );
}
