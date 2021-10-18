const jwt = require('jsonwebtoken');

function jwt_authentication (req, res, next) {
    const header = req.header('Authorization');
    if(!header) return res.status(400).send({error: `Athorization token in header is missing.`});
    const token = header.split(" ");
    const authToken = token[1];
    if(!authToken) return res.status(401).send({error: `Access denied.`});

    try{
        const verified = jwt.verify(authToken, process.env.TOKEN_SECRET);
        req.user = verified;
        //console.log(req.user);
        next();
    }catch(err){
        res.status(400).send({error: `Invalid token`});
    }
}

module.exports = jwt_authentication;