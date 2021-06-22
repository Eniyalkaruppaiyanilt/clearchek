module.exports = function(sequelize, DataTypes) {
    const contact = sequelize.define('cc_contactdetails', {
        contactdetailkey : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        country: {
            type: DataTypes.INTEGER
        },
        addressline1: {
            type: DataTypes.STRING
        },
        addressline2 :{
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        }, state: {
            type: DataTypes.INTEGER
        },zipcode:{
            type: DataTypes.STRING
        },mobilenumber:{
            type: DataTypes.STRING
        }, phonenumber:{
            type: DataTypes.STRING
        },stayingsince:{
            type: DataTypes.DATE
        },
        accommodationtype:{
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
    return contact;
}