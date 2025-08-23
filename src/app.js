import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import appConfig from "./config/appConfig.js";

const app = express();
const allowedOrigins = appConfig.ORIGIN.split(",");

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("❌❌ Not allow by CORS."));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Event management backend run successfully 😊😊");
});

export default app;
