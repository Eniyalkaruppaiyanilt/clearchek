module.exports = function(sequelize, DataTypes) {
    const personaldetails = sequelize.define('cc_personaldetails', {
        personaldetailkey : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        salutation :{
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
        gender: {
            type: DataTypes.INTEGER,
            allowNull:false
        }, dob: {
            type: DataTypes.DATE,
            allowNull:false
        },maritalstatus:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        dependents :{
            type: DataTypes.INTEGER,
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
    return personaldetails;
}