const nodemailer = require('nodemailer');
const Email = require('email-templates');
const path = require('path');
const config = require("config");

const client = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: config.get('mailUser'),
           pass: config.get('mailPass')
       }
   });

const email = new Email({
//   send: true,
  juice: true,
  juiceResources: {
    webResources: {
      relativeTo: path.resolve('emails'),
      images: true
    }
  },
  preview: true,
  transport: client,
  views: {
    options: {
      extension: 'ejs'
    },
    root: path.resolve('emails'),
  }
});

sendMail = (to, from, subject, template, localParams = {}, options = {}) => {
  let message = {
    subject: subject,
    from: from,
    to: to
  };

  if (options.replyTo) {
    message.replyTo = options.replyTo;
  }

  if (options.attachments) {
    message.attachments = options.attachments;
  }

  return email.send({
    template: template,
    message: message,
    locals: localParams
  })
}

module.exports.sendEmailVerification = (to, name, link) => {
  return sendMail(to,
    'ニュージーカフェマップ <nzcafemap@gmail.com>',
    '【ニュージーカフェマップ】アカウント登録確認',
    'verify',
    {
      name: name,
      link: link
    }
  );
}

module.exports.sendPasswordResetLink = (to, name, link) => {
  return sendMail(to,
    'ニュージーカフェマップ <nzcafemap@gmail.com>',
    '【ニュージーカフェマップ】パスワードリセット',
    'password',
    {
      name: name,
      link: link
    }
  );
}