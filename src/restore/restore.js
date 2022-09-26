const express = require("express");

const router = express.Router();

function restore() {
  execute(`pg_restore -cC -d ${database} ${fileNameGzip}`)
    .then(async () => {
      console.log("Restored");
    })
    .catch((err) => {
      console.log(err);
    });
}
