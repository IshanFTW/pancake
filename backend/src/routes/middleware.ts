import { NextFunction, Request, Response } from "express";
import  jwt, { JwtPayload }  from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    userId?: string;
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({});
    }
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.userId = decoded.userId;
        next();
    }catch(err: any){
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' }); 
        }
        return res.status(403).json({ message: "Forbidden: Invalid token"});
    }

}
export default authMiddleware;