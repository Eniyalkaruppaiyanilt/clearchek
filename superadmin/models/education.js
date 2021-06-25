module.exports = function(sequelize, DataTypes) {
    const education = sequelize.define('cc_educations', {
        educationkey: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },userid: {
            type: DataTypes.INTEGER
        },
        name:
        {
            type: DataTypes.STRING
        },
        qualification:
        {
            type: DataTypes.STRING
        },
        percentage:
        {
            type: DataTypes.STRING
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
    return education;
}