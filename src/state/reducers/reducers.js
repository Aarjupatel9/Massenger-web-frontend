import { currentContactTemplate } from "../../templates/Templates";
import { userDetailsTemplate } from "../../templates/Templates";

export const setContactIdReducer = (state = -1, action) => {
  // console.log("setContactIdReducer reducer call action : ", action.type);
  if (action.type == "SetContactId") {
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
  // console.log("setCurrentContactReducer reducer call action : ", action.type);
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
  //  console.log("setMyContactsReducer reducer call action : ", action.type);
  if (action.type == "SetMyContacts") {
    console.log("setMyContactsReducer reducer call inside if ");
    return action.payload;
  } else {
    return state;
  }
};
export const setBlockedContactsReducer = (
  state = [],
  action
) => {
  // console.log("setBlockedContactsReducer reducer call action : ", action.type);
  if (action.type === "SetBlockedContacts") { // Check for the correct action type
    console.log("setBlockedContactsReducer reducer call inside if ");
    return action.payload; // Update the state with BlockedContacts data
  } else {
    return state; // Return the current state unchanged for other actions
  }
};

export const setMySocketInstanceReducer = (state = -1, action) => {
  // console.log("setMySocketInstanceReducer reducer call action : ", action.type);
  if (action.type == "SetMySocketInstance") {
    console.log("setMySocketInstanceReducer reducer call inside if ");
    return action.payload;
  } else {
    return state;
  }
};
export const setStoredEmitEventsReducer = (state = [], action) => {
  // console.log("setStoredEmitEventsReducer reducer call action : ", action.type);
  if (action.type == "SetStoredEmitEvents") {
    console.log("setStoredEmitEventsReducer reducer call inside if ");
    return action.payload;
  } else {
    return state;
  }
};
