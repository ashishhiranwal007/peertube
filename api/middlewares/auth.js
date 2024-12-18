import jwt from "jsonwebtoken";

export async function auth(req,res,next) {
    try{
        
        const token = await req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ message: "token not found" });
        }

    

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = decodedToken;
        next();

    }
    catch(error){
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ message: "Authentication failed" });
    }
}

export function isCreator(req, res, next) {
    try {
        if (req.user.role !== "creator") {
            return res.status(403).json({ message: "Access denied. Not a creator." });
        }
        next();
    } catch (error) {
        console.error("isCreator Middleware Error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}

export function isEditor(req, res, next) {
    try {
        if (req.user.role !== "editor") {
            return res.status(403).json({ message: "Access denied. Not an editor." });
        }
        next();
    } catch (error) {
        console.error("isEditor Middleware Error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
}