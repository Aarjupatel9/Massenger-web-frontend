import AuthService from "./auth.service";

const API_URL = "http://localhost:10001/api/";

class UserService {
  getUserContactList() {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  updateUserProfileDetails(username, about) {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        // credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          id: AuthService.getCurrentUserId(),
          username: username,
          about: about,
          token: AuthService.getUserToken(),
        }),
      };
      fetch(API_URL + "auth/updateUserProfile", options)
        .then((response) => response.json())
        .then((response) => {
          console.log("response in login arrive : ", response);

          if (response.status > 0) {
            const oldUser = AuthService.getCurrentUser();
            var userDetails = {
              username: username,
              token: oldUser.token,
              id: oldUser.id,
              email: oldUser.email,
              about: about,
            };
            localStorage.setItem("user", JSON.stringify(userDetails));
            resolve(response);
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
      fetch(API_URL + "user/newContactAddForUser", options)
        .then((response) => response.json())
        .then((response) => {
          console.log("response in login arrive : ", response);
          resolve(response);
        });
    });
  }

  updateMyContacts() {
    return new Promise((resolve, reject) => {
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          _id: AuthService.getCurrentUserId(),
        }),
      };
      fetch(API_URL + "user/updateMyContacts", options)
        .then((response) => response.json())
        .then((response) => {
          console.log("updateMyContacts response arrive : ", response);
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
        MySocket.emit("UpdateMasseges",  AuthService.getCurrentUserId(), data );
        resolve(1);
      } else {
        console.log(
          "UserService.UpdateMasseges() ||  Socket is not initialized or not connected to the server data :",data);
        console.log()
        resolve({ event: "UpdateMasseges", value: { id : AuthService.getCurrentUserId(), data : data } });
      }
    });
  }
}

export default new UserService();
