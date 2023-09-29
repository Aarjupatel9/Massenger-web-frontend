import AuthService from "./auth.service";

class UserService {
  getUsersMassseges(contacts) {
    const id = AuthService.getCurrentUserId()
    return new Promise(function (resolve, reject) {
      const options = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methos": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
        body: JSON.stringify({
          id: id,
          contacts: contacts
        }),
      };
      fetch(process.env.REACT_APP_API_SERVER + "/getContactsMasseges", options)
        .then((response) => {
          // console.log("getUsersMassseges || fetch then response :", response);
          return response.json();
        })
        .then((res) => {
          console.log("getUsersMassseges || response json parse : ", res);
          if (res.status == 1) {
            resolve(res.masseges);
          } else {
            reject(0);
          }
        })
        .catch((e) => {
          console.log("errer : ", e);
          reject(0);
        });
    });
  }
  getUserProfileImage(data) {
    const id = AuthService.getCurrentUserId()
    return new Promise(function (resolve, reject) {
      const options = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methos": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
        body: JSON.stringify({
          id: id,
          data:data
        }),
      };
      fetch(process.env.REACT_APP_API_SERVER + "/getUserProfileImage", options)
        .then((response) => {
          // console.log("getUserProfileImage || fetch then response :", response);
          return response.json();
        })
        .then((res) => {
          console.log("getUserProfileImage || response json parse : ", res);
          if (res.status == 1) {
            resolve(res);
          } else {
            reject(0);
          }
        })
        .catch((e) => {
          console.log("errer : ", e);
          reject(0);
        });
    });
  }
  getUserContactList() {
    const id = AuthService.getCurrentUserId()
    return new Promise(function (resolve, reject) {
      const options = {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methos": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
        body: JSON.stringify({
          id: id,
        }),
      };
      fetch(process.env.REACT_APP_API_SERVER + "/getContactsList", options)
        .then((response) => {
          // console.log("getContactsList || fetch then response :", response);
          return response.json();
        })
        .then((res) => {
          console.log("getContactsList || response json parse : ", res);
          if (res.status == 1) {
            resolve(res);
          } else {
            reject(0);
          }
        })
        .catch((e) => {
          console.log("errer : ", e);
          reject(0);
        });
    });
  }

  updateUserDisplayName(displayName) {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          id: AuthService.getCurrentUserId(),
          displayName: displayName,
        }),
      };
      fetch(process.env.REACT_APP_API_SERVER + "/profile/displayName", options)
        .then((response) => response.json())
        .then((response) => {
          console.log("/profile/displayName || response : ", response);
          if (response.status > 0) {
            resolve(response.status);
          } else {
            reject(response);
          }
        })
        .catch();
    });
  }
  updateUserAboutInfo(about) {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          id: AuthService.getCurrentUserId(),
          about: about,
        }),
      };
      fetch(process.env.REACT_APP_API_SERVER + "/profile/aboutInfo", options)
        .then((response) => response.json())
        .then((response) => {
          console.log("/profile/aboutInfo || response : ", response);

          if (response.status > 0) {
            resolve(response.status);
          } else {
            reject(response);
          }
        })
        .catch();
    });
  }
  updateUserProfileImage(byteArray) {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          id: AuthService.getCurrentUserId(),
          byteArray: byteArray,
        }),
      };
      console.log("updateUserProfileImage || buteArray : ", byteArray.length);

      fetch(process.env.REACT_APP_API_SERVER + "/profile/profileImage", options)
        .then((response) => response.json())
        .then((response) => {
          console.log("/profile/aboutInfo || response : ", response);
          if (response.status > 0) {
            resolve(response.status);
          } else {
            reject(response);
          }
        })
        .catch();
    });
  }

  newContactHandleMain(email, name) {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          id: AuthService.getCurrentUserId(),
          email: email,
          name: name,
        }),
      };
      fetch(process.env.REACT_APP_API_SERVER + "user/newContactAddForUser", options)
        .then((response) => response.json())
        .then((response) => {
          console.log("response in login arrive : ", response);
          resolve(response);
        });
    });
  }




  updateMasseges(MySocket, MyContacts) {
    return new Promise((resolve, reject) => {
      console.log(
        "updateMasseges start... MyContacts is : ",
        MyContacts.length
      );
      const data = {};
      MyContacts.forEach((entity) => {
        const masseges = localStorage.getItem("massege_" + entity.id);
        var lastMassegeId;
        if (masseges == undefined || masseges == null) {
          lastMassegeId = null;
        } else {
          lastMassegeId = masseges[masseges.length - 1].id;
        }
        data[entity._id] = lastMassegeId;
      });


      console.log(
        "updateMasseges : ",
        AuthService.getCurrentUserId(),
        " and data is :",
        data
      );

      if (MySocket && MySocket.connected) {
        console.log(
          "UserService.UpdateMasseges() ||  Socket is initialized and connected to the server"
        );
        MySocket.emit("UpdateMasseges", AuthService.getCurrentUserId(), data);
        resolve(1);
      } else {
        console.log(
          "UserService.UpdateMasseges() ||  Socket is not initialized or not connected to the server data :", data);
        console.log()
        resolve({ event: "UpdateMasseges", value: { id: AuthService.getCurrentUserId(), data: data } });
      }
    });
  }
}

export default new UserService();
