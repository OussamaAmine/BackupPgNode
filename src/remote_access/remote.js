const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const nodeCmd = require('node-cmd');
const dotenv = require('dotenv');
const { Client } = require('ssh2');

const readFileAsync = promisify(fs.readFile);
const executeCommandAsync = promisify(nodeCmd.run);

dotenv.config();
const sshConfig = {
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT,
  username: process.env.SSH_USER,
  password: process.env.SSHPASS,
};
const connectSSH = (privateKey, cmd) => {
  const conn = new Client();
  conn
    .on('ready', () => {
      console.log('Client :: ready');

      console.log(cmd);

      conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream
          .on('close', (code, signal) => {
            console.log(
              `SSH Stream :: close :: code: ${code}, signal: ${signal}`
            );
            conn.end();
          })
          .on('data', (data) => {
            console.log(`STDOUT: ${data}`);
          })
          .stderr.on('data', (data) => {
            console.log(`STDERR: ${data}`);
          });
      });
    })
    .connect({
      host: sshConfig.host,
      port: sshConfig.port,
      username: sshConfig.username,
      privateKey: privateKey,
    });
};

exports.remoteAccess = async (req, res) => {
  console.log(sshConfig);
  const privateKeyPath = path.join(__dirname, '../', '../', 'rsa2');
  const privateKey = await readFileAsync(privateKeyPath);
  const database = process.env.DB_NAME;
  const username = process.env.DB_USERNAME;
  const password = process.env.PGPASSWORD;

  const backupName = 'database-backup-2022.9.26.7.18.sql';
  const backupNameGz = `${backupName}.gz`;
  const backupPath = `C:/Users/LENOVO IDEAPAD Y700/Desktop/${backupNameGz}`;
  const remotePath = '/home/ruafbwuf/repositories/BackupPg/upload/';
  const unzipCommand = `gzip -d ${remotePath + backupNameGz}`;
  const restoreCommand = `PGPASSWORD=${password} psql -U ${username} -d ${database} -f ${
    remotePath + backupName
  }`;
  const deleteCommand = `rm ${remotePath + backupName}`;

  try {
    await executeCommandAsync(
      `scp -i "${privateKeyPath}"  -P ${sshConfig.port}  "${backupPath}" ${sshConfig.username}@${sshConfig.host}:${remotePath}`
    );
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    //setTimeout(() => {}, 10000);
    await delay(20000);
    connectSSH(privateKey, unzipCommand);
    //setTimeout(() => {}, 12000);
    await delay(20000);
    connectSSH(privateKey, restoreCommand);
    //setTimeout(() => {}, 15000);
    await delay(20000);
    connectSSH(privateKey, deleteCommand);
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 'failed' });
  }
};
