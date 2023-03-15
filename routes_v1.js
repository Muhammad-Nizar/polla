const express = require('express');
const router = express.Router();

router.use('/admin', require('./routes/admin_route'));
router.use('/app', require('./routes/app_route'));
router.use('/auth', require('./routes/auth_route'));
console.log("v1 route");
module.exports = router;