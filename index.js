const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const bearerToken = require('express-bearer-token');
const nodemailer = require('nodemailer')
const xoauth2 = require('xoauth2')

app.use(bodyParser()) // Biar bisa read req.body
app.use(cors()) // Front bisa akses API
app.use(bearerToken()) // Supaya bisa send token lewat header
app.use(bodyParser.urlencoded({ extended : false }))
app.use(express.static('public'))

app.get('/', (req,res) => {
    res.status(200).send('<h1>My API</h1>')
})

const { publicRouter } = require('./router')  // Import userRouter dan ditaro di const --> (router.get('/getAllUsers', userController.getUsers))
app.use('/public', publicRouter)


const { adminRouter } = require('./router')
app.use('/admin', adminRouter)

const { userRouter } = require('./router')
app.use('/user', userRouter)

app.listen(2000, () => console.log(2000))
