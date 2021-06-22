module.exports = function(sequelize, DataTypes) {
    const identification = sequelize.define('cc_identificationdetails', {
        identificationkey: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        identificationtype:
        {
            type: DataTypes.INTEGER,
            allowNull:false,
        },identificationnumber:
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
    return identification;
}