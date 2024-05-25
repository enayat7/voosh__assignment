import express from "express"
import cors from "cors"
import session from 'express-session';
import passport from "passport";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended: true, limit:'20kb'}))
app.use(cors())
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());



import './config/passport.js'

import userRouter from "./routes/user.routes.js"


app.use("/",userRouter);



app.use((err, req, res, next) => {
    res.status(400).json({ error: 'Internal Server Error' });
  });

export default app
