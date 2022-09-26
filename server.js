const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());

app.use('/pg/test', routes);

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
