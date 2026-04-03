import express from "express";
import cookieParser from "cookie-parser";
import runGraph from "./services/graph.service.js";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.get("/", async (req, res) => {
  const result = await runGraph("Write an code for Factorial function in js");

  res.json(result);
});

export default app;
