import jwt from "jsonwebtoken"
import "dotenv/config"

function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.json({
            error: "Token Missing"
        })
    }

    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }catch{
        return res.status(403).json({
            error: "Invalid Token"
        })
    }
}

export default authMiddleware;