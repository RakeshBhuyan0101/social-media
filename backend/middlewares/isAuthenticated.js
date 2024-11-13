import jwt from "jsonwebtoken"
import { User } from "../model/user.model.js";

const isAuthenticated = async (req , res , next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message : "User not authenticated",
                success : false
            });
        }

        const decodedData = jwt.verify(token , process.env.JWt_SECRETE_KEY)

        if (!decodedData) {
            return res.status(401).json({
                message: "Invalid token",
                success : false
            })
        }

        req.id = decodedData.userId;
        next ();
    } catch (error) {
        console.log(error)
    }
}

export {isAuthenticated}