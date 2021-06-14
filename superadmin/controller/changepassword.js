const db = require('../../config/dbconnection');
const config = require('../../config/config.json');
const registration = db.registration;
express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verifytoken = require('../../middlewares/verifytoken');
const CF = require('../../middlewares/commonfunction');
const { request } = require('../../app');
const winston = require('../../middlewares/logger_service');

router.put('/:id', verifytoken, function (req, res, next) {
  const id = req.params.id;
  registration.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "User not found");
        return res.status(401).send(response)
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.currentpassword,
        data.password
      );
      if (!passwordIsValid) {
        var response = CF.getStandardResponse(401, "Invalid Current password");
        return res.status(401).send(response)
      }
      else {
       
          registration.update({password: testpassword }, {
            where: { registrationkey: id }
          })
            .then(data => {
              winston.info('changepass/data'+data);
              var response = CF.getStandardResponse(200, "Password change successfully");
              return res.status(200).send(response)
             
            })
            .then(data => {
              winston.info('changepass/data'+data);
              var response = CF.getStandardResponse(200, "Password change successfully");
              return res.status(200).send(response)
             
            })
            .catch(err => {
              winston.error('changepass/'+err)
              var response = CF.getStandardResponse(500, "Something wrong while created.");
              return res.status(500).send(response)
             });
        
      }
    }).catch(err=>
      {
        winston.error('changepass/'+err)
        var response = CF.getStandardResponse(500, "Something went to wrong.");
        return res.status(500).send(response)
     
      })
});
module.exports = router;