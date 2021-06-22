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


// {
//     iv: '237f306841bd23a418878792252ff6c8',
//     content: 'e2da5c6073dd978991d8c7cd'
// }

console.log(hash.iv);
console.log(hash.content);
const text = decrypt(hash);

console.log(text);





module.exports = router;