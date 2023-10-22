const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException',err=>{
   console.log("UNHANDLED EXCEPTION! 💥 Shutting down...");
   console.log(err.name,err.message);
   server.close(() => {
     process.exit(1);
   });
})