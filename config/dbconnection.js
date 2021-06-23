const Sequelize = require('sequelize');
 const sequelize = new Sequelize('postgres://infologia:Infologia_1@18.206.171.57/Clearchek')
sequelize
.authenticate()
.then(() => {
console.log('Connection has been established successfully.');
})
.catch(err => {
console.error('Unable to connect to the database:', err);
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//models/tables
db.registration = require('../superadmin/models/registration')(sequelize, Sequelize);
db.logdetails = require('../superadmin/models/logdetails')(sequelize, Sequelize);
db.personaldetails = require('../superadmin/models/personaldetails')(sequelize, Sequelize);
db.contact = require('../superadmin/models/contact')(sequelize, Sequelize);
db.occupationdetails = require('../superadmin/models/occupation')(sequelize, Sequelize);
db.identification = require('../superadmin/models/identification')(sequelize, Sequelize);
db.travelinformation = require('../superadmin/models/travelinformation')(sequelize, Sequelize);
module.exports = db;