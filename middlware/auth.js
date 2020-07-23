const jwt = require('jsonwebtoken');
const config = require('config');

//Middleware Function

module.exports = function(req, res, next){
    // Get Token From header
    const token = req.header('x-auth-token');

    //Check token
    if(!token){
        return res.status(401).json({msg: "No token, Authorization Denied"})
    }

    //Verifty token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next()
    } catch (error) {
        res.status(401).json({msg: 'token is not valid'})
    }
}