import appConfig from "./config/appConfig.js";
import db from "./models/index.js";
import app from "./app.js";

db.sequelize
    .sync({ alter: true }) // Database Connection
    .then(() => {
        console.log("🚀 Database Connected Succssfully 🚀");
        app.listen(appConfig.PORT, () => {
            console.log(`Server is running on port ${appConfig.PORT}`);
        });
    })
    .catch((err) => {
        console.log("❌ Database Connected Faild ❌", err);
    });
