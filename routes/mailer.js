var postmark = require("postmark");
var express = require('express');
const { catchErrors } = require('../controllers/errorHandlers');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/send_mail', catchErrors(async (req, res) => {
    "use strict";
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
