import React, { Component, useState } from "react";
import { actionCreators } from "../../state/index";
import { useDispatch, useSelector } from "react-redux";

import userService from "../../services/user.service";

import AddIcon from "@mui/icons-material/Add";
export default function ContactListArea() {
  const MyContacts = useSelector((state) => state.MyContacts);
  const CurrentUser = useSelector((state) => state.CurrentUser);

  // const MyContacts = [
  //   {
  //     id: 1,
  //     name: "aman",
  //     email: "aman@gmail.com",
  //     about: "hi",
  //     lastMassege: "hello",
  //   },
  //   {
  //     id: 2,
  //     name: "aarju",
  //     email: "aarju@gmail.com",
  //     about: "hnnnn i",
  //     lastMassege: "nknllknhello",
  //   },
  // ];

  const dispatch = useDispatch();
  const [addContactEmail, setAddContactEmail] = useState("");
  const [addContactName, setaddContactName] = useState("");

  function onChangeAddContactEmail(e) {
    setAddContactEmail(e.target.value);
  }
  function onChangeAddContactName(e) {
    setaddContactName(e.target.value);
  }

  function HandleOnContactClickEvent(e) {
    var contactId = e.target.id;
    dispatch(actionCreators.SetContactId(contactId));

    const currentContact = MyContacts.find((object) => object._id == contactId);
    console.log("you clicked on contact", contactId, " and : ", currentContact);
    dispatch(actionCreators.SetCurrentContact(currentContact));
  }

  function AddContactFormOpner(e) {
    var div2 = document.getElementById("AddContactForm");
    div2.style.display = "block";
  }

  function AddContactHandler() {
    var div2 = document.getElementById("AddContactForm");

    userService
      .newContactHandleMain(addContactEmail, addContactName)
      .then((e) => {
        console.log("resolve :" + e);
        if (e.status == 0) {
          window.alert("Invite Your Friend In Massenger");
        } else if (e.status == 1) {
          window.alert("Your Friend is added into contact list");
        } else if (e.status == 2) {
          window.alert("Your Friend is already added into contact list");
        }
        userService.updateMyContacts(dispatch, actionCreators).then((res) => {
          console.log("contact refress success");
        }).catch((err) => {
          console.log("contact refress failed"); 
        });
      })
      .catch((e) => {
        console.log("error :" + e);
      });
    div2.style.display = "none";
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item btn ">
              <AddIcon
                titleAccess="Add Your Friend to contact List"
                onClick={() => {
                  AddContactFormOpner();
                }}
              />
            </li>
          </ul>
        </div>
      </nav>

      <div data-spy="scroll">
        {MyContacts.length > 0 ? (
          MyContacts.map((contact, index) => {
            return (
              <div
                key={index}
                id={contact._id}
                onClick={HandleOnContactClickEvent}
                className="border-right"
              >
                <div className="text-center" style={{ pointerEvents: "none" }}>
                  <h4>name: {contact.name}</h4>
                  <h6>email: {contact.email}</h6>
                  <h6>last massege: {contact._id}</h6>
                  <hr />
                </div>
              </div>
            );
          })
        ) : (
          <div className="container">
            <div className="card">
              <img
                className="card-img-top "
                src="https://i.ibb.co/NSfrfzs/ic-launcher.jpg"
                alt="Massenger Logo"
              />
              <div className="card-body">
                <h5 className="card-title">
                  Add Your Friends in your Contact List
                </h5>
                <p className="card-text">
                  Start chat with your friends with massenger
                </p>
                <div
                  className="btn btn-lg btn-success"
                  onClick={() => {
                    AddContactFormOpner();
                  }}
                >
                  add Friends
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="AddContactForm form-group" id="AddContactForm">
        <div className="form-group">
          <label htmlFor="email">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={addContactName}
            onChange={onChangeAddContactName}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="form-control"
            name="email"
            value={addContactEmail}
            onChange={onChangeAddContactEmail}
          />
        </div>

        <div className="form-group">
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              AddContactHandler();
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
