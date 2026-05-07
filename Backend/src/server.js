import dotenv from "dotenv";
import connectDB from "./db/db.js";
import {app} from "./app.js";
dotenv.config();

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("ERR: ", error);
      throw err;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongo DB connection failed!", error);
  });