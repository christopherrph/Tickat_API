const express = require('express');
const { adminController } = require('../controller');
const router = express.Router();
const { auth } = require('../helper/auth')


router.post('/login', adminController.login)
router.post('/keeplogin',auth,adminController.keeplogin)    // auth untuk verify

router.get('/getAllAdmin', adminController.getAllAdmin)
router.get('/getAdminById/:idnya', adminController.getAdminById)
router.post('/addAdmin', adminController.addAdmin)
router.patch('/deactivateadmin/:idnya',adminController.deactivateadmin)
router.patch('/editadmin', adminController.editadmin)


router.get('/getAllCategory', adminController.getAllCategory)
router.get('/getCategoryById/:idnya', adminController.getCategoryById)
router.post('/addCategory', adminController.addCategory)
router.patch('/deactivatecategory/:idnya',adminController.deactivatecategory)
router.patch('/editcategory', adminController.editcategory)

router.get('/getAllFeedback', adminController.getAllFeedback)
router.get('/getAllReadFeedback', adminController.getAllReadFeedback)
router.patch('/markasreadfeedback/:idnya',adminController.markasreadfeedback)
router.patch('/markasunreadfeedback/:idnya',adminController.markasunreadfeedback)

router.get('/getAllUser', adminController.getAllUser)
router.get('/getAllUserLike/:like', adminController.getAllUserLike)

router.get('/getAllPartner', adminController.getAllPartner)
router.get('/getAllPartnerLike/:like', adminController.getAllPartnerLike)
router.get('/getPartnerById/:idnya', adminController.getPartnerById)
router.post('/addPartner', adminController.addPartner)
router.post('/editPartner/:idnya', adminController.editPartner)
router.patch('/deactivatepartner/:idnya',adminController.deactivatepartner)

router.post('/addEvent', adminController.addEvent)
router.post('/addTicket/:idevent', adminController.addTicket)
router.get('/getTicketByEvent/:idnya', adminController.getTicketByEvent)
router.get('/getAllEvent', adminController.getAllEvent)
router.get('/getAllEventLater', adminController.getAllEventLater)
router.get('/getEventById/:idnya', adminController.getEventById)
router.get('/getEventByPartner/:idnya', adminController.getEventByPartner)
router.get('/getAllEventLike/:like', adminController.getAllEventLike)
router.patch('/deactivateevent/:idnya',adminController.deactivateevent)
router.post('/editEvent/:idnya', adminController.editEvent)
router.post('/editEventTicket/:idevent', adminController.editEventTicket)

router.get('/getAllTransaction', adminController.getAllTransaction)
router.get('/getAllTransactionById/:idnya', adminController.getAllTransactionById)
router.get('/getTickets/:idnya', adminController.getTickets)

router.get('/countuser',adminController.countuser)
router.get('/countpartner',adminController.countpartner)
router.get('/countevent',adminController.countevent)
router.get('/countallevent',adminController.countallevent)
router.get('/countfeedback',adminController.countfeedback)
router.get('/countpaymentmethodbyevent/:idnya',adminController.countpaymentmethodbyevent)
router.get('/counttickettypebyevent/:idnya',adminController.counttickettypebyevent)
router.get('/countdoneevent',adminController.countdoneevent)
router.get('/countinactiveevent',adminController.countinactiveevent)

router.get('/countusermonth/:bulan/:tahun',adminController.countusermonth)
router.get('/countpartnermonth/:bulan/:tahun',adminController.countpartnermonth)
router.get('/countalleventmonth/:bulan/:tahun',adminController.countalleventmonth)
router.get('/getAllTransactionmonth/:bulan/:tahun', adminController.getAllTransactionmonth)
router.get('/countpaymentmethodbymonth/:bulan/:tahun',adminController.countpaymentmethodbymonth)
router.get('/getEventCategorybymonth/:bulan/:tahun',adminController.getEventCategorybymonth)
router.get('/getAllEventmonth/:bulan/:tahun', adminController.getAllEventmonth)
router.get('/getEventLaku/:bulan/:tahun', adminController.getEventLaku)

router.get('/getUserGender',adminController.getUserGender)
router.get('/getUserAge',adminController.getUserAge)
router.get('/getEventCategory',adminController.getEventCategory)
router.get('/getMonthlyTransaction',adminController.getMonthlyTransaction)

module.exports = router;