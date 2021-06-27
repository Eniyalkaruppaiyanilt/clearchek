const db = require('../../config/dbconnection');
const medicalreport=db.medicalreport;
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
  sequelize.query("select  * from cc_medicalreports where  visitdate='"+req.body.visitdate+"' and  visittime='"+req.body.visittime+"' and   doctorname='"+req.body.doctorname+"' and  hospitalname='"+req.body.hospitalname+"' ",
  { replacements: ['active'], type: sequelize.QueryTypes.SELECT }).then(user => {
    if (user!=""|| user!=0) {
      var response = CF.getStandardResponse(400, "medicalreport already exist.");
      return res.status(400).send(response);
    }
    else
    {
      const userreg = new medicalreport(req.body) 
      userreg.save()
      .then(data => {
        winston.info('post some data/medicalreport'+data);
        res.status(201).send({ response_code:"201",response_message:"medicalreport created successfully",id:data.medicalreportkey});
        return res.status(201).send(response)
      }).catch(err => {
        winston.error('error'+err);
        var response = CF.getStandardResponse(500, "Something wrong while created.");
        return res.status(500).send(response)
      }); 
    }
  });
});

router.post('/reportcopy', verifytoken,function (req, res, next) {
  var  jsondata = req.body;
  for(var i=0; i< jsondata.length; i++)
{
    let dept = jsondata.files;
    var image1 = dept.reportcopy;
    image1.mv('./public/reportcopy/' + image1.name);
  var sql = "INSERT INTO cc_medicalreportcopies (medicalreportid, reportcopy,reportname,createdby,userid) VALUES ("+jsondata[i].medicalreportid+","+jsondata[i].reportcopy+","+jsondata[i].reportname+","+jsondata[i].createdby+","+jsondata[i].userid+")";
  sequelize.query(sql)
  .then(data => {
    winston.info('postmedicalreportcopies/data'+data);
    res.status(201).send({
      response_code:"201",response_message:"medicalreportcopies  created successfully"
   });
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Something wrong while creating the order."
      });
      winston.error('postmedicalreportcopies' + err)  
  });}
});
router.put('/:id', verifytoken, function (req, res, next) {
  const id = req.params.id;
  const reg = req.body;
  medicalreport.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "medicalreport not found");
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
              image1.mv('./public/ticketupload/' + ticket_upload);
              reg.ticket_upload = image1.name;
            }
          }
          medicalreport.update(reg, {
          where: { medicalreportkey: id }
        })
          .then(data => {
            winston.info('putmedicalreport' + data)
            var response = CF.getStandardResponse(200, "medicalreport updated successfully");
            return res.status(200).send(response)

          })
          .catch(err => {
            winston.error('put medicalreport' + err)
            var response = CF.getStandardResponse(500, "Something wrong while created.");
            return res.status(500).send(response)

          });
      }
    });
});

router.put('/:medicalreportid/:userid', verifytoken, function (req, res, next) {
  const medicalreportid = req.params.medicalreportid;
  const userid = req.params.userid;
  medicalreport.destroy({
  where: { medicalreportid: medicalreportid , userid: userid }
  })
  .then(Register => {

  var  jsondata = req.body;
  for(var i=0; i< jsondata.length; i++)
  {
    let dept = jsondata;
    var image1 = dept.reportcopy;
    image1.mv('./public/reportcopy/' + image1.name);
    var sql = "INSERT INTO cc_medicalreportcopies (medicalreportid, reportcopy,reportname,createdby,userid) VALUES ("+jsondata[i].medicalreportid+","+jsondata[i].reportcopy+","+jsondata[i].reportname+","+jsondata[i].createdby+","+jsondata[i].userid+")";
    sequelize.query(sql)
  .then(data => {
  winston.info('postsubsale/data'+data);
  res.status(201).send({
  response_code:"200",response_message:"subsale updated successfully"
  });
  }).catch(err => {
  res.status(500).send({
      message: err.message || "Something wrong while creating the order."
  });
  winston.error('putsubsale' + err)  
  }); 
  }});
  });
  
router.delete('/:id',verifytoken,function(req,res,next){ 
    const id = req.params.id;
    medicalreport.destroy({
      where: { medicalreportkey: id }
    })
    .then(Register => {
        if(!Register) {
            return res.status(404).send({
                message: "medicalreport not found with id " + req.params.id
            });
        } winston.info('deletemedicalreport/id' +id)
        res.send({message: "medicalreport deleted successfully!"});
       
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "travelinformation not found with id " + req.params.id
            });                
        }
        var response = CF.getStandardResponse(500, "Something wrong while deleted.");
          return res.status(500).send(response)
          winston.error('deletemedicalreport' + err) 
    });
  });
  
 
router.get('/show/all/:userid', verifytoken, function (req, res, next) {
  sequelize.query("select  distinct a.*,to_char(a.createdon,'DD/MM/YYYY')AS date,b.reportcopy,b.reportname from  cc_medicalreports a left outer join cc_medicalreportcopies b on  b.medicalreportid=a.medicalreportkey   where a.createdby='"+id+"'",
    { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
    .then(data => {
      
      res.status(200).send({
        response_code: "200", response_message: "success.", data
      });
      winston.info('getmedicalreport')
    })
})




router.get('/:id', verifytoken, function (req, res, next) {
  const id = req.params.id;
  medicalreport.findByPk(id)
    .then(data => {
      if (!data) {
        var response = CF.getStandardResponse(401, "medicalreport not found");
        return res.status(401).send(response)
      }
      sequelize.query("select  a.*,to_char(a.createdon,'DD/MM/YYYY')AS date,b.reportcopy,b.reportname from  cc_medicalreports a left outer join cc_medicalreportcopies b on  b.medicalreportid=a.medicalreportkey where medicalreportkey="+id+"",
        { replacements: ['active'], type: sequelize.QueryTypes.SELECT })
        .then(data => {
          if (!data) {
            var response = CF.getStandardResponse(401, "This medicalreport not found");
            return res.status(401).send(response)
          }
          else {
            res.status(200).send({
              response_code: "200", response_message: "success.", data
            });
            winston.info('getmedicalreport')
          }
        })
        .catch(err => {
          winston.error('/getmedicalreport' + err)
          var response = CF.getStandardResponse(500, "Something went to wrong");
          return res.status(500).send(response)

        });
    });

});



module.exports = router;