import React, { Component, useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { actionCreators } from "../../state/index1";
import { useDispatch, useSelector } from "react-redux";

import userService from "../../services/user.service";
import UserContext from "../../context/createContext";
import AddIcon from "@mui/icons-material/Add";
import authService from "../../services/auth.service";
import { userDetailsTemplate } from "../../templates/Templates";
import HomeContext from "../../context/HomeContext";
export default function ContactListArea() {

  const { isSidebarOpen, setIsSidebarOpen, admin, currentUser, setCurrentUser, mySocket, massegeArray, setMassegeArray, setMySocket, storedEmitEvents, setStoredEmitEvents, contactId, setContactId, currentContact, setCurrentContact } = useContext(UserContext);

  // setMyContacts, myContacts

  const myContacts = useSelector((state) => state.MyContacts);

  // const CurrentUser = useSelector((state) => state.CurrentUser);

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
  // const [audio] = useState(new Audio(process.env.PUBLIC_URL + "/audio/massege_pop_alert.mp3"));

  // function playNotificationSound(){
  //   console.log("playNotificationSound || start");
  //   audio.play();
  // };
  return (
    <div className="ContactList  ">
      <nav className="contactListNavbar navbar navbar-expand-lg navbar-light bg-light p-0">
        <div className="collapse navbar-collapse p-0 m-0" id="navbarNavDropdown">
          <div className="nav-item btn btn-lg mx-auto font-weight-bolder ">
            Contacts
          </div>
        </div>
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