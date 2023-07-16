const API_URL = "http://13.234.177.94:10005";

class AuthService {
  loginService(credential) {
    console.log(credential);
    return new Promise(function (resolve, reject) {
      const options = {
        method: "POST",
        // credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          credential: credential,
        }),
      };
      fetch(API_URL + "/loginForWeb", options)
        .then((response) => {
          console.log("fetch then response :", response);
          return response.json();
        })
        .then((res) => {
          console.log("response in login arrive : ", res);
          if (res.status == 1) {
            var userDetails = {
              username: res.data.username,
              token: res.token,
              _id: res.data._id,
              email: res.data.email,
              picture: res.data.picture,
              about: res.data.about,
            };

            console.log("response in login arrive userDetails : ", userDetails);
            localStorage.setItem("user", JSON.stringify(userDetails));
            resolve({
              status: 1,
              userDetails: userDetails,
              Contacts: res.Contacts,
            });
          } else {
            reject({ status: 0, res: res });
          }
        })
        .catch((e) => {
          console.log("erre : ", e);
          reject({ status: 0 });
        });
      console.log("reached after fetchx");
    });
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  getCurrentUserId() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    return currentUser._id;
  }
  getUserToken() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    return currentUser.token;
  }
}
export default new AuthService();
