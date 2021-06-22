const bcrypt = require("bcrypt");
const db = require('../../config/dbconnection');
const identification=db.identification;
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
  sequelize.query("select  * from cc_identificationdetails where identificationtype='"+req.body.identificationtype+"' and  identificationnumber='"+req.body.identificationnumber+"'",
  { replacements: ['active'], type: sequelize.QueryTypes.SELECT }).then(user => {
    if (user[0]) {
      var response = CF.getStandardResponse(400, "identification already exist.");
      return res.status(400).send(response);
    }
    else
    {
      const userreg = new identification(req.body)
      userreg.save()
      .then(data => {
        winston.info('post some data/identification'+data);
        var response = CF.getStandardResponse(201, "identification created successfully.");
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
  identification.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "identification not found");
        return res.status(401).send(response)
      } else {
       
        identification.update(reg, {
          where: { identificationkey: id }
        })
          .then(data => {
            winston.info('putidentification' + data)
            var response = CF.getStandardResponse(200, "identification updated successfully");
            return res.status(200).send(response)

          })
          .catch(err => {
            winston.error('put identification' + err)
            var response = CF.getStandardResponse(500, "Something wrong while created.");
            return res.status(500).send(response)

          });
      }
    });
});

router.delete('/:id',verifytoken,function(req,res,next){ 
       
  const id = req.params.id;
  identification.destroy({
    where: { identificationkey: id }
  })
  .then(Register => {
      if(!Register) {
          return res.status(404).send({
              message: "identification not found with id " + req.params.id
          });
      } winston.info('deleteidentification/id' +id)
      res.send({message: "identification deleted successfully!"});
     
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "identification not found with id " + req.params.id
          });                
      }
      var response = CF.getStandardResponse(500, "Something wrong while deleted.");
        return res.status(500).send(response)
        winston.error('deleteidentification' + err) 
  });
});



router.get('/', verifytoken, function (req, res, next) {
  sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_identificationdetails  ",
    { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
    .then(data => {
      
      res.status(200).send({
        response_code: "200", response_message: "success.", data
      });
      winston.info('getidentification')
    })
})

router.get('/:id', verifytoken, function (req, res, next) {
  const id = req.params.id;
  identification.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "identification not found");
        return res.status(401).send(response)
      }
      sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_identificationdetails where identificationkey="+id+"",
        { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
        .then(data => {
          if (!data) {
            var response = CF.getStandardResponse(401, "This identification not found");
            return res.status(401).send(response)
          }
          else {
            res.status(200).send({
              response_code: "200", response_message: "success.", data
            });
            winston.info('getidentification')
          }
        })
        .catch(err => {
          winston.error('/getidentification' + err)
          var response = CF.getStandardResponse(500, "Something went to wrong");
          return res.status(500).send(response)

        });
    });

});

 module.exports = router;