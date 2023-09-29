import React, { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/user.service";
import ContactList from "./child-component/ContactListArea.home";
import MainDisplayArea from "./child-component/MainDisplayArea.home";
import AuthService from "../services/auth.service";
import io from "socket.io-client";

import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../state/index1";

import UserContext from "../context/createContext";
import HomeContext from "../context/HomeContext";

import "../mainstyle.css";
import { userDetailsTemplate } from "../templates/Templates";
import authService from "../services/auth.service";

import toast from "react-hot-toast";

function Home() {
  const {
    setCurrentContactOnlineStatus,
    currentContact,
    currentUser,
    setCurrentUser,
    mySocket,
    setMySocket,
    storedEmitEvents,
    contactId,
    massegeArray,
    setMassegeArray,
  } = useContext(UserContext);
  // myContacts, setMyContacts,

  const myContacts = useSelector((state) => state.MyContacts);
  const dispatch = useDispatch();

  const [massegeArrayPage, setMassegeArrayPage] = useState(1);
  const [massegeArrayScrollToBottom, setMassegeArrayScrollToBottom] =
    useState(1);
  const [massegeArrayWhole, setMassegeArrayWhole] = useState([]);

  const [localContacts, setLocalContacts] = useState([]);

  const contactIdRef = useRef(contactId);

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser === userDetailsTemplate) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    console.log("useEffect localContacts start ", localContacts.length);
  }, [localContacts]);

  useEffect(() => {
    console.log(
      "home useffect , current contact is changed , ",
      contactId,
      " , ",
      currentContact
    );
    contactIdRef.current = contactId;

    addMyContactsUpdateQueue(4, currentContact._id);
  }, [contactId, currentContact]);

  useEffect(() => {
    console.log("home useffect , myContacts , ", myContacts);
  }, [myContacts]);

  const PAGE_SIZE = 100; // Number of messages to fetch per page
  const fSetMassegeArray = () => {
    // if()
    console.log("fSetMassegeArray || start : ");

    var startIndex = massegeArrayWhole.length - massegeArrayPage * PAGE_SIZE;
    var endIndex =
      massegeArrayWhole.length - (massegeArrayPage - 1) * PAGE_SIZE;
    if (startIndex < 0) {
      startIndex = 0;
      endIndex = 100;
    }
    const messagesForPage = massegeArrayWhole.slice(startIndex, endIndex);
    console.log(
      "Home fSetMassegeArray : ",
      startIndex,
      " , ",
      endIndex,
      " , ",
      messagesForPage.length
    );
    setMassegeArray(messagesForPage);
  };

  var timerForTipingEvent = {};
  // Processing function for the queue
  const myContactsUpdateQueue = [];
  const processUpdateQueue = () => {
    if (myContactsUpdateQueue.length > 0) {
      const updateFunction = myContactsUpdateQueue.shift();
      updateFunction();
    }
  };

  const addMyContactsUpdateQueue = (type, ...data) => {
    console.log("addMyContactsUpdateQueue start || type : ", type);
    if (type == 1) {
      myContactsUpdateQueue.push(() => {
        fUpdateContactRankAndLastMassege(data[0], data[1]);
        processUpdateQueue();
      });
    } else if (type == 2) {
      myContactsUpdateQueue.push(() => {
        fSetMassegeArriveCounter(data[0]);
        processUpdateQueue();
      });
    } else if (type == 3) {
      myContactsUpdateQueue.push(() => {
        fSetContactList();
        processUpdateQueue();
      });
    } else if (type == 4) {
      myContactsUpdateQueue.push(() => {
        fRemoveNewArrivalValue(data[0]);
        processUpdateQueue();
      });
    } else if (type == 5) {
      myContactsUpdateQueue.push(() => {
        fUpdateLastMassegeOfContacts(data[0]);
        processUpdateQueue();
      });
    } else if (type == 6) {
      myContactsUpdateQueue.push(() => {
        updateTypingStatusToContact(data[0]); // typing status update
        processUpdateQueue();
      });
    } else if (type == 7) {
      myContactsUpdateQueue.push(() => {
        updateLastMassegeToContact(data[0]); // for single contact specially for typing event
        processUpdateQueue();
      });
    }

    if (myContactsUpdateQueue.length === 1) {
      processUpdateQueue();
    }
  };

  function updateLastMassegeToContact(CID) {
    var lastMassege;
    const messages = getMessagesFromLocalStorage(CID);
    if (messages.length > 0) {
      lastMassege = messages[messages.length - 1].massege;
      const truncatedMessage =
        lastMassege.length > 20
          ? `${lastMassege.slice(0, 20)}...`
          : lastMassege;
      lastMassege = truncatedMessage;
    } else {
      lastMassege = "";
    }
    setLocalContacts((prevLocalContacts) => {
      const updatedContacts = prevLocalContacts.map((contact) => {
        if (contact._id === CID) {
          contact.lastMassege = lastMassege;
          return contact;
        }
        return contact;
      });
      dispatch(actionCreators.SetMyContacts(updatedContacts));
      return updatedContacts;
    });
  }

  function updateTypingStatusToContact(CID) {
    var timeoutId = timerForTipingEvent[CID];
    if (timeoutId) {
      clearTimeout(timeoutId); // remove previous timeOut
    }
    var timeoutId = setTimeout(() => {
      // setLastMaseegeOfContact(CID);
      addMyContactsUpdateQueue(7, CID);
    }, 1500);

    timerForTipingEvent[CID] = timeoutId; //timeOut set

    //now update in UI
    setLocalContacts((prevLocalContacts) => {
      const updatedContacts = prevLocalContacts.map((contact) => {
        if (contact._id === CID) {
          contact.lastMassege = "typing...";
          return contact;
        }
        return contact;
      });
      dispatch(actionCreators.SetMyContacts(updatedContacts));
      return updatedContacts;
    });
  }

  function fRemoveNewArrivalValue(idToRemove) {
    setLocalContacts((prevLocalContacts) => {
      const updatedContacts = prevLocalContacts.map((contact) => {
        if (contact._id === idToRemove) {
          const { unSeenMassegeCounter, ...updatedContact } = contact;
          return updatedContact;
        }
        return contact;
      });
      dispatch(actionCreators.SetMyContacts(updatedContacts));
      localStorage.setItem(
        "MyContacts_basicInfo",
        JSON.stringify(updatedContacts)
      );
      return updatedContacts;
    });
  }

  function fUpdateContactRankAndLastMassege(massegeOBJ, type) {
    let connect_id;
    if (type == 1) {
      connect_id = massegeOBJ.from;
    } else if (type == 0) {
      connect_id = massegeOBJ.to;
    }
    console.log(
      "fUpdateContactRankAndLastMassege || start contact_id : ",
      connect_id
    );

    setLocalContacts((prevLocalContacts) => {
      const indexToUpdate = prevLocalContacts.findIndex(
        (item) => item._id == connect_id
      );
      console.log("fSetMassegeArriveCounter || start index : ", indexToUpdate);

      if (indexToUpdate != -1) {
        const newData = [...prevLocalContacts];

        const objectToMove = newData.splice(indexToUpdate, 1)[0];
        objectToMove.lastMassege = getTruncatedMasssege(massegeOBJ.massege);

        newData.unshift(objectToMove);
        console.log("fSetMassegeArriveCounter || newData: ", newData);
        // setLocalContacts(newData);
        dispatch(actionCreators.SetMyContacts(newData));
        localStorage.setItem("MyContacts_basicInfo", JSON.stringify(newData));

        return newData;
      } else {
        console.log("fSetMassegeArriveCounter index : -1");
        return prevLocalContacts;
      }
    });
  }

  function fSetMassegeArriveCounter(massegeObj) {
    setLocalContacts((prevLocalContacts) => {
      const indexToUpdate = prevLocalContacts.findIndex(
        (item) => item._id == massegeObj.from
      );
      console.log("fSetMassegeArriveCounter || start index : ", indexToUpdate);

      if (indexToUpdate != -1) {
        const newData = [...prevLocalContacts];
        var counter = 0;
        console.log(
          "fSetMassegeArriveCounter || before counter cond. : ",
          newData[indexToUpdate].unSeenMassegeCounter
        );
        if (parseInt(newData[indexToUpdate].unSeenMassegeCounter) > 0) {
          counter = parseInt(newData[indexToUpdate].unSeenMassegeCounter);
        }
        counter++;
        newData[indexToUpdate] = {
          ...newData[indexToUpdate],
          unSeenMassegeCounter: counter,
        };

        if (indexToUpdate !== -1) {
          const objectToMove = newData.splice(indexToUpdate, 1)[0];
          objectToMove.lastMassege = getTruncatedMasssege(massegeObj.massege);
          newData.unshift(objectToMove);
        }
        console.log("fSetMassegeArriveCounter || newData: ", newData);
        dispatch(actionCreators.SetMyContacts(newData));
        localStorage.setItem("MyContacts_basicInfo", JSON.stringify(newData));

        return newData;
      } else {
        console.log("fSetMassegeArriveCounter index : -1");
        return prevLocalContacts;
      }
    });
  }
  function fSetMassegeArrayInit() {
    console.log("fSetMassegeArrayInit || start");
    if (contactId == null) {
      return;
    }
    var massegePointer =
      "masseges_" + authService.getCurrentUserId() + contactId;
    var sortedMA = [];
    const ma = JSON.parse(localStorage.getItem(massegePointer));
    // console.log("fSetMassegeArrayInit || ma ia : ", currentContact);
    // console.log("fSetMassegeArrayInit || ma ia : ", ma);
    if (ma == null) {
      setMassegeArrayWhole([]);
      setMassegeArray([]);
    } else {
      sortedMA = ma.slice().sort((a, b) => a.time - b.time);
      // const last200Messages = ma.slice(-100 * massegeArrayPage);
      // console.log("fSetMassegeArrayInit || ma length : ", sortedMA.length);
      setMassegeArrayWhole(sortedMA);
      setMassegeArray(sortedMA);
    }
    setMassegeArrayScrollToBottom((prev) => prev + 1);

    const filteredMasseges = sortedMA.filter(
      (massege) => massege.massegeStatus < 3 && massege.from === contactId
    );
    const updatedFilterMasseges = filteredMasseges.map((e) => {
      e.massegeStatus = 3;
      return e;
    });
    console.log("filtermassege : ", updatedFilterMasseges);
    if (filteredMasseges.length > 0) {
      mySocket.emit(
        "massege_reach_read_receipt",
        4,
        authService.getCurrentUserId(),
        updatedFilterMasseges,
        contactId
      ); // emit the massegeStatus 3 event
    }
  }

  useEffect(() => {
    fUpdateContactList();
    fSetContactList();
  }, []);

  function fUpdateContactList() {
    const contactListPromise = userService.getUserContactList();
    contactListPromise
      .then((data) => {
        var blockedContact = [];
        const imageUpdatedContacts = data.contacts.map((contact) => {
          console.log("image version : ", contact);
          const _id = contact._id;
          contact._id = _id._id;
          contact.ProfileImageVersion = _id.ProfileImageVersion;
          if (
            contact.ProfileImageVersion === undefined ||
            contact.ProfileImageVersion < 1
          ) {
            contact.imageUrl =
              "https://massengeruserprofileimage.s3.ap-south-1.amazonaws.com/general-contact-icon.jpg";
          } else {
            contact.imageUrl =
              "https://massengeruserprofileimage.s3.ap-south-1.amazonaws.com/" +
              contact._id +
              ".jpg";
          }
          return contact;
        });
        const updatedContacts = imageUpdatedContacts.filter((contact) => {
          console.log("contact blocked status : ", contact.blocked);
          if (contact.blocked) {
            blockedContact.push(contact);
          }
          return !contact.blocked;
        });

        var oldArray = JSON.parse(localStorage.getItem("MyContacts_basicInfo"));
        console.log(
          "Home userService.getUserContactList || status after get from local storage : ",
          oldArray
        );

        if (oldArray == null) {
          oldArray = [];
        }
        for (let i = 0; i < updatedContacts.length; i++) {
          const object = updatedContacts[i];
          if (!oldArray.some((item) => item._id == object._id)) {
            oldArray.push(object);
          }
        }

        console.log("Home getUserContactList || oldArray : ", oldArray);
        console.log(
          "Home getUserContactList || blockedContact : ",
          blockedContact
        );
        localStorage.setItem("MyContacts_basicInfo", JSON.stringify(oldArray));
        localStorage.setItem(
          "BlockedContacts_basicInfo",
          JSON.stringify(blockedContact)
        );
        dispatch(actionCreators.SetBlockedContacts(blockedContact));

        // actionCreators.SetBlockedContacts(blockedContact);
        fetchMassegesOfUser(oldArray);

        addMyContactsUpdateQueue(3);
        fSetContactList();
      })
      .catch((status) => {
        console.log(
          "Home userService.getUserContactList || error status : ",
          status
        );
      });

    toast.promise(
      contactListPromise,
      {
        loading: "updating contacts...",
        success: <b>contact is updated</b>,
        error: <b>problem while updating contact list</b>,
      },
      {
        success: {
          duration: 500,
        },
        error: {
          duration: 2000,
        },
      }
    );
  }

  function fSetContactList() {
    var localMyContacts = JSON.parse(
      localStorage.getItem("MyContacts_basicInfo")
    );
    if (localMyContacts != null) {
      console.log(
        "fSetContactList before setLocalContacts length : ",
        localMyContacts.length,
        " , ",
        localMyContacts
      );
      setLocalContacts(localMyContacts);
      dispatch(actionCreators.SetMyContacts(localMyContacts));
    } else {
      setLocalContacts([]);
      dispatch(actionCreators.SetMyContacts([]));
    }
  }

  function getTruncatedMasssege(lastMassege) {
    const truncatedMessage =
      lastMassege.length > 12 ? `${lastMassege.slice(0, 12)}...` : lastMassege;
    return truncatedMessage;
  }
  function getMessagesFromLocalStorage(contactId) {
    var messagesString =
      "masseges_" + authService.getCurrentUserId() + contactId;
    const array = messagesString
      ? JSON.parse(localStorage.getItem(messagesString))
      : [];
    return array;
  }
  function fUpdateLastMassegeOfContacts(myContacts) {
    var lastMassegeObj = {};
    var unSeenMassegsObj = {};
    var lastMassege = "";

    function getLastMessageTime(CID) {
      const messages = getMessagesFromLocalStorage(CID);
      // console.log("getLastMessageTime || masseges : ", messages, " , ", CID);
      const countMessagesWithStatusLessThan2 = messages.filter(
        (message) => message.massegeStatus <= 2 && message.from == CID
      ).length;
      if (messages.length > 0) {
        lastMassege = messages[messages.length - 1].massege;
        lastMassege = getTruncatedMasssege(lastMassege);
        return [
          messages[messages.length - 1].time,
          countMessagesWithStatusLessThan2,
        ];
      }
      lastMassege = "";
      return [0, countMessagesWithStatusLessThan2];
    }

    console.log("fUpdateLastMassegeOfContacts || myContacts : ", myContacts);
    var sortedContacts = myContacts.sort((a, b) => {
      const [lastMessageTimeA, unSeenMassegeOfA] = getLastMessageTime(a._id);
      const [lastMessageTimeB, unSeenMassegeOfB] = getLastMessageTime(b._id);
      lastMassegeObj[a._id] = lastMassege;
      lastMassegeObj[b._id] = lastMassege;

      unSeenMassegsObj[a._id] = unSeenMassegeOfA;
      unSeenMassegsObj[b._id] = unSeenMassegeOfB;

      return lastMessageTimeB - lastMessageTimeA;
    });

    console.log(
      "fUpdateLastMassegeOfContacts || sortedContacts : ",
      sortedContacts
    );
    console.log(
      "fUpdateLastMassegeOfContacts || lastMassegeObj : ",
      lastMassegeObj
    );

    const updatedArray = sortedContacts.map((obj) => {
      var counter = 0;
      if (unSeenMassegsObj.hasOwnProperty(obj._id)) {
        counter = unSeenMassegsObj[obj._id];
      }
      return {
        ...obj,
        lastMassege: lastMassegeObj[obj._id],
        unSeenMassegeCounter: counter,
      };
    });
    console.log(
      "fUpdateLastMassegeOfContacts || sortedContacts : ",
      updatedArray
    );

    setLocalContacts(updatedArray);
    dispatch(actionCreators.SetMyContacts(updatedArray));
    localStorage.setItem("MyContacts_basicInfo", JSON.stringify(updatedArray));
  }

  function fetchMassegesOfUser(contacts) {
    const massegeFetchPromise = userService.getUsersMassseges(contacts);
    massegeFetchPromise
      .then((data) => {
        console.log(data);
        for (const id in data) {
          if (data.hasOwnProperty(id)) {
            const localMassegeArray = data[id];
            const massegePointer =
              "masseges_" + authService.getCurrentUserId() + id;
            localStorage.setItem(
              massegePointer,
              JSON.stringify(localMassegeArray)
            );
          }
        }
        if (contactId) {
          if (data.hasOwnProperty(contactId)) {
            const localMassegeArray = data[contactId];
            setMassegeArray(localMassegeArray);
          }
        }
        // fUpdateLastMassegeOfContacts(contacts);
        addMyContactsUpdateQueue(5, contacts);
      })
      .catch((reject) => {
        console.log("fetchMassegesOfUser reject : ", reject);
      });

    toast.promise(
      massegeFetchPromise,
      {
        loading: "updating massege...",
        success: <b>contact is updated</b>,
        error: <b>problem while updating contact list</b>,
      },
      {
        success: {
          duration: 20,
        },
        error: {
          duration: 2000,
        },
      }
    );
  }

  // listenr's function for sockerts
  function new_massege_from_server(args, socket) {
    // playNotificationSound();
    var massegeObj = args[1];
    console.log(
      "socket event new_massege_from_server || :",
      massegeObj,
      " , contactId ",
      contactIdRef.current
    );

    const dataArray = [];
    massegeObj.massegeStatus = 2;

    /// display into ui
    if (contactIdRef.current == massegeObj.from) {
      massegeObj.massegeStatus = 3; // set update status to 3
      console.log("inseide contactId open and massege arrive ");
      setMassegeArray((prevMessages) => [...prevMessages, massegeObj]);
      setMassegeArrayScrollToBottom((prev) => prev + 1);
      addMyContactsUpdateQueue(1, massegeObj, 1); //tyoe=1
    } else {
      addMyContactsUpdateQueue(2, massegeObj); //tyoe=2
    }

    //update contact list lastmassege and rank

    dataArray.push(massegeObj);
    socket.emit(
      "massege_reach_read_receipt",
      3,
      authService.getCurrentUserId(),
      dataArray
    );

    //stro massege to localStorage
    const massegePointer =
      "masseges_" + AuthService.getCurrentUserId() + massegeObj.from;
    var localMasseege = JSON.parse(localStorage.getItem(massegePointer));
    if (localMasseege != undefined || localMasseege != null) {
      if (!localMasseege.some((message) => message.time === massegeObj.time)) {
        // console.log("before push and store i localstoreage");
        localMasseege.push(massegeObj);
        localStorage.setItem(massegePointer, JSON.stringify(localMasseege));
      }
    } else {
      // console.log("problem in localMassege");
      var tmp = [];
      tmp.push(massegeObj);
      localStorage.setItem(massegePointer, JSON.stringify(tmp));
    }
  }

  function massege_reach_read_receipt(args, socket) {
    var requestCode = args[0];
    console.log("massege_reach_read_receipt || start ");
    if (requestCode == 1) {
      var data = args[1];
      try {
        var viewStatus = data["massegeStatus"];
        var massege_sent_time = data["time"];
        var sender_id = data["from"];
        var receiver_id = data["to"];
        console.log(
          "massege_reach_read_receipt",
          "sender : ",
          receiver_id,
          " , cc : ",
          contactIdRef.current,
          " status : ",
          data
        );

        // update view status into database
        try {
          const massegePointer =
            "masseges_" + AuthService.getCurrentUserId() + receiver_id;
          var localMasseege = localStorage.getItem(massegePointer);
          // console.log("massege_reach_read_receipt", "localMassege : ", localMasseege);
          localMasseege = JSON.parse(localMasseege);
          // console.log("massege_reach_read_receipt", "after localMassege : ", localMasseege);
          localMasseege = localMasseege.map((message) => {
            if (message.time === massege_sent_time) {
              if (message.massegeStatus < viewStatus) {
                return { ...message, massegeStatus: viewStatus };
              }
            }
            return message;
          });

          localStorage.setItem(massegePointer, JSON.stringify(localMasseege));
          if (contactIdRef.current == receiver_id) {
            console.log("massege_reach_read_receipt || page is opened ");
            setMassegeArray(localMasseege);
          } else {
            // console.log("massege_reach_read_receipt || page is not opened , currenr contacct : ", contactIdRef.current, " , ", receiver_id);
          }
        } catch (e) {
          console.log("error in massege_reach_read_receipt || e : ", e);
        }

        var xArray = [];
        try {
          xArray.push(data);
          socket.emit(
            "massege_reach_read_receipt_acknowledgement",
            1,
            authService.getCurrentUserId(),
            xArray
          );
          // console.log("massege_reach_read_receipt", "massege_reach_read_receipt_acknowledgement event emitted")
        } catch (e) {
          console.log("massege_reach_read_receipt", "Exception || e : ", e);
        }
      } catch (e) {
        console.log("massege_reach_read_receipt", "Exception || e:", e);
      }
    } else {
      console.log(
        "massege_reach_read_receipt",
        "onMassegeReachReadReceipt || request code :$requestCode"
      );
    }
  }

  function massege_reach_read_receipt_acknowledgement(args, socket) {
    const code = args[0];
    const user_id = args[1];
    const fa = args[2];
    const contact_id = args[3];
    console.log(
      "massege_reach_read_receipt_acknowledgement , ",
      contact_id,
      " , l ",
      fa
    );
    if (contact_id != null) {
      var massegePointer =
        "masseges_" + authService.getCurrentUserId() + contact_id;
      try {
        const ma = JSON.parse(localStorage.getItem(massegePointer));
        // console.log("current contact is : ", currentContact);
        // console.log("ma length is : ", ma.length);
        // console.log("fa length is : ", fa.length);

        // Update the original ma array with the updatedMessages
        const updatedMa = ma.map((message) => {
          const updatedMessage = fa.find(
            (updatedMsg) => updatedMsg.time === message.time
          );
          // if (updatedMessage) {
          //   console.log("enter in side updated ", updatedMessage);
          // }
          return updatedMessage ? updatedMessage : message;
        });

        if (contact_id == contactIdRef.current) {
          setMassegeArray(updatedMa);
        }
        localStorage.setItem(massegePointer, JSON.stringify(updatedMa));
      } catch (e) {
        setMassegeArray([]);
        console.log("error is chatsRecyclerView || e : ", e);
        localStorage.removeItem(massegePointer);
      }
    }
  }

  function CheckContactOnlineStatusReturn(args) {
    // console.log("Hone || on CheckContactOnlineStatus_return args : ", args);
    if (args !== null) {
      try {
        const user_id = args[0];
        const contact_id = args[1];
        const type = args[4];
        const onlineStatusPolicy = args[2];
        const online_status = args[3];
        if (type === 1) {
          setCurrentContactOnlineStatus("online");
        } else if (type === 0) {
          if (onlineStatusPolicy === 0) {
            setCurrentContactOnlineStatus("");
          } else if (onlineStatusPolicy === 1) {
            const date = new Date(online_status);
            const current_date = new Date();
            if (
              current_date.getFullYear() === date.getFullYear() &&
              current_date.getMonth() === date.getMonth() &&
              current_date.getDate() === date.getDate()
            ) {
              const formatted = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              setCurrentContactOnlineStatus(`last seen at ${formatted}`);
            } else if (
              current_date.getFullYear() === date.getFullYear() &&
              current_date.getMonth() === date.getMonth() &&
              current_date.getDate() === date.getDate() + 1
            ) {
              const formatted = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              setCurrentContactOnlineStatus(
                `last seen yesterday at ${formatted}`
              );
            } else {
              const formatted = date
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
              const cur_formatted = current_date
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
              setCurrentContactOnlineStatus(`last seen at ${formatted}`);
            }
          }
        } else {
          console.log("enter in other cond.");
        }
      } catch (e) {
        console.log("Exception:", e.toString());
      }
    } else {
      console.log("onlineStatusArgs is null");
    }
  }

  function contact_massege_typing_event(args) {
    console.log("contact_massege_typing_event || start args : ", args);

    addMyContactsUpdateQueue(6, args[0]);
  }

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_SERVER, {
      withCredentials: true,
      extraHeaders: {
        token: "abcd",
      },
      auth: {
        id: AuthService.getCurrentUserId(),
      },
    });

    socket.on("connect", () => {
      setMySocket(socket);
      console.log("SocketServiceInit Connected to server!");
      console.log(
        "SocketServiceInit Connected storedEmitEvents  :",
        storedEmitEvents.length
      );
      storedEmitEvents.forEach((eventObj) => {
        const { event, value } = eventObj;
        console.log("Onconnect || event : ", event, " args : ", value);
        socket.emit(event, value.id, value.data);
      });
    });

    socket.on("logoutEvent", (status) => {
      console.log("logout event accure");
      socket.disconnect();
      AuthService.logout();
      setCurrentUser(userDetailsTemplate);
      toast.error("you are logout due to android session is started", {
        duration: 5000,
      });
      window.location.reload();
    });

    socket.on("new_massege_from_server", (...args) => {
      new_massege_from_server(args, socket);
    });

    socket.on("massege_reach_read_receipt", (...args) => {
      massege_reach_read_receipt(args, socket);
    });

    socket.on("massege_reach_read_receipt_acknowledgement", (...args) => {
      massege_reach_read_receipt_acknowledgement(args, socket);
    });

    socket.on("CheckContactOnlineStatus_return", (...args) => {
      CheckContactOnlineStatusReturn(args);
    });
    socket.on("contact_massege_typing_event", (...args) => {
      contact_massege_typing_event(args);
    });

    setMySocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  const onBlockContentClick = () => {};
  return (
    <div className="homeDiv">
      <HomeContext.Provider
        value={{
          addMyContactsUpdateQueue,
          massegeArrayScrollToBottom,
          setMassegeArrayScrollToBottom,
          fUpdateContactRankAndLastMassege,
          fSetMassegeArrayInit,
          massegeArrayPage,
          setMassegeArrayPage,
          fSetMassegeArray,
        }}
      >
        <ContactList />
        <MainDisplayArea />
      </HomeContext.Provider>
    </div>
  );
}

export default Home;
