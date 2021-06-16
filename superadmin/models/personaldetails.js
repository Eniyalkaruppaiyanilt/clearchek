module.exports = function(sequelize, DataTypes) {
    const personaldetails = sequelize.define('cc_personaldetails', {
        personaldetailkey : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        salutation :{
            type: DataTypes.INTEGER
        },
        firstname: {
            type: DataTypes.STRING
        },
        lastname: {
            type: DataTypes.STRING
        },
        emailid :{
            type: DataTypes.STRING
        },
        gender: {
            type: DataTypes.INTEGER
        }, dob: {
            type: DataTypes.DATE
        },maritalstatus:{
            type: DataTypes.INTEGER
        },
        dependents :{
            type: DataTypes.INTEGER
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