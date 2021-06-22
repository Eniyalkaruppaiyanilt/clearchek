const bcrypt = require("bcrypt");
const db = require('../../config/dbconnection');
const contact=db.contact;
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
  sequelize.query("select  * from cc_contactdetails where mobilenumber='"+req.body.mobilenumber+"' ",
  { replacements: ['active'], type: sequelize.QueryTypes.SELECT }).then(user => {
    if (user[0]) {
      var response = CF.getStandardResponse(400, "contact already exist.");
      return res.status(400).send(response);
    }
    else
    {
      const userreg = new contact(req.body)
      userreg.save()
      .then(data => {
        winston.info('post some data/contact'+data);
        var response = CF.getStandardResponse(201, "contactdetails created successfully.");
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
  contact.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "contact not found");
        return res.status(401).send(response)
      } else {
       
        contact.update(reg, {
          where: { contactdetailkey: id }
        })
          .then(data => {
            winston.info('putcontactdetails' + data)
            var response = CF.getStandardResponse(200, "contactdetails updated successfully");
            return res.status(200).send(response)

          })
          .catch(err => {
            winston.error('put contact' + err)
            var response = CF.getStandardResponse(500, "Something wrong while created.");
            return res.status(500).send(response)

          });
      }
    });
});

router.delete('/:id',verifytoken,function(req,res,next){ 
       
  const id = req.params.id;
  contact.destroy({
    where: { contactdetailkey: id }
  })
  .then(Register => {
      if(!Register) {
          return res.status(404).send({
              message: "contact not found with id " + req.params.id
          });
      } winston.info('deletecontact/id' +id)
      res.send({message: "contact deleted successfully!"});
     
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "contact not found with id " + req.params.id
          });                
      }
      var response = CF.getStandardResponse(500, "Something wrong while deleted.");
        return res.status(500).send(response)
        winston.error('deletecontact' + err) 
  });
});

router.get('/', verifytoken, function (req, res, next) {
  sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_contactdetails  ",
    { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
    .then(data => {
      
      res.status(200).send({
        response_code: "200", response_message: "success.", data
      });
      winston.info('getcontactdetails')
    })
})

router.get('/:id', verifytoken, function (req, res, next) {
  const id = req.params.id;
  contact.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "contactdetails not found");
        return res.status(401).send(response)
      }
      sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_contactdetails where contactdetailkey=" + id + "",
        { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
        .then(data => {
          if (!data) {
            var response = CF.getStandardResponse(401, "This contactdetails not found");
            return res.status(401).send(response)
          }
          else {
            res.status(200).send({
              response_code: "200", response_message: "success.", data
            });
            winston.info('getcontactdetails')
          }
        })
        .catch(err => {
          winston.error('/getcontactdetails' + err)
          var response = CF.getStandardResponse(500, "Something went to wrong");
          return res.status(500).send(response)

        });
    });

});

 module.exports = router;