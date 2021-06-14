const db = require('../../config/dbconnection');
const registration = db.registration;
const logdetails = db.logdetails;
express = require('express');
var router = express.Router();
const CF = require('../../middlewares/commonfunction');
var uuid = require('node-uuid');
const winston = require('../../middlewares/logger_service');

router.post('/', function (req, res, next) {
  var rnumber = (Math. floor(Math. random() * 1000) + 9000);
  var regkey = uuid.v1();
  registration.findOne({
    where: {
      emailid: req.body.emailid
    }
  }).then(user => {
    if (user) {
      const logreg = new logdetails({
        logkey: regkey,
        createdby:user.registrationkey,
        otp:rnumber
      });
      logreg.save()
    
      if (user) {
        winston.info('forgotpassword'+user.emailid)
        res.status(200).send({
          respnse_code: 200,
          response_message: "Success",
          emailid: user.emailid,
          OTP: rnumber,
        });
        return res.status(200).send(response)
        
      }
      else {
        winston.error('forgotpassword'+user.emailid)
        var response = CF.getStandardResponse(401, "Something went wrong please contact support team");
        return res.status(401).send(response)
       
      }
    }
    else {
      var response = CF.getStandardResponse(401, "Invalid phonenumber");
      return res.status(401).send(response)
    }
  })
  .catch(err=>{
    winston.error('forgotpassword'+err)
    var response = CF.getStandardResponse(401, "Something went wrong please contact support team");
    return res.status(401).send(response);
  });
})
module.exports = router;
