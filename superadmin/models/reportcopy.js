module.exports = function(sequelize, DataTypes) {
    const reportcopy = sequelize.define('cc_medicalreportcopies', {
        reportcopieskey : {
           type: DataTypes.INTEGER,
           autoIncrement: true,
           primaryKey: true
       },
       medicalreportid :{
           type: DataTypes.INTEGER,
       },
       reportcopy :{
           type: DataTypes.STRING,
       },
       reportname :{
           type: DataTypes.STRING,
       },
       userid :{
               type: DataTypes.INTEGER,
       },
          createdby:{
   
           type: DataTypes.INTEGER, 
       }, 
           
       modifiedby:{
   
           type: DataTypes.INTEGER, 
       },
   
       createdAt: {
           type: DataTypes.DATE,
           field: 'createdon',         
       },
           
       updatedAt: {
           type: DataTypes.DATE,
           field: 'modifiedon',
       } 
       });
       return reportcopy;
   }
    