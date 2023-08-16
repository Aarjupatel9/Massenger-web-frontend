import React, { useState, useContext, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import UserContext from "../../context/createContext";
import HomeContext from "../../context/HomeContext";
import { useEffect } from "react";
import authService from "../../services/auth.service";

export default function Chats() {


  const { isSidebarOpen, setIsSidebarOpen, admin, currentUser, setCurrentUser, mySocket, setMySocket, storedEmitEvents, setStoredEmitEvents, contactId, setContactId, massegeArray, setMassegeArray, currentContact, setCurrentContact, typedMassege, setTypedMassege } = useContext(UserContext);

  const { fSetMassegeArrayInit, massegeArrayPage, setMassegeArrayPage, fSetMassegeArray, massegeArrayScrollToBottom, setMassegeArrayScrollToBottom } = useContext(HomeContext);

  const [renderedMessages, setRenderedMessages] = useState([]);

  useEffect(() => {
    console.log("chatsRecycletView || useEfect cerrentContact : start");
    fSetMassegeArrayInit();
  }, [currentContact]);


  function scrollToLastMessage() {
    const lastMessageElement = document.getElementById(massegeArray.length - 1);
    if (lastMessageElement) {
      lastMessageElement.scrollIntoView({ behavior: 'auto' });
    }
  }

  useEffect(() => {
    scrollToLastMessage();
  }, [massegeArrayScrollToBottom]);

  function hasDateChanged(timestamp1, timestamp2) {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return (
      date1.getFullYear() !== date2.getFullYear() ||
      date1.getMonth() !== date2.getMonth() ||
      date1.getDate() !== date2.getDate()
    );
  }
  function formatDate(milliseconds) {
    const date = new Date(milliseconds);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const daySuffix = getDaySuffix(day);

    return `${day}${daySuffix} ${month}`;
  }

  function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    const lastDigit = day % 10;
    switch (lastDigit) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  function getForamateDateTime(milliseconds) {
    const date = new Date(milliseconds);
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${hour}:${minute}`;
  }

  var prevMassege = null;
  var reciept = null;
  var reach_reciept_icon = <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="m0.918,12.902 l5.59,5.59 1.41,-1.42 -5.58,-5.58m20.41,-6.42 l-10.58,10.59 -4.16,-4.17 -1.43,1.41 5.59,5.59 12,-12m-5.66,0 l-1.41,-1.42 -6.35,6.35 1.42,1.41z" fill="#353535" />
  </svg>;
  var read_reciept_icon = <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="m0.918,12.902 l5.59,5.59 1.41,-1.42 -5.58,-5.58m20.41,-6.42 l-10.58,10.59 -4.16,-4.17 -1.43,1.41 5.59,5.59 12,-12m-5.66,0 l-1.41,-1.42 -6.35,6.35 1.42,1.41z" fill="#3cbb51" />
  </svg>;
  var sent_reciept_icon = <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" fill="#353535" />
  </svg>


  const MESSAGES_PER_PAGE = 10;
  const getMessageList = () => {
    const startIndex = (massegeArrayPage - 1) * MESSAGES_PER_PAGE;
    const endIndex = startIndex + MESSAGES_PER_PAGE;

    return massegeArray
      .map((massege, index) => {
        let dateChangedLabel = null;
        if (prevMassege != null && hasDateChanged(massege.time, prevMassege.time)) {
          const formattedDate = formatDate(massege.time);
          const uniqueKey = `${formattedDate}_${index}`;
          dateChangedLabel = (
            <div className="date-changed-label-card p-0 m-2 mx-5" key={uniqueKey} id={formattedDate}>
              <div className="date-changed-label-card-card-body pb-0 px-3 pt-1 text-right">
                <div className="date-changed-label">
                  {formattedDate}
                </div></div></div>
          );
        }

        if (massege.massegeStatus == 0) {
          reciept = sent_reciept_icon;
        } else if (massege.massegeStatus == 1) {
          reciept = sent_reciept_icon;
        }
        else if (massege.massegeStatus == 2) {
          reciept = reach_reciept_icon;

        } else if (massege.massegeStatus == 3) {
          reciept = read_reciept_icon;
        } else {
          reciept = sent_reciept_icon;
        }

        // console.log("in massegeList making  , from : ", massege.from, " , ", currentUser._id)
        prevMassege = massege;
        if (massege.from != currentUser._id) {
          return (<>
            {dateChangedLabel}
            <div className="message-box" key={massege.time} id={index} >
              <div className="card p-0 m-2 mr-5">
                <div className="card-body pb-0 px-3 pt-1 text-right">
                  <p className="card-text">{massege.massege}</p>
                  <hr />
                  <div className="timestamp m-0 p-0 ">{getForamateDateTime(massege.time)}</div>
                </div>
              </div>
            </div>
          </>
          );

        } else {
          return (
            <>
              {dateChangedLabel != null ? dateChangedLabel : <></>}
              <div className="message-box-user" key={massege.time} id={index}>
                <div className="card p-0 m-2 mr-5">
                  <div className="card-body pb-0 px-3 pt-1 text-right">
                    <p className="card-text">{massege.massege}</p>
                    <hr />
                    <div className="timestamp m-0 p-0 ">{getForamateDateTime(massege.time)} {reciept}</div>
                  </div>
                </div>
              </div>
            </>
          );
        }

      })
  };


  const massegeList = useMemo(() => {
    const messagesToRender = getMessageList();
    setRenderedMessages(messagesToRender);
  }, [massegeArray, massegeArrayPage]);

  //for scrolling in recyclerView
  const chatsRecyclerViewRef = useRef(null);
  const handleScroll = () => {
    const container = chatsRecyclerViewRef.current;
    if (!container) return;
    // Check scroll position
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop === 0) {
      console.log("at top of recyclerView");
      setMassegeArrayPage((prevPage) => prevPage + 1);
    } else if (scrollTop + clientHeight === scrollHeight) {
      console.log("at bottom of recyclerView");
      if (massegeArrayPage == 1) {
        return;
      }
      setMassegeArrayPage((prevPage) => prevPage - 1);
    }
  };


  return (

    <div className="chatsRecyclerView myScroll" ref={chatsRecyclerViewRef} onScroll={handleScroll} >
      {renderedMessages.length > 0 ? renderedMessages : <div className="container text-center mt-5" > <h1>Start chat with {currentContact.Name}</h1></div>}
    </div>

  );
}
