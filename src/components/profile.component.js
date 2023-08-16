import React, { useContext, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import userService from "../services/user.service";

import UserContext from "../context/createContext";
import { userDetailsTemplate } from "../templates/Templates";
import { useEffect } from "react";
import authService from "../services/auth.service";
import "./profile.css";

export default function Profile() {

  const { isSidebarOpen, setIsSidebarOpen, currentContact, setCurrentContact, admin, currentUser, setCurrentUser, mySocket, setMySocket, myContacts, setMyContacts, storedEmitEvents, setStoredEmitEvents, contactId, setContactId, massegeArray, setMassegeArray } = useContext(UserContext);

  const [about, setAbout] = useState("");
  const [displayName, setDisplayName] = useState("");
  useEffect(() => {
    // console.log("image : ", currentUser.picture);
    setAbout(currentUser.about);
    setDisplayName(currentUser.displayName);

  }, []);


  function saveUserDetails() {
    console.log("saveUserDetails : ", currentUser, ", name : ", displayName, " , about : ", about);
    if (mySocket == null) {
      console.log("mySocket is null");
      return;
    }
    var pass = false;
    if (about != currentUser.about) {
      pass = true;
      userService.updateUserAboutInfo(about).then((status) => {
        const oldUser = currentUser;
        oldUser.about = about;
        localStorage.setItem("user", JSON.stringify(oldUser));
        setCurrentUser(oldUser);
        alert("About info is updated")
      }).catch((error) => {
        alert("About info is not updated")
        console.log("userService.updateUserAboutInfo || error : ", error);
      })
    }

    if (displayName != currentUser.displayName) {
      pass = true;
      userService.updateUserDisplayName(displayName).then((status) => {
        const oldUser = currentUser;
        oldUser.displayName = displayName;
        localStorage.setItem("user", JSON.stringify(oldUser));
        setCurrentUser(oldUser);
        alert("display name is updated")
      }).catch((error) => {
        alert("display name is not updated")
        console.log("userService.updateUserAboutInfo || error : ", error);
      })
    }
    if (isImageDataUpdate) {
      pass = true;
      const base64Data = imageData.split(',')[1]; // Get the base64-encoded data
      const byteArray = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)); // Convert to byte array
      // console.log("isImageDataUpdate || base64 : ", base64Data);
      console.log("isImageDataUpdate || buteArray : ", byteArray.length);

      userService.updateUserProfileImage(byteArray).then((status) => {
        alert("Profile image is updated")
      }).catch((error) => {
        alert("Profile image is not updated")
        console.log("userService.updateUserProfileImage || error : ", error);
      })
    }
    if (!pass) {
      alert("about and displayname and Profile image is already updated");
    }
  }


  const [imageData, setImageData] = useState(currentUser.picture);
  const [isImageDataUpdate, setIsImageDataUpdate] = useState(false);

  const [showOptions, setShowOptions] = useState(false); // State to show/hide options
  const TARGET_RESOLUTION = 1024;
  const JPEG_QUALITY = 90;
  const handleDrop = async (event) => {
    console.log("handleDrop || start : ", event.target.files.length);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const image = new Image();
      const reader = new FileReader();
      const originalBlob = new Blob([file]);

      reader.onload = () => {
        image.src = reader.result;
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let scaleFactor = 1;
          if (image.width > TARGET_RESOLUTION || image.height > TARGET_RESOLUTION) {
            scaleFactor = Math.pow(2, Math.ceil(Math.log(Math.max(image.width, image.height) / TARGET_RESOLUTION) / Math.log(0.5)));
          }

          canvas.width = image.width / scaleFactor;
          canvas.height = image.height / scaleFactor;

          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

          const compressedImageData = canvas.toDataURL('image/jpeg', JPEG_QUALITY / 100);
          setImageData(compressedImageData);
          setIsImageDataUpdate(true);


          const compressedBlob = new Blob([compressedImageData]);

          // Log original and compressed image sizes
          console.log('Original Image Size:', originalBlob.size, 'bytes');
          console.log('Compressed Image Size:', compressedBlob.size, 'bytes');

        };
      };
      if (originalBlob.size > 10000000) {
        alert("max 10MB is allowed");
        return;
      }
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    console.log("removwImage  : || ", process.env.REACT_APP_DEFAULT_PROFILE_IMAGE);
    setImageData(process.env.REACT_APP_DEFAULT_PROFILE_IMAGE);
    setShowOptions(false);
  };
  return (
    <div className="">
      {currentUser != userDetailsTemplate ? (
        <div className="container rounded bg-white mt-5 mb-5">
          <div className="row">

            <div className="col-md-3 border-right">
              {/* <div
                className="d-flex flex-column align-items-center text-center p-3 py-5"
                onMouseEnter={() => setShowOptions(true)}
                onMouseLeave={() => setShowOptions(false)}
              >
                <img
                  alt="profile image"
                  className="rounded-circle mt-5"
                  width="150px"
                  src={imageData}
                  onError={(e) => {
                    e.target.src = process.env.REACT_APP_DEFAULT_PROFILE_IMAGE;
                  }}
                />
                {showOptions && (
                  <div className="image-options">
                    <label htmlFor="file-input" className="change-image">
                      Change Image
                    </label>
                    <span className="remove-image" onClick={removeImage}>
                      Remove Image
                    </span>
                  </div>
                )}
                <span className="font-weight-bold mt-3">
                  Account name : {currentUser.username}
                </span>
                <span className="text-black-50">
                  Account number : {currentUser.number}
                </span>
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleDrop}
                />
              </div> */}

              <div
  className="d-flex flex-column align-items-center text-center p-3 py-5"
  onMouseEnter={() => setShowOptions(true)}
  onMouseLeave={() => setShowOptions(false)}
>
  <div className="profile-image-container">
    <img
      alt="profile image"
      className="rounded-circle mt-5 profile-image"
      width="200px"
      src={imageData}
      onError={(e) => {
        e.target.src = process.env.REACT_APP_DEFAULT_PROFILE_IMAGE;
      }}
    />
    {showOptions && (
      <div className="image-options">
        <label htmlFor="file-input" className="change-image">
          Change Image
        </label>
        <div className="remove-image" onClick={removeImage}>
          Remove Image
        </div>
      </div>
    )}
  </div>
  <span className="font-weight-bold mt-3">
    Account name: {currentUser.username}
  </span>
  <span className="text-black-50">
    Account number: {currentUser.number}
  </span>
  <input
    type="file"
    id="file-input"
    accept="image/*"
    style={{ display: 'none' }}
    onChange={handleDrop}
  />
</div>


            </div>
            <div className="col-md-5 ">
              <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="text-right">Profile Information</h4>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <label className="labels">Display Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={displayName}
                      onChange={(e) => {
                        setDisplayName(e.target.value);
                      }}
                    />
                  </div>
                </div>


                <div className="row mt-2">
                  <div className="col-md-12">
                    <label className="labels">About</label>
                    <input
                      type="text"
                      className="form-control"
                      value={about}
                      onChange={(e) => {
                        setAbout(e.target.value);
                      }}
                    />
                  </div>
                </div>

                {currentUser.recoveryEmail ? <div className="row mt-3">
                  <div className="col-md-12">
                    <label className="labels">Recovery Email</label>
                    <input
                      type="text"
                      className="form-control"
                      value={currentUser.recoveryEmail}
                      readOnly
                    />
                  </div>
                </div> : <div className="row mt-3">
                  <div className="col-md-12">
                    <label className="labels font-weight-bold">Recovery Email is not added, please add throw android device</label>
                  </div>
                </div>}

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
