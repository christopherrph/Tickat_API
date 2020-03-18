const express = require('express');
const { userController } = require('../controller');
const router = express.Router();

router.post('/changeAvatar/:idnya', userController.changeAvatar)
router.get('/countTicketLeft/:idnya', userController.countTicketLeft)
router.get('/getEventbyCategory/:idnya', userController.getEventbyCategory)
router.patch('/editpass/:idnya', userController.editpass)
router.patch('/editprofile/:idnya', userController.editprofile)
router.get('/getticketamount/:idnya', userController.getticketamount)
router.patch('/ticketsub', userController.ticketsub)
router.patch('/ticketadd', userController.ticketadd)
router.post('/addTransaction', userController.addTransaction)
router.post('/addTransactionTransfer', userController.addTransactionTransfer)
router.post('/addTransactionTicket', userController.addTransactionTicket)
router.get('/getTransactionByUser/:idnya', userController.getTransactionByUser)
router.get('/getTickets/:idnya', userController.getTickets)

module.exports = router;