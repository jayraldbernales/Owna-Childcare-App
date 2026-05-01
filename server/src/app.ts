import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import session from "express-session";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";

import authRoute from "./routers/authRoute";
import childRoutes from "./routers/children";
import userRoute from "./routers/user";
import notificationRoutes from "./routers/notifications";
import { swaggerSpec } from "./utils/swagger";

dotenv.config();

const app = express();

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",
});

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoute);
app.use("/api/children", childRoutes);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/notifications", notificationRoutes);

export default app;
