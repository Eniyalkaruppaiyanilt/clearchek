const db = require('../../config/dbconnection');
const personaldetails=db.personaldetails;
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
    personaldetails.findAll({
        where: {
            personaldetailkey: id
        },
        attributes: ['firstname', 'lastname', 'emailid', 'gender','dob','maritalstatus'], //object
    }).then(data => {
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
    personaldetails.findByPk(id)
        .then(data1 => {
            if (!data1) {
                var response = CF.getStandardResponse(401, "This userid not found");
                return res.status(401).send(response)
                next();
            }
            else {
                personaldetails.update(reg, {
                    where: { personaldetailkey: id }
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