module.exports = function(sequelize, DataTypes) {
    const travelinformation = sequelize.define('cc_travelinformations', {
       travelkey : {
           type: DataTypes.INTEGER,
           autoIncrement: true,
           primaryKey: true
       },
       from_date :{
           type: DataTypes.STRING,
       },
       to_date :{
           type: DataTypes.STRING,
       },
       title :{
           type: DataTypes.STRING,
       },
       source_of_journey :{
       type: DataTypes.STRING,
       },
       from_time :{
           type: DataTypes.STRING,
       },
       to_time :{
           type: DataTypes.STRING,
       },
       destination_place :{
           type: DataTypes.STRING,
       },sourceplace:
       {
        type: DataTypes.STRING,
    },
       no_of_days :{
           type: DataTypes.INTEGER,
       },
       no_of_person :{
           type: DataTypes.INTEGER,
       },
       experience_journey :{
           type: DataTypes.STRING,
       },
       soj :{
           type: DataTypes.INTEGER,
       },
       vehicle_no :{
           type: DataTypes.STRING,
       },
       ticket_upload :{
           type: DataTypes.STRING,
       },
       isaid :{
           type: DataTypes.INTEGER,
       },
       expenses :{
           type: DataTypes.STRING,
       },description :{
        type: DataTypes.STRING,
    },sourcestation :{
        type: DataTypes.STRING,
    },destinationstation :{
        type: DataTypes.STRING,
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
       return travelinformation;
   }
    