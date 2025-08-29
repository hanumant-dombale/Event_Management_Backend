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

// import all routers
import userRoute from "./routers/user.route.js";
import {
    globalErrorHandle,
    notFound,
} from "./middlewares/errorHandlers.middleware.js";

// Add all routes
app.use("/api/users", userRoute);

app.use(notFound);
app.use(globalErrorHandle);

export default app;
