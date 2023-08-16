
class AuthService {

  loginService(credential) {
    console.log(credential);
    return new Promise(function (resolve, reject) {
      const options = {
        method: "POST",
        credentials: "include",
        // mode: "no-cors",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methos": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
        body: JSON.stringify({
          credential: credential,
        }),
      };
      fetch(process.env.REACT_APP_API_SERVER + "/loginForWeb", options)
        .then((response) => {
          console.log("fetch then response :", response);
          return response.json();
        })
        .then((res) => {
          console.log("response in login arrive : ");
          console.log(res.data);
          if (res.status == 1) {


            var imageUrl = "https://massengeruserprofileimage.s3.ap-south-1.amazonaws.com/" + res.data._id + ".jpg";
            if (res.data.profileImageVersion == undefined || res.data.profileImageVersion < 1) {
              imageUrl = "https://massengeruserprofileimage.s3.ap-south-1.amazonaws.com/general-contact-icon.jpg";
            }

            var userDetails = {
              _id: res.data._id,
              username: res.data.name,
              number: res.data.number,
              displayName: res.data.displayName,
              about: res.data.about,
              recoveryEmail: res.data.recoveryEmail,
              picture: imageUrl,
            };

            console.log("response in login arrive userDetails : ", userDetails);
            localStorage.setItem("user", JSON.stringify(userDetails));
            resolve({
              status: 1,
              userDetails: userDetails,
              token: res.token,
            });
          } else {
            reject({ status: res.status, res: res });
          }
        })
        .catch((e) => {
          console.log("erre : ", e);
          reject({ status: 0 });
        });
    });
  }


  logout() {
    localStorage.removeItem("user");
    localStorage.clear();

  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  getCurrentUserId() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      return currentUser._id;
    }
    return null;
  }
  getUserToken() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    return currentUser.token;
  }
}
export default new AuthService();
