const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../controllers/adminController');

<<<<<<< HEAD
// The '/api/admin' prefix is already applied in server.js
router.post('/login', loginAdmin);
=======
router.post('/admin/login', loginAdmin);
>>>>>>> 18b3bb154fe4bc562397050ecc39746c89c3272e

module.exports = router;