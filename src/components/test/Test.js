import React, { useEffect } from "react";

export default function Test() {
  useEffect(() => {
    fetch("http://localhost:10001/api/auth/login", {
      method: "POST",
      //   credentials: 'include',

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({
        email: "a@gmail.com",
        password: "mhk123",
      }),
    })
      .then((res) => {
        // console.log("res in test res : ", res);
        return res.json();
        // console.log(JSON.parse(res.body));
      })
      .then((response) => {
        console.log("res in test : ", response);
      })
      .catch((e) => {
        console.log("err : ", e);
      });
  }, []);

  return <div></div>;
}
