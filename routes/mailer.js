var postmark = require("postmark");
var express = require('express');
var router = express.Router();
const { catchErrors } = require('../controllers/errorHandlers');
const basicAuthentication = require('../helpers/basicAuthentication');
const cors = require('cors');

const whitelist = ['http://www.classiccarseurope.eu'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/send_mail', cors(corsOptions), basicAuthentication.authentication, catchErrors(async (req, res) => {
    "use strict";
    console.log('Sbe', process);
    // Send an email:
    const client = new postmark.Client(process.env.POSTMARK_API);
    const emailSend = await client.sendEmailWithTemplate({
        'From': 'donotreply@dexperts.nl',
        'TemplateId': process.env.POSTMARK_TEMPLATE,
        'To': req.body.email_to,
        'TemplateModel': {
            'subject': `Contact via ${req.body.email_sender_url}!`,
            'from_name': req.body.from_name,
            'from': req.body.from,
            'phone': req.body.phone,
            'from_message': req.body.message,
        }
    });

    if (emailSend) {
        res.json({ "mail_send" : true, "to" : req.body.email_to, "from": req.body.from });
    } else {
        res.json({ "mail_send" : false });
    }
}));

module.exports = router;
