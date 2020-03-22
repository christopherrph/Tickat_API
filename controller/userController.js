const db = require('../database');
const { uploader } = require('../helper/uploader');
const fs = require('fs');
const { createJWTToken } = require('../helper/jwt');
const secret = 'rahasia'
const crypto = require('crypto');
const transporter = require('../helper/nodemailer');

makeid = (length) => {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }


module.exports = {
    changeAvatar : (req,res) => {
        console.log(req.body.avatar)
        console.log(req.params.idnya)
        try{
            let sql = `UPDATE user SET avatar = '${req.body.avatar}'WHERE iduser = '${req.params.idnya}';`;
                db.query(sql, req.body, (err,results) => {
                    if(err){
                        console.log(err)
                        return res.status(500).send({message : 'haduh'})
                    }
                    return res.status(200).send(results)
                })
        }
        catch(err){
            return res.status(500).send({message: 'error'})
        }
    },countTicketLeft : (req,res) => {               //parameter req adalah data yang dikirim dari front-end
        let sql = `SELECT sum(ticket_stock) as TotalStock FROM tickat.event_ticket WHERE idevent ='${req.params.idnya}';`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getEventbyCategory : (req,res) => {
        let sql = `SELECT * FROM event e INNER JOIN partner p ON e.idpartner = p.idpartner INNER JOIN category c ON e.idcategory = c.idcategory WHERE event_status ='Active' AND e.idcategory ='${req.params.idnya}' AND e.event_date > CURDATE() ORDER BY e.dateposted DESC;`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },editpass: (req,res) => {
        console.log(req.body)
        req.body.newpass = crypto.createHmac('sha256',secret)
                            .update(req.body.newpass)
                            .digest('hex');
        req.body.oldpass = crypto.createHmac('sha256',secret)
                            .update(req.body.oldpass)
                            .digest('hex');
        let sqlcekpass = `SELECT * FROM user WHERE iduser = '${req.params.idnya}' AND password = '${req.body.oldpass}'`
        db.query(sqlcekpass, req.body, (err, results) => {
            if(err){
                console.log(err)
                res.status(500).send(err)
            }
            if(results.length>0){
                let sql = `UPDATE user SET password='${req.body.newpass}' WHERE iduser = '${req.params.idnya}';`
                db.query(sql, req.body, (err, result) => {
                    if(err){
                        console.log(err)
                        res.status(500).send(err)
                    }
                    res.status(200).send(result)
                });
            }else{
                res.status(500).send(err)
            }
        })
    },editprofile: (req,res) => {
                let sql = `UPDATE user SET name='${req.body.name}', birthdate='${req.body.birthdate}', phone='${req.body.phonenum}', address='${req.body.address}' WHERE iduser = '${req.params.idnya}';`
                db.query(sql, req.body, (err, result) => {
                    if(err){
                        console.log(err)
                        res.status(500).send(err)
                    }
                    res.status(200).send(result)
                });
    },getticketamount : (req,res) => {               //parameter req adalah data yang dikirim dari front-end
        let sql = `SELECT ticket_stock FROM event_ticket WHERE idticket ='${req.params.idnya}';`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },ticketsub: (req,res) => {
        let sql = `UPDATE event_ticket SET ticket_stock='${req.body.sisa}' WHERE idticket = '${req.body.idtiket}';`
        db.query(sql, req.body, (err, result) => {
            if(err){
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send(result)
        });
    },ticketadd: (req,res) => {
        let sql = `UPDATE event_ticket SET ticket_stock = ticket_stock + ${req.body.amount} WHERE idticket = '${req.body.idtiket}';`
        db.query(sql, req.body, (err, result) => {
            if(err){
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send(result)
        });
    },addTransaction : (req,res) =>{
        let sql = `INSERT INTO transaction set?`
        db.query(sql, req.body, (err, insert) => {
            if(err){
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send(insert)
        });
    },addTransactionTransfer : (req,res) =>{
        console.log(req.body.data)
        console.log('HELLO')
        try{    
            const path = '/receipt'
            const upload = uploader(path, 'IMG').fields([{ name : 'image' }])
            upload(req,res, (err) => {
                if(err){
                    return res.status(500).send({message : 'error'})
                }
                const {image} = req.files;  // File gambarnya
                const imagePath = image ? path +'/' + image[0].filename : null // 
                const data = JSON.parse(req.body.data)  // datanya diparse dari JSON
                data.receipt = imagePath // awalnya data yang dikirim dari frontend isi objectnya ga ada img. Disini ditambahin img 
                let sql = 'INSERT INTO transaction set?';
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
    },addTransactionTicket : (req,res) =>{
        console.log(req.body)
        for(var i=0; i<req.body.stateticket.length; i++){
            for(var j=0; j<req.body.stateticket[i].amount;j++){
                var idtransticket = `TIX${makeid(8)}`
                let sql = `INSERT INTO transaction_ticket VALUES('${idtransticket}','${req.body.idtransaction}','${req.body.idevent}','${req.body.stateticket[i].idtiket}','${req.body.stateticket[i].harga}','${req.body.ticket_status}')`
                db.query(sql, req.body, (err,results) => {
                    if(err){
                        console.log('FAIL')
                        console.log(err)
                        return res.status(500).send(err)
                    }
                })
            }
        }

        let mailOptions = {
            from : 'TICKAT <tickatickat@gmail.com>',
            to: req.body.email,
            subject: 'Tickat Purchase',
            html : `
            <img width="200px" src="cid:logoku">
            <h3>Hello</h3> \n
            <a>
                Thank you for purchasing tickets with us, you can view your purchased ticket through your profile page in our website. \n
                We hope you enjoy your experience with us.
            </a>\n
            <h3>Here are the details of your order</h3> 
            <hr/>
            <a style="font-size:15px;">
                Event Name          : ${req.body.event_name}
            <br/>
                Transaction ID      : ${req.body.idtransaction}
            <br/>
                Invoice Date        : ${req.body.transaction_time}
            <br/>
                Total Payment       : Rp.${req.body.totalprice}
            <br/>
                Total Ticket        : ${req.body.totalticket}
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
    },getTransactionByUser : (req,res) => {
        let sql = `SELECT t.idtransaction, t.totalticket, t.totalprice, t.transaction_time, t.payment_method, t.idevent, e.event_name, e.event_date, e.event_location FROM transaction t
        INNER JOIN event e
        ON t.idevent = e.idevent
        WHERE iduser ='${req.params.idnya}' ORDER BY t.transaction_time DESC`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getTickets : (req,res) => {
        let sql = `SELECT * FROM transaction_ticket tt INNER JOIN event_ticket t ON tt.idticket = t.idticket INNER JOIN event e ON tt.idevent = e.idevent WHERE idtransaction ='${req.params.idnya}' ORDER BY t.ticket_name`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getEventLowestPrice : (req,res) => {
        let sql = `SELECT MIN(ticket_price) as Minimal FROM event_ticket WHERE idevent ='${req.params.idnya}'`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    }
}