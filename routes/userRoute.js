const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/me', userController.getMe);
router.patch('/', upload.single('profilePic'), userController.updateProfile);
router.get('/services', userController.getUserServices);
router.get('/:userId', userController.getUserById);
module.exports = router;
