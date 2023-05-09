import bp from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { errorHandler } from "./errorHandlerMiddleware.js";
import { router } from "../Routes/index.js";

export const app = express();

export const sessionMiddleware = session({
  secret: "keyboard cat",
  resave: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  saveUninitialized: true,
  socketClients: {},
});

app.use(morgan("dev"));

app.get("/", (_, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const options = {
    root: path.join(__dirname),
  };
  res.sendFile("index.html", options);
});
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(sessionMiddleware);

app.use(router);
app.use(errorHandler);
