import React, { useState } from "react";
import { useSelector } from "react-redux";
export default function Chats() {
  const [typedMassege, setTypedMassege] = useState("");

  const MySocket = useSelector((state) => state.MySocket);
  const CurrentUser = useSelector((state) => state.CurrentUser);
  const CurrentContact = useSelector((state) => state.CurrentContact);

  const ContactMasseges = [
    {
      _id: 1,
      massege: "first massege",
      time: Date.now(),
    },
    {
      _id: 2,
      massege: "second massege",
      time: Date.now(),
    },
  ];

  function onTypedMassegeChangedEvent(e) {
    setTypedMassege(e.target.value);
  }

  function SendMassege(e) {
    console.log("sending massege : ", typedMassege);

    var massegeObj = {
      from: CurrentUser._id,
      to: CurrentContact._id,
      massege: typedMassege.trim(),
      massegeType: 1,
      time: Date.now(),
      fs: 1,
      ts: 0,
    }

    MySocket.emit("massege", CurrentUser._id, massegeObj);

    setTypedMassege("");

  }

  return (
    <>
      {ContactMasseges != [] ? (
        ContactMasseges.map((massege, index) => {
          return (
            <div key={index} id={massege._id} className="border-right">
              <div className="card p-0 m-2 mr-5">
                <div className="card-body p-2">
                  <p className="card-text">{massege.massege}</p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div>
          <h1>Let start some chat...</h1>
        </div>
      )}

      <div className="typedMassege mb-2">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="write massege"
            value={typedMassege}
            onChange={onTypedMassegeChangedEvent}
          />
          <span>
            <button
              className="input-group-addon  btn btn-primary"
              id="basic-addon2"
              onClick={() => {
                SendMassege();
              }}
            >
              send
            </button>
          </span>
        </div>
      </div>
    </>
  );
}
