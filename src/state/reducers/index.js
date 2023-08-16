import { combineReducers } from "redux";

import {
  setContactIdReducer,
  setCurrentContactReducer,
  setMyContactsReducer,
  setMySocketInstanceReducer,
  setStoredEmitEventsReducer,
} from "./reducers";

const reducers = combineReducers({
  ContactId: setContactIdReducer,
  CurrentContact: setCurrentContactReducer,
  MyContacts: setMyContactsReducer,
  MySocket: setMySocketInstanceReducer,
  StoredEmitEvents  :setStoredEmitEventsReducer,
});
export default reducers;
