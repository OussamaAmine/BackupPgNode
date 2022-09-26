const fs = require('fs');
const compress = require('gzipme');
const { promisify } = require('util');
const { execute } = require('@getvim/execute');
const dotenv = require('dotenv');
const path = require('path');

const unlinkAsync = promisify(fs.unlink);
dotenv.config();

exports.backup = async (req, res) => {
  try {
    const username = process.env.DB_USERNAME;
    const database = process.env.DB_NAME;
    const password = process.env.PGPASSWORD;
    const date = new Date();
    const currentDate = `${date.getFullYear()}.${
      date.getMonth() + 1
    }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;

    const fileName = `database-backup-${currentDate}.sql`;
    let filePath = path.join(__dirname, '../', '../', 'backup', fileName);
    const execution = await execute(
      `pg_dump -U ${username} ${database} -f ${filePath} -F p`
    );

    await compress(filePath);
    await unlinkAsync(filePath);
    filePath = filePath + '.gz';
    console.log('Finito');
    res.download(filePath);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};
