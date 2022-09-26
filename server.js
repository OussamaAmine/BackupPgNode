const express = require('express');
const bodyParser = require('body-parser');
const backup = require('./src/backup/backup');
const restore = require('./src/restore/restore');

const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.use('/pg/restore', restore);
app.use('/pg/backup', backup);

const server = app.listen();

process.on('unhandledRejection', (err) => {
  console.error(err);
  console.log('Unhandled Rejection  ');
  server.close(() => {
    process.exit(1);
  });
});
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
