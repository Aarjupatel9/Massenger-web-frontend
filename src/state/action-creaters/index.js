export const SetContactId = (ContactId) => {
  // console.log("in setContactId action-creaters");
  return (dispatch) => {
    dispatch({
      type: 'SetContactId',
      payload: ContactId
    })
  }
};
export const SetCurrentUser = (CurrentUser) => {
  // console.log("in SetCurrentUser action-creaters");
  return (dispatch) => {
    dispatch({
      type: "SetCurrentUser",
      payload: CurrentUser,
    });
  };
};
export const SetCurrentContact = (CurrentContact) => {
  // console.log("in SetCurrentUser action-creaters");
  return (dispatch) => {
    dispatch({
      type: "SetCurrentContact",
      payload: CurrentContact,
    });
  };
};
export const SetMyContacts = (MyContacts) => {
  // console.log("SetMyContacts action-creator called : ", MyContacts);
  return (dispatch) => {
    dispatch({
      type: "SetMyContacts",
      payload: MyContacts,
    });
  };
};
export const SetBlockedContacts = (BlockedContacts) => {
  // console.log("SetBlockedContacts action-creator called : ", BlockedContacts);
  return (dispatch) => {
    dispatch({
      type: "SetBlockedContacts",
      payload: BlockedContacts,
    });
  };
};


export const SetMySocketInstance = (Socket) => {
  return (dispatch) => {
    dispatch({
      type: "SetMySocketInstance",
      payload: Socket,
    });
  };
};
export const SetStoredEmitEvents = (Socket) => {
  return (dispatch) => {
    dispatch({
      type: "SetStoredEmitEvents",
      payload: Socket,
    });
  };
};


