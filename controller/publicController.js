const db = require('../database');
const { uploader } = require('../helper/uploader');
const fs = require('fs');
const { createJWTToken } = require('../helper/jwt');
const secret = 'rahasia'
const crypto = require('crypto');
const nodemailer = require('nodemailer')
const xoauth2 = require('xoauth2')
const transporter = require('../helper/nodemailer');
const hbs = require("nodemailer-express-handlebars")

makeid = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }


module.exports = {
    postFeedback : (req,res) => {
        console.log('uploader')
        console.log(req.body)
        try{
            const path = '/feedback'
            const upload = uploader(path, 'IMG').fields([{ name : 'image' }])

            upload(req,res, (err) => {
                if(err){
                    return res.status(500).send({message : 'error'})
                }
                const {image} = req.files;  // File gambarnya
                const imagePath = image ? path +'/' + image[0].filename : null // 
                const data = JSON.parse(req.body.data)  // datanya diparse dari JSON
                data.img = imagePath // awalnya data yang dikirim dari frontend isi objectnya ga ada img. Disini ditambahin img 
                let sql = 'INSERT INTO feedback set ?';
                db.query(sql, data, (err,results) => {
                    if(err){
                        console.log('FAIL')
                        console.log(err)
                        fs.unlinkSync('./public' + imagePath)
                        return res.status(500).send({message : 'error'})
                    }
                    return res.status(200).send(results)
                })
            })
        }
        catch(err){
            return res.status(500).send({message: 'error'})
        }
    },getAllFeedback : (req,res) => {               //parameter req adalah data yang dikirim dari front-end
        let sql = "SELECT * FROM feedback;"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },register : (req,res) => {
        console.log(req.body)
        req.body.password = crypto.createHmac('sha256',secret)
                            .update(req.body.password)
                            .digest('hex');
        let sql = `INSERT INTO user set ?`
        db.query(sql, req.body, (err, insert) => {
            if(err){
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send(insert)
        });
    },getAllUser : (req,res) => {               //parameter req adalah data yang dikirim dari front-end
        let sql = "SELECT * FROM user;"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getUsersById : (req,res) => {               //parameter req adalah data yang dikirim dari front-end
        let sql = `SELECT * FROM user WHERE iduser = ${req.params.idnya};`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },checkemail : (req,res) => {               //parameter req adalah data yang dikirim dari front-end
        console.log(req.params.emailnya)
        let sql = `SELECT * FROM user WHERE email='${req.params.emailnya}';`
        db.query(sql, (err, results) => {
            if(err || results.length == 0){
                console.log(err)
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        });
    },login : (req,res) => {
        const {email, password} = req.body;
        console.log(req.body)
        console.log(email)
        console.log(password)
        req.body.password = crypto.createHmac('sha256',secret)
                            .update(req.body.password)
                            .digest('hex');
        let sqlget = `SELECT * FROM user WHERE email='${email}' AND password='${req.body.password}';`
        db.query(sqlget, (err, result) => {
            if(err){
                res.status(500).send(err)
            } 
            if(result.length !== 0){
                console.log(result) // result dalam bentuk array (dalemnya ada object)
                let {iduser, name, email} = result[0]

                const token = createJWTToken({
                    iduser,
                    name,
                    email     
                })

                return res.status(200).send(
                    {
                        iduser,
                        name,
                        email,
                        token
                    }
                )
            }else{
                res.status(500).send({
                error: 'Login Fail'
                })
            }
        });
    },
    keeplogin : (req,res) => {
        console.log('masuk')
        console.log(req.user);
        let sql = `SELECT * FROM user WHERE iduser = ${req.user.iduser};`;
        db.query(sql, (err,result) => {
            if(err) res.status(500).send(err)
            let {iduser, name, email} = result[0]
            const token = createJWTToken({
                iduser,
                name,
                email     
            })
            return res.status(200).send(
                {
                    iduser,
                    name,
                    email,
                    token
                }
            )
        }) 
    },forgotpassword : (req,res) => {
        try{
            var newPass = makeid(8);
            var passuncrypt = newPass
            var image = "../public/LogoSS.PNG"
            console.log(newPass)
            newPass = crypto.createHmac('sha256',secret).update(newPass).digest('hex');
            console.log(newPass)
            let sql = `UPDATE user SET password='${newPass}' WHERE email = '${req.params.emailnya}';`
            db.query(sql, req.body, (err, result) => {
                if(err){
                    console.log(err)
                    res.status(500).send(err)
                }
                
                let mailOptions = {
                    from : 'TICKAT <tickatickat@gmail.com>',
                    to: req.params.emailnya,
                    subject: 'Forgot Password',
                    html : `
                    <img width="200px" src="cid:logoku">
                    <h3>New Password </h3> \n
                    <a>
                        Hello, your new password is: ${passuncrypt}, you can change your password through your profile page.
                    <br/>
                       Thankyou and have a good day!
                    </a>
                    `,
                    attachments:[{
                        filename : 'logoSS.png',
                        path: 'http://localhost:2000/logoSS.png',
                        cid : 'logoku'
                    }]
                }

                transporter.sendMail(mailOptions, (err,res2) => {
                    if(err){
                        console.log(err)
                        return res.status(500).send({ message : err })
                    }
                    console.log('success')
                    return res.status(200).send({message: 'success'})
                })

            })
        }catch(err){
            console.log(err)
            res.status(500).send(err)
        }
    }
}