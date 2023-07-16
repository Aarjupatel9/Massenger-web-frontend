import { combineReducers } from "redux";

import {
  setContactIdReducer,
  setCurrentContactReducer,
  setMyContactsReducer,
  setCurrentUserReducer,
  setMySocketInstanceReducer,
  setStoredEmitEventsReducer,
} from "./reducers";

const reducers = combineReducers({
  ContactId: setContactIdReducer,
  CurrentUser: setCurrentUserReducer,
  CurrentContact: setCurrentContactReducer,
  MyContacts: setMyContactsReducer,
  MySocket: setMySocketInstanceReducer,
  StoredEmitEvents  :setStoredEmitEventsReducer,
});
export default reducers;
