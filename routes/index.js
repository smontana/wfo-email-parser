var express = require('express');
var router = express.Router();
var MailParser = require("mailparser").MailParser;
// var mailparser = new MailParser({debug: true});
var mailparser = new MailParser();
var fs = require("fs");

var email_path = 'C:/Users/e002679/Desktop/TEST.msg';

/* GET home page. */
router.get('/', function(req, res, next) {

  // * ----- BEGIN mailparser ----- * \\

  var email_date = '',
      email_subject = '',
      email_text = '',
      email_html = '';

  mailparser.on("end", function(mail_object){
    email_date = mail_object.date;
    email_subject = mail_object.subject;
    email_text = mail_object.text;
    email_html = mail_object.html;

    console.log("Subject:", mail_object.subject);
  });
   
  fs.createReadStream(email_path).pipe(mailparser);

  // * ----- END mailparser ----- * \\

  var Imap = require('imap'),
      inspect = require('util').inspect;

  var imap = new Imap({
    // user: process.env.DT_UN,
    // password: process.env.DT_PW,
    // host: process.env.DT_HOST,
    // port: process.env.DT_PORT,
    // tls: process.env.DT_TLS
    user: process.env.GMAIL_UN,
    password: process.env.GMAIL_PW,
    host: process.env.GMAIL_HOST,
    port: process.env.GMAIL_PORT,
    tls: process.env.GMAIL_TLS
  });

  function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
  }

  imap.once('ready', function() {
    openInbox(function(err, box) {
      if (err) throw err;
      var f = imap.seq.fetch('1:3', {
        bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
        struct: true
      });
      f.on('message', function(msg, seqno) {
        console.log('Message #%d', seqno);
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function(stream, info) {
          var buffer = '';
          stream.on('data', function(chunk) {
            buffer += chunk.toString('utf8');
          });
          stream.once('end', function() {
            console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
          });
        });
        msg.once('attributes', function(attrs) {
          console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
        });
        msg.once('end', function() {
          console.log(prefix + 'Finished');
        });
      });
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
      f.once('end', function() {
        console.log('Done fetching all messages!');
        imap.end();
      });
    });
  });

  imap.once('error', function(err) {
    console.log(err);
  });

  imap.once('end', function() {
    console.log('Connection ended');
  });

  imap.connect();

  res.render('../views/index', { 
    title: 'WFO',
    subject: email_subject,
    text_body: email_text,
    html_body: email_html,
    email_date: email_date
  });
});

module.exports = router;
