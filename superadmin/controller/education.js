const bcrypt = require("bcrypt");
const db = require('../../config/dbconnection');
const education=db.education;
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

router.post('/', function (req, res, next) {
  sequelize.query("select  * from cc_educations where userid="+req.body.userid+" and  name='"+req.body.name+"' and qualification='"+req.body.qualification+"' ",
  { replacements: ['active'], type: sequelize.QueryTypes.SELECT }).then(user => {
    if (user[0]) {
      var response = CF.getStandardResponse(400, "education already exist.");
      return res.status(400).send(response);
    }
    else
    {
      const userreg = new education(req.body)
      userreg.save()
      .then(data => {
        winston.info('post some data/education'+data);
        var response = CF.getStandardResponse(201, "educationdetails created successfully.");
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
  education.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "education not found");
        return res.status(401).send(response)
      } else {
       
        education.update(reg, {
          where: { educationkey: id }
        })
          .then(data => {
            winston.info('puteducationdetails' + data)
            var response = CF.getStandardResponse(200, "educationdetails updated successfully");
            return res.status(200).send(response)

          })
          .catch(err => {
            winston.error('put education' + err)
            var response = CF.getStandardResponse(500, "Something wrong while created.");
            return res.status(500).send(response)

          });
      }
    });
});

router.delete('/:id',verifytoken,function(req,res,next){ 
       
  const id = req.params.id;
  education.destroy({
    where: { educationkey: id }
  })
  .then(Register => {
      if(!Register) {
          return res.status(404).send({
              message: "education not found with id " + req.params.id
          });
      } winston.info('deleteeducation/id' +id)
      res.send({message: "education deleted successfully!"});
     
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "education not found with id " + req.params.id
          });                
      }
      var response = CF.getStandardResponse(500, "Something wrong while deleted.");
        return res.status(500).send(response)
        winston.error('deleteeducation' + err) 
  });
});

router.get('/', verifytoken, function (req, res, next) {
  sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_educations  ",
    { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
    .then(data => {
      
      res.status(200).send({
        response_code: "200", response_message: "success.", data
      });
      winston.info('geteducationdetails')
    })
})

router.get('/:id', verifytoken, function (req, res, next) {
  const id = req.params.id;
  education.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "educationdetails not found");
        return res.status(401).send(response)
      }
      sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_educations where educationkey=" + id + "",
        { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
        .then(data => {
          if (!data) {
            var response = CF.getStandardResponse(401, "This educationdetails not found");
            return res.status(401).send(response)
          }
          else {
            res.status(200).send({
              response_code: "200", response_message: "success.", data
            });
            winston.info('geteducationdetails')
          }
        })
        .catch(err => {
          winston.error('/geteducationdetails' + err)
          var response = CF.getStandardResponse(500, "Something went to wrong");
          return res.status(500).send(response)

        });
    });

});

 module.exports = router;