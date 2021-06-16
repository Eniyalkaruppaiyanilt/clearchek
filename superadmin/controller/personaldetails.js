const bcrypt = require("bcrypt");
const db = require('../../config/dbconnection');
const personaldetails=db.personaldetails;
express = require('express');
var router = express.Router();
const CF = require('../../middlewares/commonfunction');
var verifytoken = require('../../middlewares/verifytoken');
const winston = require('../../middlewares/logger_service');
const { config } = require('winston');
const config1 =require('../../config/config.json');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
var uuid = require('node-uuid');
const sequelize = db.sequelize;
const fs = require('fs');
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

router.post('/', function (req, res, next) {
  sequelize.query("select  * from cc_personaldetails where emailid='"+req.body.emailid+"' and phonenumber='"+req.body.phonenumber+"'",
  { replacements: ['active'], type: sequelize.QueryTypes.SELECT }).then(user => {
    if (user[0]) {
      var response = CF.getStandardResponse(400, "user already exist.");
      return res.status(400).send(response);
    }
    else
    {
      const userreg = new personaldetails(req.body)
      if (req.files) {
        let dept = req.files;
        var image1 = dept.image;
            image1.mv('./public/images/' + image1.name);
            userreg.image = image1.name;
          }
      userreg.save()
      .then(data => {
        winston.info('post some data/personaldetails'+data);
        var response = CF.getStandardResponse(201, "personaldetail created successfully.");
        return res.status(201).send(response)
      }).catch(err => {
        winston.error('error'+err);
        var response = CF.getStandardResponse(500, "Something wrong while created.");
        return res.status(500).send(response)
      }); 
    }
  });
});


 module.exports = router;