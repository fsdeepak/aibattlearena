import express from "express";
import cookieParser from "cookie-parser";
import runGraph from "./services/graph.service.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

app.post("/invoke", async (req, res) => {
  const { input, m1, m2 } = req.body;

  if (!input) {
    return res.status(400).json({
      success: false,
      message: "Prompt input is required",
    });
  }

  try {
    console.info(
      `[Arena] Executing graph for prompt: "${input.substring(0, 30)}..."`,
    );

    const result = await runGraph(input, m1, m2);

    return res.status(200).json({
      message: "Graph executed successfully",
      success: true,
      result,
    });
  } catch (error) {
    // 3. Log the error for debugging (In production, you'd use LangSmith/Sentry)
    console.error("[Arena Error]:", error?.message);

    return res.status(500).json({
      success: false,
      message: "An error occurred during AI orchestration",
      error: error?.message, // Hide this in a real production environment
    });
  }
});

export default app;
