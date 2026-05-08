import axios from "axios";

type EventType = {
  type: string;
  status: number;
  method: string;
  url: string;
  responseTime: number;
  message?: string;
  stack?: string;
  terminated: boolean;
};

const API_URL = "https://agencypulseai.onrender.com/api/collect";
const API_KEY = "668a9ca7d7491afa875978d8";

const queue: EventType[] = [];
const INTERVAL = 20000;

async function sendBatch(events: EventType[]) {
  try {
    await axios.post(
      API_URL,
      {
        apiKey: API_KEY,
        events,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err: any) {
    queue.unshift(...events);
  }
}

export function trackingMiddleware(req: any, res: any, next: any) {
  const start = Date.now();
  let capturedBody: any = null;
  let alreadyLogged = false;

  const originalSend = res.send;
  res.send = function (body: any): any {
    if (!capturedBody) capturedBody = body;
    return originalSend.apply(res, arguments as any);
  };

  const originalJson = res.json;
  res.json = function (body: any): any {
    capturedBody = body;
    return originalJson.apply(res, arguments as any);
  };

  const logEvent = (terminatedEarly: boolean) => {
    if (alreadyLogged) return;
    alreadyLogged = true;

    let finalMessage = "";
    let finalStack = "";

    if (capturedBody) {
      if (typeof capturedBody === "object") {
        finalMessage =
          capturedBody.message ||
          capturedBody.error ||
          JSON.stringify(capturedBody);
        finalStack = capturedBody.stack || "";
      } else {
        try {
          const parsed = JSON.parse(capturedBody);
          finalMessage = parsed.message || parsed.error || capturedBody;
          finalStack = parsed.stack || "";
        } catch {
          finalMessage = capturedBody.toString();
        }
      }
    } else {
      finalMessage = res.statusMessage || "";
    }

    const event: EventType = {
      type: "REQUEST",
      status: res.statusCode,
      method: req.method,
      url: req.originalUrl,
      responseTime: Date.now() - start,
      message: finalMessage,
      stack: finalStack,
      terminated: terminatedEarly,
    };

    queue.push(event);
  };

  res.on("finish", () => logEvent(false));
  res.on("close", () => logEvent(!res.writableFinished));

  next();
}

setInterval(async () => {
  if (queue.length === 0) return;
  const events = queue.splice(0, queue.length);
  await sendBatch(events);
}, INTERVAL);

async function flushOnExit() {
  if (queue.length > 0) {
    await sendBatch([...queue]);
  }
}

process.on("SIGINT", async () => {
  await flushOnExit();
  process.exit();
});

process.on("SIGTERM", async () => {
  await flushOnExit();
  process.exit();
});
