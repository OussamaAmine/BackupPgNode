const express = require('express');
const backup = require('./src/backup/backup');
const restore = require('./src/restore/restore');
const remote = require('./src/remote_access/remote');

const router = express.Router();

router.route('/backup').get(backup.backup);
router.route('/restore').post(restore.uploadMulter, restore.restore);
router.route('/remote').get(remote.remoteAccess);
//router.route('/upload').get(remote.upload);
module.exports = router;
