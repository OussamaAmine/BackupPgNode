const express = require("express");
const { execute } = require("@getvim/execute");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    const username = process.env.DB_USERNAME;
    const database = process.env.DB_NAME;
    const password = process.env.PGPASSWORD;
    const date = new Date();
    const currentDate = `${date.getFullYear()}.${
      date.getMonth() + 1
    }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
    const fileName = `database-backup-${currentDate}.sql`;
    const filePath = path.join(__dirname, "../", "../", "backup", fileName);
    const execution = await execute(
      `pg_dump -U ${username} ${database} -f ${filePath} -F p`
    );
    console.log(execution);
    // res.status(200).json({
    //   status: "success",
    //   data: {
    //     user: filePath,
    //   },
    // });
    res.download(filePath);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});
module.exports = router;
