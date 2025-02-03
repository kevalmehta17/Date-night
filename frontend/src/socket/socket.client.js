// import io from "socket.io-client";

// // The URL for your Socket.io server (backend).
// const SOCKET_URL = "http://localhost:5500";

// let socket = null; // Variable to hold the current socket connection instance

// // Function to initialize the socket connection
// // Takes the userId as an argument to authenticate the user
// export const initializeSocket = (userId) => {
//   // If there is already an active socket connection, disconnect it first

//   if (socket) {
//     socket.disconnect();
//   }

//   // Create a new socket connection with authentication (passing the userId)
//   socket = io(SOCKET_URL, {
//     auth: { userId }, // Sends the userId during the handshake as part of the connection request
//   });
// };

// // Function to retrieve the current socket instance
// export const getSocket = () => {
//   // If the socket hasn't been initialized, throw an error
//   if (!socket) {
//     throw new Error("Socket is not initialized");
//   }
//   return socket; // Return the existing socket instance
// };

// // Function to disconnect the socket connection
// export const disconnectSocket = () => {
//   // If a socket connection exists, disconnect it and set socket to null
//   console.log("Socket disconnected");
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };

import io from "socket.io-client";

// The URL for your Socket.io server (backend).
const SOCKET_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5500" : "/";

let socket = null; // Variable to hold the current socket connection instance

// Function to initialize the socket connection
// Takes the userId as an argument to authenticate the user
export const initializeSocket = (userId) => {
  // If there is already an active socket connection, disconnect it first
  if (socket) {
    console.log("Disconnecting existing socket before initializing a new one.");
    socket.disconnect();
  }

  console.log("Initializing new socket connection with userId:", userId);

  // Create a new socket connection with authentication (passing the userId)
  socket = io(SOCKET_URL, {
    auth: { userId }, // Sends the userId during the handshake as part of the connection request
  });

  // Add event listeners for debugging
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });
};

// Function to retrieve the current socket instance
export const getSocket = () => {
  // If the socket hasn't been initialized, throw an error
  if (!socket) {
    throw new Error("Socket is not initialized");
  }
  return socket; // Return the existing socket instance
};

// Function to disconnect the socket connection
export const disconnectSocket = () => {
  // If a socket connection exists, disconnect it and set socket to null
  console.log("Socket disconnected");
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
