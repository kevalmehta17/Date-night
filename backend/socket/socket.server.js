import { Server } from "socket.io";

let io;

const connectedUser = new Map();
// connectedUser Map tracks connected users.
// It stores:
// Key (userId) → The unique ID of a user.
// Value (socketId) → The unique ID of their WebSocket connection.
// userId : socketId

// io = new Server -> Creates a new WebSocket server and attaches it to the existing HTTP server (httpServer).

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL, // Frontend URL
      credentials: true, // Allows authentication (cookies, tokens, etc.)
    },
  });

  // io.use -> Middleware function for socket connections.
  // It checks if the userId is present in the handshake and associates it with the socket.

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId; // Extract userId from the handshake
    if (!userId) return next(new Error("Invalid User Id")); // If no userId, reject the connection
    socket.userId = userId; // Store userId in socket object for later use
    next(); // Proceed to the connection event
  });

  // io.on("connection") -> This event runs when a new user connects to the server.
  // socket represents the WebSocket connection of a user.
  // socket.id is a unique identifier for the WebSocket connection.

  io.on("connection", (socket) => {
    console.log(`User is connected with the socket:- ${socket.id}`);
    connectedUser.set(socket.userId, socket.id); // Store the mapping of userId to socketId

    // socket.on("disconnect") -> This event runs when a user disconnects from the server.
    socket.on("disconnect", () => {
      console.log(`User is disconnected with the socket:- ${socket.id}`);
      connectedUser.delete(socket.userId); // Remove the disconnected user from the connectedUser map
    });
  });
};

//Checking for the Io connection
export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not connected yet");
  }
  return io;
};

//this will get the connected User
export const getConnectedUser = () => {
  return connectedUser;
};
