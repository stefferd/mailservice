const basicAuth = require('basic-auth');

exports.authentication = (req, res, next) => {

    function unauthorized(response) {
        response.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return response.sendStatus(401).json({ error: 'Unauthorized', message: 'You are unauthorized to use this route!'});
    }
    const user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    }
    if (user.name === process.env.BA_USERNAME && user.pass === process.env.BA_PASSWORD) {
        return next();
    } else {
        return unauthorized(res);
    }
};