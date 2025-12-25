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
import venueRoute from "./routers/venue.route.js";
import eventRoute from "./routers/event.route.js";
import authRoute from "./routers/auth.route.js";

// Add all routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
// app.use("/api/events", eventRoute);
app.use("/api/venues", venueRoute);

// import error handlers
import {
    globalErrorHandle,
    notFound,
} from "./middlewares/errorHandlers.middleware.js";

app.use(notFound);
app.use(globalErrorHandle);

export default app;
