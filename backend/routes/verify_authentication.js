const jwt = require('jsonwebtoken');

function verify_authentication(req,res, next){
    const token = req.header('auth-token');
    if(!token){
        return res.json({
            "msg" : "Access Denied",
            "Status" : 401
        });
    }
    try {
        jwt.verify(token, "Amazecodes");
        next();
    } catch (error) {
        return res.json({
            "msg" : "Invalid Token",
            "Status" : 400
        });        
    }
}

module.exports = verify_authentication;