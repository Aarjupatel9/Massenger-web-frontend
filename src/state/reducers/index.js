import { combineReducers } from "redux";

import {
  setContactIdReducer,
  setCurrentContactReducer,
  setMyContactsReducer,
  setMySocketInstanceReducer,
  setStoredEmitEventsReducer, setBlockedContactsReducer,
} from "./reducers";

const reducers = combineReducers({
  ContactId: setContactIdReducer,
  CurrentContact: setCurrentContactReducer,
  MyContacts: setMyContactsReducer,
  BlockedContacts: setBlockedContactsReducer,
  MySocket: setMySocketInstanceReducer,
  StoredEmitEvents  :setStoredEmitEventsReducer,
});
export default reducers;
