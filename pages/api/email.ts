const nodemailer = require('nodemailer');

export default async (req: any, res: any) => {

  const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.REQ_EMAIL,
      pass: process.env.PASSWORD
    },
    secure: true
  });

  await new Promise((resolve: any, reject: any) => {
    transporter.verify((error: any, success: any) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Server is ready to take our messages');
        resolve(success);
      }
    });
  });

  const mailData = {
    user: process.env.REQ_EMAIL,
    to:  req.body.toEmail,
    subject: `Your was added as collobarator by  ${ req.body.byEmail} `,
    text: `Post link ${req.body.postLink}`
  };

  await new Promise((resolve: any, reject: any) => {
    transporter.sendMail(mailData, (err: any, info: any) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(info);
        resolve(info);
      }
    });
  });

  res.status(200).json({ status: 'OK' });
};