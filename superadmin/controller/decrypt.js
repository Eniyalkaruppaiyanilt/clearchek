const { encrypt, decrypt } = require("../../middlewares/crypto"); 
const bcrypt = require("bcrypt");
const db = require('../../config/dbconnection');
const registration=db.registration;
express = require('express');
var router = express.Router();
var path = require('path');
const crypto = require('crypto');
var app = express();
const hash = encrypt('saranyarajendrenilt@gmail.com');
const hash1 = decrypt(hash);

console.log(hash.iv);
console.log(hash.content);
const text = decrypt(hash);

console.log(text);





module.exports = router;