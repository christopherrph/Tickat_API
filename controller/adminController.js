const db = require('../database');
const { uploader } = require('../helper/uploader');
const fs = require('fs');
const { createJWTToken } = require('../helper/jwt');
const secret = 'rahasia'
const crypto = require('crypto');

module.exports = {
    getAllAdmin : (req,res) => {
        let sql = "SELECT * FROM admin WHERE status='Active' AND role='Admin';"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getAdminById : (req,res) => {               //parameter req adalah data yang dikirim dari front-end
        let sql = `SELECT * FROM admin WHERE idadmin = ${req.params.idnya};`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },addAdmin : (req,res) =>{
        console.log(req.body)
        req.body.password = crypto.createHmac('sha256',secret)
                            .update(req.body.password)
                            .digest('hex');
        let sql = `INSERT INTO admin set ?`
        db.query(sql, req.body, (err, insert) => {
            if(err){
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send(insert)
        });
    },login : (req,res) => {
        const {username} = req.body;
        console.log(req.body)
        console.log(username)
        req.body.password = crypto.createHmac('sha256',secret)
                            .update(req.body.password)
                            .digest('hex');
        let sqlget = `SELECT * FROM admin WHERE username='${username}' AND password='${req.body.password}' AND status ='Active';`
        db.query(sqlget, (err, result) => {
            if(err){
                res.status(500).send(err)
            } 
            if(result.length !== 0){
                console.log(result) // result dalam bentuk array (dalemnya ada object)
                let {idadmin, username, role} = result[0]

                const token = createJWTToken({
                    idadmin,
                    username,
                    role     
                })

                return res.status(200).send(
                    {
                        idadmin,
                        username,
                        role,
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
        let sql = `SELECT * FROM admin WHERE idadmin = ${req.user.idadmin};`;
        db.query(sql, (err,result) => {
            if(err) res.status(500).send(err)
            let {idadmin, username, role} = result[0]
            const token = createJWTToken({
                idadmin,
                username,
                role     
            })
            return res.status(200).send(
                {
                    idadmin,
                    username,
                    role,
                    token
                }
            )
        }) 
    },deactivateadmin: (req,res) => {
        let sql = `UPDATE admin SET status = "Non-Active" WHERE idadmin = ${req.params.idnya};`
        db.query(sql, (err, results) => {
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },editadmin: (req,res) => {
        console.log(req.body)
        req.body.password = crypto.createHmac('sha256',secret)
        .update(req.body.password)
        .digest('hex');
        let sql = `UPDATE admin SET username='${req.body.username}', password='${req.body.password}' WHERE idadmin = ${req.body.id};`
        db.query(sql, req.body, (err, result) => {
            if(err){
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send(result)
        });
    },countuser : (req,res) => {
        let sql = "SELECT count(iduser) as total FROM user WHERE status = 'Active';"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },countpartner : (req,res) => {
        let sql = "SELECT count(idpartner) as total FROM partner WHERE partner_status = 'Active';"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },countevent : (req,res) => {
        let sql = "SELECT count(idevent) as total FROM event WHERE event_status = 'Active' AND event_date > CURDATE();"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },countallevent : (req,res) => {
        let sql = "SELECT count(idevent) as total FROM event WHERE event_status = 'Active';"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },







    getAllUser : (req,res) => {
        let sql = "SELECT * FROM user WHERE status='Active';"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getAllUserLike : (req,res) => {
        let sql = `SELECT * FROM user WHERE name LIKE '%${req.params.like}%' AND status='Active';`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },


    getAllPartner : (req,res) => {
        let sql = "SELECT * FROM partner p JOIN admin a on p.addedd_by = a.idadmin WHERE partner_status='Active' ORDER BY p.idpartner DESC;"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getPartnerById : (req,res) => {
        let sql = `SELECT * FROM partner p JOIN admin a on p.addedd_by = a.idadmin WHERE p.idpartner =${req.params.idnya};`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getAllPartnerLike : (req,res) => {
        let sql = `SELECT * FROM partner p JOIN admin a on p.addedd_by = a.idadmin  WHERE p.partner_name LIKE '%${req.params.like}%' OR p.email LIKE '%${req.params.like}%' OR a.username LIKE '%${req.params.like}%' AND p.partner_status='Active';`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },addPartner : (req,res) => {
        try{
            const path = '/partnerpic'
            const upload = uploader(path, 'IMG').fields([{ name : 'image' }])
            upload(req,res, (err) => {
                if(err){
                    return res.status(500).send({message : 'error'})
                }
                console.log('INI ISI BODYYYYY DATA: ' + req.body.data)
                const {image} = req.files;
                const imagePath = image ? path +'/' + image[0].filename : null // 
                const data = JSON.parse(req.body.data)  //
                if(data.partner_pic == undefined){
                    data.partner_pic = imagePath
                }
                let sql = 'INSERT INTO partner set ?';
                db.query(sql, data, (err,results) => {
                    if(err){
                        console.log('GATOTTTTTT')
                        console.log(err)
                        fs.unlinkSync('./public' + imagePath)
                        return res.status(500).send({message : 'haduh'})
                    }
                    return res.status(200).send(results)
                })
            })
        }
        catch(err){
            return res.status(500).send({message: 'error'})
        }
    },deactivatepartner: (req,res) => {
        let sql = `UPDATE partner SET partner_status = "Non-Active" WHERE idpartner = ${req.params.idnya};`
        db.query(sql, (err, results) => {
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },editPartner : (req,res) => {
        try{
            const path = '/partnerpic'
            const upload = uploader(path, 'IMG').fields([{ name : 'image' }])
            upload(req,res, (err) => {
                if(err){
                    return res.status(500).send({message : 'error'})
                }
                console.log('INI ISI BODYYYYY DATA: ' + req.body.data)
                const {image} = req.files;
                const imagePath = image ? path +'/' + image[0].filename : null // 
                const data = JSON.parse(req.body.data)  //
                if(data.partner_pic == undefined){
                    data.partner_pic = imagePath
                }
                let sql = `UPDATE partner SET ? WHERE idpartner = ${req.params.idnya};`;
                db.query(sql, data, (err,results) => {
                    if(err){
                        console.log('GATOTTTTTT')
                        console.log(err)
                        fs.unlinkSync('./public' + imagePath)
                        return res.status(500).send({message : 'haduh'})
                    }
                    return res.status(200).send(results)
                })
            })
        }
        catch(err){
            return res.status(500).send({message: 'error'})
        }
    },
    
    getAllFeedback : (req,res) => {
        let sql = "SELECT * FROM feedback WHERE statusfeedback = 'Unread' ORDER BY id_feedback DESC;"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getAllReadFeedback : (req,res) => {
        let sql = "SELECT * FROM feedback WHERE statusfeedback = 'Read' ORDER BY id_feedback DESC;"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },markasreadfeedback: (req,res) => {
        let sql = `UPDATE feedback SET statusfeedback = "Read" WHERE id_feedback = ${req.params.idnya};`
        db.query(sql, (err, results) => {
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },markasunreadfeedback: (req,res) => {
        let sql = `UPDATE feedback SET statusfeedback = "Unread" WHERE id_feedback = ${req.params.idnya};`
        db.query(sql, (err, results) => {
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },countfeedback : (req,res) => {
        let sql = "SELECT count(id_feedback) as total FROM feedback WHERE statusfeedback = 'Unread';"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },




    getAllCategory : (req,res) => {
        let sql = "SELECT * FROM category WHERE category_status='Active';"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getCategoryById : (req,res) => {               //parameter req adalah data yang dikirim dari front-end
        let sql = `SELECT * FROM category WHERE idcategory = ${req.params.idnya};`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },addCategory : (req,res) =>{
        console.log('body: ' + req.body)
        let sql = `INSERT INTO category set?`
        db.query(sql, req.body, (err, insert) => {
            if(err){
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send(insert)
        });
    },deactivatecategory: (req,res) => {
        let sql = `UPDATE category SET category_status = "Non-Active" WHERE idcategory = ${req.params.idnya};`
        db.query(sql, (err, results) => {
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },editcategory: (req,res) => {
        console.log(req.body)
        let sql = `UPDATE category SET category_name='${req.body.category_name}' WHERE idcategory = ${req.body.id};`
        db.query(sql, req.body, (err, result) => {
            if(err){
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send(result)
        });
    },

    
    
    
    
    addEvent : (req,res) => {
        try{
            const path = '/eventpic'
            const upload = uploader(path, 'IMG').fields([{ name : 'image' }])
            upload(req,res, (err) => {
                if(err){
                    return res.status(500).send({message : 'error'})
                }
                console.log('INI ISI BODYYYYY DATA: ' + req.body.data)
                const {image} = req.files;
                const imagePath = image ? path +'/' + image[0].filename : null // 
                const data = JSON.parse(req.body.data)  //
                data.event_pic = imagePath
                let sql = 'INSERT INTO event set ?';
                db.query(sql, data, (err,results) => {
                    if(err){
                        console.log('GATOTTTTTT')
                        console.log(err)
                        fs.unlinkSync('./public' + imagePath)
                        return res.status(500).send({message : 'haduh'})
                    }
                    return res.status(200).send(results)
                })
            })
        }
        catch(err){
            return res.status(500).send({message: 'error'})
        }
    },addTicket : (req,res) => {
        console.log('TICKET: ' + req.body[0].ticket_type)
        console.log(req.body.length)
        for(var i=0; i<req.body.length; i++){
            let sql = `INSERT INTO event_ticket VALUES (null,'${req.params.idevent}','${req.body[i].ticket_type}','${req.body[i].ticket_price}','${req.body[i].ticket_stock}','Active')`;
            db.query(sql, req.body, (err,results) => {
                if(err){
                    console.log('GATOTTTTTT')
                    console.log(err)
                    res.status(500).send(err)
                }
            })
        }
        res.status(200).send('Berhasil')
    },getAllEvent : (req,res) => {
        let sql = "SELECT * FROM event e INNER JOIN partner p ON e.idpartner = p.idpartner INNER JOIN category c ON e.idcategory = c.idcategory WHERE event_status ='Active' ORDER BY e.dateposted DESC;"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getAllEventLater : (req,res) => {
        let sql = "SELECT * FROM event e INNER JOIN partner p ON e.idpartner = p.idpartner INNER JOIN category c ON e.idcategory = c.idcategory WHERE event_status ='Active' AND event_date > CURDATE() ORDER BY e.event_date ASC;"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getAllEventLike : (req,res) => {
        let sql = `SELECT * FROM event e INNER JOIN partner p ON e.idpartner = p.idpartner INNER JOIN category c ON e.idcategory = c.idcategory WHERE e.event_name LIKE '%${req.params.like}%' OR p.partner_name LIKE '%${req.params.like}%' OR c.category_name LIKE '%${req.params.like}%' AND event_status='Active';`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getEventById : (req,res) => {
        let sql = `SELECT * FROM event e 
        INNER JOIN partner p ON e.idpartner = p.idpartner 
        INNER JOIN category c ON e.idcategory = c.idcategory
        INNER JOIN admin a ON e.idadmin = a.idadmin
        WHERE e.idevent = '${req.params.idnya}'`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getEventByPartner : (req,res) => {
        let sql = `SELECT * FROM event e 
        INNER JOIN partner p ON e.idpartner = p.idpartner 
        INNER JOIN category c ON e.idcategory = c.idcategory
        INNER JOIN admin a ON e.idadmin = a.idadmin
        WHERE e.idpartner = '${req.params.idnya}'`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getTicketByEvent : (req,res) => {
        let sql = `SELECT * FROM event_ticket 
        WHERE idevent = '${req.params.idnya}' AND ticket_status='Active'`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },deactivateevent: (req,res) => {
        let sql = `UPDATE event SET event_status = "Non-Active" WHERE idevent = '${req.params.idnya}';`
        db.query(sql, (err, results) => {
            if(err){
                console.log(err)
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },editEvent : (req,res) => {
        try{
            const path = '/eventpic'
            const upload = uploader(path, 'IMG').fields([{ name : 'image' }])
            upload(req,res, (err) => {
                if(err){
                    return res.status(500).send({message : 'error'})
                }
                console.log('INI ISI BODYYYYY DATA: ' + req.body.data)
                const {image} = req.files;
                const imagePath = image ? path +'/' + image[0].filename : null // 
                const data = JSON.parse(req.body.data)  //
                if(data.event_pic == undefined){
                    data.event_pic = imagePath
                }
                let sql = `UPDATE event SET ? WHERE idevent = '${req.params.idnya}';`;
                db.query(sql, data, (err,results) => {
                    if(err){
                        console.log('GATOTTTTTT')
                        console.log(err)
                        fs.unlinkSync('./public' + imagePath)
                        return res.status(500).send({message : 'haduh'})
                    }
                    return res.status(200).send(results)
                })
            })
        }
        catch(err){
            return res.status(500).send({message: 'error'})
        }
    },editEventTicket : (req,res) => {
        console.log(req.body.length)
        for(var i=0; i<req.body.length; i++){
            console.log(req.body[i].idticket)
            if(req.body[i].idticket != undefined){
                let sql = `UPDATE event_ticket SET ticket_name = '${req.body[i].ticket_name}', ticket_price = '${req.body[i].ticket_price}', ticket_stock = '${req.body[i].ticket_stock}' WHERE idticket = '${req.body[i].idticket}';`;
                db.query(sql, req.body, (err,results) => {
                    if(err){
                        console.log(err)
                        return res.status(500).send({message : 'haduh'})
                    }
                })
            }else{
                let sql = `INSERT INTO event_ticket VALUES (null,'${req.params.idevent}','${req.body[i].ticket_name}','${req.body[i].ticket_price}','${req.body[i].ticket_stock}','Active')`;
                db.query(sql, req.body, (err,results) => {
                    if(err){
                        console.log(err)
                        return res.status(500).send({message : 'haduh'})
                    }
                })
            }
        }
        res.status(200).send('Berhasil')
    },getAllTransaction : (req,res) => {
        let sql = "SELECT * FROM transaction t INNER JOIN event e ON t.idevent = e.idevent ORDER BY t.transaction_time desc;"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getTickets : (req,res) => {
        let sql = `SELECT *,  tt.ticket_price as 'harga_beli' FROM transaction_ticket tt 
        INNER JOIN transaction tr ON tt.idtransaction = tr.idtransaction 
        INNER JOIN event_ticket t ON tt.idticket = t.idticket 
        INNER JOIN event e ON tt.idevent = e.idevent 
        INNER JOIN user u ON tr.iduser = u.iduser
        WHERE tt.idtransaction ='${req.params.idnya}' 
        ORDER BY t.ticket_name`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getAllTransactionById : (req,res) => {
        let sql = `SELECT * FROM transaction WHERE idevent = '${req.params.idnya}';`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },countpaymentmethodbyevent : (req,res) => {
        let sql = `SELECT payment_method ,count(payment_method) as jumlah FROM transaction WHERE idevent = '${req.params.idnya}' GROUP BY payment_method;`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },counttickettypebyevent : (req,res) => {
        let sql = `SELECT tt.idticket, et.ticket_name, count(tt.idticket) as jumlah  FROM transaction_ticket tt INNER JOIN event_ticket et ON tt.idticket = et.idticket WHERE tt.idevent ='${req.params.idnya}' GROUP BY idticket`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getUserGender : (req,res) => {
        let sql = "SELECT gender,count(iduser) as jumlah FROM user WHERE status='Active' GROUP BY gender"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getUserAge : (req,res) => {
        let sql = `SELECT 
        CASE WHEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birthdate, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birthdate, '00-%m-%d'))) <= 20 THEN '<20'
             WHEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birthdate, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birthdate, '00-%m-%d'))) <= 30 THEN '20-30'
             WHEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birthdate, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birthdate, '00-%m-%d'))) <= 50 THEN '30-50'
             WHEN (DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(birthdate, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < DATE_FORMAT(birthdate, '00-%m-%d'))) > 50 THEN '>50' END AS Age,
        COUNT(*) Total
        FROM user
        GROUP BY Age
        ORDER BY CASE WHEN Age = '<20' THEN '1'
                      WHEN Age = '20-30' THEN '2'
                      WHEN Age = '30-50' THEN '3'
                      WHEN Age = '>50' THEN '4'
                      ELSE Age END ASC`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getEventCategory : (req,res) => {
        let sql = "SELECT e.idcategory, c.category_name, count(e.idcategory) as Total FROM event e INNER JOIN category c ON e.idcategory = c.idcategory WHERE event_status ='Active' GROUP BY e.idcategory;"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },countdoneevent : (req,res) => {
        let sql = "SELECT count(idevent) as total FROM event WHERE event_status = 'Active' AND event_date < CURDATE();"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },countinactiveevent : (req,res) => {
        let sql = "SELECT count(idevent) as total FROM event WHERE event_status != 'Active';"
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getMonthlyTransaction : (req,res) => {
        let sql = `SELECT MONTHNAME(transaction_time) as Month, YEAR(transaction_time) as Year, COUNT(idtransaction) AS Total_Transaction, SUM(totalprice) AS Total_Money, SUM(totalticket) AS Total_Ticket
        FROM transaction
        GROUP BY EXTRACT(YEAR_MONTH FROM transaction_time)
        ORDER BY EXTRACT(YEAR_MONTH FROM transaction_time) DESC`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },countusermonth : (req,res) => {
        console.log(req.params.bulan)
        console.log(req.params.tahun)
        let sql = `SELECT count(iduser) as total FROM user WHERE status = 'Active' AND MONTH(joindate) = ${req.params.bulan} AND YEAR(joindate) = ${req.params.tahun}`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },countpartnermonth : (req,res) => {
        console.log(req.params.bulan)
        console.log(req.params.tahun)
        let sql = `SELECT count(idpartner) as total FROM partner WHERE partner_status = 'Active' AND MONTH(join_date) = ${req.params.bulan} AND YEAR(join_date) = ${req.params.tahun}`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },countalleventmonth : (req,res) => {
        let sql = `SELECT count(idevent) as total FROM event WHERE event_status = 'Active' AND MONTH(event_date) = ${req.params.bulan} AND YEAR(event_date) = ${req.params.tahun}`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getAllTransactionmonth : (req,res) => {
        console.log(req.params.bulan)
        console.log(req.params.tahun)
        let sql = `SELECT * FROM transaction t INNER JOIN event e ON t.idevent = e.idevent WHERE MONTH(transaction_time) = ${req.params.bulan} AND YEAR(transaction_time) = ${req.params.tahun} ORDER BY t.transaction_time desc `
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },countpaymentmethodbymonth : (req,res) => {
        let sql = `SELECT payment_method ,count(payment_method) as jumlah FROM transaction WHERE MONTH(transaction_time) = ${req.params.bulan} AND YEAR(transaction_time) = ${req.params.tahun} GROUP BY payment_method;`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getEventCategorybymonth : (req,res) => {
        let sql = `SELECT e.idcategory, c.category_name, count(e.idcategory) as Total 
        FROM event e INNER JOIN category c ON e.idcategory = c.idcategory 
        WHERE event_status ='Active' 
        AND MONTH(e.event_date) = ${req.params.bulan} 
        AND YEAR(e.event_date) = ${req.params.tahun} 
        GROUP BY e.idcategory;`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getAllEventmonth : (req,res) => {
        let sql = `SELECT * FROM event e 
        INNER JOIN partner p ON e.idpartner = p.idpartner 
        INNER JOIN category c ON e.idcategory = c.idcategory 
        WHERE event_status ='Active'  
        AND MONTH(e.event_date) = ${req.params.bulan} 
        AND YEAR(e.event_date) = ${req.params.tahun} 
        ORDER BY e.event_date DESC;`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    },getEventLaku: (req,res) => {
        let sql = `SELECT e.event_name, sum(t.totalticket) as TotalTicket, sum(t.totalprice) as TotalEarn FROM event e 
        INNER JOIN transaction t 
        ON t.idevent = e.idevent  
        WHERE event_status ='Active'  
        AND MONTH(e.event_date) = ${req.params.bulan} 
        AND YEAR(e.event_date) = ${req.params.tahun} 
        GROUP BY e.event_name
        ORDER BY TotalTicket DESC`
        db.query(sql, (err, results) => {   //db.query(sql,.....) make database yang uda di declare dengan query = sql.
            if(err){
                res.status(500).send(err)
            }
            res.status(200).send(results)
             });
    }
}