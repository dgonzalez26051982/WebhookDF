'use strict'

sendEmail("sgarcia@tecnologyad.com");

function sendEmail(email) {
 console.log(email);
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sahid.garcia.tecadvisors@gmail.com',
    pass: 'sancho.1'
  }
});

let mailOptions = {
  from: 'sahid.garcia.tecadvisors@gmail.com',
  to: 'sgarcia@tecnologyad.com',
  subject: 'Asistente Virtual',
  html: '<h1>Welcome</h1><p>That was easy!</p>'
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}