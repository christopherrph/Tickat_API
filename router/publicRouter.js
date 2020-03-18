const express = require('express');
const { publicController } = require('../controller');
const router = express.Router();
const { auth } = require('../helper/auth')

router.post('/postFeedback', publicController.postFeedback)
router.get('/getAllFeedback', publicController.getAllFeedback)
router.post('/register', publicController.register)
router.get('/getAllUser', publicController.getAllUser)
router.get('/getUsersById/:idnya', publicController.getUsersById)
router.get('/checkemail/:emailnya', publicController.checkemail)
router.post('/login', publicController.login)
router.post('/keeplogin',auth,publicController.keeplogin)
router.patch('/forgotpassword/:emailnya', publicController.forgotpassword)

module.exports = router;