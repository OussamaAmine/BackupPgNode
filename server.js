const express = require("express");
const backup = require("./src/backup/backup");

const app = express();

app.use("/backup", backup);

const server = app.listen(3000);
process.on("unhandledRejection", (err) => {
  console.error(err);
  console.log("Unhandled Rejection  ");
  server.close(() => {
    process.exit(1);
  });
});
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
