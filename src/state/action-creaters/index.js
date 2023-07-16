export const SetContactId = (ContactId)  => {
  console.log("in setContactId action-creaters");
  return (dispatch) => {
    dispatch({
      type: 'SetContactId',
      payload : ContactId 
    })
  }
};
export const SetCurrentUser = (CurrentUser) => {
  console.log("in SetCurrentUser action-creaters");
  return (dispatch) => {
    dispatch({
      type: "SetCurrentUser",
      payload: CurrentUser,
    });
  };
};
export const SetCurrentContact = (CurrentContact) => {
  console.log("in SetCurrentUser action-creaters");
  return (dispatch) => {
    dispatch({
      type: "SetCurrentContact",
      payload: CurrentContact,
    });
  };
};
export const SetMyContacts = (MyContacts) => {
  console.log("in SetMyContacts action-creaters");
  return (dispatch) => {
    dispatch({
      type: "SetMyContacts",
      payload: MyContacts,
    });
  };
};

export const SetMySocketInstance = (Socket) => {
  console.log("in SetMySocketInstance action-creaters");
  return (dispatch) => {
    dispatch({
      type: "SetMySocketInstance",
      payload: Socket,
    });
  };
};
export const SetStoredEmitEvents = (Socket) => {
  console.log("in SetStoredEmitEvents action-creaters");
  return (dispatch) => {
    dispatch({
      type: "SetStoredEmitEvents",
      payload: Socket,
    });
  };
};


