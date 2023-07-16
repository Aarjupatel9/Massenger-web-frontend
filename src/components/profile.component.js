import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import userService from "../services/user.service";

export default function Profile() {
  const dispach = useDispatch();
  const CurrentUser = useSelector((state) => state.CurrentUser);

  const [massege, setMassege] = useState(null);
  const [updateFlag, setUpdateFlag] = useState(null);
  const [userReady, setUserReady] = useState(true);

  function displayNameChangeHandler(e) {}
  function aboutChangeHandler(e) { }
  function saveUserDetails() { }
  return (
    <div className="">
      {userReady ? (
        <div className="container rounded bg-white mt-5 mb-5">
          <div className="row">
            <div className="col-md-3 border-right">
              <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                <img
                  alt="profile image"
                  className="rounded-circle mt-5"
                  width="150px"
                  src={CurrentUser.picture}
                />
                <span className="font-weight-bold">{CurrentUser.username}</span>
                <span className="text-black-50">{CurrentUser.email}</span>
              </div>
            </div>
            <div className="col-md-5 ">
              <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="text-right">Profile Settings</h4>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <label className="labels">Display Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={CurrentUser.username}
                      onChange={() => {
                        displayNameChangeHandler();
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-12">
                    <label className="labels">Email ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={CurrentUser.email}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-12">
                    <label className="labels">About</label>
                    <input
                      type="text"
                      className="form-control"
                      value={CurrentUser.about}
                      onChange={() => {
                        aboutChangeHandler();
                      }}
                    />
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <button
                    className="btn btn-primary profile-button"
                    type="button"
                    onClick={() => {
                      saveUserDetails();
                    }}
                  >
                    Save Profile
                  </button>
                </div>
                {massege && (
                  <div className="form-group">
                    <div
                      className={`alert  ${
                        updateFlag ? "alert-success" : "alert-danger"
                      } `}
                      role="alert"
                    >
                      {massege}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h3>please login firt</h3>
      )}
    </div>
  );
}
