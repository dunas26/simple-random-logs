import { Hono } from "hono";

const r = () =>
  randomLog({
    descriptions: [
      { type: "log", message: () => "Hello World" },
      { type: "error", message: () => "Something went wrong" },
      { type: "warn", message: () => "Please review this log" },
    ],
  });

const app = new Hono();
const PORT = Number(Deno.env.get("PORT")) || 80;

addEventListener("fetch", () => {
  console.log(`APP Running on ${PORT}`);
});

app.get("/", (c) => {
  const result = r();
  return c.json({
    message: "Log enabled and successfully running",
    log: result,
  });
});

app.get("/logs/:count", async (c) => {
  const count = Number(c.req.param("count"));
  const delay = Number(c.req.query("delay")) || 0;

  const results: LogPayload[] = [];
  for (let i = 0; i < count; i++) {
    results.push(r());
    if (delay && delay > 0) await new Promise((res) => setTimeout(res, delay));
  }
  return c.json({
    message: "Log enabled and successfully running",
    results,
  });
});

Deno.serve({ port: PORT }, app.fetch);

export type LogType = "log" | "error" | "warn";
export interface LogPayload {
  type: LogType;
  msg: string;
  now: Date;
}

export interface LogDescription {
  type: LogType;
  message: () => string;
}

export interface RandomLogOpts {
  descriptions: LogDescription[];
}

export function randomLog(opts: RandomLogOpts) {
  const { descriptions } = opts;

  const pickLog = descriptions[Math.floor(Math.random() * descriptions.length)];
  const { message, type } = pickLog;
  const msg = `[${type.toUpperCase()}] ${message()} -> ${
    new Date().toUTCString()
  }`;

  switch (type) {
    case "error":
      console.error(msg);
      break;
    case "log":
      console.log(msg);
      break;
    case "warn":
      console.warn(msg);
      break;
  }

  return { type, msg, now: new Date() } as LogPayload;
}
