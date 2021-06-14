const db = require('../../config/dbconnection');
const registration = db.registration;
const bcrypt = require("bcrypt");
const logdetails = db.logdetails;
express = require('express');
var router = express.Router();
const CF = require('../../middlewares/commonfunction');
var uuid = require('node-uuid');
const winston = require('../../middlewares/logger_service');
router.post('/', function (req, res, next) {
  registration.findOne({
    where: {
      emailid: req.body.emailid
    }
  }).then(user => {
    if (user) {
        logdetails.findOne({
            where: {
              otp: req.body.otp,
              createdby:user.registrationkey
            }, order: [
              ['createdon','DESC'],
          ],
          }).then(logdet => {
            if(logdet)
            {
                var moment = require("moment");
                //var curtime = moment().format('Y-m-d H:M:S');
                var curtime = moment();
                var end_date = moment(curtime, 'YYYY-MM-DD HH:mm:ss');
                var createdtime = logdet.createdAt;
                var duration = moment.duration(end_date.diff(createdtime));
                var diffmin = duration.asMinutes();
                if(Math.round(diffmin) > 60)
                {
                    var response = CF.getStandardResponse(401, "OTP time expired");
                    return res.status(401).send(response)                        
                }
                else
                {
                  winston.info('otp verification success/Id='+user.registrationkey);
                    return res.status(200).send({                     
                      respnse_code: 200,
                      response_message: "OTP validation success",
                      logkey: logdet.logkey,
                    })
                }               
            }
            else
            {               
                var response = CF.getStandardResponse(401, "Invalid Request");
                return res.status(401).send(response)
            }
        })       
    }
    else {
      var response = CF.getStandardResponse(401, "Invali emailid");
      return res.status(401).send(response)
    }
  }).catch(err => {
    winston.error('error'+err);
    var response = CF.getStandardResponse(500, "Something wrong while created.");
    return res.status(500).send(response)
   
  }); 
})
router.put('/resetpassword', function (req, res, next) {
  logdetails.findOne({
    where: {
      logkey: req.body.logkey
    }
  }).then(logdetails => {
    if (logdetails) {
      registration.update({
        password:req.body.password
      }, {
        where: { registrationkey: logdetails.createdby }
    }).then(data => {
            if (!data) {
                var response = CF.getStandardResponse(401, "This user not found");
                return res.status(401).send(response)
            }
            winston.info('password will be changed/id='+logdetails.createdby);
            var response = CF.getStandardResponse(200, "Details updated successfully");
            return res.status(200).send(response)
        })
        .catch(err => {
          winston.error('error'+err);
            var response = CF.getStandardResponse(500, "Something went to wrong");
            return res.status(500).send(response)
        });
    }
    else {
      
      var response = CF.getStandardResponse(401, "Invalid request");
      return res.status(401).send(response)
    }
  })
})

module.exports = router;
