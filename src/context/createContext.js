// import { useState, createContext } from "react";
// import ReactDOM from "react-dom/client";

// const UserContext = createContext();

import React from "react";

// this is the equivalent to the createStore method of Redux

const UserContext = React.createContext({});

export const UserProvider = UserContext.Provider;

export const UserConsumer = UserContext.Consumer;


export default UserContext;