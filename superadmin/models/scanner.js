module.exports = function(sequelize, DataTypes) {
    const scanners = sequelize.define('cc_scanners', {
        scannerkey: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        scannername:
        {
            type: DataTypes.STRING,
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
    return scanners;
}