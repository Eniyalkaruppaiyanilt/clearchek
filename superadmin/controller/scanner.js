const bcrypt = require("bcrypt");
const db = require('../../config/dbconnection');
const scanners=db.scanners;
express = require('express');
var router = express.Router();
const CF = require('../../middlewares/commonfunction');
var verifytoken = require('../../middlewares/verifytoken');
const winston = require('../../middlewares/logger_service');
const { config } = require('winston');
const config1 =require('../../config/config.json');
const jwt = require('jsonwebtoken');
const sequelize = db.sequelize;

router.post('/', verifytoken,function (req, res, next) {
  const userreg = new scanners(req.body)
      userreg.save()
      .then(data => {
        winston.info('post some data/scanners'+data);
        var response = CF.getStandardResponse(201, "scanners created successfully.");
        return res.status(201).send(response)
      }).catch(err => {
        winston.error('error'+err);
        var response = CF.getStandardResponse(500, "Something wrong while created.");
        return res.status(500).send(response)
      }); 
});
router.put('/:id', verifytoken, function (req, res, next) {
  const id = req.params.id;
  const reg = req.body;
  scanners.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "scanner not found");
        return res.status(401).send(response)
      } else {
       
        scanners.update(reg, {
          where: { scannerkey: id }
        })
          .then(data => {
            winston.info('putscanners' + data)
            var response = CF.getStandardResponse(200, "scanners updated successfully");
            return res.status(200).send(response)

          })
          .catch(err => {
            winston.error('put scanners' + err)
            var response = CF.getStandardResponse(500, "Something wrong while created.");
            return res.status(500).send(response)

          });
      }
    });
});

router.delete('/:id',verifytoken,function(req,res,next){ 
       
  const id = req.params.id;
  scanners.destroy({
    where: { scannerkey: id }
  })
  .then(Register => {
      if(!Register) {
          return res.status(404).send({
              message: "scanner not found with id " + req.params.id
          });
      } winston.info('deletescanners/id' +id)
      res.send({message: "scanners deleted successfully!"});
     
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "scanners not found with id " + req.params.id
          });                
      }
      var response = CF.getStandardResponse(500, "Something wrong while deleted.");
        return res.status(500).send(response)
        winston.error('deletescanners' + err) 
  });
});

router.get('/', verifytoken, function (req, res, next) {
  sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_scanners  ",
    { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
    .then(data => {
      
      res.status(200).send({
        response_code: "200", response_message: "success.", data
      });
      winston.info('getscanners')
    })
})

router.get('/:id', verifytoken, function (req, res, next) {
  const id = req.params.id;
  scanners.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "scanner not found");
        return res.status(401).send(response)
      }
      sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_scanners where scannerkey=" + id + "",
        { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
        .then(data => {
          if (!data) {
            var response = CF.getStandardResponse(401, "This scanner not found");
            return res.status(401).send(response)
          }
          else {
            res.status(200).send({
              response_code: "200", response_message: "success.", data
            });
            winston.info('getscanners')
          }
        })
        .catch(err => {
          winston.error('/getscanners' + err)
          var response = CF.getStandardResponse(500, "Something went to wrong");
          return res.status(500).send(response)

        });
    });

});

 module.exports = router;