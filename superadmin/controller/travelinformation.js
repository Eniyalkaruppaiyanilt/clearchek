const db = require('../../config/dbconnection');
const travelinformation=db.travelinformation;
express = require('express');
var router = express.Router();
const CF = require('../../middlewares/commonfunction');
var verifytoken = require('../../middlewares/verifytoken');
const winston = require('../../middlewares/logger_service');
const fileUpload = require('express-fileupload');
const sequelize = db.sequelize;
const fs = require('fs');
router.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024
  },
}));
var path = require('path'); var app = express();
app.use(express.static(path.join(__dirname, 'public')));

router.post('/', verifytoken,function (req, res, next) {
  sequelize.query("select  * from cc_travelinformations where  from_date='"+req.body.from_date+"' and  to_date='"+req.body.to_date+"' and   title='"+req.body.title+"' and  vehicle_no='"+req.body.vehicle_no+"' ",
  { replacements: ['active'], type: sequelize.QueryTypes.SELECT }).then(user => {
    if (user!=""|| user!=0) {
      var response = CF.getStandardResponse(400, "travelinformation already exist.");
      return res.status(400).send(response);
    }
    else
    {

      const userreg = new travelinformation(req.body) 
      if (req.files) {
        let dept = req.files;
        var image1 = dept.ticket_upload;
        image1.mv('./public/ticketupload/' + image1.name);
        userreg.ticket_upload = image1.name;
      }
      userreg.save()
      .then(data => {
        winston.info('post some data/travelinformation'+data);
        var response = CF.getStandardResponse(201, "travelinformation created successfully.");
        return res.status(201).send(response)
      }).catch(err => {
        winston.error('error'+err);
        var response = CF.getStandardResponse(500, "Something wrong while created.");
        return res.status(500).send(response)
      }); 
    }
  });
});

router.delete('/:id',verifytoken,function(req,res,next){ 
      
    const id = req.params.id;
    travelinformation.destroy({
      where: { travelkey: id }
    })
    .then(Register => {
        if(!Register) {
            return res.status(404).send({
                message: "travelinformation not found with id " + req.params.id
            });
        } winston.info('deletetravelinformation/id' +id)
        res.send({message: "travelinformation deleted successfully!"});
       
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "travelinformation not found with id " + req.params.id
            });                
        }
        var response = CF.getStandardResponse(500, "Something wrong while deleted.");
          return res.status(500).send(response)
          winston.error('deletetravelinformation' + err) 
    });
  });
  
 
router.get('/', verifytoken, function (req, res, next) {
  sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_travelinformations  ",
    { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
    .then(data => {
      
      res.status(200).send({
        response_code: "200", response_message: "success.", data
      });
      winston.info('gettravelinformation')
    })
})

router.put('/:id', verifytoken, function (req, res, next) {
  const id = req.params.id;
  const reg = req.body;
  travelinformation.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "travelinformation not found");
        return res.status(401).send(response)
      } else {
        if (req.files) {
            let dept = req.files;
            var image1 = dept.ticket_upload;
            var ticket_upload= image1.name;
          
            if (!image1) {
              reg.ticket_upload = data.ticket_upload;
            }
            else {
              var test = data.ticket_upload;
              fs.unlink("./public/ticketupload/" + test, function (err) {
                if (err) {
                  console.log("failed to delete local image:" + err);
                } else {
                  console.log('successfully deleted local image');
                }
              });
              image1.mv('./public/ticketupload/'+ticket_upload);
              reg.ticket_upload = image1.name;
            }
          }
          travelinformation.update(reg, {
          where: {travelkey: id }
        })
          .then(data => {
            winston.info('puttravelinformation' + data)
            var response = CF.getStandardResponse(200, "travelinformation updated successfully");
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


router.get('/:id', verifytoken, function (req, res, next) {
  const id = req.params.id;
  travelinformation.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "travelinformation not found");
        return res.status(401).send(response)
      }
      sequelize.query("select *,to_char(createdon,'DD/MM/YYYY')AS date from  cc_travelinformations where travelkey="+id+"",
        { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
        .then(data => {
          if (!data) {
            var response = CF.getStandardResponse(401, "This travelinformation not found");
            return res.status(401).send(response)
          }
          else {
            res.status(200).send({
              response_code: "200", response_message: "success.", data
            });
            winston.info('gettravelinformation')
          }
        })
        .catch(err => {
          winston.error('/gettravelinformation' + err)
          var response = CF.getStandardResponse(500, "Something went to wrong");
          return res.status(500).send(response)

        });
    });

});
module.exports = router;