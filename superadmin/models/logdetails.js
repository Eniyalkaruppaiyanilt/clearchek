module.exports = function(sequelize, DataTypes) {
    const logdetails = sequelize.define('bt_logdetails', {
        logkey: {
            type: DataTypes.STRING,
            allowNull:false,
            primaryKey: true
        },
        otp:
        {
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        createdby:DataTypes.INTEGER,
        createdAt: {
            type: DataTypes.DATE,
            field: 'createdon',         
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'modifiedon',
        }
    });
    return logdetails;
}