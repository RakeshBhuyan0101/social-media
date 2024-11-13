import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./utils/db.js";
import dotenv from "dotenv"
import userRoute from "./routes/user.routes.js"
import postRoute from "./routes/post.routes.js"

dotenv.config({})

const app = express()


app.get ( "/" , (req , res) => {
    return res.status(200).json({
        message : "I am comming from backened",
        success : true
    })
})

// middleware section
app.use(express.json())
app.use (cookieParser())
app.use (urlencoded( {extended : true}) )
const corsOption = {
    origin: 'http://localhost:5173',  // Allow requests from this origin
  credentials: true  
}
app.use(cors(corsOption))

// here api call is helled
app.use("/api/v1/user",userRoute)
app.use("/api/v1/post" , postRoute)


app.listen( process.env.PORT , ()=> {
    console.log(`app is listen at port : ${process.env.PORT}`);
    connectDb();
} )
