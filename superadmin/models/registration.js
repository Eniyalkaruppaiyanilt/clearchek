module.exports = function(sequelize, DataTypes) {
    const registration = sequelize.define('cc_registrations', {
        registrationkey : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        role :{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull:false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull:false
        },
        emailid :{
            type: DataTypes.STRING,
            allowNull:false
        },
        phonenumber: {
            type: DataTypes.STRING,
            allowNull:false
        },
        agree :{
            type: DataTypes.INTEGER,
            allowNull:false
        },facelock:{
            type: DataTypes.STRING
        },thumb:{
            type: DataTypes.STRING
        },
        image:{
            type: DataTypes.STRING
        },password:{
            type: DataTypes.STRING,
            allowNull:false 
        },
        createdby:
        {
            type: DataTypes.INTEGER, 
        }, modifiedby:
        {
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
    return registration;
}