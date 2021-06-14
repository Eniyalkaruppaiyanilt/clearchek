const db = require('../config/dbconnection');
const Customer = db.customer;
express = require('express');
var path = require("path");

module.exports = {
  getStandardResponse,
  sendemail
};
function getStandardResponse(status, message) {
  return {
    response_code: status,
    response_message: message
  }
}
hbs = require('nodemailer-express-handlebars'),
  email = process.env.MAILER_EMAIL_ID || 'testinginfologia@gmail.com',
  pass = process.env.MAILER_PASSWORD || 'Welcome@12345',
  nodemailer = require('nodemailer');

  var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user:email,
        pass:pass
    }
    });

const handlebarsOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: './public/template/',
    layoutsDir: './public/template/',
    defaultLayout: '',
  },
  viewPath: './public/template/',
  extName: '.html',
};
smtpTransport.use('compile', hbs(handlebarsOptions));
function sendemail(data) {
  smtpTransport.sendMail(data);
  return 1;
};
