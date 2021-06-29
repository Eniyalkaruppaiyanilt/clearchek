const bcrypt = require("bcrypt");
const db = require('../../config/dbconnection');
const registration=db.registration;
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
  sequelize.query("select  * from cc_registrations where emailid='"+req.body.emailid+"' and phonenumber='"+req.body.phonenumber+"'",
  { replacements: ['active'], type: sequelize.QueryTypes.SELECT }).then(user => {
    if (user[0]) {
      var response = CF.getStandardResponse(400, "user already exist.");
      return res.status(400).send(response);
    }
    else
    {
      const userreg = new registration(req.body)
      if (req.files) {
        let dept = req.files;
        var image1 = dept.image;
            image1.mv('./public/images/' + image1.name);
            userreg.image = image1.name;
          } 
      userreg.save()

      .then(data => {
        const refreshToken = jwt.sign({ sub: data.registrationkey }, config1.refreshTokenSecret)
        const token = jwt.sign({ sub: data.registrationkey }, config1.secret)
        winston.info('post some data/userregister'+data);
        var response = CF.getStandardResponse({ response_code:"201",response_message:"user register created successfully.",id:data.registrationkey,  accessToken: token,
        refreshToken: refreshToken,});
        return res.status(201).send(response)
      }).catch(err => {
        winston.error('error'+err);
        var response = CF.getStandardResponse(500, "Something wrong while created.");
        return res.status(500).send(response)
      }); 
    }
  });
});

router.post('/login', function (req, res) {
  registration.findOne({
    where: {
      emailid: req.body.emailid
    }
  }).then(user => {
     
      if (!user) {
        var response = CF.getStandardResponse(404, "User not found.");
        return res.status(404).send(response)
      }
     
      if (req.body.password!=user.password) {
        var response = CF.getStandardResponse(401, "Invalid  password");
        return res.status(401).send(response)
      }else
             {
              const img = user.image;
              if(img)
              {
                user.image = "http://ec2-3-82-204-221.compute-1.amazonaws.com:4002/images/" + img;
              }else
              {
                user.image = "http://ec2-3-82-204-221.compute-1.amazonaws.com:4002/images/nopicture.png";
              }
      const refreshToken = jwt.sign({ sub: user.registrationkey }, config1.refreshTokenSecret)
      const token = jwt.sign({ sub: user.registrationkey }, config1.secret)
      res.status(200).send({
        respnse_code: 200,
        response_message: "Login success",
        id: user.registrationkey,
        accessToken: token,
        refreshToken: refreshToken,
        role:user.role,
        image:user.image,
        firstname:user.firstname,
        lastname:user.lastname,
         phonenumber:user.phonenumber,
        emailid:user.emailid,
        
                });
    }
   
    });
});
 module.exports = router;