import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import UserContext from "../../context/createContext";
import { userDetailsTemplate } from "../../templates/Templates";
import { useEffect } from "react";
import authService from "../../services/auth.service";
import userService from "../../services/user.service";

export default function ContactProfileView() {

  const { isSidebarOpen, setIsSidebarOpen, currentContact, setCurrentContact, admin, currentUser, setCurrentUser, mySocket, setMySocket, storedEmitEvents, setStoredEmitEvents, contactId, setContactId, massegeArray, setMassegeArray } = useContext(UserContext);

  const [about, setAbout] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [number, setNumber] = useState("");

  useEffect(() => {
    // console.log("image : ", currentUser.picture);
    mySocket.on("getContactDetailsForContactDetailsFromMassegeViewPage_return", fUpdateContatDetailsInView);
    mySocket.emit("getContactDetailsForContactDetailsFromMassegeViewPage", authService.getCurrentUserId(), currentContact._id);
    return () => {

      mySocket.off("getContactDetailsForContactDetailsFromMassegeViewPage_return", fUpdateContatDetailsInView);

    };
  }, []);

  const fUpdateContatDetailsInView = (...args) => {
    console.log("getContactDetailsForContactDetailsFromMassegeViewPage_return || args : ", args);
    const CID = args[0];
    const displayName = args[1];
    const about = args[2];
    const number = args[3];

    setDisplayName(displayName);
    setAbout(about);
    setNumber(number);
  }

  return (
    <div className="chatsRecyclerView myScroll">
      {currentContact != userDetailsTemplate ? (
        <div className="container rounded bg-white mt-5 mb-5">
          <div className="row">
            <div className="col-md-3 border-right">
              <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                <img
                  alt="profile image"
                  className="rounded-circle mt-5"
                  width="150px"
                  src={currentContact.imageUrl}
                  onError={(e) => { e.target.src = process.env.REACT_APP_DEFAULT_PROFILE_IMAGE }}
                />
                <span className="text-black-50 mt-4 m-2">Account number : {number}</span>
              </div>
            </div>
            <div className="col-md-5 ">
              <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="text-right">Profile Information</h4>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <label className="labels">Display Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={displayName}
                      readOnly
                    />
                  </div>
                </div>


                <div className="row mt-2">
                  <div className="col-md-12">
                    <label className="labels">About</label>
                    <input
                      type="text"
                      className="form-control"
                      value={about}
                      readOnly
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      ) : (
        <h3>please login firt</h3>
      )}
    </div>
  );
}
