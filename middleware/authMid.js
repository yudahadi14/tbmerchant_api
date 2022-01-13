const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const auth = req.header("x-auth-token");
    if(!auth){
        
    }
    jwt.verify(auth, process.env.JWT_AUTH, (err, decode) => {
        if(decode) {
            return res.status(200)
        }
    });
}