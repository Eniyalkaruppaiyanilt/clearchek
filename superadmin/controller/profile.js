const db = require('../../config/dbconnection');
const registration=db.registration;
express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var router = express.Router();
const config = require('../../config/config.json');
const CF = require('../../middlewares/commonfunction');
const verifytoken = require('../../middlewares/verifytoken');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const winston = require('../../middlewares/logger_service');
var http = require('http');
var path = require('path');
var app = express();
router.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 2 * 1024 * 1024 * 1024
    },
}));
app.use(express.static(path.join(__dirname, 'public')));
router.get('/:id', verifytoken, function (req, res, next) {
    const id = req.params.id;
    registration.findAll({
        where: {
            registrationkey: id
        },
        attributes: ['firstname', 'lastname', 'emailid', 'phonenumber','image','role'], //object
    }).then(data => {
        const img = data[0].image;
        if (img) {
          
            data[0].image = "http://ec2-3-82-204-221.compute-1.amazonaws.com:4003/images/" + img
        }
        else {
           
            data[0].image = "http://ec2-3-82-204-221.compute-1.amazonaws.com:4003/images/nopicture.png"
        }
            res.send(data[0]);
            winston.info('/userprofile/id=' + id + 'data' + data);
    })
        .catch(err => {
            winston.error('/userprofile' + err)
            var response = CF.getStandardResponse(500, "Something went to wrong");
            return res.status(500).send(response)
        });
  
});
router.put('/:id', verifytoken, function (req, res, next) {
    const id = req.params.id;
    const reg = req.body;
    registration.findByPk(id)
        .then(data1 => {
            if (!data1) {
                var response = CF.getStandardResponse(401, "This userid not found");
                return res.status(401).send(response)
                next();
            }
            else {
                if (req.files) {
                    let dept = req.files;
                    var image1 = dept.image;
                    if (!image1) {
                        reg.image = data1.image;
                    }
                    else {
                        fs.unlink('./public/images/' + data1.image,(err) => {
                            if (err) {
                            }
                        });
                        image1.mv('./public/images/' + id + image1.name);
                        reg.image = id + image1.name;
                    }

                }
                registration.update(reg, {
                    where: { registrationkey: id }
                })
                    .then(data => {
                        if (!data) {
                            var response = CF.getStandardResponse(401, "This user not found");
                            return res.status(401).send(response)
                        }
                        winston.info('/userprofileupdate/id=' + id + 'data' + reg)
                        res.status(200).send({
                            response_code:"200",response_message:"updated successfully.",data
                         });
                        
                    })
                    .catch(err => {
                        winston.error('/userprofileupdate' + err)
                        var response = CF.getStandardResponse(500, "Something went to wrong");
                        return res.status(500).send(response)
                    });
                
            }
        });
});

module.exports = router;