import appConfig from "./config/appConfig.js";
import db from "./models/index.js";
import app from "./app.js";

db.sequelize
  .sync({ alter: true }) // Database Connection
  .then(() => {
    console.log("🚀 Database Connected Successfully 🚀");
    app.listen(appConfig.PORT, () => {
      console.log(
        `Server is running on port "http://localhost:${appConfig.PORT}"`,
      );
    });
  })
  .catch((err) => {
    console.log("❌ Database Connected Failed ❌", err);
  });
