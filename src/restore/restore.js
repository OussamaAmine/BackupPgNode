const express = require("express");
const { execute } = require("@getvim/execute");
const fs = require("fs");
const compress = require("gzipme");
const { promisify } = require("util");
const dotenv = require("dotenv");
const multer = require("multer");

dotenv.config();
const database = process.env.DB_NAME;

const multerMemoryStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("application/gzip")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload only gzip files", 400), false);
  }
};

const uploadToMemory = multer({
  storage: multerMemoryStorage,
  fileFilter: multerFilter,
});

const writeFileAsync = promisify(fs.writeFile);

const router = express.Router();

router.route("/").post(async (req, res) => {
  try {
    uploadToMemory.single("file");
    if (!req.file) {
      throw new AppError("you must upload file ", 400);
    }
    const date = new Date();
    const currentDate = `${date.getFullYear()}.${
      date.getMonth() + 1
    }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;

    const fileName = `upload-backup-${currentDate}.sql`;
    let filePath = path.join(__dirname, "../", "../", "upload", fileName);

    await writeFileAsync(filePath, req.file.buffer);

    await execute(`pg_restore -cC -d ${database} ${filePath}`);
    console.log("Restored");
    res.status(200);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

module.exports = router;
