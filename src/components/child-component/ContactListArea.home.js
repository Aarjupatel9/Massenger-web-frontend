import React, { Component, useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { actionCreators } from "../../state/index1";
import { useDispatch, useSelector } from "react-redux";
import Popup from 'reactjs-popup';

import userService from "../../services/user.service";
import UserContext from "../../context/createContext";
import AddIcon from "@mui/icons-material/Add";
import authService from "../../services/auth.service";
import { userDetailsTemplate } from "../../templates/Templates";
import HomeContext from "../../context/HomeContext";
export default function ContactListArea() {

  const { isSidebarOpen, setIsSidebarOpen, admin, currentUser, setCurrentUser, mySocket, massegeArray, setMassegeArray, setMySocket, storedEmitEvents, setStoredEmitEvents, contactId, setContactId, currentContact, setCurrentContact } = useContext(UserContext);
  const myContacts = useSelector((state) => state.MyContacts);
  const BlockedContacts = useSelector((state) => state.BlockedContacts);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("ContactListArea || myContacts is changed  :", myContacts);
  }, [myContacts]);

  function HandleOnContactClickEvent(e) {
    var contactId = e.currentTarget.id;
    const currentContact = myContacts.find((object) => object._id == contactId);
    console.log("you clicked on contact", contactId, " and : ", currentContact);
    if (currentContact != userDetailsTemplate) {
      console.log("you clicked on contact perfectly set");
      setContactId(contactId);
      setCurrentContact(currentContact);
    }
  }
  return (
    <div className="ContactList  ">
      <nav className="contactListNavbar navbar navbar-expand-lg navbar-light bg-light p-0">
        <div className="collapse navbar-collapse p-0 m-0" id="navbarNavDropdown">
          <div className="nav-item btn btn-lg mx-auto font-weight-bolder ">
            Contacts
          </div>
        </div>
        <Popup trigger={<div className="collapse navbar-collapse p-0 m-0" id="navbarNavDropdown">
          <div className="nav-item btn btn-sm mx-auto font-weight-bolder ">
            Blocked Contacts
          </div>
        </div>} position="bottom center">
          {close => (
            <div>
              <div className="contactListScroll" >
                {BlockedContacts.length > 0 ? (
                  BlockedContacts.map((contact, index) => {
                    return (
                      <div
                        key={index}
                        id={contact._id}
                        onClick={(e) => { console.log("contact is blocked in this account") }}
                        className="contact-card m-0"
                      >
                        <div className="contact-info p-2 ">
                          <img
                            src={contact.imageUrl}
                            className="contact-image"
                          // onError={(e) => {
                          //   e.target.src = defaultImageURL; // Use the default image URL when the image fails to load
                          // }}
                          />
                          <div className="contact-text">
                            <h5>{contact.Name}</h5>
                            <h6>{contact.lastMassege}</h6>
                          </div>
                          {parseInt(contact.unSeenMassegeCounter) > 0 ? <div className="m-3 bg-success rounded-circle unSeenMassegeCounter ml-auto"><div className="unSeenMassegeCounterText px-2">{contact.unSeenMassegeCounter}</div></div> : <></>}
                        </div>

                      </div>
                    );
                  })
                ) : (
                  <>no blocked contact</>
                )}
              </div>
              <a className="close" onClick={close}>
                &times;
              </a>
            </div>
          )}
        </Popup>

      </nav>

      <div className="contactListScroll" >
        {myContacts.length > 0 ? (
          myContacts.map((contact, index) => {
            return (
              <div
                key={index}
                id={contact._id}
                onClick={(e) => { HandleOnContactClickEvent(e); }}
                className="contact-card m-0"
              >
                <div className="contact-info p-2 ">
                  <img
                    src={contact.imageUrl}
                    className="contact-image"
                  // onError={(e) => {
                  //   e.target.src = defaultImageURL; // Use the default image URL when the image fails to load
                  // }}
                  />
                  <div className="contact-text">
                    <h5>{contact.Name}</h5>
                    <h6>{contact.lastMassege}</h6>
                  </div>
                  {parseInt(contact.unSeenMassegeCounter) > 0 ? <div className="m-3 bg-success rounded-circle unSeenMassegeCounter ml-auto"><div className="unSeenMassegeCounterText px-2">{contact.unSeenMassegeCounter}</div></div> : <></>}
                </div>

              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>


    </div>
  );
}