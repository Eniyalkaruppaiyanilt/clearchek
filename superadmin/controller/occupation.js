const bcrypt = require("bcrypt");
const db = require('../../config/dbconnection');
const occupationdetails=db.occupationdetails;
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

router.post('/', verifytoken,function (req, res, next) {
  sequelize.query("select  * from cc_occupationdetails where occupationtype='"+req.body.occupationtype+"' and employername='"+req.body.employername+"' and occupationstatus='"+req.body.occupationstatus+"'",
  { replacements: ['active'], type: sequelize.QueryTypes.SELECT }).then(user => {
    if (user[0]) {
      var response = CF.getStandardResponse(400, "occupationdetails already exist.");
      return res.status(400).send(response);
    }
    else
    {
      const userreg = new occupationdetails(req.body)
      userreg.save()
      .then(data => {
        winston.info('post some data/occupationdetails'+data);
        var response = CF.getStandardResponse(201, "occupationdetails created successfully.");
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
  occupationdetails.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "occupationdetails not found");
        return res.status(401).send(response)
      } else {
       
        occupationdetails.update(reg, {
          where: { occupationkey: id }
        })
          .then(data => {
            winston.info('putoccupationdetails' + data)
            var response = CF.getStandardResponse(200, "occupationdetails updated successfully");
            return res.status(200).send(response)

          })
          .catch(err => {
            winston.error('put occupationdetails' + err)
            var response = CF.getStandardResponse(500, "Something wrong while created.");
            return res.status(500).send(response)

          });
      }
    });
});
router.delete('/:id',verifytoken,function(req,res,next){ 
       
  const id = req.params.id;
  occupationdetails.destroy({
    where: { occupationkey: id }
  })
  .then(Register => {
      if(!Register) {
          return res.status(404).send({
              message: "occupationdetails not found with id " + req.params.id
          });
      } winston.info('deleteoccupationdetails/id' +id)
      res.send({message: "occupationdetails deleted successfully!"});
     
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "occupationdetails not found with id " + req.params.id
          });                
      }
      var response = CF.getStandardResponse(500, "Something wrong while deleted.");
        return res.status(500).send(response)
        winston.error('deleteoccupationdetails' + err) 
  });
});


router.get('/', verifytoken, function (req, res, next) {
  sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_occupationdetails  ",
    { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
    .then(data => {
      
      res.status(200).send({
        response_code: "200", response_message: "success.", data
      });
      winston.info('getoccupationdetails')
    })
})

router.get('/:id', verifytoken, function (req, res, next) {
  const id = req.params.id;
  occupationdetails.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "occupationdetails not found");
        return res.status(401).send(response)
      }
      sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_occupationdetails where occupationkey=" + id + "",
        { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
        .then(data => {
          if (!data) {
            var response = CF.getStandardResponse(401, "This occupationdetails not found");
            return res.status(401).send(response)
          }
          else {
            res.status(200).send({
              response_code: "200", response_message: "success.", data
            });
            winston.info('getoccupationdetails')
          }
        })
        .catch(err => {
          winston.error('/getoccupationdetails' + err)
          var response = CF.getStandardResponse(500, "Something went to wrong");
          return res.status(500).send(response)

        });
    });

});

 module.exports = router;