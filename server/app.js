import cookieParser from 'cookie-parser';
//const express = require('express'); common js
import express from 'express' // module js
import cors from 'cors'
import morgan from 'morgan'
const app = express();

app.use(express.json()) // for data parsing from frontend

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials:true
}));

app.use(morgan('dev')); // keep track of url in log(in terminal)

app.use(cookieParser()); //parse token stored in cookie

// routes of User,Course,Payment module

app.all('*',(req,res)=>{
    res.status(404).send('OOPS!! 404 Page Not Found');
}); //to handle any unknown route

export default app