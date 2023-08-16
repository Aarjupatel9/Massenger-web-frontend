import { currentContactTemplate } from "../../templates/Templates";

import { userDetailsTemplate } from "../../templates/Templates";

export const setContactIdReducer = (state = -1, action) => {
  if (action.type == "SetContactId") {
    // return { ...state, contactId: action.payload };
    console.log("SetContectId reducer call inside if ");
    return action.payload;
  } else {
    return state;
  }
};

export const setCurrentContactReducer = (
  state = currentContactTemplate,
  action
) => {
  if (action.type == "SetCurrentContact") {
    console.log("setCurrentContactReducer enter if condition");
    return action.payload;
  } else {
    return state;
  }
};

export const setMyContactsReducer = (
  state = [],
  action
) => {
   console.log("setMyContactsReducer reducer call action : ", action.type);
  if (action.type == "SetMyContacts") {
    console.log("setMyContactsReducer reducer call inside if ");
    return action.payload;
  } else {
    return state;
  }
};
export const setMySocketInstanceReducer = (state = -1, action) => {
  if (action.type == "SetMySocketInstance") {
    console.log("setMySocketInstanceReducer reducer call inside if ");
    return action.payload;
  } else {
    return state;
  }
};
export const setStoredEmitEventsReducer = (state = [], action) => {
  if (action.type == "SetStoredEmitEvents") {
    console.log("setStoredEmitEventsReducer reducer call inside if ");
    return action.payload;
  } else {
    return state;
  }
};
