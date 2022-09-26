const express = require('express');
const backup = require('./src/backup/backup');
const restore = require('./src/restore/restore');

const router = express.Router();

router.route('/backup').get(backup.backup);
router.route('/restore').post(restore.uploadMulter, restore.restore);

module.exports = router;
