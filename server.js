const express = require("express");
const backup = require("./src/backup/backup");

const app = express();

app.use("/pg/backup", backup);

const server = app.listen();
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
