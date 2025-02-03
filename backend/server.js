import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { createServer } from "http";
// Routes
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import matchRoutes from "./routes/match.route.js";
import messageRoutes from "./routes/message.route.js"; // Import message routes
import { connectDB } from "./config/db.js";
import { initializeSocket } from "./socket/socket.server.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5500;

const __dirname = path.resolve();

// httpServer is created by passing the Express app (app) to createServer. This enables the use of both HTTP and WebSocket (via Socket.IO) on the same server.
initializeSocket(httpServer);

// Middleware
app.use(express.json({ limit: "50mb" })); // Handling large JSON payloads
app.use(cookieParser()); // Cookie parsing middleware

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Frontend URL
    credentials: true, // Allow cookies
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes); // Ensure this matches the client-side URL

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {  
    res.sendFile(path.resolve(__dirname, "/frontend", "dist", "index.html"));
  });

// Start the server and connect to the database
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
