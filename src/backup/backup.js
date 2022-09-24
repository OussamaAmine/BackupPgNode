const express = require("express");
const { execute } = require("@getvim/execute");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const router = express.Router();

router.route("/").get((req, res) => {
  const username = process.env.DB_USERNAME;
  const database = process.env.DB_NAME;
  const date = new Date();
  const currentDate = `${date.getFullYear()}.${
    date.getMonth() + 1
  }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
  const fileName = `database-backup-${currentDate}.sql`;
  const filePath = path.join(__dirname, "../", "../", "backup", fileName);
  execute(`pg_dump -U ${username} -F p  ${database}   > ${filePath}`)
    .then(async () => {
      console.log("Finito");
      res.download(`/backup/${fileName}`);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
});
module.exports = router;
