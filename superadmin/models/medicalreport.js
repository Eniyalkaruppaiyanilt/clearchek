module.exports = function(sequelize, DataTypes) {
    const medicalreport = sequelize.define('cc_medicalreports', {
        medicalreportkey : {
           type: DataTypes.INTEGER,
           autoIncrement: true,
           primaryKey: true
       },
       reasonvisithospital :{
           type: DataTypes.STRING,
       },
       visitdate :{
           type: DataTypes.STRING,
       },
       visittime :{
           type: DataTypes.STRING,
       },
       reason :{
               type: DataTypes.STRING,
       },
       doctorname :{
           type: DataTypes.STRING,
       },
       hospitalname :{
           type: DataTypes.STRING,
       },
       address :{
           type: DataTypes.STRING,
       },
       description :{
           type: DataTypes.STRING,
       },
   
       nextvisit :{
   
           type: DataTypes.STRING,
       },    createdby:{
   
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
       return medicalreport;
   }
    