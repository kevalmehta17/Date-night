import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5500;

app.use(express.json());

app.use("/api/auth");
app.use("/api/users");
app.use("/api/matches");
app.use("/api/messages");

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:5500`);
});
