import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
//google apis
import { GoogleOAuthProvider } from "@react-oauth/google";
import toast, { Toaster } from 'react-hot-toast';

//for redux strore
import { Provider } from "react-redux";
import store from "./state/store";

import App from "./App";
// import * as serviceWorker from "./serviceWorker";
import "./mainstyle.css";

const container = document.getElementById("root");

const root = createRoot(container);
root.render(
  <GoogleOAuthProvider clientId="754777254417-e177q2glmotv28lllmm7chn9p6krevpi.apps.googleusercontent.com">
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: '',
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },

            // Default options for specific types
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
      </Provider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);

// serviceWorker.unregister();
