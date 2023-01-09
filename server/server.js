const dotenv = require("dotenv");
const nodeEnv = process.env.NODE_ENV;
let envPath;
if (nodeEnv === "dev") {
  envPath = ".env.dev";
} else if (nodeEnv === "prod") {
  envPath = ".env.prod";
}
dotenv.config({ path: `./${envPath}` });

const app = require("./app");
const database = require("./core/config/database/database");
const initialData = require("./core/utils/initialData");
const PORT = process.env.PORT || 8080;
const start = async () => {
  try {
    await database.authenticate();
    await database.sync({
      // force: true,
      // alter: true,
    });
    app.listen(PORT, () => {
      console.log(
        `Server ${process.env.NODE_ENV} started on port ${PORT}`
      );
    });

    initialData();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
