import React, { Component, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import UserService from "../services/user.service";
import ContactList from "./child-component/ContactListArea.home";
import MainDisplayArea from "./child-component/MainDisplayArea.home";
import AuthService from "../services/auth.service";
import io from "socket.io-client";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../state/index";
import { SocketServiceInit } from "../services/socket.service";
import { connect } from "react-redux";


import "../mainstyle.css";

function Home() {
  const dispatch = useDispatch();

  const MyContacts = useSelector((state) => state.MyContacts);
  const MySocket = useSelector((state) => state.MySocket);
  const StoredEmitEvents = useSelector((state) => state.StoredEmitEvents);

  const [redirect, setRedirect] = useState(null);
  const [content, setContent] = useState("");
  const [contactId, setContactId] = useState("-1");

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser == null) {
      // console.log("set redirect to home");
      setRedirect("/login");
    } else {
      try {
        var tryMasseges = JSON.parse(
          localStorage.getItem("masseges_6440da64a72c6878e94754f2")
        );
        console.log("home.js : tryMasseges :", tryMasseges);
      } catch  {
        
      }
      var localMyContacts = JSON.parse(
        localStorage.getItem("MyContacts_basicInfo")
      );
      console.log(
        "home.js useEffect start first localMyContacts is : ",
        localMyContacts
      );
      if (localMyContacts == null) {
        localMyContacts = [];
      }
      console.log("element is : ", localMyContacts[0]);
      dispatch(actionCreators.SetMyContacts(localMyContacts));

      console.log("before SocketServiceInit");

      const socket = io("http://localhost:10002", {
        query: { id: AuthService.getCurrentUserId() },
      });

      socket.on("connect", () => {
        console.log("SocketServiceInit Connected to server!");
        console.log(
          "SocketServiceInit Connected storedEmitEvents  :",
          StoredEmitEvents.length
        );
        StoredEmitEvents.forEach((eventObj) => {
          const { event, value } = eventObj;
          console.log("Onconnect || event : ", event, " args : ", value);
          socket.emit(event, value.id, value.data);
        });
      });

      dispatch(actionCreators.SetMySocketInstance(socket));
      console.log("before updateMassege in app.js useEffect");

      socket.on("new_massege_from_server", function (id, data) {
        const masseges = data.selectedMessages;
        console.log(
          "socket event new_massege_from_server || masseges:",
          masseges
        );
        console.log("massege array length : ", masseges.length);
        if (masseges.length > 0) {
          masseges.forEach((massegeObj) => {
            let contactId;
            if (massegeObj.from === AuthService.getCurrentUserId()) {
              contactId = massegeObj.to;
            } else if (massegeObj.to === AuthService.getCurrentUserId()) {
              contactId = massegeObj.from;
            }

            const massegePointer = "masseges_" + contactId;
            var localMasseege = JSON.parse(
              localStorage.getItem(massegePointer)
            );
            if (localMasseege != undefined || localMasseege != null) {
              if (
                !localMasseege.some(
                  (message) => message.time === massegeObj.time
                )
              ) {
                console.log("before push and store i localstoreage");
                localMasseege.push(massegeObj);
                localStorage.setItem(massegePointer, localMasseege);
              }
            } else {
              console.log("problem in localMassege");
              const massegeArray = [];
              massegeArray.push(massegeObj);
              localStorage.setItem(massegePointer, massegeArray);
            }
          });
        }
      });

      // UserService.updateMasseges(socket, MyContacts);

      UserService.updateMyContacts()
        .then((response) => {
          if (response.status > 0) {
            const newMyContacts = response.data;
            console.log(
              "UserService.updateMyContacts().then() newMyContacts is : ",
              newMyContacts
            );
            const localMyContacts0 = localStorage.getItem(
              "MyContacts_basicInfo"
            );
            var localMyContacts;
            if (localMyContacts0 == undefined || localMyContacts0) {
              localMyContacts = [];
            } else {
              localMyContacts = JSON.parse(localMyContacts0 || "[]");
            }

            const addedItems = newMyContacts.filter(
              (item) => !localMyContacts.includes(item)
            );
            const removedItems = localMyContacts.filter(
              (item) => !newMyContacts.includes(item)
            );
            removedItems.forEach((element) => {
              element["blocked"] = true;
              newMyContacts.push(element);
            });

            dispatch(actionCreators.SetMyContacts(newMyContacts));
            localStorage.setItem(
              "MyContacts_basicInfo",
              JSON.stringify(newMyContacts)
            );

            console.log(
              "UserService.updateMyContacts() in home.js aafter localstorage set newMyContacts: ",
              JSON.stringify(newMyContacts)
            );
            UserService.updateMasseges(MySocket, newMyContacts).then(
              (resolve) => {
                if (resolve != 1) {
                  console.log("after resolve : ", {
                    event: resolve.event,
                    value: resolve.value,
                  });
                  StoredEmitEvents.push({
                    event: resolve.event,
                    value: resolve.value,
                  });
                }
              }
            );
          } else {
          }
        })
        .catch((error) => {
          console.log("error in UserService.updateMyContacts.catch : ", error);
        });
      // UserService.getUserContactList().then(
      //   (response) => {
      //     setContent(response.data);
      //   },
      //   (error) => {
      //     setContent(
      //       (error.response && error.response.data) ||
      //         error.message ||
      //         error.toString()
      //     );
      //   }
      // );
    }
  }, []);

  function onSelectContact(contactId) {
    console.log("in onSelectContact and contact id is : ", contactId);
    setContactId(contactId);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="Home">
      <div className="ContactList  ">
        <ContactList />
      </div>
      <div className="MainDisplayArea ">
        <MainDisplayArea hi={"hello"} />
      </div>
    </div>
  );
}

export default Home;
