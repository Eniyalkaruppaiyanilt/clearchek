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

router.post('/',verifytoken, function (req, res, next) {
  sequelize.query("select  * from cc_personaldetails where emailid='"+req.body.emailid+"'",
  { replacements: ['active'], type: sequelize.QueryTypes.SELECT }).then(user => {
    if (user[0]) {
      var response = CF.getStandardResponse(400, "user already exist.");
      return res.status(400).send(response);
    }
    else
    {
      const userreg = new personaldetails(req.body)
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
router.put('/:id', verifytoken, function (req, res, next) {
  const id = req.params.id;
  const reg = req.body;
  personaldetails.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "personaldetails not found");
        return res.status(401).send(response)
      } else {
       
        personaldetails.update(reg, {
          where: { personaldetailkey: id }
        })
          .then(data => {
            winston.info('putpersonaldetails' + data)
            var response = CF.getStandardResponse(200, "personaldetails updated successfully");
            return res.status(200).send(response)

          })
          .catch(err => {
            winston.error('put clearance' + err)
            var response = CF.getStandardResponse(500, "Something wrong while created.");
            return res.status(500).send(response)

          });
      }
    });
});



router.get('/', verifytoken, function (req, res, next) {
  sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_personaldetails  ",
    { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
    .then(data => {
      
      res.status(200).send({
        response_code: "200", response_message: "success.", data
      });
      winston.info('getpersonaldetails')
    })
})

router.get('/:id', verifytoken, function (req, res, next) {
  const id = req.params.id;
  personaldetails.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "personaldetails not found");
        return res.status(401).send(response)
      }
      sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_personaldetails where personaldetailkey=" + id + "",
        { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
        .then(data => {
          if (!data) {
            var response = CF.getStandardResponse(401, "This personaldetails not found");
            return res.status(401).send(response)
          }
          else {
            res.status(200).send({
              response_code: "200", response_message: "success.", data
            });
            winston.info('getpersonaldetails')
          }
        })
        .catch(err => {
          winston.error('/getpersonaldetails' + err)
          var response = CF.getStandardResponse(500, "Something went to wrong");
          return res.status(500).send(response)

        });
    });

});

 module.exports = router;