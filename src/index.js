import express from "express";
const app = express();
const PORT = 4000;
import { pool } from "./database.js";
import router from "./controlador/lp.js";
import morgan from "morgan";
import cors from "cors";

app.use(cors())
app.use(morgan("dev"));
app.use(express.json());
app.use(router);


pool
  .query("SELECT 1")
  .then(() => console.log("Connected to MySQL"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
