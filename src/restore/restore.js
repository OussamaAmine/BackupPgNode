const path = require('path');
const { execute } = require('@getvim/execute');
const fs = require('fs');
const compress = require('gzipme');
const { promisify } = require('util');
const dotenv = require('dotenv');
const multer = require('multer');

// const multerMemoryStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("application/gzip")) {
//     cb(null, true);
//   } else {
//     cb(new Error("error"), false);
//   }
// };

// const uploadToMemory = multer({
//   storage: multerMemoryStorage,
//   fileFilter: multerFilter,
// });
exports.restore = (req, res) => {
  //     uploadToMemory.single("file")
  //   dotenv.config();
  //   const database = process.env.DB_NAME;

  //   const writeFileAsync = promisify(fs.writeFile);

  //   try {
  //     if (!req.file) {
  //       throw new Error("you must upload file ");
  //     }
  //     const date = new Date();
  //     const currentDate = `${date.getFullYear()}.${
  //       date.getMonth() + 1
  //     }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;

  //     const fileName = `upload-backup-${currentDate}.sql.gz`;
  //     let filePath = path.join(__dirname, "../", "../", "upload", fileName);

  //     await writeFileAsync(filePath, req.file.buffer);

  //     await execute(`pg_restore -cC -d ${database} ${filePath}`);
  console.log('Restored');
  res.status(200).json({
    status: 'succes',
  });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500);
  //   }
};
