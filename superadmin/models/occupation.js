module.exports = function(sequelize, DataTypes) {
    const occupationdetails = sequelize.define('cc_occupationdetails', {
        occupationkey : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        occupationtype: {
            type: DataTypes.INTEGER
        },
        occupationstatus: {
            type: DataTypes.INTEGER
        },
        employername :{
            type: DataTypes.STRING
        },
        startdate: {
            type: DataTypes.DATE
        }, designation: {
            type: DataTypes.STRING
        },grossannualsalary:{
            type: DataTypes.DECIMAL
        }, country:{
            type: DataTypes.INTEGER
        },addressline1:{
            type: DataTypes.STRING
        },
        addressline2:{
            type: DataTypes.STRING
        },
        city:{
            type: DataTypes.STRING
        },
        state:{
            type: DataTypes.INTEGER
        },
        zipcode:{
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
    return occupationdetails;
}