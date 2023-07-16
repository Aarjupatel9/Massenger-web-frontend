import { connect, useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import AuthService from "./auth.service";

export function SocketServiceInit() {
  console.log("SocketServiceInit start");
  return new Promise((resolve, reject) => {
    const socket = io("http://localhost:10002");

    socket.on("connect", () => {
      console.log("SocketServiceInit Connected to server!");
      resolve(socket);
    });
  });

  // socket.connect();
}
