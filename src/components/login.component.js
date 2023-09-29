import React, { useEffect, useState, useContext } from "react";
import AuthService from "../services/auth.service";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { userDetailsTemplate } from "../templates/Templates";
import { actionCreators } from "../state/index1";


import toast from "react-hot-toast";

import UserContext from "../context/createContext";

function Login() {

  const { isSidebarOpen, setIsSidebarOpen, admin, currentUser, setCurrentUser, mySocket, setMySocket, myContacts, setMyContacts } = useContext(UserContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [massege, setMassege] = useState("");
  const [registerButton, setRegisterButton] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

 

  function handleLogin(credential) {
    setMassege("");
    setLoading(true);

    if (credential) {
      if (credential.email_verified) {
        setMassege(
          "Your Email address is not verified by google please verify first to open account"
        );
        setLoading(false);
        return;
      }
    } else {
      credential = {
        number: number,
        password: password,
        web: true,
      };
    }

    const loginPromise = AuthService.loginService(credential);
    loginPromise.then((data) => {
      if (data.status == 1) {
        document.cookie = `token=${JSON.stringify(data.token)}`;
        setCurrentUser(data.userDetails);
        navigate("/home");
      }
    })
      .catch((error) => {
        var resMessage;
        if (error.status == 0) {
          resMessage = "security error";
          // resMessage = "this email is not register with massege, kindly signup first";
          setRegisterButton(true);
        } else if (error.status == 2) {
          resMessage = "wrong password";
        } else if (error.status == 5) {
          resMessage = "request failed code : 5";
        } else {
          resMessage = "unhandled status arrive";
        }
        setLoading(false);
        setMassege(resMessage);
      });

    toast.promise(
      loginPromise,
      {
        loading: 'plese wait while login',
        success: <b>login succesfull</b>,
        error: <b>login failed</b>,
      },
      {
        success: {
          duration: 2000,
        },
        error: {
          duration: 2000,
        },
      }
    );

  }

  useEffect(() => {
    if (currentUser !== userDetailsTemplate) {
      navigate("/home");
      console.log("login.js currentUser : ", currentUser);
    }
  }, []);


  return (
    <>
      <div className="container ">
        <div className="container MyLoginStyle">
          <div className="FormTag   ml-auto mr-auto">
            <div className="login-card card-container p-5">
              <div className="form-group text-lg-center text-success">
                Login Into Massenger
              </div>
              <div className="form-group">
                <label htmlFor="number">Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="number"
                  value={number}
                  onChange={(e) => {
                    setNumber(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  disabled={loading}
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  Login
                </button>
              </div>

              {massege && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {massege}
                  </div>
                </div>
              )}
              {/* <div className="form-group text-center" htmlFor="loginWithGoogle">
                Or
              </div>
              <div
                className="form-group text-center mr-auto ml-auto"
                name="loginWithGoogle"
              >
                <GoogleLogin
                  onSuccess={responseMessage}
                  onError={errorMessage}
                  responseType="code"
                  scope="openid profile email"
                  buttonText="Sign in with Google"
                  cookiePolicy={"single_host_origin"}
                  uxMode={"popup"}
                />
              </div> */}
              {/* <div className="form-group text-center  mt-5">
                if you not register? <Link to="/signup">Sing Up</Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
